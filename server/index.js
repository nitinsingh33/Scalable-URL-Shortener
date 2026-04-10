require('dotenv').config();
const express = require('express');
const redis = require('redis');
const shortid = require('shortid');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const redisClient = [
    redis.createClient({ host: process.env.REDIS_HOST_1, port: process.env.REDIS_PORT_1 }),
    redis.createClient({ host: process.env.REDIS_HOST_2, port: process.env.REDIS_PORT_2 }),
    redis.createClient({ host: process.env.REDIS_HOST_3, port: process.env.REDIS_PORT_3 })
];

// Hash function to distribute keys among Redis clients
function getRedisClient(key) {
    const hash = key.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return redisClient[hash % redisClient.length];
}

// Endpoint to shorten a URL with expiration
app.post('/shorten', async (req, res) => {
    const { url, ttl } = req.body; // ttl (time-to-live) is optional
    if (!url) return res.status(400).send('URL is required');

    const shortId = shortid.generate();
    const redisClient = getRedisClient(shortId);

    await redisClient.set(shortId, url, 'EX', ttl || 3600); // Default TTL of 1 hour
    res.json({ shortUrl: `http://localhost:${process.env.PORT}/${shortId}` });
});

// Endpoint to retrieve the original URL 
app.get('/:shortId', async (req, res) => {
    const { shortId } = req.params;
    const redisClient = getRedisClient(shortId);

    try {
        const url = await redisClient.get(shortId);
        if (!url) {
            console.log(`Cache miss for key: ${shortId}`);
            return res.status(404).send('URL not found');      
        }
        console.log(`Cache hit for key: ${shortId}`);
        res.redirect(url);
    } catch (err) {
        console.error('Error retrieving URL:', err.message);
        res.status(500).send('Error retrieving URL');
    }
});

// Initialize Redis connections
async function start() {
    try {
        await Promise.all(redisClient.map(client => client.connect()));
        app.listen(process.env.PORT, () => {
            console.log(`URL Shortener service running on port ${process.env.PORT}`);
        });
    } catch (err) {
        console.error('Error connecting to Redis:', err.message);
        process.exit(1);
    }
}

start();
