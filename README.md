# Turknuzz - Food Ordering & Restaurant Booking System

Turknuzz is a full-stack web application for restaurant food ordering and table booking services. The system features a user-friendly interface with online payment processing, email confirmations, and a comprehensive admin panel.

## Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Frontend](#frontend)
- [Backend](#backend)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)

## Overview

Turknuzz provides a seamless dining experience with two main services:
1. Online Takeaway food ordering with secure payment processing
2. Table reservation system with confirmation emails

The application follows a modern web architecture with a React frontend and a Node.js/Express backend, connected to a PostgreSQL database through Prisma ORM.

## Tech Stack

### Frontend
- React.js
- Bootstrap
- Responsive design

### Backend
- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Stripe Payment Gateway
- Email service for confirmations

### Development Tools
- pnpm (Package manager)
- Git (Version control)

## Installation

### Prerequisites
- Node.js (v14 or later)
- pnpm
- PostgreSQL
- Stripe account

### Setup

1. Clone the repository
```bash
git clone https://github.com/Dominicmburu/Restaurant-system.git
```

2. Install dependencies
```bash
# Both for Frontend and Backend
pnpm install
```

3. Configure environment variables
```bash
# Create .env file in the root directory
cp .env.example .env
```

4. Set up the database
```bash
npx prisma generate
pnpm run db:migrate
```

5. Start the development server
```bash
# Start the backend
pnpm run db:seed
pnpm run dev 

# Start the frontend
pnpm run dev
```

## Usage

### Development Mode
```bash
pnpm run dev
```

### Production Build
```bash
pnpm run build
```

### Testing
```bash
pnpm run test
```
------------------
