# Family Tree Client

A modern React frontend for the Family Tree application built with Chakra UI.

## Features

- **Authentication**: Login/Register with JWT token management
- **Dashboard**: Overview of family data with quick actions
- **Person Management**: Full CRUD operations for family members
- **Family Tree Visualization**: Interactive tree showing ancestors, descendants, and siblings
- **Relationships**: Manage family relationships (parent-child, spouse, sibling)
- **Profile Management**: View and edit user profile

## Tech Stack

- **React 19** - UI library
- **Chakra UI v2** - Component library
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Backend server running at `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:8000
VITE_APP_NAME=FamilyTree
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Footer/
│   ├── Layout/
│   ├── LoadingSpinner/
│   ├── Navbar/
│   └── ProtectedRoute/
├── hooks/               # Custom React hooks
│   ├── useAuth.jsx      # Authentication context & hook
│   ├── useFamilyTree.js # Family tree operations
│   ├── usePersons.js    # Person CRUD operations
│   └── useRelationships.js
├── pages/               # Page components
│   ├── Dashboard/
│   ├── FamilyTree/
│   ├── Home/
│   ├── Login/
│   ├── Persons/
│   ├── Profile/
│   ├── Register/
│   └── Relationships/
├── services/            # API service modules
│   ├── api.js           # Axios instance configuration
│   ├── authService.js   # Authentication API
│   ├── personService.js # Person API
│   ├── relationshipService.js
│   └── treeService.js   # Family tree traversal API
├── App.jsx              # Root component with providers
├── main.jsx             # Entry point
└── routes.jsx           # Route configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Endpoints Used

The client connects to these backend endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/me` - Get current user profile

### Persons
- `GET /persons/` - List all persons
- `GET /persons/{id}` - Get person by ID
- `GET /persons/search` - Search persons
- `POST /persons/` - Create person
- `PUT /persons/{id}` - Update person
- `DELETE /persons/{id}` - Delete person

### Relationships
- `GET /relationships/` - List all relationships
- `POST /relationships/` - Create relationship
- `DELETE /relationships/{id}` - Delete relationship

### Family Tree
- `GET /tree/{id}/ancestors` - Get ancestors
- `GET /tree/{id}/descendants` - Get descendants
- `GET /tree/{id}/siblings` - Get siblings

## License

MIT
