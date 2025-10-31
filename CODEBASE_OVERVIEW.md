# Lindo Mart API - Complete Codebase Overview

## 📁 Project Structure

```
lindo-mart-api/
├── src/
│   ├── main.ts                          # Application entry point
│   ├── app.module.ts                    # Root module
│   ├── app.controller.ts                 # Root controller
│   ├── app.service.ts                   # Root service
│   │
│   ├── auth/                            # Authentication Module
│   │   ├── auth.controller.ts          # Login, Register, Reset Password
│   │   ├── auth.service.ts              # JWT, bcrypt, user validation
│   │   ├── auth.module.ts
│   │   ├── jwt.strategy.ts              # Passport JWT strategy
│   │   └── jwt-auth.guard.ts            # JWT authentication guard
│   │
│   ├── user/                            # User Management Module
│   │   ├── user.controller.ts          # Profile, Roles, CRUD
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   │
│   ├── forms/                           # Form Management Module
│   │   ├── forms.controller.ts         # Submit, Get, Update Forms
│   │   ├── forms.service.ts             # Form CRUD, status updates
│   │   └── forms.module.ts
│   │
│   ├── alerts/                          # Alert/Notification Module
│   │   ├── alerts.controller.ts        # Get alerts, update status
│   │   ├── alerts.service.ts           # Email, SMS, WebSocket alerts
│   │   ├── alerts.gateway.ts           # Socket.IO WebSocket gateway
│   │   └── alerts.module.ts
│   │
│   ├── dashboard/                       # Dashboard Module
│   │   ├── dashboard.controller.ts     # Stats, forms, move forms
│   │   ├── dashboard.service.ts        # Analytics, metrics
│   │   └── dashboard.module.ts
│   │
│   ├── contact/                         # Contact Form Module
│   │   ├── contact.controller.ts       # Submit, Get contacts
│   │   ├── contact.service.ts
│   │   └── contact.module.ts
│   │
│   ├── items/                           # Items Module (Generic)
│   │   ├── items.controller.ts         # CRUD operations
│   │   ├── items.service.ts
│   │   ├── items.module.ts
│   │   └── dto/
│   │       └── create-item.dto.ts
│   │
│   ├── itemlist/                        # Item List Modules
│   │   ├── inventory/                   # Inventory Management
│   │   │   ├── inventory.controller.ts # CRUD, filters, stats
│   │   │   ├── inventory.service.ts
│   │   │   ├── inventory.module.ts
│   │   │   ├── schemas/
│   │   │   │   └── inventory.schema.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-inventory.dto.ts
│   │   │   │   └── update-inventory.dto.ts
│   │   │   └── common/
│   │   │       ├── packaging/          # Packaging sub-module
│   │   │       └── unitOfMeasure/       # Unit of Measure sub-module
│   │   │
│   │   ├── equipment/                   # Equipment Management
│   │   │   ├── equipment.controller.ts # CRUD, filters, stats
│   │   │   ├── equipment.service.ts
│   │   │   ├── equipment.module.ts
│   │   │   ├── schemas/
│   │   │   │   └── equipment.schema.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-equipment.dto.ts
│   │   │   │   └── update-equipment.dto.ts
│   │   │   └── common/
│   │   │       └── reasonCode/          # Reason Code sub-module
│   │   │
│   │   ├── operational-alerts/         # Operational Alerts
│   │   │   ├── operational-alerts.controller.ts
│   │   │   ├── operational-alerts.service.ts
│   │   │   ├── operational-alerts.module.ts
│   │   │   ├── schemas/
│   │   │   │   └── operational-alert.schema.ts
│   │   │   └── dto/
│   │   │
│   │   └── common/                      # Shared Item List Resources
│   │       ├── common.module.ts
│   │       ├── category/                # Category management
│   │       └── actions/                 # Actions management
│   │
│   ├── schemas/                         # MongoDB Schemas (Models)
│   │   ├── user/
│   │   │   └── user.schema.ts          # User model
│   │   ├── form/
│   │   │   └── form.schema.ts          # Form model
│   │   ├── alert/
│   │   │   └── alert.schema.ts        # Alert model
│   │   ├── contact.schema.ts          # Contact model
│   │   └── item/
│   │       └── item.schema.ts          # Generic Item model
│   │
│   ├── common/                          # Shared Services & Utilities
│   │   ├── common.module.ts
│   │   ├── cloudinary.service.ts       # Image upload service
│   │   ├── gmail.service.ts            # Email service (nodemailer)
│   │   ├── twilio.service.ts           # SMS service
│   │   ├── resend.service.ts           # Alternative email service
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── roles.decorator.ts
│   │   └── guards/
│   │       └── roles.guard.ts          # Role-based access control
│   │
│   └── types/                           # TypeScript Types
│       ├── custom-request.interface.ts
│       └── express.d.ts
│
├── test/                                # E2E Tests
├── dist/                                # Compiled JavaScript
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 🛣️ API Routes

### Base URL: `/api/v1`

### 🔐 Authentication Routes (`/auth`)
- `POST /auth/login` - User login (returns JWT token)
- `POST /auth/register` - User registration
- `POST /auth/reset-password` - Reset password (protected)

### 👤 User Routes (`/users`) [Protected]
- `GET /users/profile` - Get current user profile
- `PUT /users/profile` - Update current user profile
- `GET /users/roles` - Get available roles
- `PUT /users/:id/role` - Update user role
- `GET /users` - Get all users
- `DELETE /users/:id` - Delete user (Super-Admin only)

### 📋 Forms Routes (`/forms`) [Protected]
- `POST /forms/submit` - Submit a new form
- `GET /forms/user-forms` - Get forms created by user
- `GET /forms/user-form/:id` - Get specific form by ID
- `PATCH /forms/:formId/status` - Update form status (with optional signature)

### 🔔 Alerts Routes (`/alerts`) [Protected]
- `GET /alerts/all` - Get all alerts (Super-Admin only)
- `GET /alerts/user` - Get alerts for current user
- `PATCH /alerts/user/:id/status` - Update alert status

### 📊 Dashboard Routes (`/dashboard`) [Protected]
- `GET /dashboard/admin-stats` - Admin dashboard statistics
- `GET /dashboard/forms` - Get all forms
- `GET /dashboard/user-forms` - Get user-related forms
- `POST /dashboard/move-form` - Move form to another recipient
- `GET /dashboard/moved-forms` - Get moved forms
- `POST /dashboard/trigger-followup` - Trigger follow-up alert

### 📧 Contact Routes (`/contact`)
- `POST /contact` - Submit contact form
- `GET /contact` - Get all contacts
- `GET /contact/:id` - Get contact by ID
- `PUT /contact/:id/resolve` - Mark contact as resolved

### 📦 Items Routes (`/items`) [Protected]
- `POST /items` - Create item (Admin/Super-Admin)
- `GET /items` - Get all items (with filters)
- `GET /items/action-needed` - Get items needing action
- `GET /items/:id` - Get item by ID
- `PATCH /items/:id` - Update item (Admin/Super-Admin)
- `DELETE /items/:id` - Delete item (Super-Admin only)

### 📦 Inventory Routes (`/itemlist/inventory/items`) [Protected - Admin/Super-Admin]
- `POST /itemlist/inventory/items` - Create inventory item
- `GET /itemlist/inventory/items` - Get all (with pagination, filters)
- `GET /itemlist/inventory/items/stats` - Get inventory statistics
- `GET /itemlist/inventory/items/essential` - Get essential items
- `GET /itemlist/inventory/items/perishable` - Get perishable items
- `GET /itemlist/inventory/items/status/:status` - Get items by status
- `GET /itemlist/inventory/items/:id` - Get item by ID
- `PATCH /itemlist/inventory/items/:id` - Update inventory item
- `DELETE /itemlist/inventory/items/:id` - Delete inventory item

### 🔧 Equipment Routes (`/itemlist/equipment/items`) [Protected - Admin/Super-Admin]
- `POST /itemlist/equipment/items` - Create equipment item
- `GET /itemlist/equipment/items` - Get all (with pagination, filters)
- `GET /itemlist/equipment/items/stats` - Get equipment statistics
- `GET /itemlist/equipment/items/by-category/:category` - Get by category
- `GET /itemlist/equipment/items/options/category` - Get category options
- `GET /itemlist/equipment/items/options/subcategory` - Get subcategory options
- `GET /itemlist/equipment/items/:id` - Get item by ID
- `PATCH /itemlist/equipment/items/:id` - Update equipment item
- `DELETE /itemlist/equipment/items/:id` - Delete equipment item

---

## 📊 Database Schemas (Models)

### User Schema (`user.schema.ts`)
```typescript
{
  username: string (required)
  password: string (required, hashed)
  role: string (default: 'Staff')
  phoneNumber: string (required)
  email: string (required)
  resetPasswordToken?: string
  resetPasswordExpires?: number
  movedForms: Array<{
    formId: string
    recipientId: string
    status: string
  }>
}
```

### Form Schema (`form.schema.ts`)
```typescript
{
  userId: string (required)
  formType: string (required)
  formData: Record<string, any> (required)
  status: string (default: 'Pending')
  createdAt: Date (auto)
  recipient: string (required) // userId or role
  alertId?: string
  signatureUrl?: string
  history: Array<{
    status: string
    timestamp: Date
    userId: string
    fromUserId: string
    toUserId: string
  }>
}
```

### Alert Schema (`alert.schema.ts`)
```typescript
{
  message: string (required)
  role?: string
  userId?: string
  categories: string[] (required) // ['in-app', 'email', 'sms']
  relatedId?: string // Form ID or related entity
  userIds?: string[]
  createdAt: Date (auto)
}
```

### Contact Schema (`contact.schema.ts`)
```typescript
{
  name: string (required)
  email: string (required)
  subject: string (required)
  message: string (required)
  isResolved: boolean (default: false)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Item Schema (`item.schema.ts`)
```typescript
{
  name: string (required)
  description: string (required)
  categories: string[]
  minimumLevel: string
  actionsNeeded: string[]
  createdAt: Date
  updatedAt: Date
}
```

### Inventory Item Schema (`inventory.schema.ts`)
```typescript
{
  name: string (required)
  description: string (required)
  unitOfMeasure: string (required) // Reference to UnitOfMeasure
  unitsPerPackage: number (required, min: 0)
  reorderLevel: string (required)
  perishable: boolean (default: false)
  essential: boolean (default: false)
  category: string (required) // Reference to Category
  subcategory: string (required)
  lastUpdated: Date (auto)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Equipment Item Schema (`equipment.schema.ts`)
```typescript
{
  itemName: string (required)
  description: string (required)
  category: string (required)
  subcategory: string (required)
  location: string (required)
  maintenanceNotes: string (default: '')
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

### Operational Alert Schema (`operational-alert.schema.ts`)
```typescript
{
  itemName: string (required)
  description: string (required)
  category: string (required)
  subcategory: string (required)
  actionNeeded: string (required)
  type: string (required, enum: [
    'operational-alerts',
    'handover-alerts',
    'customer-feedback',
    'health-safety',
    'disaster-preparedness'
  ])
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

---

## 🔧 Services Overview

### AuthService
- `validateUser()` - Validate username/password
- `login()` - Authenticate and generate JWT token
- `register()` - Create new user with hashed password
- `resetPassword()` - Update user password

### UserService
- `getProfile()` - Get user profile
- `updateProfile()` - Update user profile
- `getRoles()` - Get available roles: ['Staff', 'Supervisor', 'Management', 'Super-Admin']
- `updateRole()` - Update user role (triggers alert)
- `getAllUsers()` - Get all users
- `deleteUser()` - Delete user

### FormsService
- `submitForm()` - Create new form with history tracking
- `getUserForms()` - Get forms created by user
- `getFormStatus()` - Get form details
- `updateFormStatus()` - Update status (with signature upload)
- `getAllForms()` - Get all forms
- `getUserRelatedForms()` - Get forms where user is recipient
- `moveForm()` - Transfer form to another user/role
- `getMovedForms()` - Get forms moved by user

### AlertsService
- `sendAlert()` - Send multi-channel alert (WebSocket, Email, SMS)
  - Supports: user ID, role, or array of user IDs
  - Channels: in-app (WebSocket), email (Resend/Gmail), SMS (Twilio)
- `getAllAlerts()` - Get all alerts (Super-Admin)
- `getUserAlerts()` - Get alerts for user
- `updateAlertStatus()` - Update alert and related form status

### AlertsGateway (WebSocket)
- `handleConnection()` - Authenticate WebSocket connection via JWT
- `handleDisconnect()` - Clean up connections
- `sendNotificationToUser()` - Send real-time notification to specific user
- `sendNotificationByRole()` - Send notification to role-based room

### DashboardService
- `getAdminDashboardStats()` - Comprehensive statistics:
  - Time-based stats (today, last 7 days, last 30 days)
  - Form category statistics
  - Performance metrics (avg completion time, etc.)
- `getAllForms()` - Get all forms
- `getUserRelatedForms()` - Get user-related forms
- `moveForm()` - Move form functionality
- `getMovedForms()` - Get moved forms
- `triggerFollowUp()` - Send follow-up alert

### ContactService
- `create()` - Create contact entry
- `findAll()` - Get all contacts (sorted by date)
- `findById()` - Get contact by ID
- `markAsResolved()` - Mark contact as resolved

### ItemsService
- `create()` - Create generic item
- `findAll()` - Get all items with filters
- `findActionNeeded()` - Get items needing action
- `findOne()` - Get item by ID
- `update()` - Update item
- `remove()` - Delete item

### InventoryService
- `create()` - Create inventory item
- `findAll()` - Get with pagination, search, filters (perishable, essential, status, etc.)
- `getInventoryStats()` - Statistics
- `findOne()` - Get by ID
- `update()` - Update inventory item
- `remove()` - Delete inventory item

### EquipmentService
- `create()` - Create equipment item
- `findAll()` - Get with pagination, search, filters (category, subcategory, location)
- `getEquipmentStats()` - Statistics
- `getCategoryOptions()` - Get available categories
- `getSubcategoryOptions()` - Get available subcategories
- `findOne()` - Get by ID
- `update()` - Update equipment item
- `remove()` - Delete equipment item

### Common Services

#### CloudinaryService
- `uploadSignature()` - Upload base64 signature image to Cloudinary
  - Folder: `signatures/`
  - Public ID format: `signature-{userId}-{timestamp}`

#### GmailService (Nodemailer)
- `sendFormReceivedEmail()` - Email template for new form
- `sendFormStatusUpdateEmail()` - Email template for status update
- `sendRoleUpdateEmail()` - Email template for role change
- `sendFormMovedEmail()` - Email template for form transfer
- `sendFollowUpEmail()` - Email template for follow-up
- `sendEmail()` - Generic email sending with fallback (587 STARTTLS)

#### TwilioService
- SMS notification support (currently commented out)
- Phone number validation and formatting

#### ResendService
- Alternative email service (configured but GmailService is primary)

---

## 🔒 Authentication & Authorization

### JWT Authentication
- **Strategy**: Passport JWT
- **Token Expiration**: 7 days (Auth), 60 minutes (User module)
- **Extraction**: Bearer token from Authorization header
- **Payload**: `{ username, sub (userId), role }`

### Guards
- **JwtAuthGuard**: Validates JWT token on protected routes
- **RolesGuard**: Enforces role-based access control

### Roles Hierarchy
1. **Staff** - Basic user
2. **Supervisor** - Elevated permissions
3. **Management** - Management level
4. **Super-Admin** - Full system access

### Role-Based Access
- **Items**: Create/Update (Admin/Super-Admin), Delete (Super-Admin only)
- **Inventory/Equipment**: All operations (Admin/Super-Admin)
- **User Deletion**: Super-Admin only
- **All Alerts**: Super-Admin only

---

## 🎯 Key Features

### Form Management
- Form submission with recipient assignment (user ID or role)
- Status tracking with history (Pending, In-Progress, Completed, etc.)
- Digital signature upload to Cloudinary
- Form movement/transfer between users
- Follow-up reminders

### Alert System
- **Multi-channel notifications**:
  - In-app (WebSocket real-time)
  - Email (HTML templates via Gmail SMTP)
  - SMS (Twilio - configured but commented)
- **Alert categories**: in-app, email, sms
- **Smart targeting**: By user ID, role, or multiple users
- **Email templates**: Context-aware templates for different events

### Dashboard & Analytics
- Time-based statistics (today, 7 days, 30 days)
- Form category breakdowns
- Performance metrics (completion times)
- Status distribution analytics

### Item Management
- **Inventory**: Perishable items, essential items, reorder levels, unit of measure
- **Equipment**: Category/subcategory organization, location tracking
- **Operational Alerts**: Various alert types with action requirements

### Security Features
- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- CORS enabled for frontend integration

---

## 🔌 External Integrations

### MongoDB (Mongoose)
- Connection URI from `MONGODB_URI` environment variable
- Connection logging and error handling
- Auto-indexing on schemas

### Cloudinary
- Image upload for signatures
- Configuration: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`

### Gmail SMTP
- Configuration: `GMAIL_SMTP_HOST`, `GMAIL_SMTP_PORT`, `GMAIL_SMTP_USER`, `GMAIL_SMTP_PASS`
- Fallback to STARTTLS (port 587) if secure connection fails
- HTML email templates

### Twilio
- SMS notifications (configured but disabled)
- Configuration: Twilio credentials in environment

### Socket.IO
- WebSocket real-time notifications
- JWT authentication for WebSocket connections
- User-specific rooms for targeted notifications

---

## 📝 Environment Variables

Required environment variables:
```env
# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://...

# JWT
JWT_SECRET=your-secret-key

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# Gmail SMTP
GMAIL_SMTP_HOST=smtp.gmail.com
GMAIL_SMTP_PORT=465
GMAIL_SMTP_SECURE=true
GMAIL_SMTP_USER=...
GMAIL_SMTP_PASS=...
GMAIL_SENDER_NAME=Lindo Mart
GMAIL_SENDER_EMAIL=...

# Twilio (Optional)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=...
```

---

## 🚀 Technology Stack

- **Framework**: NestJS (Node.js)
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: Passport JWT
- **Real-time**: Socket.IO
- **File Upload**: Cloudinary
- **Email**: Nodemailer (Gmail SMTP)
- **SMS**: Twilio (configured, disabled)
- **Validation**: class-validator, class-transformer
- **Testing**: Jest

---

## 📦 Module Dependencies

```
AppModule
├── ConfigModule (Global)
├── MongooseModule (Global)
├── AuthModule
│   ├── UserModule (for alerts)
│   └── CommonModule (Twilio, Gmail)
├── UserModule
│   └── AlertsModule (forwardRef)
├── FormsModule
│   ├── AlertsModule
│   ├── UserModule
│   └── CommonModule (Cloudinary)
├── AlertsModule
│   ├── UserModule (forwardRef)
│   └── CommonModule
├── DashboardModule
│   ├── FormsModule
│   └── AlertsModule
├── ContactModule
├── ItemsModule
├── InventoryModule
├── EquipmentModule
├── ItemListCommonModule
└── OperationalAlertsModule
```

---

## 🎨 Response Format

Most endpoints return consistent format:
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "pagination": { ... } // When applicable
}
```

---

## 🔄 Data Flow Examples

### Form Submission Flow
1. User submits form via `POST /forms/submit`
2. Form created with status "Pending"
3. Alert generated via `AlertsService.sendAlert()`
4. WebSocket notification sent to recipient
5. Email notification sent (if recipient has email)
6. Alert record saved to database

### Form Status Update Flow
1. User updates status via `PATCH /forms/:id/status`
2. Signature uploaded to Cloudinary (if provided)
3. Form status updated
4. History entry added
5. (Optional) Alert sent to related users

### Login Flow
1. User credentials validated
2. JWT token generated with user payload
3. Login alert sent to user's email
4. Token returned to client

---

## 📌 Important Notes

1. **CORS**: Enabled for all origins (`*`) - adjust for production
2. **Password Security**: Passwords hashed with bcrypt (10 salt rounds)
3. **Token Expiration**: Different expiration times across modules (check config)
4. **Email Fallback**: Gmail service has automatic fallback to STARTTLS on connection failure
5. **WebSocket Auth**: WebSocket connections require JWT token in handshake
6. **Signature Storage**: Signatures stored in Cloudinary `signatures/` folder
7. **Form Recipients**: Can be user ID or role name (enables role-based routing)

---

This overview covers the complete structure, routes, models, services, and key features of the Lindo Mart API codebase.

