# Steam Games Project

This is a full-stack web application designed as a clone of the Steam games platform. The project is split into two main directories: `backend` for the server-side API and database integration, and `frontend` for the user interface.

## Project Structure

```text
Steam Games/
├── backend/            # Express.js API and MongoDB configuration
│   ├── src/
│   │   ├── config/     # Database and server config
│   │   ├── controllers/# Business logic
│   │   ├── models/     # Mongoose schemas
│   │   ├── routes/     # API endpoints
│   │   └── ...
│   ├── .env            # Environment variables for the backend
│   └── package.json    # Backend dependencies
├── frontend/           # Frontend web application (React/Next/Vite, etc.)
│   └── ...             # Source code, assets, and styling
└── README.md           # Project documentation (this file)
```

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB instance (local or Atlas)

### Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the `backend` folder and add your specific configuration (e.g., Database URI, Port, JWT secrets):
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   ```

4. Start the backend server:
   - For development: `npm run dev` (uses Nodemon)
   - For production: `npm start`

### Frontend Setup

*(Currently setting up the frontend workspace)*

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. *(Instructions will be added once the frontend framework is initialized)*

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, Mongoose.
- **Frontend**: (To be determined - usually React/Vite/Next.js)

## Features

- **Games API**: Endpoints to create, read, update, and delete game data.
- **Authentication**: JWT-based user authentication and authorization (via `jsonwebtoken` and `bcryptjs`).
- *(More features to be added as development continues)*
