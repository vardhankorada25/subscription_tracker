# Subscription Tracker API

Backend API for user auth, subscription management, and workflow-based reminder emails.

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Upstash Workflow (QStash)
- Nodemailer (Gmail)
- Arcjet middleware

## Project Structure

```text
subscription_tracker/
├── app.js
├── config/
├── controller/
├── database/
├── middleware/
├── models/
├── routes/
└── utils/
```

## Prerequisites

- Node.js 18+
- MongoDB connection string
- Upstash Workflow/QStash credentials
- Gmail app password for email sending

## Installation

```bash
npm install
```

## Environment Variables

Create this file in the project root:

- `.env.development.local`

Example:

```env
PORT=5500
SERVER_URL=http://localhost:5500
NODE_ENV=development

DB_URL=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development

QSTASH_URL=your_upstash_qstash_base_url
QSTASH_TOKEN=your_upstash_qstash_token

EMAIL_PASSWORD=your_gmail_app_password
```

## Run the Project

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server starts at:

- `http://localhost:5500` (or your `PORT` value)

## API Base URL

`/api/v1`

## Main Routes

### Auth

- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout placeholder

### Users

- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get a user (requires Bearer token)

### Subscriptions

- `POST /api/v1/subscriptions` - Create subscription (requires Bearer token)
- `PUT /api/v1/subscriptions/:id` - Update subscription (requires Bearer token)
- `GET /api/v1/subscriptions/users/:id` - Get user's subscriptions (requires Bearer token)

Note: Some additional subscription endpoints currently return placeholder responses.

### Workflows

- `POST /api/v1/workflows/subscription/reminder` - Workflow callback endpoint

## Quick API Examples

### 1) Register

```bash
curl -X POST http://localhost:5500/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Vardhan",
    "email": "vardhan@example.com",
    "password": "password123"
  }'
```

### 2) Login

```bash
curl -X POST http://localhost:5500/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "vardhan@example.com",
    "password": "password123"
  }'
```

Copy the token from login response.

### 3) Create Subscription

```bash
curl -X POST http://localhost:5500/api/v1/subscriptions \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Netflix",
    "price": 499,
    "currency": "INR",
    "frequency": "monthly",
    "category": "entertainment",
    "paymentMethod": "UPI",
    "startdate": "2026-04-14"
  }'
```

## Notes

- Make sure your request URL has no hidden newline or trailing spaces.
- Protected routes require `Authorization: Bearer <token>`.
- Subscription creation triggers the workflow endpoint for reminders.

## Scripts

```json
{
  "start": "node app.js",
  "dev": "nodemon app.js"
}
```

## License

ISC
