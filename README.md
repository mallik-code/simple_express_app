# Legacy Express.js Application

This is a sample Express.js application with **intentionally outdated dependencies** for testing the AI Code Modernizer.

## Current Dependencies (Outdated)

- **Express**: 4.16.0 (Released: 2017) → Latest: 5.0.0+
- **body-parser**: 1.18.3 (Now built into Express)
- **cors**: 2.8.4 → Latest: 2.8.5+
- **dotenv**: 6.0.0 → Latest: 16.0.0+
- **morgan**: 1.9.1 → Latest: 1.10.0+

## Known Issues with Current Versions

1. **Express 4.16.0**:
   - Missing security patches
   - No async/await error handling
   - Outdated body parsing

2. **body-parser 1.18.3**:
   - Deprecated as separate package
   - Now built into Express

3. **Security Vulnerabilities**:
   - Multiple CVEs in outdated versions
   - Missing critical security patches

## Expected Modernization

The Migration Planner Agent should:

1. **Identify Outdated Packages**:
   - Detect all packages are outdated
   - Flag security vulnerabilities

2. **Create Migration Strategy**:
   - Upgrade Express 4.16 → 5.0
   - Remove body-parser (use Express built-in)
   - Update other dependencies
   - Maintain API compatibility

3. **Handle Breaking Changes**:
   - Express 5.0 breaking changes
   - body-parser removal
   - Middleware signature changes

## API Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Prerequisites

Before running this application, ensure you have:

- **Node.js**: Version 12.0.0 or higher (recommended: 18.x or 20.x)
- **npm**: Comes with Node.js
- **Port 3000**: Available on your machine

Check your Node.js version:
```bash
node --version
npm --version
```

## Installation

1. **Navigate to the project directory**:
```bash
cd tmp/projects/simple_express_app
```

2. **Install dependencies**:
```bash
npm install
```

This will install all required packages:
- express (4.18.2)
- body-parser (1.20.2)
- cors (2.8.5)
- dotenv (16.4.5)
- morgan (1.10.0)
- nodemon (dev dependency)
- jest and supertest (test dependencies)

## Running the Application Locally

### Development Mode (with auto-reload)

```bash
npm run dev
```

This starts the server with **nodemon**, which automatically restarts when you make code changes.

### Production Mode

```bash
npm start
```

This starts the server with Node.js directly.

### Verify the Server is Running

Once started, you should see:
```
Server running on http://localhost:3000
```

## Testing the API Manually

### Using Browser

Open your browser and navigate to:
- **Welcome**: http://localhost:3000/
- **Health Check**: http://localhost:3000/health
- **List Users**: http://localhost:3000/api/users

### Using curl

```bash
# Welcome message
curl http://localhost:3000/

# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Get user by ID
curl http://localhost:3000/api/users/1

# Create new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'

# Update user
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Doe", "email": "jane@example.com"}'

# Delete user
curl -X DELETE http://localhost:3000/api/users/1
```

### Expected API Responses

**GET /** - Welcome Message
```json
{
  "message": "Welcome to Express Legacy App",
  "version": "1.0.0",
  "framework": "Express.js"
}
```

**GET /health** - Health Check
```json
{
  "status": "healthy",
  "timestamp": "2025-11-11T10:30:00.000Z",
  "uptime": 123.456
}
```

**GET /api/users** - List Users
```json
{
  "success": true,
  "count": 2,
  "users": [
    { "id": 1, "name": "Alice", "email": "alice@example.com" },
    { "id": 2, "name": "Bob", "email": "bob@example.com" }
  ]
}
```

## Running Automated Tests

This application includes a comprehensive test suite with **31 test cases** covering all API endpoints, middleware, integration scenarios, and performance benchmarks.

### Run All Tests

```bash
npm test
```

Expected output:
```
PASS  test/api.test.js
  Simple Express App - API Tests
    ✓ All 31 tests pass

Test Suites: 1 passed, 1 total
Tests:       31 passed, 31 total
Time:        ~2.5s
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

Tests will automatically re-run when you make code changes.

### Generate Coverage Report

```bash
npm run test:coverage
```

This creates a detailed coverage report:
```
----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   95.83 |    88.24 |     100 |   95.65 |
 index.js             |   95.83 |    88.24 |     100 |   95.65 |
----------------------|---------|----------|---------|---------|
```

Coverage report available at: `coverage/index.html`

### Run Tests with Verbose Output

```bash
npm run test:verbose
```

This shows detailed information about each test case.

### Test Individual Endpoints

```bash
# Test only root endpoints
npx jest -t "GET /"

# Test only user management
npx jest -t "User Management"

# Test only error handling
npx jest -t "Error Handling"
```

## What Gets Tested

The automated test suite validates:

✅ **All 7 API Endpoints**
- GET / (welcome message)
- GET /health (health check with uptime)
- GET /api/users (list all users)
- GET /api/users/:id (get user by ID)
- POST /api/users (create new user)
- PUT /api/users/:id (update user)
- DELETE /api/users/:id (delete user)

✅ **Middleware Functionality**
- CORS headers
- JSON body parsing
- URL-encoded body parsing
- Error handling (404, 500)

✅ **Data Validation**
- Required fields (name, email)
- Invalid IDs
- Empty request bodies
- Non-existent resources

✅ **Integration Workflows**
- Full CRUD lifecycle (create → read → update → delete)
- Multiple concurrent users
- State persistence between operations

✅ **Performance**
- Response time validation (<100ms)
- Concurrent request handling (10 simultaneous requests)

## Troubleshooting

### Port 3000 Already in Use

If you see `EADDRINUSE: address already in use`, port 3000 is occupied:

**Find and kill the process**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### Tests Fail to Start

**Ensure dependencies are installed**:
```bash
npm install
```

**Check Node.js version**:
```bash
node --version  # Should be >=12.0.0
```

### Application Doesn't Start

**Check for errors**:
```bash
npm start
```

**Common issues**:
- Missing dependencies: Run `npm install`
- Syntax errors: Check console output
- Port conflict: See "Port 3000 Already in Use" above

## Using with AI Code Modernizer

This application serves as a test project for the AI Code Modernizer system.

### Before Upgrade - Establish Baseline

```bash
# Install current dependencies
npm install

# Run tests to establish baseline
npm test
# ✅ All 31 tests should pass
```

### After Upgrade - Verify Compatibility

```bash
# AI Code Modernizer will upgrade dependencies
# Then run tests to verify nothing broke
npm test
# ✅ All 31 tests should still pass
```

### Testing Migration with AI Code Modernizer

```bash
# From backend directory
python agents/migration_planner.py --project tmp/projects/simple_express_app
```

## Expected Migration Output

```json
{
  "dependencies": {
    "express": {
      "current": "4.16.0",
      "target": "5.0.0",
      "breaking_changes": ["..."],
      "risk": "medium"
    },
    "body-parser": {
      "current": "1.18.3",
      "action": "remove",
      "reason": "Built into Express 5.0"
    }
  },
  "strategy": {
    "phases": [
      {
        "name": "Update dependencies",
        "order": 1
      },
      {
        "name": "Remove body-parser",
        "order": 2
      },
      {
        "name": "Update middleware",
        "order": 3
      }
    ]
  }
}
```
