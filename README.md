# Rada API
<a name="readme-top"></a>

<div align="center">
  <a href="https://rada-blog.vercel.app"><img src="./public/rada-logo.svg" alt="logo" width=150></a>
  <h1>Rada</h1>
</div> <br>

<details open>
<summary>Table of Contents</summary>
<ol>
  <li>
    <a href="#introduction">Introduction</a>
    <ul>
      <li>
        <a href="#client">Client</a>
      </li>
    </ul>
  </li>
  <li>
    <a href="#features">Features</a>
    <ul>
      <li>
        <a href="#built-with">Built With</a>
      </li>
    </ul>
  </li>
  <li><a href="#endpoints">Endpoints</a></li>
  <li><a href="#getting-started">Getting Started</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
</ol>
</details>

## Introduction
Rada Blog API powers the backend for the Rada Blog platform. It handles authentication, authorization, blog management, comments, claps, and database operations.

This repository contains the server-side application.

### Client 
- Client Repository: https://github.com/Dewiin/rada-blog
- Client Deployment: https://rada-blog.vercel.app

## Features
- ⚡ RESTful API Architecture
    - Simple and scalable API structure for interacting with blog data.
    - Organized route and controller system for maintainability.
- ✍️ CRUD Operations
    - Create, read, update, and delete blog posts.
    - Manage comments and user interactions.
    - Support for published and draft blog content.
- 🛡️ Validation & Error Handling
    - Request validation for secure API interactions.
    - Structured error handling for consistent responses.
    - Protection against invalid or unauthorized requests.
- 🔐 Authentication & Authorization
    - JWT authentication with refresh token flow.
    - Google OAuth integration using Passport.js.
    - Protected routes and role-based access control.
    - Secure HTTP-only cookie handling.

### Built With
[![Node][Node]][Node-url]
[![Express][Express]][Express-url]
[![PostgreSQL][PostgreSQL]][PostgreSQL-url]
[![Prisma][Prisma]][Prisma-url]

## Endpoints

### Auth
| Endpoint          | Method | Description           |
| ----------------- | ------ | --------------------- |
| /api/auth/signup  | POST   | Create a new user     |
| /api/auth/login   | POST   | Log in user           |
| /api/auth/logout  | POST   | Log out user          |
| /api/auth/refresh | POST   | Refresh access token  |
| /api/auth/me      | GET    | Retrieve current user |

### Posts
| Endpoint            | Method | Description                         |
| ------------------- | ------ | ----------------------------------- |
| /api/posts/         | GET    | Retrieve all published posts        |
| /api/posts/         | POST   | Create a public or unpublished post |
| /api/posts/:id      | GET    | Retrieve post by id                 |
| /api/posts/:id      | PUT    | Update post by id                   |
| /api/posts/:id      | DELETE | Delete post by id                   |
| /api/posts/:id/clap | POST   | Submit clap for a post              |

### Profile
| Endpoint                 | Method | Description                         |
| ------------------------ | ------ | ----------------------------------- |
| /api/profile/published   | GET    | Retrieve author's published posts   |
| /api/profile/unpublished | GET    | Retrieve author's unpublished posts |
| /api/profile/activity    | GET    | Retrieve all user activity          |

### Comments
| Endpoint                 | Method | Description                    |
| ------------------------ | ------ | ------------------------------ |
| /api/comments/:postId    | POST   | Create a new comment on a post |
| /api/comments/:commentId | DELETE | Delete comment by id           |
| /api/comments/:commentId | PUT    | Update an existing comment     |

## Getting Started

### Installation
```sh 
npm install
```

### Environment Variables
```sh
DATABASE_URL="your_data_url"
JWT_SECRET_KEY="your_jwt_secret"
JWT_REFRESH_KEY="your_refresh_secret"
NODE_ENV="development"

GOOGLE_OAUTH_CLIENT_ID="your_google_client_id"
GOOGLE_OAUTH_CLIENT_SECRET="your_google_client_secret"
GOOGLE_OAUTH_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"
CLIENT_URL="http://localhost:5173"

# If creating an author account 
AUTHOR_USERNAME="author_username"
AUTHOR_PASSWORD="author_password"
```

### Prisma setup
```sh
# Generate client and apply migrations
npx prisma migrate dev

# Open studio (optional)
npx prisma studio

# Seeding an author account (optional)
npx prisma db seed
```

### Running the server
```sh
npm run dev
```

## Contributing

Any kinds of contribution is welcome, such as:

- New features
- Bug fixes
- Typo fixes
- Suggestions
- Maintenance
- Documents
- etc.

#### Heres how you can contribute:

1. Fork the repository
2. Create a new feature branch
3. Commit your changes
4. Push to the branch
5. Submit a pull request

<p align="right"><a href="#readme-top">Back to top</a></p>

## License

MIT License

Copyright (c) 2026 Devin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


[Node]: https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/en

[Express]: https://img.shields.io/badge/Express.js-404d59.svg?style=for-the-badge&logo=express&logoColor=61DAFB
[Express-url]: https://expressjs.com/

[PostgreSQL]: https://img.shields.io/badge/Postgres-316192.svg?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/

[Prisma]: https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/docs 