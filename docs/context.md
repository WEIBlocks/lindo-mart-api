# Lindo Mart Process Automation - Step-by-Step Development Guide

> **Tech Stack:**  
> Backend: Node.js (NestJS) + MongoDB  
> Frontend: Next.js (React)


## 💡 Objective
Digitize and automate Lindo Mart's paper-based processes to increase operational efficiency using form-based systems, real-time notifications, and role-based dashboards.

---

## 🔧 Project Setup Instructions

### 1. **Project Initialization**
#### Backend (NestJS):
```bash
nest new lindo-mart-backend
cd lindo-mart-backend
npm install @nestjs/mongoose mongoose @nestjs/config @nestjs/passport passport passport-jwt @nestjs/jwt socket.io @nestjs/platform-socket.io
```

#### Frontend (Next.js):
```bash
npx create-next-app lindo-mart-frontend --typescript
cd lindo-mart-frontend
npm install axios socket.io-client tailwindcss @headlessui/react @heroicons/react
npx tailwindcss init -p
```

---

## 🧱 Backend Development (NestJS)

### 2. **Setup MongoDB Connection**
- Configure in `app.module.ts` using `MongooseModule.forRoot()`
- Use `.env` for database URL.

### 3. **Authentication & Authorization**
- Setup JWT-based auth (staff, supervisor, management, super-admin roles)
- Implement guards using Passport strategy
- Endpoints:
  - `POST /auth/login`
  - `POST /auth/register`

### 4. **User Module**
- Models: User schema (roles, access sets)
- Services: CRUD operations, assign roles, custom access

### 5. **Forms Module**
- Schema for each form @forms.md
- Form types:
  - Inventory Exceptions
  - Slow Moving Items
  - Essentials Alerts
  - Equipment Facility Alerts
  - Alert Reminders & Follow Ups
  - Handover Notes
  - Customer Feedback (Complaints, Kudos, & Recommendations)
  - Health & Safety Alerts
- Endpoints:
  - `POST /forms/submit`
  - `GET /forms/user/forms`
  - `GET /forms/user/form/:id` (status and history included)
  - `PATCH /forms/:formId/status`
  

### 6. **Alert/Notification Module**
- WebSocket gateway using `@nestjs/websockets`
- SMS integration (Twilio or similar)
- Store alerts in MongoDB with logs (for auditing)
- Endpoints:
  - Helper Function to send in-app, sms and email alerts
  - `GET /alerts/all`
  - `GET /alerts/user`
  - `PATCH /alerts/user/:id/status`

### 7. **Admin Dashboard API**
- Endpoints:
  - `GET /dashboard/forms`
  - `GET /dashboard/user-forms`
  - `POST /dashboard/move-form`
  - `GET /dashboard/moved-forms`
  - `POST /dashboard/trigger-followup`
---

## 🎨 Frontend Development (Next.js) -- take inspiration from https://www.checkbox.ai/ for UI

### 8. **TailwindCSS Setup & Theming**
- Use Tailwind for UI components
- Mobile responsive and accessible design

### 9. **Pages to Implement**
- `/` Landing Page
- `/login`, `/register`
- `/dashboard`
- `/alerts`
- `/forms/:type`
- `/settings`
- `/home`
- `/about`
- `/contact`

### 10. **Role-based UI Control**
- Use user context with role-based rendering
- Redirect based on access level

### 11. **Forms Interface**
- Dynamic form renderer from schema
- Upload support (if needed)
- Digital signature component (e.g. `react-signature-canvas`)

### 12. **Real-time Notifications (Sockets)**
- Connect to backend WebSocket server
- Show toasts or in-app notifications

### 13. **API Integration (Axios)**
- Setup Axios instance with JWT headers
- Endpoints integration with NestJS backend

---

## 🔄 DevOps & Deployment

### 14. **Environment Variables**
- Store in `.env` for both frontend and backend

---

## 📑 Documentation & Testing

### 16. **API Docs**
- Use Swagger in NestJS: `@nestjs/swagger`

### 17. **Testing**
- Unit tests with Jest (NestJS default)
- Component tests using `@testing-library/react`



