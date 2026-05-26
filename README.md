# Steam Games Clone Backend (Complete API & Database Platform)

This is a comprehensive, production-ready full-stack backend built with **Node.js, Express.js, and MongoDB (Mongoose)** following the industry-standard **MVC Architecture**. It is fully integrated with a realistic dataset of 22 premium Steam games, and includes dynamic query structures, JWT authorization, role-based access control, analytics aggregations, and automatic backup systems.

---

## 🚀 Key Features Built

1. **MVC Architecture & Separation of Concerns**: Core controllers delegate request/response lifecycles, service layers govern business operations, utilities govern helpers, and models dictate Mongo validations.
2. **JWT-Based Authentication**:
   - User signup and login with secure password hashing via `bcryptjs`.
   - Access token signature & decoding with expiration control.
   - Protected routes guarded by auth middleware.
3. **Role-Based Access Control (RBAC)**:
   - Restricts database mutations (`POST`, `PUT`, `DELETE` operations) exclusively to accounts with the `"admin"` role.
   - Default administrators (`admin@steamgames.com`) and standard players (`ansh@steamgames.com`) seeded automatically.
4. **Comprehensive Games CRUD Operations**:
   - `GET /api/v1/games`: Retrieve all games with advanced filter queries.
   - `GET /api/v1/games/appid/:appid`: Fetch single game specs.
   - `POST /api/v1/games`: Add new games (Admin only).
   - `PUT /api/v1/games/appid/:appid`: Edit game records (Admin only).
   - `DELETE /api/v1/games/appid/:appid`: Safe Soft Delete using `isDeleted` flag tracking (Admin only).
5. **Advanced Querying Ecosystem**:
   - **Case-Insensitive Text Search**: Matches query text across name, developer, publisher, and descriptions using Mongoose indexes.
   - **Pagination System**: Standardized query limits and skips, returning `totalPages`, `hasNextPage`, `hasPrevPage`, and total items count.
   - **Dynamic Sorting**: Orders records based on fields like `price`, `-recommendations`, etc.
   - **Range Filtering**: Supports numerical constraints like `minPrice`, `maxPrice`, `minRecommendations`, platforms, and genre inclusions.
6. **MongoDB Aggregation Pipelines (Advanced Analytics)**:
   - `/stats/genre`: Group by genres to calculate counts, average prices, and recommendations.
   - `/stats/price-tier`: Bin games into Free-to-Play, Budget, Premium, and Elite tiers.
   - `/stats/developer-rankings`: Rank developers by total recommendations and games library count.
   - `/stats/release-trends`: Trend analysis of game releases and price averages over different years.
7. **Robust Middleware Pipeline**:
   - Centralized global exception catcher handles validations, JWT, and database key errors uniformly.
   - Customized memory rate-limiter prevents denial-of-service/API abuse.
   - Double logging levels (standard mode vs detail-rich debug mode in development).
8. **Automated Utilities & Seeding**:
   - Database seeding script imports games dataset and default accounts.
   - Data backup script exports tables locally inside `backups/` directories.

---

## 📁 Repository Structure

```text
a_steam_data_patel_ansh/
├── backend/
│   ├── src/
│   │   ├── config/             # Connection and env parameters configurations
│   │   │   ├── db.js           # Mongoose DB connection
│   │   │   └── env.config.js   # Environment config manager
│   │   ├── controllers/        # Request handlers (controllers layer)
│   │   │   ├── auth.controller.js
│   │   │   ├── game.controller.js
│   │   │   └── user.controller.js
│   │   ├── data/               # Static dataset source
│   │   │   └── steam_games.json# Realistic games list (~22 detailed games)
│   │   ├── middlewares/        # Custom middleware chain
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   ├── logger.middleware.js
│   │   │   ├── rbac.middleware.js
│   │   │   ├── rateLimiter.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── models/             # Schema definitions (data layer)
│   │   │   ├── game.model.js
│   │   │   └── user.model.js
│   │   ├── routes/             # REST Route mappings (routing layer)
│   │   │   ├── auth.routes.js
│   │   │   ├── game.routes.js
│   │   │   ├── health.routes.js
│   │   │   └── user.routes.js
│   │   ├── scripts/            # Admin execution utilities
│   │   │   ├── backup.js       # Local JSON database backups
│   │   │   └── seed.js         # Database seeding system
│   │   ├── utils/              # Standardized utility wrappers
│   │   │   ├── ApiError.js
│   │   │   ├── ApiResponse.js
│   │   │   ├── asyncHandler.js
│   │   │   ├── filterBuilder.js
│   │   │   └── pagination.js
│   │   ├── app.js              # Express app wiring
│   │   └── index.js            # Node startup entrypoint
│   ├── .env                    # Environment key values config file
│   ├── backups/                # Local data exports directory
│   └── package.json            # Dependencies and scripts definitions
├── frontend/                   # UI Directory
└── README.md                   # Main Documentation
```

---

## 🛠️ Installation & Setup

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Install Node modules**:
   ```bash
   npm install
   ```

3. **Database Seeding**:
   Populate MongoDB automatically with default admin/user credentials and 22 premium Steam games:
   ```bash
   npm run seed
   ```
   *Seeded Users:*
   - **Admin Account**: `admin@steamgames.com` / `adminpassword123`
   - **User Account**: `ansh@steamgames.com` / `userpassword123`

4. **Launch Server**:
   - For local development:
     ```bash
     npm run dev
     ```
   - For production environments:
     ```bash
     npm start
     ```

5. **Backup Database Collections**:
   Export all data tables to local backups at any time:
   ```bash
   npm run backup
   ```

---

## 🔗 REST API Endpoint Reference

### 🔐 Authentication (`/api/v1/auth`)
| Method | Endpoint | Access | Description | Input Payload / Query |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/register` | Public | Register new player profile | `{ "username": "...", "email": "...", "password": "..." }` |
| **POST** | `/login` | Public | Log in user and generate JWT | `{ "email": "...", "password": "..." }` |
| **POST** | `/logout` | Public | Log out user sessions | *None* |
| **GET** | `/profile` | User/Admin | Load authorized user details | *Bearer Token Header* |

### 🎮 Games management (`/api/v1/games`)
| Method | Endpoint | Access | Description | Query Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/` | Public | Query games with filters | `search`, `genres`, `isFree`, `minPrice`, `maxPrice`, `page`, `limit`, `sort` |
| **GET** | `/appid/:appid`| Public | Fetch single game details | *None* |
| **POST** | `/` | Admin | Create a new game | `{ "appid": "...", "name": "...", "price": 19.99, "developer": "...", "publisher": "..." }` |
| **PUT** | `/appid/:appid`| Admin | Update game particulars | `{ "price": 14.99, ... }` |
| **DELETE**| `/appid/:appid`| Admin | Safe soft delete a game | *None* |

### 📊 Advanced Aggregations (`/api/v1/games/stats`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/genre` | Public | Genre distributions, counts, average price, total recommendations |
| **GET** | `/price-tier` | Public | Categorization counts: Free, Budget, Premium, Elite groups |
| **GET** | `/developer-rankings`| Public | Rank developers by recommendations count and game volumes |
| **GET** | `/release-trends` | Public | Trend analytics across historical release years |

### 🔍 User Management (`/api/v1/users`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Admin | Audit list of registered users |
| **GET** | `/:id` | Admin | View user profiles by ID |

### 🩺 Health System (`/api/v1/health`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/` | Public | Checks Node uptime, database connection status, memory utilization |

---

## 🏆 Checklist Requirements Completed

- [x] **Node.js, Express, MongoDB (Mongoose)** connection & configuration setup inside custom config.
- [x] **MVC Architecture** with strict layer divisions: `models`, `services`, `controllers`, `routes`.
- [x] **Database Seeding script** populating initial data efficiently.
- [x] **Full CRUD operations** for all entities with validation & soft deletes (`isDeleted`).
- [x] **Advanced queries**: Multi-field Text searches, numerical limits/inclusions, flexible paginator utilities.
- [x] **Secure JWT Authorization flow**: Hashing password fields inside schema pre-save hooks and protecting private routes with user extraction middlewares.
- [x] **Custom Middleware Chain**: Global API error handlers, custom rate limiters, request log systems.
- [x] **Advanced Aggregations**: match, group, project, sort stages used on multiple complex metrics.
- [x] **Robust Local backup systems** exporting database documents automatically.
