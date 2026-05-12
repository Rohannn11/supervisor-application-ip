# Patrol & Incident Reporting System — Tech Stack + MCP Requirements (May 2026)

## Overview

This document defines:

- The recommended free-tier tech stack
- The required MCP servers for Antigravity
- The GitHub MCP tools that should be enabled
- The tools that should NOT be enabled initially
- Security and operational recommendations

---

# Tech Stack

## Frontend

### Mobile Application
- React Native
- Expo

### Admin Dashboard
- React
- Vite

---

# Backend

## API Layer
- Node.js
- Express.js

## Realtime Communication
- Socket.io

## Background Jobs / Queues
- BullMQ

---

# Database & Storage

## Relational Database
- TiDB Cloud (MySQL-compatible)

### Used For
- Users
- Patrol assignments
- GPS sessions
- Audit logs
- Relational entities

---

## Document Database
- MongoDB Atlas

### Used For
- Incident reports
- Evidence metadata
- Flexible JSON structures
- Nested incident data

---

## Cache / Queue Storage
- Upstash Redis

### Used For
- Active patrol sessions
- Queue management
- OTP throttling
- Realtime presence
- Caching

---

## Media Storage
- Cloudinary

### Used For
- Incident images
- Video uploads
- Evidence storage

---

## Authentication
- Firebase Auth

### Used For
- OTP login
- Phone authentication
- Session identity

---

# Deployment

## Backend Hosting
- Fly.io

## Frontend Hosting
- Cloudflare Pages or Vercel

## Mobile Deployment
- Expo EAS

## Source Control
- GitHub

---

# Recommended Architecture

```text
React Native (Expo)
        |
React + Vite Dashboard
        |
REST + Socket.io
        |
Node.js + Express API
        |
--------------------------------
|      |       |       |       |
TiDB MongoDB Redis Cloudinary Firebase
```

---

# Required MCP Servers

## Core MCP Servers

### Filesystem MCP
Purpose:
- Full project access
- Code generation
- Refactoring
- Architecture understanding

---

### GitHub MCP
Purpose:
- Repository access
- Pull requests
- Branch management
- Commit history
- Issue workflows

---

### MySQL MCP
Purpose:
- TiDB database inspection
- Query generation
- Schema understanding

---

### MongoDB MCP
Purpose:
- Incident document inspection
- Collection analysis
- Query assistance

---

### Upstash Redis MCP
Purpose:
- Queue inspection
- Session debugging
- Cache monitoring

---

### Firebase MCP
Purpose:
- Auth debugging
- OTP workflows
- User verification flows

---

### Playwright MCP
Purpose:
- Browser automation
- End-to-end testing
- Dashboard validation


# Final Recommended Stack

## Application Stack
- React Native + Expo
- React + Vite
- Node.js + Express
- Socket.io
- BullMQ

---

## Data Layer
- TiDB Cloud
- MongoDB Atlas
- Upstash Redis

---

## Services
- Firebase Auth
- Cloudinary

---

## Hosting
- Fly.io
- Cloudflare Pages / Vercel

---

## MCP Stack
- Filesystem MCP
- GitHub MCP
- MySQL MCP
- MongoDB MCP
- Redis MCP
- Firebase MCP
- Playwright MCP

---

# Result

This setup provides:

- Fully free-tier development
- AI-assisted coding
- Database-aware agents
- Automated testing
- Secure MCP exposure
- Scalable architecture
- Production-ready deployment
- Low operational cost