# TrustMeds Project Structure & File Reference

Complete guide to all files in the TrustMeds project.

## 📁 Root Directory Files

```
TrustMeds/
├── README.md                      # Main documentation
├── QUICKSTART.md                  # 5-minute setup guide
├── DEPLOYMENT.md                  # Production deployment guide
├── DEPLOYMENT_CHECKLIST.md        # Pre-deployment checklist
├── API_TESTING_GUIDE.md          # API endpoint testing reference
├── docker-compose.yml             # Development Docker setup
├── docker-compose.prod.yml        # Production Docker setup
├── setup.sh                       # Linux/Mac setup script
├── setup.bat                      # Windows setup script
├── .gitignore                     # Git ignore rules
├── backend/                       # ← Backend Express.js API
└── frontend/                      # ← Frontend React app
```

---

## 🔧 Backend Structure

```
backend/
├── server.js                      # Main server entry point
├── package.json                   # Node.js dependencies
├── .env.example                   # Environment variables template
├── .gitignore                     # Ignore patterns
├── Dockerfile                     # Docker containerization
│
├── config/
│   └── db.js                     # MongoDB connection setup
│
├── models/                        # Mongoose database schemas
│   ├── User.js                   # User schema (customer/vendor)
│   ├── Medicine.js               # Medicine schema
│   └── Inventory.js              # Store inventory schema
│
├── routes/                        # API endpoint handlers
│   ├── auth.js                   # Register/login endpoints
│   ├── medicines.js              # Search medicines endpoints
│   ├── vendor.js                 # Vendor inventory endpoints
│   └── chat.js                   # Chatbot endpoints
│
├── middleware/                    # Express middleware functions
│   ├── auth.js                   # JWT authentication middleware
│   └── errorHandler.js           # Global error handling
│
└── seeds/                         # Database initialization
    ├── index.js                  # Seed runner script
    └── seedMedicines.js          # Sample medicines data
```

### Backend File Descriptions

#### server.js
- Main Express.js server
- Configures middleware (CORS, JSON parser)
- Sets up routes
- Error handling
- Health check endpoint

#### config/db.js
- MongoDB connection
- Connection pooling
- Error handling

#### models/User.js
- User schema with password hashing
- comparePassword method
- Supports customer and vendor roles
- Store information for vendors

#### models/Medicine.js
- Medicine master list
- Fields: name, composition, uses, sideEffects, dosage
- Searchable with indexes

#### models/Inventory.js
- Store-specific inventory
- Links vendor to medicine with price/stock
- Unique index on (vendorId, medicineId)

#### routes/auth.js
- POST /auth/register - Create user account
- POST /auth/login - User authentication
- Returns JWT token on success

#### routes/medicines.js
- GET /medicines/search?q=query - Search medicines
- GET /medicines/master - All medicines list
- Returns stores with prices sorted

#### routes/vendor.js
- POST /vendor/inventory - Add/update inventory
- GET /vendor/inventory - Get vendor's items
- Requires vendor role and JWT

#### routes/chat.js
- POST /chat - AI chatbot responses
- Hardcoded responses for demo
- Can be extended with real LLM API

#### middleware/auth.js
- JWT token verification
- Vendor role validation
- Attaches user to request

#### middleware/errorHandler.js
- Global error handling
- Formats error responses
- Handles MongoDB errors

#### seeds/seedMedicines.js
- 10 sample medicines
- Composition, uses, side effects
- Prevents duplicate seeding

---

## 🎨 Frontend Structure

```
frontend/
├── index.html                     # HTML entry point
├── package.json                   # dependencies
├── vite.config.js                 # Vite bundler config
├── .env.example                   # Environment template
├── Dockerfile.dev                 # Development Docker image
├── Dockerfile.prod                # Production Docker image
├── eslint.config.js               # Linting rules
│
└── src/
    ├── main.jsx                  # React app entry point
    ├── App.jsx                   # Main App component & routing
    ├── App.css                   # Global styles
    ├── index.css                 # Tailwind CSS imports
    │
    ├── pages/                    # Page components
    │   ├── Login.jsx             # Login form & validation
    │   ├── Register.jsx          # Registration form
    │   ├── SearchPage.jsx        # Medicine search interface
    │   ├── ChatbotPage.jsx       # AI chatbot interface
    │   ├── CartPage.jsx          # Shopping cart display
    │   └── VendorDashboard.jsx   # Vendor inventory management
    │
    ├── components/               # Reusable components
    │   └── Navbar.jsx            # Navigation bar
    │
    ├── context/                  # State management (React Context)
    │   ├── AuthContext.jsx       # User authentication state
    │   └── CartContext.jsx       # Shopping cart state
    │
    ├── services/                 # API communication
    │   └── api.js                # Axios instance with interceptors
    │
    └── assets/                   # Images, fonts, etc.
```

### Frontend File Descriptions

#### index.html
- Root HTML file
- Div with id="root" for React
- Bootstrap Tailwind CSS

#### main.jsx
- React app initialization
- Creates React root
- Renders App component

#### App.jsx
- Main component with routing
- Wraps app with providers (Auth, Cart)
- Defines all routes

#### pages/Login.jsx
- Email/password login form
- Calls AuthContext.login()
- Redirects on success

#### pages/Register.jsx
- User registration form
- Customer and Vendor modes
- Creates account via API

#### pages/SearchPage.jsx
- Medicine search interface
- Displays results with store prices
- Add to cart functionality

#### pages/ChatbotPage.jsx
- AI assistant chat interface
- Message history display
- Calls /api/chat endpoint

#### pages/CartPage.jsx
- Shows items in cart
- Remove/clear functionality
- (TODO: Checkout integration)

#### pages/VendorDashboard.jsx
- Vendor inventory management
- Add/update medicine prices
- Stock management

#### components/Navbar.jsx
- Top navigation bar
- Links to pages
- Login/logout buttons
- User info display

#### context/AuthContext.jsx
- Global auth state
- login() / logout() methods
- localStorage persistence
- User info management

#### context/CartContext.jsx
- Shopping cart state
- add/remove/clear cart methods
- localStorage persistence

#### services/api.js
- Axios HTTP client
- Base URL from environment
- JWT token interceptor
- Error handling

---

## 📊 Database Schemas

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed with bcrypt),
  role: "customer" | "vendor",
  storeName: String,      // For vendors only
  address: String,        // For vendors only
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Medicine Collection
```javascript
{
  _id: ObjectId,
  name: String (indexed),
  composition: String,
  uses: String,
  sideEffects: String,
  dosage: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Inventory Collection
```javascript
{
  _id: ObjectId,
  vendorId: ObjectId (ref User),
  medicineId: ObjectId (ref Medicine),
  price: Number,
  stock: Number,
  storeName: String,
  address: String,
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
  // Unique compound index: (vendorId, medicineId)
}
```

---

## 🔌 API Endpoints Reference

### Authentication
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/auth/register | None | Create account |
| POST | /api/auth/login | None | Login |

### Medicines
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/medicines/search | None | Search medicines with prices |
| GET | /api/medicines/master | None | All medicines (dropdown) |

### Vendor
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/vendor/inventory | JWT | Add/update inventory |
| GET | /api/vendor/inventory | JWT | Get vendor's inventory |

### Chat
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | /api/chat | None | AI chatbot |

### Health
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | /api/health | None | Health check |

---

## 🔐 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trustmeds
JWT_SECRET=your_secret_key_minimum_32_chars
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 📦 Dependencies

### Backend
- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT tokens
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **axios** - HTTP client (for LLM APIs)
- **nodemon** - Dev auto-reload

### Frontend
- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Routing
- **axios** - HTTP client
- **tailwindcss** - CSS framework
- **tailwindcss/vite** - Tailwind Vite plugin
- **lucide-react** - Icons

---

## 🚀 Key Features by File

| Feature | Files |
|---------|-------|
| User Authentication | auth.js, AuthContext.jsx, User.js |
| Medicine Search | SearchPage.jsx, medicines.js, Medicine.js |
| Store Comparison | SearchPage.jsx, medicines.js, Inventory.js |
| Vendor Dashboard | VendorDashboard.jsx, vendor.js |
| Shopping Cart | CartPage.jsx, CartContext.jsx |
| Chat | ChatbotPage.jsx, chat.js |
| State Management | AuthContext.jsx, CartContext.jsx |
| API Calls | api.js, all services |
| Styling | Tailwind CSS via index.css |

---

## 🔄 Data Flow

```
User Registration/Login
├── Frontend: Register.jsx
├── API: POST /auth/register
├── Backend: auth.js → hash password → save User
└── Response: Send JWT token

Medicine Search
├── Frontend: SearchPage.jsx
├── API: GET /medicines/search?q=name
├── Backend: medicines.js → find medicines → get prices
└── Response: Array of medicines with prices

Vendor Add Inventory
├── Frontend: VendorDashboard.jsx
├── Auth: JWT token in header
├── API: POST /vendor/inventory
├── Backend: vendor.js → create/update Inventory
└── Response: Success message

Chat
├── Frontend: ChatbotPage.jsx
├── API: POST /api/chat
├── Backend: chat.js → generate response
└── Response: AI reply
```

---

## 📝 File Naming Conventions

- **Components**: PascalCase (Login.jsx)
- **Utilities**: camelCase (api.js)
- **Models**: PascalCase (User.js)
- **Routes**: kebab-case (auth.js)
- **Constants**: UPPER_SNAKE_CASE
- **Variables**: camelCase
- **CSS Classes**: kebab-case

---

## 🔒 Security Considerations by File

| File | Security Feature |
|------|------------------|
| User.js | bcrypt password hashing |
| auth.js | JWT token generation |
| auth.js (middleware) | Token validation |
| api.js | CORS + Axios |
| vendor.js | Role-based access control |

---

This documentation covers all files and their purposes. For implementation details, refer to individual files.
