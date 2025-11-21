# 401(k) Contribution Manager

A web application for managing 401(k) retirement savings contributions.

## Running the Application

### Prerequisites

You need Node.js (v16 or higher) and npm installed.

**Check if you have them:**
```bash
node --version
npm --version
```

**Don't have Node.js?** Install it:

- **Windows/Mac:** Download from https://nodejs.org/ (LTS version recommended)
- **Mac (with Homebrew):** `brew install node`
- **Linux (Ubuntu/Debian):** 
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

npm comes automatically with Node.js.

### Setup Instructions

**1. Install Backend Dependencies**

```bash
cd backend
npm install
```

**2. Install Frontend Dependencies**

```bash
cd frontend
npm install
```

**3. Start the Backend Server**

Open a terminal and run:

```bash
cd backend
npm start
```

The backend will start on `http://localhost:3010`

**Important:** API documentation is available at:
### **http://localhost:3010/api/docs** (Swagger UI)

**4. Start the Frontend**

Open a **second terminal** and run:

```bash
cd frontend
npm run dev
```

The frontend will automatically open at `http://localhost:3000`

### That's it!

The application should now be running. You can interact with the UI at `http://localhost:3000` or test the API directly at `http://localhost:3010/api/docs`.

## Testing the Application

### Default Test User

The app comes pre-configured with test user ID: `123`

- Current contribution: 5% of salary
- Annual Salary: $60,000
- Pay Frequency: Biweekly

### What You Can Test

1. Toggle between percentage and fixed dollar contributions
2. Adjust contribution amounts using the slider or text input
3. View year-to-date statistics
4. See retirement projections
5. Save changes and verify they persist

## API Testing

Use the Swagger UI at `http://localhost:3010/api/docs` to test API endpoints directly:

- `GET /api/users/123/contribution/settings`
- `PUT /api/users/123/contribution/settings`
- `GET /api/users/123/contribution/ytd`

## Troubleshooting

**Backend won't start:**
- Make sure port 3010 is not already in use
- Check that you ran `npm install` in the backend directory

**Frontend won't start:**
- Make sure port 3000 is not already in use
- Check that you ran `npm install` in the frontend directory
- Verify the backend is running first

**Can't connect to backend:**
- Ensure backend is running on port 3010
- Check browser console for errors
