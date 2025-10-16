# Category Management API

This module provides a unified category management system that can be used by both inventory and equipment modules.

## Features

- **Unified Categories**: Single table for both inventory and equipment categories
- **Multiple Subcategories**: Each category can have multiple subcategories
- **Type-based Filtering**: Categories are distinguished by type (inventory/equipment)
- **CRUD Operations**: Full create, read, update, delete functionality
- **Admin Access**: Only Super-Admin and Admin roles can manage categories

## File Structure

```
category/
├── category.controller.ts      # API endpoints
├── category.service.ts         # Business logic
├── dto/
│   ├── create-category.dto.ts  # Create validation
│   └── update-category.dto.ts  # Update validation
├── schemas/
│   └── category.schema.ts      # Database schema
├── seed-categories.ts          # Initial data seeding
└── README.md                   # This file
```

## Database Schema

```typescript
{
  name: string;           // Category name (e.g., "Electronics")
  subcategories: string[]; // Array of subcategories (e.g., ["Computers", "Mobile Phones"])
  type: string;           // Either "inventory" or "equipment"
  createdAt: Date;        // Auto-generated timestamp
  updatedAt: Date;        // Auto-generated timestamp
}
```

## API Endpoints

### Base URL: `/categories`

All endpoints require JWT authentication and Admin/Super-Admin role.

#### 1. Create Category
```http
POST /categories
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "name": "Electronics",
  "subcategories": ["Computers", "Mobile Phones", "Accessories"],
  "type": "inventory"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category created successfully"
}
```

#### 2. Get All Categories
```http
GET /categories?type=inventory&page=1&limit=10
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `type` (optional): Filter by type ("inventory" or "equipment")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": {
    "categories": [
      {
        "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "name": "Electronics",
        "subcategories": ["Computers", "Mobile Phones", "Accessories"],
        "type": "inventory",
        "createdAt": "2023-09-06T10:30:00.000Z",
        "updatedAt": "2023-09-06T10:30:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

#### 3. Get Category Options (for dropdowns)
```http
GET /categories/options?type=inventory
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Category options retrieved successfully",
  "data": [
    {
      "name": "Electronics",
      "subcategories": ["Computers", "Mobile Phones", "Accessories"]
    }
  ]
}
```

#### 4. Get Single Category
```http
GET /categories/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Category retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Electronics",
    "subcategories": ["Computers", "Mobile Phones", "Accessories"],
    "type": "inventory",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

#### 5. Update Category (Name and/or Subcategories)
```http
PATCH /categories/:id
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
  "name": "Updated Electronics",
  "subcategories": ["Computers", "Mobile Phones", "Accessories", "Gaming"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Category updated successfully"
}
```

**Note:** You can update:
- Only the name: `{ "name": "New Name" }`
- Only subcategories: `{ "subcategories": ["Sub 1", "Sub 2"] }`
- Both name and subcategories: `{ "name": "New Name", "subcategories": ["Sub 1", "Sub 2"] }`

#### 6. Delete Category
```http
DELETE /categories/:id
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```


## Error Responses

### Validation Error
```json
{
  "statusCode": 400,
  "message": "Validation failed: name is required",
  "error": "Bad Request"
}
```

### Duplicate Category
```json
{
  "statusCode": 400,
  "message": "Category \"Electronics\" already exists for type \"inventory\"",
  "error": "Bad Request"
}
```

### Not Found
```json
{
  "statusCode": 404,
  "message": "Category with ID \"64f8a1b2c3d4e5f6a7b8c9d0\" not found",
  "error": "Not Found"
}
```

### Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

## Usage Examples

### Frontend Integration

#### 1. Fetch Categories for Table
```javascript
const fetchCategories = async (type = 'inventory', page = 1) => {
  const response = await fetch(`/api/categories?type=${type}&page=${page}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

#### 2. Create New Category
```javascript
const createCategory = async (categoryData) => {
  const response = await fetch('/api/categories', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(categoryData)
  });
  return await response.json();
};
```

#### 3. Get Category Options for Dropdown
```javascript
const getCategoryOptions = async (type) => {
  const response = await fetch(`/api/categories/options?type=${type}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

#### 4. Update Category (Name and Subcategories)
```javascript
const updateCategory = async (categoryId, updateData) => {
  const response = await fetch(`/api/v1/itemlist/common/categories/${categoryId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(updateData)
  });
  return await response.json();
};

// Examples:
// Update only name
await updateCategory("categoryId", { name: "Updated Electronics" });

// Update only subcategories
await updateCategory("categoryId", { subcategories: ["Sub 1", "Sub 2", "Sub 3"] });

// Update both name and subcategories
await updateCategory("categoryId", { 
  name: "Updated Electronics", 
  subcategories: ["Computers", "Mobile Phones", "Accessories"] 
});
```

## Database Indexes

The following indexes are created for optimal performance:

- `{ type: 1 }` - For filtering by type
- `{ name: 1, type: 1 }` - Unique compound index for name and type combination

## Seeding

The module automatically seeds initial categories on startup:

**Inventory Categories:**
- Electronics (Computers, Mobile Phones, Accessories, Gaming)
- Clothing (Men's Wear, Women's Wear, Kids Wear, Accessories)
- Food & Beverages (Fresh Produce, Packaged Foods, Beverages, Snacks)

**Equipment Categories:**
- Freezer Equipment (Walk-in Freezers, Display Freezers, Ice Machines, Refrigeration Units)
- Point of Sale (Cash Registers, Card Readers, Receipt Printers, Barcode Scanners)
- Security Systems (CCTV Cameras, Alarm Systems, Access Control, Monitoring Equipment)

## Integration with Other Modules

This category system can be integrated with:

1. **Inventory Module**: Use categories for inventory item classification
2. **Equipment Module**: Use categories for equipment classification
3. **Forms Module**: Use categories in form data for better organization

## Security

- All endpoints require JWT authentication
- Only Super-Admin and Admin roles can access category management
- Input validation using class-validator
- Unique constraints prevent duplicate categories
