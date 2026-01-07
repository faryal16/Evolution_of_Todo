# Quickstart Guide: Frontend - Phase II Todo Web App

## Prerequisites

- Node.js version 18 or higher
- npm or yarn package manager
- Access to the backend API server

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Key Commands

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run code linter
- `npm test` - Run unit tests

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   └── TaskForm.tsx
│   ├── pages/          # Next.js pages
│   │   ├── login.tsx
│   │   ├── signup.tsx
│   │   └── tasks.tsx
│   ├── services/       # API and business logic
│   │   └── api.ts
│   ├── lib/           # Utility functions
│   │   └── auth.ts
│   └── types/         # TypeScript type definitions
│       └── index.ts
├── public/            # Static assets
├── tests/            # Test files
└── package.json      # Project dependencies and scripts
```

## Authentication Flow

1. User visits `/signup` to create an account
2. User visits `/login` to authenticate
3. Authentication token is stored securely in the browser
4. All API requests include the authentication token in headers
5. Token expiration is monitored and user is redirected to login when expired

## Task Management Features

### Creating Tasks
- Navigate to the tasks dashboard
- Use the "Add Task" form to create new tasks
- Title is required (1-200 characters)
- Description is optional (max 1000 characters)

### Viewing Tasks
- Tasks are displayed in a responsive list
- Filter options: All, Pending, Completed
- Tasks are sorted by creation date by default

### Updating Tasks
- Click on a task to edit its details
- Changes are saved to the backend immediately

### Completing Tasks
- Toggle completion status with the checkbox
- Status is updated in the backend immediately

### Deleting Tasks
- Click the delete button on a task
- Confirmation is required before deletion
- Task is removed from the backend and UI

## API Integration

The frontend communicates with the backend through the centralized API service in `src/services/api.ts`. This service handles:

- Authentication token management
- Request/response error handling
- Retry logic for failed requests
- Consistent error messaging

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Base URL for the backend API
- `NEXT_PUBLIC_JWT_SECRET` - Secret for JWT token verification (should match backend)
- `NEXTAUTH_URL` - Base URL for NextAuth.js

## Testing

### Running Tests
```bash
npm test
# or to run tests in watch mode
npm run test:watch
```

### Test Structure
- Unit tests in `tests/unit/`
- End-to-end tests in `tests/e2e/`
- API contract tests to verify backend compatibility

## Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

## Troubleshooting

### Common Issues

1. **API requests failing**: Verify that the backend server is running and the `NEXT_PUBLIC_API_BASE_URL` is correctly configured

2. **Authentication not working**: Check that JWT secrets match between frontend and backend

3. **Styles not loading**: Ensure Tailwind CSS is properly configured in `tailwind.config.js` and `globals.css`

### Development Tips

- Use the browser's developer tools to inspect network requests and authentication headers
- Check the console for any error messages during development
- Use the API contract documentation to understand expected request/response formats