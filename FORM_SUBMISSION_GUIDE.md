# Form Submission Guide - Lindo Mart API

## 📋 API Endpoint

**Endpoint:** `POST /api/v1/forms/submit`

**Base URL:** `http://localhost:5000` (or your server URL)

**Full URL:** `http://localhost:5000/api/v1/forms/submit`

---

## 🔐 Authentication

This endpoint requires **JWT Authentication**. You must include a valid JWT token in the request headers.

**Header:**
```
Authorization: Bearer <your_jwt_token>
```

**How to get JWT Token:**
1. Login via `POST /api/v1/auth/login` with username and password
2. Copy the `access_token` from the response
3. Use it in the Authorization header

---

## 📤 Request Body Structure

### Required Fields:
- `formType` (string) - Type of form (e.g., "slow-moving-items", "inventory-exception", etc.)
- `recipient` (string) - User ID or role to receive the form (e.g., "general", user ID)
- `selectedItems` (array) - Array of items/objects with different keys

### Optional Fields:
- `notes` (string) - Additional notes for the form
- `createdDate` (string) - Date when form was created (ignored, not stored)
- `employeeSubmitting` (string) - Employee ID (ignored, not stored)
- `forDate` (string) - Date for the form (ignored, not stored)

### Request Body Example:

#### Example 1: Slow Moving Items (Inventory)
```json
{
  "createdDate": "2025-11-06",
  "employeeSubmitting": "6825cc700dbf9d6a8a00397e",
  "forDate": "2025-11-06",
  "formType": "slow-moving-items",
  "notes": "Additional notes here",
  "recipient": "general",
  "selectedItems": [
    {
      "category": "inventory category 1",
      "description": "Inventory: Product List Description",
      "itemList": "inventory",
      "name": "Inventory: Product List 2",
      "packaging": "carton",
      "quantity": 44,
      "subCategory": "inventory sub-category 2",
      "unitsPerPackage": 45
    },
    {
      "category": "inventory category 2",
      "description": "Inventory: Product List Description 2",
      "itemList": "inventory",
      "name": "Inventory: Product List 3",
      "packaging": "box",
      "quantity": 55,
      "subCategory": "inventory sub-category 3",
      "unitsPerPackage": 66
    }
  ]
}
```

#### Example 2: Equipment Form
```json
{
  "formType": "equipment",
  "notes": "Equipment maintenance required",
  "recipient": "6825cc700dbf9d6a8a00397e",
  "selectedItems": [
    {
      "actionNeeded": "Equipment Action needed 3",
      "category": "Equipment & Facilities: Categories 2",
      "description": "Equipment & Facilities: Item List Description",
      "itemList": "equipment",
      "name": "Equipment & Facilities: Item List 2",
      "reasonCode": "RC02",
      "subCategory": "Equipment & Facilities: Categories sub 3"
    },
    {
      "actionNeeded": "Equipment Action needed 4",
      "category": "Equipment & Facilities: Categories 4",
      "description": "Equipment & Facilities: Item List Description 4",
      "itemList": "equipment",
      "name": "Equipment & Facilities: Item List 4",
      "reasonCode": "RC04",
      "subCategory": "Equipment & Facilities: Categories sub 4"
    }
  ]
}
```

#### Example 3: Operational Alerts
```json
{
  "formType": "operational-alerts",
  "notes": "Urgent operational issue",
  "recipient": "Management",
  "selectedItems": [
    {
      "actionNeeded": "Immediate action required",
      "category": "Safety",
      "description": "Safety equipment check needed",
      "itemList": "operational-alerts",
      "name": "Safety Alert 1",
      "subCategory": "Emergency"
    }
  ]
}
```

---

## 📥 Response Structure

### Success Response (200 OK):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "userId": "6825cc700dbf9d6a8a00397e",
  "formType": "slow-moving-items",
  "formData": [
    {
      "category": "inventory category 1",
      "description": "Inventory: Product List Description",
      "itemList": "inventory",
      "name": "Inventory: Product List 2",
      "packaging": "carton",
      "quantity": 44,
      "subCategory": "inventory sub-category 2",
      "unitsPerPackage": 45
    }
  ],
  "status": "Pending",
  "notes": "Additional notes here",
  "recipient": "general",
  "alertId": "507f1f77bcf86cd799439012",
  "createdAt": "2025-11-06T10:30:00.000Z",
  "history": [
    {
      "status": "Pending",
      "timestamp": "2025-11-06T10:30:00.000Z",
      "userId": "6825cc700dbf9d6a8a00397e",
      "fromUserId": "6825cc700dbf9d6a8a00397e",
      "toUserId": "general"
    }
  ]
}
```

### Error Responses:

**401 Unauthorized** (Missing/Invalid Token):
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**400 Bad Request** (Missing Required Fields):
```json
{
  "statusCode": 400,
  "message": "Validation failed"
}
```

---

## 🔧 How to Submit (Examples)

### 1. Using cURL

```bash
curl -X POST http://localhost:5000/api/v1/forms/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -d '{
    "formType": "slow-moving-items",
    "notes": "Additional notes here",
    "recipient": "general",
    "selectedItems": [
      {
        "category": "inventory category 1",
        "description": "Inventory: Product List Description",
        "itemList": "inventory",
        "name": "Inventory: Product List 2",
        "packaging": "carton",
        "quantity": 44,
        "subCategory": "inventory sub-category 2",
        "unitsPerPackage": 45
      }
    ]
  }'
```

### 2. Using JavaScript (Fetch API)

```javascript
const submitForm = async () => {
  const formData = {
    formType: "slow-moving-items",
    notes: "Additional notes here",
    recipient: "general",
    selectedItems: [
      {
        category: "inventory category 1",
        description: "Inventory: Product List Description",
        itemList: "inventory",
        name: "Inventory: Product List 2",
        packaging: "carton",
        quantity: 44,
        subCategory: "inventory sub-category 2",
        unitsPerPackage: 45
      }
    ]
  };

  try {
    const response = await fetch('http://localhost:5000/api/v1/forms/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${yourJwtToken}`
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    console.log('Form submitted:', result);
    return result;
  } catch (error) {
    console.error('Error submitting form:', error);
  }
};
```

### 3. Using Axios

```javascript
import axios from 'axios';

const submitForm = async () => {
  const formData = {
    formType: "slow-moving-items",
    notes: "Additional notes here",
    recipient: "general",
    selectedItems: [
      {
        category: "inventory category 1",
        description: "Inventory: Product List Description",
        itemList: "inventory",
        name: "Inventory: Product List 2",
        packaging: "carton",
        quantity: 44,
        subCategory: "inventory sub-category 2",
        unitsPerPackage: 45
      }
    ]
  };

  try {
    const response = await axios.post(
      'http://localhost:5000/api/v1/forms/submit',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${yourJwtToken}`
        }
      }
    );
    console.log('Form submitted:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error submitting form:', error.response?.data || error.message);
  }
};
```

### 4. Using Postman

1. **Method:** POST
2. **URL:** `http://localhost:5000/api/v1/forms/submit`
3. **Headers:**
   - `Content-Type: application/json`
   - `Authorization: Bearer YOUR_JWT_TOKEN_HERE`
4. **Body:** Select "raw" and "JSON", then paste:
```json
{
  "formType": "slow-moving-items",
  "notes": "Additional notes here",
  "recipient": "general",
  "selectedItems": [
    {
      "category": "inventory category 1",
      "description": "Inventory: Product List Description",
      "itemList": "inventory",
      "name": "Inventory: Product List 2",
      "packaging": "carton",
      "quantity": 44,
      "subCategory": "inventory sub-category 2",
      "unitsPerPackage": 45
    }
  ]
}
```

---

## 📝 Important Notes

1. **Authentication Required:** You must be logged in and include a valid JWT token
2. **selectedItems Array:** The `selectedItems` array is mapped to `formData` in the database
3. **Flexible Item Structure:** Each item in `selectedItems` can have different keys depending on the form type:
   - **Inventory items:** `category`, `description`, `itemList`, `name`, `packaging`, `quantity`, `subCategory`, `unitsPerPackage`
   - **Equipment items:** `actionNeeded`, `category`, `description`, `itemList`, `name`, `reasonCode`, `subCategory`
   - **Other types:** Can have any combination of keys
4. **Ignored Fields:** `createdDate`, `employeeSubmitting`, `forDate` are accepted but not stored in the database
5. **Auto-Generated Fields:**
   - `userId` - Automatically set from authenticated user
   - `status` - Defaults to "Pending"
   - `createdAt` - Automatically set to current date/time
   - `history` - Automatically created with initial entry
   - `alertId` - Automatically set after alert is sent

---

## 🔄 What Happens After Submission

1. Form is created with status "Pending"
2. History entry is automatically created
3. Alert is sent to the recipient (via email, WebSocket, and optionally SMS)
4. Alert ID is stored in the form
5. Form is returned with all details

---

## ✅ Validation

- `formType` - Required, must be a string
- `recipient` - Required, must be a string (user ID or role)
- `selectedItems` - Required, must be an array (can be empty)
- `notes` - Optional, defaults to empty string if not provided

---

## 🚨 Common Errors

1. **401 Unauthorized:** Missing or invalid JWT token
2. **400 Bad Request:** Missing required fields (`formType`, `recipient`, `selectedItems`)
3. **500 Internal Server Error:** Server-side error (check server logs)

---

## 📚 Related Endpoints

- `GET /api/v1/forms/user-forms` - Get all forms submitted by current user
- `GET /api/v1/forms/user-form/:id` - Get specific form details
- `PATCH /api/v1/forms/:formId/status` - Update form status
- `GET /api/v1/forms/metadata?itemListType=inventory` - Get form metadata

