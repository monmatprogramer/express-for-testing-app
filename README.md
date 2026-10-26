# Express Testing App (`express-for-testing-app`)

A modern, lightweight REST API starter built with **Express 5**, **TypeScript**, and **JSON Web Token (JWT)** authentication. Designed for testing, prototyping, and serving as a solid template for TypeScript backend services.

---

## 🚀 Features

- **TypeScript Ready**: Full TypeScript support with strict type-checking and modern NodeNext module resolution.
- **Express 5**: Uses the latest Express framework for fast, robust routing and middleware.
- **JWT Authentication**: Token generation and bearer token verification with configurable issuer and audience.
- **Environment Validation**: Strict runtime environment variable checks at startup (`src/config/env.ts`).
- **Developer Experience**: Fast auto-reloading during development powered by `tsx watch`.
- **CORS Enabled**: Configured out of the box with `cors`.

---

## 🛠️ Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v18+ recommended)
- **Framework**: [Express 5](https://expressjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Development Tooling**: [tsx](https://github.com/privatenumber/tsx)
- **Security / Auth**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [cors](https://github.com/expressjs/cors)

---

## 📁 Project Structure

```text
express-for-testing-app/
├── src/
│   ├── config/
│   │   └── env.ts               # Environment variable validation & loader
│   ├── controllers/
│   │   └── user.controllers.ts  # Route handlers (auth, profile, health)
│   ├── routes/
│   │   └── user.routes.ts       # User endpoint routing definitions
│   └── index.ts                 # Application entry point & server bootstrap
├── postman/                     # Postman workspace & collections
├── .env.example                 # Example environment variables template
├── .gitignore                   # Git ignore patterns
├── package.json                 # Project dependencies & npm scripts
├── tsconfig.json                # TypeScript compiler configuration
└── README.md                    # Project documentation
```

---

## ⚡ Getting Started

### 1. Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) (version 9 or higher)

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone https://github.com/monmatprogramer/express-for-testing-app.git
cd express-for-testing-app
npm install
```

### 3. Environment Configuration

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure your environment variables in `.env`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Port number the server will listen on | `4000` |
| `JWT_SECRET` | Secret key used to sign and verify JWTs | *`your_jwt_secret_key_here`* |
| `JWT_ISSUER` | JWT token issuer (`iss` claim) | `jwtissuer` |
| `JWT_AUDIENCE` | JWT token audience (`aud` claim) | `jwtaudience` |

> ⚠️ **Important**: Never commit your `.env` file containing real secrets to version control.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with live reload via `tsx watch` |
| `npm run build` | Compiles TypeScript source files into JavaScript in `dist/` |
| `npm run type-check` | Runs TypeScript compiler checks without emitting files |
| `npm start` | Runs the compiled production server from `dist/index.js` |

---

## 📡 API Reference

Base URL: `http://localhost:4000/api/v1`

### 1. Root Status

- **Method**: `GET`
- **URL**: `/api/v1/`
- **Description**: Verifies that the API service is reachable.
- **Response** `(200 OK)`:
  ```json
  {
    "message": "Hello from Express!"
  }
  ```

---

### 2. User Service Health Check

- **Method**: `GET`
- **URL**: `/api/v1/users/health`
- **Description**: Returns health status of the users service.
- **Response** `(200 OK)`:
  ```json
  {
    "message": "User health is ok!"
  }
  ```

---

### 3. User Login (Generate JWT)

- **Method**: `POST`
- **URL**: `/api/v1/users/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "id": 101,
    "username": "monmat",
    "role": "admin"
  }
  ```
- **Response** `(200 OK)`:
  ```json
  {
    "message": "Login success.",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
  ```

---

### 4. User Profile (Protected Route)

- **Method**: `GET`
- **URL**: `/api/v1/users/profile`
- **Headers**:
  - `Authorization: Bearer <YOUR_JWT_TOKEN>`
- **Response** `(200 OK)`:
  ```json
  {
    "message": "Authorization success",
    "user": {
      "userId": 101,
      "username": "monmat",
      "role": "admin",
      "sub": "101",
      "iss": "jwtissuer",
      "aud": "jwtaudience",
      "iat": 1729930000,
      "exp": 1729930900
    }
  }
  ```
- **Response** `(401 Unauthorized)`:
  ```json
  {
    "error": "Missing or invalid authorization header"
  }
  ```

---

## 🧪 Testing with cURL

#### Login & Obtain Token:
```bash
curl -X POST http://localhost:4000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"id": 1, "username": "testuser", "role": "admin"}'
```

#### Access Protected Profile:
```bash
curl -X GET http://localhost:4000/api/v1/users/profile \
  -H "Authorization: Bearer <PASTE_TOKEN_HERE>"
```

---

## 📄 License

This project is licensed under the [ISC](LICENSE) License.
