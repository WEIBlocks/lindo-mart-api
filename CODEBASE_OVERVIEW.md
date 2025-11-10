# Lindo Mart API - Complete Codebase Overview

## 📁 Project Structure

This is a **NestJS** (Node.js) backend API for **Lindo Mart Form Management System** using:
- **TypeScript**
- **MongoDB** (via Mongoose)
- **JWT Authentication**
- **WebSocket** (Socket.IO) for real-time alerts
- **Cloudinary** for image uploads
- **Email Services** (Gmail SMTP & Resend)
- **SMS Service** (Twilio)

---

## 🏗️ Architecture Overview

### Main Entry Point
- **`src/main.ts`**: Application bootstrap, sets global prefix `/api/v1`, enables CORS, connects to MongoDB

### Core Module
- **`src/app.module.ts`**: Root module that imports all feature modules

---

## 📂 Folder Structure

```
src/
├── alerts/              # Alert management system
├── auth/                # Authentication & authorization
├── common/              # Shared services & utilities
├── contact/             # Contact form handling
├── dashboard/           # Dashboard statistics & operations
├── forms/               # Form submission & management
├── items/                # General items management
├── itemlist/            # Item list modules
│   ├── common/          # Shared categories & actions
│   ├── equipment/       # Equipment management
│   ├── inventory/       # Inventory management
│   └── operational-alerts/ # Operational alerts
├── schemas/             # MongoDB schemas (models)
├── types/               # TypeScript type definitions
└── user/                # User management
```

---

## 🔐 Authentication & Authorization

### Module: `auth/`
- **Controller**: `auth.controller.ts`
  - `POST /auth/login` - User login
  - `POST /auth/register` - User registration
  - `POST /auth/reset-password` - Password reset (protected)

- **Service**: `auth.service.ts`
  - Validates users, handles login/register
  - Password hashing with bcrypt
  - JWT token generation
  - Sends login alerts via email

- **Strategy**: `jwt.strategy.ts`
  - JWT token validation
  - Extracts user info from token payload

- **Guard**: `jwt-auth.guard.ts`
  - Protects routes requiring authentication

### Roles System
- **Roles**: `Staff`, `Supervisor`, `Management`, `Super-Admin`
- **Guard**: `common/guards/roles.guard.ts` - Role-based access control
- **Decorator**: `common/decorators/roles.decorator.ts` - `@Roles('Super-Admin')`

---

## 👤 User Management

### Module: `user/`
- **Controller**: `user.controller.ts`
  - `GET /users/profile` - Get current user profile
  - `PUT /users/profile` - Update profile
  - `GET /users/roles` - Get available roles
  - `PUT /users/:id/role` - Update user role
  - `GET /users` - Get all users
  - `DELETE /users/:id` - Delete user (Super-Admin only)

- **Service**: `user.service.ts`
  - Profile management
  - Role updates with alert notifications
  - User CRUD operations

### Schema: `schemas/user/user.schema.ts`
```typescript
- username: string (required)
- password: string (hashed, required)
- role: string (default: 'Staff')
- phoneNumber: string (required)
- email: string (required)
- movedForms: array (tracks form movements)
```

---

## 📋 Forms Management

### Module: `forms/`
- **Controller**: `forms.controller.ts`
  - `POST /forms/submit` - Submit new form
  - `GET /forms/user-forms` - Get user's submitted forms
  - `GET /forms/user-form/:id` - Get form status
  - `PATCH /forms/:formId/status` - Update form status (with signature)

- **Service**: `forms.service.ts`
  - Form submission with history tracking
  - Status updates with signature upload (Cloudinary)
  - Form movement between users
  - Alert generation on form events

### Schema: `schemas/form/form.schema.ts`
```typescript
- userId: string (form creator)
- formType: string (form category)
- formData: object (form content)
- status: string (Pending, In-Progress, Completed, etc.)
- recipient: string (user ID or role)
- alertId: string (related alert)
- signatureUrl: string (Cloudinary URL)
- history: array (status change history)
- createdAt: Date
```

---

## 🔔 Alerts System

### Module: `alerts/`
- **Controller**: `alerts.controller.ts`
  - `GET /alerts/all` - Get all alerts (Super-Admin)
  - `GET /alerts/user` - Get user's alerts
  - `PATCH /alerts/user/:id/status` - Update alert status

- **Service**: `alerts.service.ts`
  - Multi-channel notifications:
    - **In-app** (WebSocket)
    - **Email** (Gmail SMTP via Resend)
    - **SMS** (Twilio - optional)
  - Smart email templates based on alert type
  - Role-based or user-specific targeting

- **Gateway**: `alerts.gateway.ts` (WebSocket)
  - Real-time notifications via Socket.IO
  - User-specific rooms
  - JWT authentication for connections

### Schema: `schemas/alert/alert.schema.ts`
```typescript
- message: string
- role: string (optional)
- userId: string (target user)
- categories: string[] (in-app, email, sms)
- relatedId: string (related form/item ID)
- userIds: string[] (multiple targets)
- createdAt: Date
```

---

## 📊 Dashboard

### Module: `dashboard/`
- **Controller**: `dashboard.controller.ts`
  - `GET /dashboard/admin-stats` - Admin statistics
  - `GET /dashboard/forms` - All forms
  - `GET /dashboard/user-forms` - User-related forms
  - `POST /dashboard/move-form` - Move form to another user
  - `GET /dashboard/moved-forms` - Get moved forms
  - `POST /dashboard/trigger-followup` - Trigger follow-up alert

- **Service**: `dashboard.service.ts`
  - Time-based statistics (today, 7 days, 30 days)
  - Form category statistics
  - Performance metrics (completion times)
  - Form movement tracking

---

## 📦 Inventory Management

### Module: `itemlist/inventory/`
- **Controller**: `inventory.controller.ts`
  - Full CRUD operations
  - Filtering by: perishable, essential, status, unitOfMeasure
  - Search functionality
  - Pagination
  - Public endpoint (read-only, filtered fields)

- **Service**: `inventory.service.ts`
  - Inventory item management
  - Statistics (total, perishable, essential counts)
  - Public data filtering

### Schema: `schemas/inventory.schema.ts`
```typescript
- name: string
- description: string
- unitOfMeasure: string
- unitsPerPackage: number
- reorderLevel: string
- perishable: boolean
- essential: boolean
- category: string
- subcategory: string
- lastUpdated: Date
```

### Sub-modules:
- **Unit of Measure**: `common/unitOfMeasure/`
- **Packaging**: `common/packaging/`

---

## 🛠️ Equipment Management

### Module: `itemlist/equipment/`
- **Controller**: `equipment.controller.ts`
  - Full CRUD operations
  - Filtering by category, subcategory, location
  - Search functionality
  - Category/subcategory options
  - Public endpoint

- **Service**: `equipment.service.ts`
  - Equipment item management
  - Statistics by category
  - Category/subcategory options

### Schema: `schemas/equipment.schema.ts`
```typescript
- name: string
- description: string
- category: string
- subcategory: string
- location: string
- maintenanceNotes: string
```

### Sub-modules:
- **Reason Code**: `common/reasonCode/`

---

## ⚠️ Operational Alerts

### Module: `itemlist/operational-alerts/`
- **Controller**: `operational-alerts.controller.ts`
  - Full CRUD operations
  - Filtering by category, subcategory, actionNeeded, type
  - Multiple filter endpoints
  - Public endpoint

- **Service**: `operational-alerts.service.ts`
  - Alert management
  - Statistics by category/subcategory
  - Type-based filtering

### Schema: `schemas/operational-alert.schema.ts`
```typescript
- name: string
- description: string
- category: string
- subcategory: string
- actionNeeded: string
- type: enum (operational-alerts, handover-alerts, customer-feedback, health-safety, disaster-preparedness)
```

---

## 📁 Common Item List Features

### Module: `itemlist/common/`
- **Categories**: `category/`
  - Category management with subcategories
  - Type-based categories (inventory, equipment, operational-alerts, etc.)
  - Public endpoint for category options

- **Actions**: `actions/`
  - Action definitions for different types
  - Type-based actions
  - Public endpoint for action options

---

## 📝 Items Management

### Module: `items/`
- **Controller**: `items.controller.ts`
  - `POST /items` - Create item (Admin/Super-Admin)
  - `GET /items` - Get all items (with filters)
  - `GET /items/action-needed` - Get items needing action
  - `GET /items/:id` - Get single item
  - `PATCH /items/:id` - Update item (Admin/Super-Admin)
  - `DELETE /items/:id` - Delete item (Super-Admin only)

- **Service**: `items.service.ts`
  - General item management
  - Action-needed filtering

### Schema: `schemas/item/item.schema.ts`
```typescript
- name: string
- description: string
- categories: string[]
- minimumLevel: string
- actionsNeeded: string[]
```

---

## 📧 Contact Management

### Module: `contact/`
- **Controller**: `contact.controller.ts`
  - `POST /contact` - Create contact message
  - `GET /contact` - Get all contacts
  - `GET /contact/:id` - Get single contact
  - `PUT /contact/:id/resolve` - Mark as resolved

- **Service**: `contact.service.ts`
  - Contact form handling
  - Resolution tracking

### Schema: `schemas/contact.schema.ts`
```typescript
- name: string
- email: string
- subject: string
- message: string
- isResolved: boolean
```

---

## 🔧 Common Services

### Module: `common/`

#### **CloudinaryService** (`cloudinary.service.ts`)
- Signature image uploads
- Base64 to Cloudinary conversion
- Folder organization (`signatures/`)

#### **GmailService** (`gmail.service.ts`)
- SMTP email sending via Gmail
- Multiple email templates:
  - Form received
  - Status updates
  - Role updates
  - Form moved
  - Follow-up reminders
- Fallback to STARTTLS (port 587) if SSL fails

#### **ResendService** (`resend.service.ts`)
- Alternative email service
- Same email templates as GmailService
- Uses Resend API

#### **TwilioService** (`twilio.service.ts`)
- SMS notifications
- Phone number validation & formatting
- Bulk SMS support

---

## 🛡️ Guards & Decorators

### Guards
- **`JwtAuthGuard`**: Validates JWT token
- **`RolesGuard`**: Checks user role against required roles

### Decorators
- **`@Roles(...roles)`**: Specify required roles for route
- **`@CurrentUser()`**: Extract current user from request

---

## 📡 API Endpoints Summary

### Base URL: `/api/v1`

#### Authentication
- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/reset-password` (protected)

#### Users
- `GET /users/profile` (protected)
- `PUT /users/profile` (protected)
- `GET /users/roles` (protected)
- `PUT /users/:id/role` (protected)
- `GET /users` (protected)
- `DELETE /users/:id` (Super-Admin)

#### Forms
- `POST /forms/submit` (protected)
- `GET /forms/user-forms` (protected)
- `GET /forms/user-form/:id` (protected)
- `PATCH /forms/:formId/status` (protected)

#### Alerts
- `GET /alerts/all` (Super-Admin)
- `GET /alerts/user` (protected)
- `PATCH /alerts/user/:id/status` (protected)

#### Dashboard
- `GET /dashboard/admin-stats` (protected)
- `GET /dashboard/forms` (protected)
- `GET /dashboard/user-forms` (protected)
- `POST /dashboard/move-form` (protected)
- `GET /dashboard/moved-forms` (protected)
- `POST /dashboard/trigger-followup` (protected)

#### Inventory
- `POST /itemlist/inventory/items` (Admin/Super-Admin)
- `GET /itemlist/inventory/items` (Admin/Super-Admin)
- `GET /itemlist/inventory/items/public` (authenticated)
- `GET /itemlist/inventory/items/stats` (Admin/Super-Admin)
- `GET /itemlist/inventory/items/:id` (Admin/Super-Admin)
- `PATCH /itemlist/inventory/items/:id` (Admin/Super-Admin)
- `DELETE /itemlist/inventory/items/:id` (Admin/Super-Admin)

#### Equipment
- `POST /itemlist/equipment/items` (Admin/Super-Admin)
- `GET /itemlist/equipment/items` (Admin/Super-Admin)
- `GET /itemlist/equipment/items/public` (authenticated)
- Similar CRUD endpoints

#### Operational Alerts
- `POST /itemlist/operational-alerts` (Admin/Super-Admin)
- `GET /itemlist/operational-alerts` (Admin/Super-Admin)
- `GET /itemlist/operational-alerts/public` (authenticated)
- Similar CRUD endpoints

#### Categories & Actions
- `POST /itemlist/common/categories` (Admin/Super-Admin)
- `GET /itemlist/common/categories` (Admin/Super-Admin)
- `GET /itemlist/common/categories/public` (authenticated)
- Similar endpoints for actions

#### Items
- `POST /items` (Admin/Super-Admin)
- `GET /items` (protected)
- `GET /items/action-needed` (protected)
- `GET /items/:id` (protected)
- `PATCH /items/:id` (Admin/Super-Admin)
- `DELETE /items/:id` (Super-Admin)

#### Contact
- `POST /contact` (public)
- `GET /contact` (public)
- `GET /contact/:id` (public)
- `PUT /contact/:id/resolve` (public)

---

## 🔌 WebSocket

### Alerts Gateway
- **Connection**: JWT authenticated
- **Events**:
  - `join` - Join user room
  - `alert` - Receive alert notification
- **Rooms**: User-specific rooms by userId

---

## 🗄️ Database Models (Schemas)

1. **User** - User accounts with roles
2. **Form** - Form submissions with history
3. **Alert** - Notification system
4. **Contact** - Contact form submissions
5. **Item** - General items
6. **InventoryItem** - Inventory management
7. **EquipmentItem** - Equipment management
8. **OperationalAlert** - Operational alerts
9. **Category** - Categories with subcategories
10. **Actions** - Action definitions
11. **UnitOfMeasure** - Inventory unit measurements
12. **Packaging** - Inventory packaging types
13. **ReasonCode** - Equipment reason codes

---

## 🔑 Environment Variables

Required environment variables:
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT signing secret
- `PORT` - Server port (default: 5000)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `GMAIL_SMTP_HOST` - Gmail SMTP host
- `GMAIL_SMTP_PORT` - Gmail SMTP port
- `GMAIL_SMTP_USER` - Gmail SMTP username
- `GMAIL_SMTP_PASS` - Gmail SMTP password
- `RESEND_API_KEY` - Resend API key (optional)
- `TWILIO_ACCOUNT_SID` - Twilio account SID (optional)
- `TWILIO_AUTH_TOKEN` - Twilio auth token (optional)
- `TWILIO_PHONE_NUMBER` - Twilio phone number (optional)
- `FRONTEND_URL` - Frontend URL for email links

---

## 🚀 Key Features

1. **Multi-role Authentication** - Staff, Supervisor, Management, Super-Admin
2. **Form Workflow** - Submit, assign, move, track status
3. **Real-time Alerts** - WebSocket notifications
4. **Multi-channel Notifications** - Email, SMS, In-app
5. **Signature Capture** - Cloudinary image uploads
6. **Dashboard Analytics** - Statistics and metrics
7. **Inventory Management** - Perishable, essential items tracking
8. **Equipment Tracking** - Location and maintenance notes
9. **Operational Alerts** - Multiple alert types
10. **Category System** - Hierarchical categories with subcategories
11. **Action System** - Predefined actions for different types
12. **Pagination & Search** - Efficient data retrieval
13. **Public Endpoints** - Filtered read-only access

---

## 📝 Notes

- All routes are prefixed with `/api/v1`
- Most routes require JWT authentication
- Role-based access control for admin operations
- Public endpoints provide limited data (name, description, category, subcategory)
- Email service uses Gmail SMTP primarily, Resend as alternative
- SMS functionality is optional (Twilio)
- Form history tracks all status changes
- Alert system supports role-based or user-specific targeting
- WebSocket connections require JWT authentication
- Cloudinary used for signature image storage

---

## 🔄 Data Flow

1. **Form Submission**:
   - User submits form → Form created → Alert sent to recipient → Email notification

2. **Status Update**:
   - User updates form status → History updated → Alert sent → Email notification

3. **Form Movement**:
   - User moves form → Recipient updated → Alert sent to new recipient → Email notification

4. **Login**:
   - User logs in → JWT token generated → Login alert sent via email

5. **Role Update**:
   - Admin updates user role → Role changed → Alert sent → Email notification

---

This codebase is a comprehensive form management system with inventory, equipment, and operational alert tracking capabilities, featuring real-time notifications and multi-channel communication.
