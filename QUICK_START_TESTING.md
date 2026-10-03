# Quick Start Testing Guide

## Setup & Verification

### Step 1: Ensure Backend is Running

```bash
# Terminal 1 - Backend
cd backend
npm start
# OR
node src/index.js

# You should see:
# ✅ Backend running on port 5000
# 🌐 Allowed CORS origins: http://localhost:5173, ...
```

### Step 2: Ensure Frontend is Running

```bash
# Terminal 2 - Frontend
cd frontend
npm run dev

# You should see:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

### Step 3: Verify Admin User Exists

Before attempting login, ensure an admin user exists in MongoDB:

```javascript
// In MongoDB Compass or mongosh:
use your_database_name
db.admins.findOne({ email: "admin@example.com" })

// Should return:
{
  _id: ObjectId("..."),
  email: "admin@example.com",
  password: "$2a$10$...", // hashed password
  createdAt: ISODate("..."),
  updatedAt: ISODate("...")
}

// If not found, create one:
// Run: node backend/src/seed/adminSeed.js
// Or add manually in MongoDB
```

---

## Test Case 1: Successful Login

### Steps:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Navigate to `http://localhost:5173/admin/login`
4. Enter valid admin credentials:
   - Email: `admin@example.com` (adjust as needed)
   - Password: `your-admin-password`
5. Click "Sign in"

### Expected Console Logs (in order):
```javascript
📝 Login form submitted
⚠️ Validation: Email/password present
🔐 Attempting login for: admin@example.com
📤 API Request: POST http://localhost:5000/api/auth/login
✅ API Response: 200 POST /auth/login
🔐 Starting login process for: admin@example.com
✅ Login successful for: admin@example.com
🔐 AuthContext.login called
✅ Setting token and admin email
💾 Token saved to localStorage
💾 Admin email saved to localStorage
🔐 Auth Token Set
✅ Login successful, redirecting to: /admin/dashboard
📍 Route changed: /admin/dashboard
🛡️ ProtectedRoute check: { isAuthenticated: true, ... }
✅ Access granted to: /admin/dashboard
```

### Expected Results:
- ✅ Page redirects to dashboard
- ✅ No error messages shown
- ✅ Token visible in LocalStorage (F12 → Application → Local Storage → http://localhost:5173 → token)
- ✅ No console errors (red messages)

---

## Test Case 2: Invalid Credentials (Wrong Password)

### Steps:
1. Go to `http://localhost:5173/admin/login`
2. Enter email: `admin@example.com`
3. Enter password: `wrong-password`
4. Click "Sign in"

### Expected Console Logs:
```javascript
📝 Login form submitted
🔐 Attempting login for: admin@example.com
📤 API Request: POST http://localhost:5000/api/auth/login
❌ API Error: 401 POST /auth/login { data: { message: 'Invalid credentials' } }
❌ Login failed: Invalid credentials
❌ AuthContext.login error: Invalid credentials
❌ Login error caught in component: Invalid credentials
```

### Expected Results:
- ✅ Stays on login page
- ✅ Red error box shows: "Invalid credentials"
- ✅ Toast notification shows: "Invalid credentials"
- ✅ No redirect occurs
- ✅ Can retry login

---

## Test Case 3: Admin Not Found

### Steps:
1. Go to `http://localhost:5173/admin/login`
2. Enter email: `nonexistent@example.com`
3. Enter password: `any-password`
4. Click "Sign in"

### Expected Console Logs:
```javascript
📝 Login form submitted
🔐 Attempting login for: nonexistent@example.com
📤 API Request: POST http://localhost:5000/api/auth/login
❌ API Error: 401 POST /auth/login { data: { message: 'Invalid credentials' } }
❌ Login failed: Invalid credentials
❌ Login error caught in component: Invalid credentials
```

### Backend Console Should Show:
```
📨 POST /api/auth/login
🔐 Login attempt for: nonexistent@example.com
⚠️ Admin not found: nonexistent@example.com
```

### Expected Results:
- ✅ Error shown to user
- ✅ Stays on login page
- ✅ Can retry with correct email

---

## Test Case 4: Empty Form Submission

### Steps:
1. Go to `http://localhost:5173/admin/login`
2. Leave both fields empty
3. Click "Sign in"

### Expected Console Logs:
```javascript
📝 Login form submitted
⚠️ Validation error: Email and password are required
```

### Expected Results:
- ✅ No API request sent (check Network tab)
- ✅ Error shows: "Email and password are required"
- ✅ No backend logs appear

---

## Test Case 5: Invalid Email Format

### Steps:
1. Go to `http://localhost:5173/admin/login`
2. Email: `not-an-email`
3. Password: `any-password`
4. Click "Sign in"

### Expected Console Logs:
```javascript
📝 Login form submitted
⚠️ Email validation error: Please enter a valid email address
```

### Expected Results:
- ✅ Error shows: "Please enter a valid email address"
- ✅ No API request made
- ✅ Form stays open for retry

---

## Test Case 6: Page Refresh After Login

### Steps:
1. Successfully login (Test Case 1)
2. Press F5 to refresh the page
3. Check console and localStorage

### Expected Console Logs:
```javascript
🚀 App initializing...
⚙️ API Base URL: http://localhost:5000/api
🔧 AuthContext initialized with token: present
🔧 Token changed: present
📍 Route changed: /admin/dashboard
🛡️ ProtectedRoute check: { isAuthenticated: true, hasToken: true, ... }
✅ Access granted to: /admin/dashboard
```

### Expected Results:
- ✅ Dashboard loads immediately (no redirect to login)
- ✅ token and adminEmail exist in localStorage
- ✅ No "Sign in" page shown
- ✅ Admin stays logged in

---

## Test Case 7: Logout

### Steps:
1. Login successfully
2. Find logout button (in header/menu)
3. Click it
4. Check localStorage

### Expected Console Logs:
```javascript
🚪 Logout called
🔧 Token changed: missing
🗑️ Token removed from localStorage
🗑️ Admin email removed from localStorage
🔓 Auth Token Removed
📍 Route changed: /admin/login
🛡️ ProtectedRoute check: { isAuthenticated: false, hasToken: false, ... }
⚠️ Access denied: User not authenticated
```

### Expected Results:
- ✅ Redirects to login page
- ✅ localStorage is now empty
- ✅ Can login again
- ✅ Authorization header removed from requests

---

## Test Case 8: Protected Route Access (Without Login)

### Steps:
1. Open new tab/private window (no cookies/localStorage)
2. Try to access: `http://localhost:5173/admin/dashboard` directly
3. Check if redirected to login

### Expected Console Logs:
```javascript
📍 Route changed: /admin/dashboard
🛡️ ProtectedRoute check: { isAuthenticated: false, hasToken: false, ... }
⚠️ Access denied: User not authenticated
📍 Route changed: /admin/login
```

### Expected Results:
- ✅ Immediately redirects to `/admin/login`
- ✅ Not authenticated message in console
- ✅ Cannot access dashboard without login

---

## Test Case 9: Network Error (Backend Offline)

### Steps:
1. Stop the backend server (`Ctrl+C` in backend terminal)
2. Go to `http://localhost:5173/admin/login`
3. Try to login
4. Check console

### Expected Console Logs:
```javascript
📝 Login form submitted
🔐 Attempting login for: admin@example.com
📤 API Request: POST http://localhost:5000/api/auth/login
❌ Network Error: { message: "...", code: "ECONNREFUSED" }
❌ Login failed: Network error. Please check your connection and try again.
❌ Login error caught in component: Network error...
```

### Expected Results:
- ✅ Error message: "Network error..."
- ✅ No 200 response (would timeout or error)
- ✅ Can retry after restarting backend

### To Fix:
```bash
# Restart backend
cd backend
npm start
```

---

## Test Case 10: Network Tab Verification

### Steps:
1. Open DevTools → Network tab
2. Go to login page
3. Enter credentials and submit
4. Look for login request in Network tab

### Expected:
1. Request appears: `auth/login` (or `POST /api/auth/login`)
2. Status code: `200` (success) or `401` (invalid credentials)
3. Request Headers include:
   ```
   Content-Type: application/json
   Origin: http://localhost:5173
   ```
4. Response Headers include:
   ```
   Access-Control-Allow-Origin: http://localhost:5173
   Content-Type: application/json
   ```
5. Response Body (success):
   ```json
   {
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
     "admin": {
       "id": "507f1f77bcf86cd799439011",
       "email": "admin@example.com",
       "createdAt": "2024-01-01T00:00:00.000Z"
     }
   }
   ```

---

## Backend Verification Tests

### Test: Check CORS Configuration

```bash
# Backend logs should show:
🌐 Allowed CORS origins: http://localhost:5173, http://localhost:5174, http://localhost:5175, ...
```

### Test: Monitor Incoming Requests

While testing login:

```bash
# Backend should show:
🔄 CORS request from origin: http://localhost:5173
📨 POST /api/auth/login
🔐 Login attempt for: admin@example.com
✅ Login successful for: admin@example.com
```

### Test: Token Validation

After login, try accessing protected endpoint:

```bash
# GET /api/admin/profile (or any protected route)

# Should show:
📨 GET /api/admin/profile
🔐 Auth middleware check: { hasAuthHeader: true, ... }
✅ Token verified for admin ID: 507f1f77bcf86cd799439011
✅ Admin authenticated: admin@example.com
```

---

## Cleanup (Remove Debug Logs When Done)

Once testing is complete, the console logs can be disabled by removing `console.log` calls. However, they're production-safe and use minimal performance.

To disable logs without editing code:
```javascript
// In browser console:
console.log = () => {}
```

---

## Checklist

### Pre-Testing:
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Admin user exists in MongoDB
- [ ] Browser DevTools open (F12)
- [ ] LocalStorage visible (F12 → Application)
- [ ] Network tab ready (F12 → Network)

### During Testing:
- [ ] Check browser console for expected logs
- [ ] Check backend terminal for request logs
- [ ] Check Network tab for HTTP requests
- [ ] Check LocalStorage for token persistence

### Verification:
- [ ] All 10 test cases pass
- [ ] No red error messages in console
- [ ] All expected logs appear
- [ ] Protected routes work correctly
- [ ] Token persists across refreshes
- [ ] Logout clears everything

---

## If Something Doesn't Work

### 1. Check Backend Connection
```bash
# In browser console:
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@test.com', password: 'test' })
})
.then(r => r.json())
.then(d => console.log(d))
.catch(e => console.error(e))

# Should show response or error message
```

### 2. Check MongoDB Connection
```bash
# In backend terminal while running:
# Should show database connected message
# Check mongod is running on your system
```

### 3. Clear Cache & Try Again
```javascript
// In browser console:
localStorage.clear()
sessionStorage.clear()
location.reload()
```

### 4. Check Environment Variables
```bash
# Frontend: Check VITE_API_BASE_URL
echo $VITE_API_BASE_URL  # Should be http://localhost:5000/api

# Backend: Check PORT, JWT_SECRET
echo $PORT  # Should be 5000 or empty (defaults to 5000)
```

### 5. Restart Everything
```bash
# Backend: Ctrl+C, then npm start
# Frontend: Ctrl+C, then npm run dev
# Browser: F5 refresh
```

---

**Your authentication system is ready to test!** 🚀

Follow these test cases in order to verify everything works correctly.
