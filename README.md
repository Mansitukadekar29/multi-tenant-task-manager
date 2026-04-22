# Multi-Tenant SaaS Application

A full-stack multi-tenant task management application with role-based access control.

## Architecture

```
Teknotantra/
├── backend/              # Express.js API
│   ├── src/
│   │   ├── controllers/ # Route handlers
│   │   ├── routes/      # API endpoints
│   │   ├── middleware/  # Auth, tenant, role middleware
│   │   └── config/      # Database config
│   └── app.js           # Express setup
├── frontend/           # React application
│   └── src/
│       ├── pages/      # Route components
│       ├── components/ # Reusable components
│       └── services/   # API service
└── package.json        # Root dependencies
```

## Tech Stack

- **Frontend:** React.js
- **Backend:** Express.js
- **Database:** PostgreSQL with Sequelize ORM
- **Auth:** JWT + bcrypt

## Roles

| Role | Access Level | Subdomain Required |
|------|--------------|---------------------|
| super_admin | Global tenant management | No (localhost) |
| admin | Tenant-specific users/tasks | Yes |
| user | View assigned tasks | Yes |

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Super admin login |
| POST | `/api/auth/tenant-login` | Tenant admin/user login |

### Super Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/superadmin/create-tenant` | Create new tenant |
| GET | `/api/superadmin/tenants` | List all tenants |
| GET | `/api/superadmin/dashboard` | Dashboard stats |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/create-user` | Create user within tenant |
| GET | `/api/admin/users` | List tenant users |
| DELETE | `/api/admin/user/:id` | Delete user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | List tasks |
| PUT | `/api/tasks/:id` | Update task |

### Dashboard
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/admin` | Admin dashboard stats |

### Tenant
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tenant/info` | Get tenant branding info |

## Tenant Detection

Tenants are identified via subdomain:
- `infosys.localhost` → extracts `infosys` → queries `tenants` table
- Falls back to super admin if no subdomain present

## Environment Variables

```env
PORT=3000
DATABASE_URL=postgres://postgres:password@localhost:5432/multitenant_db
JWT_SECRET=your-secret-key
```

## Setup

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Database Schema

### Tenants Table
- `id`, `name`, `subdomain`, `logo`, `theme_color`
- `admin_name`, `admin_email`, `admin_password` (hashed)
- `created_at`

### Users Table
- `id`, `tenant_id`, `name`, `email`, `password` (hashed)
- `role` (admin/user), `created_at`

### Tasks Table
- `id`, `tenant_id`, `user_id`, `title`, `description`
- `status` (pending/completed/overdue), `due_date`
- `created_at`

## Middleware

- `authMiddleware` - JWT verification
- `tenantMiddleware` - Subdomain-based tenant resolution
- `roleMiddleware` - Role-based access control