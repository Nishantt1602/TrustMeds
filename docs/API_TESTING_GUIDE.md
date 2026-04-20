# TrustMeds API Testing Guide

Complete guide to test all TrustMeds API endpoints.

## 🧪 Testing Setup

### Option 1: Using cURL (Command Line)
```bash
# Test health
curl http://localhost:5000/api/health
```

### Option 2: Using Postman
Download from https://www.postman.com
Import the JSON examples below

### Option 3: Using VS Code REST Client
Install extension: REST Client by Huachao Zheng
Create `test.http` file and use examples below

---

## 📋 Complete API Test Suite

### 1. Health Check (Public)

```http
GET http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "Backend is running!"
}
```

---

### 2. User Registration (Public)

#### Register as Customer
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "role": "customer"
}
```

#### Register as Vendor
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "MediStore",
  "email": "vendor@medistore.com",
  "password": "Password123!",
  "role": "vendor",
  "storeName": "MediStore - Main Branch",
  "address": "123 Medical Plaza, City"
}
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Save the token for authenticated requests:**
```
TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### 3. User Login (Public)

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123!"
}
```

**Expected Response:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "customer",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 4. Search Medicines (Public)

```http
GET http://localhost:5000/api/medicines/search?q=paracetamol
```

**Expected Response:**
```json
[
  {
    "medicineInfo": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Paracetamol",
      "composition": "Paracetamol 500mg",
      "uses": "Pain relief, fever reduction",
      "sideEffects": "Rare allergic reactions"
    },
    "cheapestPrice": 45,
    "stores": [
      {
        "inventoryId": "507f1f77bcf86cd799439012",
        "storeName": "MediStore",
        "address": "123 Medical Plaza",
        "price": 45,
        "stock": 100,
        "isVerified": true
      },
      {
        "inventoryId": "507f1f77bcf86cd799439013",
        "storeName": "HealthPlus",
        "address": "456 Health St",
        "price": 50,
        "stock": 75,
        "isVerified": false
      }
    ]
  }
]
```

---

### 5. Get Master Medicines (Public)

For vendor dropdown - lists all available medicines.

```http
GET http://localhost:5000/api/medicines/master
```

**Expected Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Paracetamol",
    "composition": "Paracetamol 500mg"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Dolo 650",
    "composition": "Paracetamol 650mg"
  }
]
```

---

### 6. Add/Update Inventory (Protected - Vendor Only)

Requires valid JWT token from vendor login.

```http
POST http://localhost:5000/api/vendor/inventory
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "medicineId": "507f1f77bcf86cd799439011",
  "price": 42,
  "stock": 150
}
```

**Expected Response:**
```json
{
  "message": "Inventory added",
  "inventory": {
    "_id": "507f1f77bcf86cd799439020",
    "vendorId": "507f1f77bcf86cd799439015",
    "medicineId": "507f1f77bcf86cd799439011",
    "price": 42,
    "stock": 150,
    "storeName": "MediStore",
    "address": "123 Medical Plaza",
    "isVerified": false
  }
}
```

---

### 7. Get Vendor Inventory (Protected - Vendor Only)

```http
GET http://localhost:5000/api/vendor/inventory
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Expected Response:**
```json
[
  {
    "_id": "507f1f77bcf86cd799439020",
    "price": 42,
    "stock": 150,
    "medicineId": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Paracetamol",
      "composition": "Paracetamol 500mg"
    }
  }
]
```

---

### 8. Chat Endpoint (Public)

```http
POST http://localhost:5000/api/chat
Content-Type: application/json

{
  "prompt": "I have a severe headache"
}
```

**Expected Response:**
```json
{
  "reply": "For headaches, common medicines are Paracetamol 500mg or Aspirin. Always consult a doctor if pain persists."
}
```

---

## 🔐 Authentication Examples

### cURL with Token

```bash
# Register
RESPONSE=$(curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name":"Vendor",
    "email":"vendor@example.com",
    "password":"Pass123!",
    "role":"vendor",
    "storeName":"My Store",
    "address":"123 Main St"
  }')

# Extract token
TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# Use token in next request
curl -X POST http://localhost:5000/api/vendor/inventory \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "medicineId":"507f1f77bcf86cd799439011",
    "price":45,
    "stock":100
  }'
```

---

## ✅ Test Checklist

### Authentication Flow
- [ ] Register customer account
- [ ] Register vendor account
- [ ] Login with customer
- [ ] Login with vendor
- [ ] Verify JWT tokens work
- [ ] Test with invalid token

### Medicine Operations
- [ ] Search by medicine name
- [ ] Search by composition
- [ ] Search returns multiple stores
- [ ] Get all master medicines
- [ ] Prices sorted correctly

### Vendor Operations
- [ ] Add inventory as vendor
- [ ] Update existing inventory
- [ ] Get vendor's inventory list
- [ ] Customer cannot add inventory (403)
- [ ] Invalid token returns 401

### Chat Operations
- [ ] Chat responds to headache
- [ ] Chat responds to fever
- [ ] Chat responds to cough
- [ ] Chat handles unknown topics
- [ ] Chat with empty prompt fails

### Error Handling
- [ ] Invalid email on register
- [ ] Duplicate email on register
- [ ] Wrong password on login
- [ ] Missing required fields
- [ ] Invalid MongoDB ID format
- [ ] Non-existent resources return 404

---

## 🐛 Debugging Tips

### Check Response Status
```bash
# Shows HTTP status code
curl -w "\n%{http_code}\n" http://localhost:5000/api/health
```

### Pretty Print JSON
```bash
curl http://localhost:5000/api/medicines/search?q=paracetamol | jq .
```

### View Response Headers
```bash
curl -i http://localhost:5000/api/health
```

### Check Token Contents (Without Validation)
```bash
# Use jwt.io to decode token (don't use real tokens online!)
```

---

## 📊 Load Testing

### Using Apache Bench
```bash
ab -n 100 -c 10 http://localhost:5000/api/medicines/master
```

### Using wrk
```bash
wrk -t4 -c100 -d30s http://localhost:5000/api/medicines/master
```

---

## 🚨 Known Issues & Responses

### HTTP 400 - Bad Request
- Missing required fields
- Invalid JSON format
- Email already exists

### HTTP 401 - Unauthorized
- Invalid or missing token
- Expired token

### HTTP 403 - Forbidden
- Non-vendor trying to access vendor route
- Insufficient permissions

### HTTP 404 - Not Found
- Invalid endpoint
- Resource doesn't exist
- Invalid MongoDB ID

### HTTP 500 - Server Error
- Database connection failed
- Unhandled exception
- Check server logs

---

## 📝 Postman Collection JSON

Create file: `trustmeds-api.postman_collection.json`

```json
{
  "info": {
    "name": "TrustMeds API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Health",
      "request": {
        "method": "GET",
        "url": "http://localhost:5000/api/health"
      }
    },
    {
      "name": "Register Customer",
      "request": {
        "method": "POST",
        "url": "http://localhost:5000/api/auth/register",
        "header": [{"key": "Content-Type", "value": "application/json"}],
        "body": {
          "mode": "raw",
          "raw": "{\"name\":\"John\",\"email\":\"john@test.com\",\"password\":\"Pass123!\",\"role\":\"customer\"}"
        }
      }
    }
  ]
}
```

---

**Happy Testing! 🎉**
