# Admin Panel - Production-Ready Boilerplate

A modern, production-ready admin panel built with Next.js 14, TypeScript, Tailwind CSS, and Zustand for state management. This is a standalone frontend application designed to connect to an existing MongoDB + Node.js backend via REST APIs.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript** (Strict mode enabled)
- **Tailwind CSS** (For styling)
- **Zustand** (State management)
- **Axios** (API client with interceptors)
- **JWT Authentication** (Token-based)
- **Lucide React** (Icons)

## Features

✅ **Authentication System**
- Login page with JWT token management
- Secure token storage using HTTP-only cookies
- Protected routes via middleware
- Auto logout on 401 responses
- Axios interceptor for automatic token injection

✅ **Admin Layout**
- Responsive sidebar navigation
- Top header with user profile menu
- Clean, professional design
- Mobile-friendly

✅ **Role-Based Access Control**
- Admin-only access (easily expandable for more roles)
- Middleware-based route protection

✅ **Module Structure**
- Dashboard with statistics
- Bank Orders (Full CRUD implementation)
- Products (Structure ready)
- Vendors (Structure ready)
- Purchase Orders (Structure ready)
- Categories (Structure ready)

✅ **Reusable UI Components**
- Button
- Input
- Modal
- Table
- Badge
- Loader

## Folder Structure

```
admin-panel/
├── app/                          # Next.js App Router pages
│   ├── login/                    # Login page
│   ├── dashboard/                # Dashboard page
│   ├── bank-orders/              # Bank Orders module
│   │   ├── page.tsx             # List page
│   │   ├── create/              # Create page
│   │   └── [id]/edit/           # Edit page
│   ├── products/                 # Products module
│   ├── vendors/                  # Vendors module
│   ├── purchase-orders/          # Purchase Orders module
│   ├── categories/               # Categories module
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Modal.tsx
│   ├── Table.tsx
│   ├── Badge.tsx
│   ├── Loader.tsx
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── AdminLayout.tsx
│   └── index.ts
├── modules/                      # Feature modules (empty, for future use)
├── services/                     # API service layer
│   ├── authService.ts
│   ├── bankOrderService.ts
│   ├── productService.ts
│   ├── vendorService.ts
│   ├── purchaseOrderService.ts
│   └── categoryService.ts
├── store/                        # Zustand stores
│   └── authStore.ts
├── hooks/                        # Custom React hooks (empty, for future use)
├── types/                        # TypeScript type definitions
│   ├── common.ts
│   ├── auth.ts
│   ├── bankOrder.ts
│   ├── product.ts
│   ├── vendor.ts
│   ├── purchaseOrder.ts
│   ├── category.ts
│   └── index.ts
├── utils/                        # Utility functions
│   └── axios.ts                 # Axios instance with interceptors
├── middleware.ts                 # Next.js middleware for auth
├── .env.local                   # Environment variables
├── .env.example                 # Environment variables template
├── next.config.ts               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── package.json                 # Dependencies
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A running backend API (MongoDB + Node.js)

### Installation

1. **Navigate to the project directory:**
   ```bash
   cd admin-panel
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**

   Copy `.env.example` to `.env.local` and update the values:
   ```bash
   cp .env.example .env.local
   ```

   Update the API URL in `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_APP_NAME=Admin Panel
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## API Integration

This admin panel expects your backend API to have the following endpoints:

### Authentication
```
POST   /api/auth/login          # Login with email & password
GET    /api/auth/me             # Get current user
POST   /api/auth/logout         # Logout
```

### Bank Orders
```
GET    /api/bank-orders         # List all orders (with pagination)
GET    /api/bank-orders/:id     # Get single order
POST   /api/bank-orders         # Create new order
PUT    /api/bank-orders/:id     # Update order
DELETE /api/bank-orders/:id     # Delete order
```

### Products, Vendors, Categories, Purchase Orders
Similar CRUD endpoints as Bank Orders (structure is ready, implementation pending)

### Expected Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* your data */ }
}
```

**Paginated Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": [ /* array of items */ ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": { /* optional field errors */ }
}
```

### Authentication Flow

1. User logs in via `/login`
2. Backend returns JWT token
3. Token is stored in cookies (`admin_token`)
4. All subsequent API requests include the token via Authorization header
5. On 401 response, user is automatically logged out and redirected to login

## Default Credentials

Set up a default admin user in your backend:
- Email: `admin@example.com`
- Password: `admin123`
- Role: `admin`

## Customization

### Adding New Modules

1. Create types in `types/yourModule.ts`
2. Create service in `services/yourModuleService.ts`
3. Create pages in `app/your-module/`
4. Add navigation link in `components/Sidebar.tsx`
5. Update middleware matcher in `middleware.ts`

### Styling

This project uses Tailwind CSS. Customize colors and theme in `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        // Update primary colors here
      },
    },
  },
}
```

## Security Features

- JWT token stored in HTTP-only cookies
- CSRF protection via SameSite cookie attribute
- Protected routes via middleware
- Automatic logout on authentication failures
- TypeScript for type safety
- Input validation on forms

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Future Enhancements

- [ ] Implement Products CRUD
- [ ] Implement Vendors CRUD
- [ ] Implement Purchase Orders CRUD
- [ ] Implement Categories CRUD
- [ ] Add user management
- [ ] Add role-based permissions system
- [ ] Add image upload functionality
- [ ] Add data export (CSV, PDF)
- [ ] Add advanced filtering and search
- [ ] Add notifications system
- [ ] Add dark mode support
- [ ] Add multi-language support

## License

MIT

## Support

For issues and questions, please refer to your backend API documentation.

---

**Built with ❤️ using Next.js 14 and TypeScript**
