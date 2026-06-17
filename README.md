# Steam Games

In this project, **Steam data** refers to the game dataset stored in `steam_games.json`. It contains details like game name, appid, price, developer, publisher, genres, platforms, descriptions, and recommendations.

This data is used to display games, search and filter records, manage game details, and generate analytics in the backend API.

---

## 🚀 Key Features Built

### ⚙️ Backend (REST API)
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

### 💻 Frontend (Client Dashboard)
9. **Responsive Design System**:
   - Fully optimized layouts across desktop, tablet, and mobile viewports.
   - Adaptive vertical sidebar with collapse toggle states and responsive spacing.
   - Sticky navbar with integrated global search box and responsive settings menus.
10. **Redux Toolkit State Management**:
    - Centralized global store managing authentication sessions, active theme states, responsive UI properties, and list configurations.
    - Specialized slices: `authSlice` for user session handling, `gameSlice` for library state, `uiSlice` for layout sizing, and `userSlice` for system admin listings.
11. **MUI v9 & Data Grid Integration**:
    - Advanced games list utilizing `@mui/x-data-grid` featuring built-in client-side sorting, pagination, and columns toggle.
    - Standardized feedback elements: Skeleton loaders, custom empty states, error fallbacks, and confirm modals.
12. **Data Visualizations via Recharts**:
    - Modern charts visualizing database metrics: Genre share distributions, pricing group bars, developer recommendation lists, and year-by-year release trend curves.
13. **Robust Client Router & Guards**:
    - Route protection with authentication middleware checks for private dashboard directories.
    - Role audits mapping admin-only view controls (Add, Edit, Delete and user list routes).
14. **Form Validation with Formik & Yup**:
    - Strictly validated inputs with detailed inline alerts covering logins, signups, and game catalog update schemas.

---

## 📁 Repository Structure

```text
a_steam_data_patel_ansh/
├── backend/
│   ├── src/
│   │   ├── config/             # Connection configurations
│   │   │   └── db.config.js    # Mongoose DB connection
│   │   ├── controllers/        # Request handlers (controllers layer)
│   │   │   ├── auth.controller.js
│   │   │   ├── game.controller.js
│   │   │   └── user.controller.js
│   │   ├── data/               # Static dataset source
│   │   │   └── steam_games.json# Realistic games list (~22 detailed games)
│   │   ├── middleware/         # Express middlewares
│   │   │   ├── auth.middleware.js
│   │   │   ├── error.middleware.js
│   │   │   └── validate.middleware.js
│   │   ├── models/             # Schema definitions (data layer)
│   │   │   ├── game.model.js
│   │   │   └── user.model.js
│   │   ├── routes/             # REST Route mappings (routing layer)
│   │   │   ├── admin.routes.js
│   │   │   ├── analytics.routes.js
│   │   │   ├── auth.routes.js
│   │   │   ├── game.routes.js
│   │   │   ├── health.routes.js
│   │   │   ├── jwt.routes.js
│   │   │   ├── middleware.routes.js
│   │   │   ├── search.routes.js
│   │   │   ├── stats.routes.js
│   │   │   └── user.routes.js
│   │   ├── scripts/            # Execution utilities
│   │   │   └── seed.js         # Database seeding system
│   │   ├── app.js              # Express app wiring
│   │   └── index.js            # Node startup entrypoint
│   ├── .env                    # Environment key values config file
│   └── package.json            # Dependencies and scripts definitions
├── frontend/                   # UI Directory
│   ├── public/                 # Static visual assets & SVGs
│   ├── src/
│   │   ├── assets/             # Local images & UI icons
│   │   ├── components/         # Reusable layouts and visual components
│   │   │   ├── common/         # Modals, inputs, skeleton screens, stats cards
│   │   │   └── layout/         # Navbar, Sidebar, Page wrappers, Error Boundary
│   │   ├── pages/              # View pages mapped to routes
│   │   │   ├── auth/           # Login & Registration views
│   │   │   ├── dashboard/      # Metrics home & Recharts analytics
│   │   │   ├── errors/         # 404 page
│   │   │   ├── games/          # Catalog list, detail page, dynamic edit forms
│   │   │   ├── profile/        # User profile details and configuration settings
│   │   │   └── users/          # Users list (Admin only)
│   │   ├── routes/             # Client-side router logic & route guards
│   │   ├── services/           # Axios interceptor setups & fetcher functions
│   │   ├── store/              # Redux Toolkit global store configuration
│   │   ├── theme/              # Custom MUI styling themes
│   │   └── utils/              # Client constants & helper methods
│   ├── .env                    # Client environment endpoint specifications
│   ├── tailwind.config.js      # Styling framework definitions
│   ├── vite.config.js          # Vite configuration options
│   └── package.json            # Client dependencies configurations
└── README.md                   # Main Documentation
```

---

## 🛠️ Installation & Setup

### ⚙️ Backend Setup
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

### 💻 Frontend Setup
1. **Navigate to the Frontend Directory**:
   ```bash
   cd ../frontend
   ```
2. **Install Node modules**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   Create a `.env` file in the `frontend` folder containing:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```
4. **Launch Local Server**:
   ```bash
   npm run dev
   ```
   The application dashboard will open on [http://localhost:5173](http://localhost:5173).
5. **Compile Assets**:
   For production builds:
   ```bash
   npm run build
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

### ⚙️ Backend Checklist
- [x] **Node.js, Express, MongoDB (Mongoose)** connection & configuration setup inside custom config.
- [x] **MVC Architecture** with strict layer divisions: `models`, `services`, `controllers`, `routes`.
- [x] **Database Seeding script** populating initial data efficiently.
- [x] **Full CRUD operations** for all entities with validation & soft deletes (`isDeleted`).
- [x] **Advanced queries**: Multi-field Text searches, numerical limits/inclusions, flexible paginator utilities.
- [x] **Secure JWT Authorization flow**: Hashing password fields inside schema pre-save hooks and protecting private routes with user extraction middlewares.
- [x] **Custom Middleware Chain**: Global API error handlers, custom rate limiters, request log systems.
- [x] **Advanced Aggregations**: match, group, project, sort stages used on multiple complex metrics.
- [x] **Robust Local backup systems** exporting database documents automatically.

### 💻 Frontend Checklist
- [x] **Vite & React 19 Client Environment** setup with Tailwind CSS and custom Material UI (MUI) v9 configurations.
- [x] **Redux Toolkit Slices** for synchronizing application global state (auth, UI settings, active game views, and registered users).
- [x] **Fully Responsive Dashboard Layout** with vertical collapse sidebar and top navbar search bindings.
- [x] **Interactive Data Analytics** integrating Recharts charts plotting developer rankings, price segments, release years, and genre distributions.
- [x] **Client-Side Filtering & Multi-Column Sorting** utilizing responsive `@mui/x-data-grid` data grids.
- [x] **Auth Guarded Routes** managing private views (`ProtectedRoute`) and administrative settings sections (`AdminRoute`).
- [x] **Formik Form Controls with Yup Validations** protecting login, register, profile, and game update schemas.
