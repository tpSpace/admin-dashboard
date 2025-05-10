# Admin Dashboard

A modern, responsive admin dashboard built with Next.js 15, React 19, and Tailwind CSS. This application provides a comprehensive interface for managing orders and other administrative tasks.

## Features

- 🎨 Modern UI with Tailwind CSS
- 🔐 Authentication system
- 📊 Order management system
- 📱 Responsive design
- 🔄 Real-time data updates with React Query
- 🎯 TypeScript support
- 🌙 Dark mode support

## Tech Stack

- **Framework:** Next.js 15.3.1
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **State Management:** React Query (TanStack Query)
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Charts:** Recharts
- **Type Safety:** TypeScript

## Getting Started

### Prerequisites

- Node.js (Latest LTS version recommended)
- Bun package manager
- Git

### Environment Setup

1. Create a `.env` file in the root directory with the following variables:
```env
NEXT_PUBLIC_BACKEND_URL=your_api_url_here
SECRET_JWT=your_auth_secret_here
NODE_ENV
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tpSpace/admin-dashboard
cd admin-dashboard
```

2. Install dependencies:
```bash
bun install
```

3. Run the development server:
```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

### Configuration

The project uses several configuration files:

- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration
- `eslint.config.mjs` - ESLint configuration

### Available Scripts

- `bun run dev` - Start the development server with Turbopack
- `bun run build` - Build the application for production
- `bun run start` - Start the production server
- `bun run lint` - Run ESLint for code linting

### Development Workflow

1. Make sure you're on the latest version of the main branch:
```bash
git checkout main
git pull origin main
```

2. Create a new branch for your feature:
```bash
git checkout -b feature/your-feature-name
```

3. Start the development server:
```bash
bun run dev
```

4. Make your changes and test them locally

5. Run linting to ensure code quality:
```bash
bun run lint
```

## Project Structure

```
admin-dashboard/
├── app/                    # Next.js app directory
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Authentication pages
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
├── lib/                 # Utility functions and API clients
├── public/             # Static assets
└── types/              # TypeScript type definitions
```

## Features in Detail

### Order Management
- View all orders with pagination
- Change order status
- Real-time updates using React Query
- Responsive table layout

### Authentication
- Secure login system
- Protected routes
- JWT-based authentication

### UI/UX
- Clean and modern interface
- Responsive design for all screen sizes
- Loading states and error handling
- Toast notifications for user feedback

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support, please contact the development team.
