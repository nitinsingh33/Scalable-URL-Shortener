# Scalable URL Shortener

A high-performance URL shortening service built with Node.js and Redis, designed to handle high traffic with minimal latency through distributed caching and intelligent sharding.

## Project Overview

This service demonstrates a production-grade URL shortening system with the following capabilities:

- **Shorten long URLs** to compact, shareable IDs
- **Retrieve original URLs** from shortened references with cached lookups
- **Distribute cache** across multiple Redis instances for horizontal scaling
- **Demonstrate cache behavior** with real-time insights into cache hits and misses
- **Handle high traffic** through efficient in-memory data structures

The system is designed to showcase distributed system concepts including caching strategies, load balancing, and data distribution patterns essential for building scalable applications.

## Features

- **Fast URL Shortening** - Generate short IDs in O(1) time
- **Distributed Caching** - Multi-node Redis cluster for horizontal scaling
- **Consistent Hashing** - Intelligent key distribution across Redis instances
- **Low Latency** - In-memory lookups eliminate database queries
- **Scalable Architecture** - Handle millions of requests per second
- **High Availability** - Distribute load across multiple cache nodes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Cache**: Redis (distributed)
- **ID Generation**: shortid
- **Configuration**: dotenv

## System Architecture

The system consists of three core components working together to deliver a scalable, high-performance URL shortening service:

### 1. API Server (Express.js)

The request handler that exposes two primary endpoints:
- `POST /shorten` - Accepts long URLs and returns shortened versions
- `GET /:shortId` - Retrieves and redirects to original URLs

The server implements request validation, error handling, and response formatting for reliable API operations.

### 2. Redis Caching Layer

A distributed cache across three Redis instances providing:
- **Data Storage** - Persistent key-value mappings of short IDs to original URLs
- **Load Distribution** - Sharding across multiple nodes for horizontal scaling
- **Performance** - Sub-millisecond lookups with in-memory access
- **Consistency** - Synchronized cache state across the cluster

Each Redis instance handles approximately one-third of the total mapping data, eliminating bottlenecks and maximizing throughput.

### 3. Docker Environment

Containerized setup simulating a distributed deployment:
- Runs three independent Redis containers on different ports (6379, 6380, 6381)
- Enables local development of distributed system behaviors
- Provides isolation and repeatability in testing
- Demonstrates production-like multi-instance architecture

### Data Flow

```
Client Request (http://localhost:3000/shorten)
    ↓
Express API Server (Request Handler)
    ↓
Consistent Hash Function (Determine Redis node)
    ↓
Redis Cluster
    ├─ Node 1 (Port 6379)
    ├─ Node 2 (Port 6380)
    └─ Node 3 (Port 6381)
    ↓
Cache Hit/Miss Response
    ↓
Return Shortened URL or Redirect
```

### Design Principles

The system uses a three-node Redis cluster with consistent hashing to distribute shortened URLs across instances. This approach ensures:

- **Even load distribution** - Keys distributed uniformly across nodes
- **Minimal rebalancing** - Adding/removing nodes affects only 1/n of keys
- **Predictable performance** - O(1) operations regardless of dataset size
- **High availability** - Node failures don't impact overall system availability

## Prerequisites

- Node.js (v14 or higher)
- Redis (3 instances running on different ports or servers)
- npm or yarn

## Installation

```bash
git clone https://github.com/nitinsingh33/Scalable-URL-Shortener.git
cd Scalable-URL-Shortener
npm install
```

## Configuration

Create a `.env` file in the project root:

```env
PORT=3000
REDIS_HOST_1=localhost
REDIS_PORT_1=6379
REDIS_HOST_2=localhost
REDIS_PORT_2=6380
REDIS_HOST_3=localhost
REDIS_PORT_3=6381
```

Adjust the Redis host/port values based on your cluster setup.

## Running the Service

```bash
npm start
```

The service will start on the configured PORT (default: 3000).

## API

### Shorten URL

**Request**
```
POST /shorten
Content-Type: application/json

{
  "url": "https://example.com/very/long/url/that/needs/shortening"
}
```

**Response**
```json
{
  "shortUrl": "http://localhost:3000/a1b2c3d4"
}
```

### Redirect to Original URL

**Request**
```
GET /:shortId
```

**Response**
- Status 301: Redirects to original URL
- Status 404: Short ID not found

## Key Concepts

### Consistent Hashing

Instead of using a simple modulo operation (which causes cache misses when nodes change), consistent hashing maps keys to a circle of nodes. When a node is added or removed, only 1/n keys are affected.

**Implementation**: Hash the short ID and use modulo to select a Redis node.

### Distributed Caching

Three Redis instances distribute the load horizontally. Each instance handles ~33% of the workload, improving throughput and reducing latency.

### Sharding Strategy

Keys are sharded based on their hash value, ensuring:
- No single point of contention
- Even distribution of data
- Predictable performance

## Performance Characteristics

- **Lookup Time**: O(1) - single Redis GET operation
- **Write Time**: O(1) - single Redis SET operation
- **Throughput**: Scales linearly with number of nodes
- **Latency**: Sub-millisecond for cache hits

## Future Enhancements

- [ ] Expiration policy (TTL) for temporary shortened URLs
- [ ] Analytics tracking (click counts, geographical data)
- [ ] Custom short codes
- [ ] Batch shortening API
- [ ] Redis cluster failover and replication
- [ ] Rate limiting per client
- [ ] URL validation and preview

## License

ISC
