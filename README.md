# Expense Share

A full-stack expense tracking and sharing application that allows users to manage personal expenses, share expenses with friends, and view detailed statistics. Built with React, Node.js, GraphQL, and MongoDB.

## 🚀 Live Demo

- **Frontend**: https://client-expense-share.ue.r.appspot.com/
- **Backend API**: https://server-expense-share.ue.r.appspot.com/

## ✨ Features

### Core Functionality
- **User Authentication**: Google OAuth integration for secure login
- **Expense Management**: Create, view, and delete personal and shared expenses
- **Friend System**: Add friends by email, send/receive friend requests
- **Expense Sharing**: Split expenses with friends and track balances
- **Statistics Dashboard**: View monthly expense summaries and category breakdowns
- **Responsive Design**: Mobile-friendly interface with dark/light mode support

### Key Features
- Filter expenses by category (6 categories available) and share type
- Real-time balance tracking between friends
- Interactive charts and visualizations
- Month-over-month comparison statistics
- Expense categorization and detailed tracking

## 🛠️ Tech Stack

### Frontend
- **React** 19.1.0 - UI framework
- **Apollo Client** - GraphQL client
- **Chakra UI** - Component library
- **React Router** - Client-side routing
- **Recharts** - Data visualization
- **React Icons** - Icon library
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Apollo Server** - GraphQL server
- **MongoDB** - Database
- **GraphQL** - API query language

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
   git clone https://github.com/hspgit/expense-share.git
   cd expense-share
```

### 2. Server Setup

#### Navigate to server directory
```bash
  cd server
```

#### Install dependencies
```bash
  npm install
```

#### Environment Configuration
Create a `.env` file in the server directory with the following variables:

```env
MONGO_DB_URL=mongodb://localhost:27017/
MONGO_DB_NAME=expense-share-db
PORT=4000
```

**For MongoDB Atlas (Cloud):**
```env
MONGO_DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/
MONGO_DB_NAME=expense-share-db
PORT=4000
```

#### Start the server
```bash
  npm run start
```

The server will be available at `http://localhost:4000/`

### 3. Client Setup

#### Navigate to client directory (from project root)
```bash
  cd client
```

#### Install dependencies
```bash
  npm install
```

#### Environment Configuration
Create a `.env` file in the client directory with:

```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_GRAPHQL_SERVER_URL=http://localhost:4000/
```

**To get Google OAuth Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add your domain to authorized origins

#### Start the development server
```bash
  npm run dev
```

The client will be available at `http://localhost:5173/`

## 🗄️ Database Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service:
```bash
  mongod
```
3. The application will automatically create the required collections

### MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and update `MONGO_DB_URL` in server `.env`
4. Whitelist your IP address

### Database Collections
The application uses the following collections:
- `users` - User profiles and authentication data
- `expenses` - Expense records
- `friendships` - Friend relationships
- `friendRequests` - Pending friend requests

## 📱 Usage

### Getting Started
1. Visit the application URL
2. Sign in with your Google account
3. Start adding expenses or friends

### Adding Expenses
1. Navigate to the Expenses page
2. Click the "Add Expense" button
3. Fill in expense details (amount, description, category)
4. Choose to make it personal or shared with friends
5. Save the expense

### Managing Friends
1. Go to the Friends page
2. Click "Add Friend" and enter their email
3. View pending requests and accept/reject as needed
4. See your current friends and balances

### Viewing Statistics
1. Navigate to the Stats page
2. View monthly summaries and trends
3. Analyze spending by category with interactive charts
4. Track friend activity and balances

## 🚀 Deployment

### Frontend (Google App Engine)
1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy using `gcloud` CLI or App Engine

### Backend (Google App Engine)
1. Ensure all environment variables are configured
2. Deploy using `gcloud` CLI


### Screenshots
![Expense Share Welcome](./screenshots/iter3-welcome-screen.png)
![Expense Share Dashboard](./screenshots/iter3-expenses-default.png)
![Expense Share Friends](./screenshots/iter3-friends-page.png)
![Expense Share Statistics](./screenshots/iter3-stats-page.png)


### None
- This application was developed from scratch as a final project for CS5610 Web Development 
course at Northeastern University, Boston, MA.
- Please refer to the readme files in the `client` and `server` directories for more details on 
  the iterative progress.
