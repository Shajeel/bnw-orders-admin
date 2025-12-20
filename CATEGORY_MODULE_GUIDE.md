# Category Management Module - Complete Guide

## Overview
The Category Management module is a fully functional CRUD system with modern UI, form validation, and API integration.

## Features Implemented

### ✅ Core Features
- **Add Category** - Modal form with validation
- **Edit Category** - Pre-filled modal form
- **Delete Category** - Confirmation dialog
- **Active/Inactive Toggle** - Click badge to toggle
- **Paginated List** - 10 items per page
- **Search** - Real-time search filter
- **Status Filter** - Filter by Active/Inactive/All
- **Modern UI** - Gradient table headers, smooth animations

### ✅ Technical Features
- **Zod Validation** - Client-side form validation
- **React Hook Form** - Form state management
- **TypeScript** - Full type safety
- **Error Handling** - User-friendly error messages
- **Loading States** - Spinners and disabled states
- **Responsive Design** - Mobile-friendly layout

---

## API Integration

### Endpoints Used

```typescript
// Get all categories (paginated)
GET /categories?page=1&limit=10&status=active&search=electronics

// Create new category
POST /categories
Body: {
  "name": "Electronics",
  "description": "Electronic items and gadgets",
  "status": "active"
}

// Update category
PATCH /categories/:id
Body: {
  "name": "Updated Name",
  "description": "Updated description",
  "status": "inactive"
}

// Delete category
DELETE /categories/:id
```

### Expected Response Format

```typescript
// List Response
{
  "success": true,
  "message": "Categories retrieved successfully",
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "Electronics",
      "description": "Electronic items and gadgets",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}

// Create/Update Response
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Electronics",
    "description": "Electronic items and gadgets",
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## Form Validation Rules

### Category Name
- **Required**: Yes
- **Min Length**: 2 characters
- **Max Length**: 100 characters
- **Example**: "Electronics", "Clothing", "Food & Beverages"

### Description
- **Required**: No (optional)
- **Max Length**: 500 characters
- **Example**: "Electronic items including smartphones, laptops, and accessories"

### Status
- **Required**: Yes
- **Options**: "active" or "inactive"
- **Default**: "active"

---

## File Structure

```
admin-panel/
├── app/categories/
│   └── page.tsx                          # Main categories page
├── components/
│   └── CategoryModal.tsx                 # Add/Edit modal
├── services/
│   └── categoryService.ts                # API service
├── types/
│   ├── category.ts                       # Category types
│   └── validations/
│       └── categorySchema.ts             # Zod validation schema
```

---

## Component Breakdown

### 1. Categories List Page (`app/categories/page.tsx`)

**Features:**
- Search bar with icon
- Status filter dropdown
- Add Category button
- Data table with gradient header
- Action buttons (Edit, Delete)
- Clickable status badges for toggle
- Pagination controls
- Empty state with illustration

**State Management:**
```typescript
const [categories, setCategories] = useState<Category[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
const [currentPage, setCurrentPage] = useState(1);
const [searchTerm, setSearchTerm] = useState('');
const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
```

### 2. Category Modal (`components/CategoryModal.tsx`)

**Features:**
- Gradient header
- Form validation with Zod
- React Hook Form integration
- Auto-populated fields for edit mode
- Loading states during submission
- Escape key to close
- Click outside to close
- Error messages inline

**Props:**
```typescript
interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  category?: Category | null;
  isLoading?: boolean;
}
```

### 3. Category Service (`services/categoryService.ts`)

**Methods:**
```typescript
categoryService.getAll(params)        // List with pagination
categoryService.getById(id)           // Get single category
categoryService.create(data)          // Create new
categoryService.update(id, data)      // Update existing
categoryService.toggleStatus(id, status) // Toggle active/inactive
categoryService.delete(id)            // Delete category
```

---

## Usage Examples

### Adding a Category

1. Click "Add Category" button
2. Fill in the form:
   - Name: "Electronics"
   - Description: "Electronic items and gadgets"
   - Status: "Active"
3. Click "Create Category"
4. Modal closes and table refreshes

### Editing a Category

1. Click the edit icon (pencil) on any row
2. Modal opens with pre-filled data
3. Modify the fields
4. Click "Update Category"
5. Changes are saved and table refreshes

### Toggling Status

1. Click on the status badge (Active/Inactive)
2. Status toggles immediately
3. Table refreshes to show new status
4. Badge color changes (Green = Active, Gray = Inactive)

### Deleting a Category

1. Click the delete icon (trash) on any row
2. Confirmation dialog appears
3. Click "OK" to confirm
4. Category is deleted and table refreshes

### Searching

1. Type in the search box
2. Results filter in real-time
3. Works on category name

### Filtering by Status

1. Select from dropdown: All Status / Active / Inactive
2. Table filters immediately
3. Pagination resets to page 1

---

## Validation Schema

```typescript
// types/validations/categorySchema.ts
import { z } from 'zod';

export const categorySchema = z.object({
  name: z
    .string()
    .min(2, 'Category name must be at least 2 characters')
    .max(100, 'Category name must not exceed 100 characters')
    .trim(),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
```

---

## Styling & Design

### Modern Features
- **Gradient Headers**: Table headers use subtle gradients
- **Rounded Corners**: All cards use `rounded-2xl`
- **Shadow Effects**: Cards have `shadow-lg`
- **Hover States**: Rows highlight on hover
- **Status Badges**: Colored dots with labels
- **Empty States**: Friendly illustrations
- **Loading States**: Centered spinners

### Color Scheme
- **Primary Actions**: Blue gradient buttons
- **Active Status**: Green badge
- **Inactive Status**: Gray badge
- **Danger Actions**: Red delete button
- **Edit Actions**: Blue edit button

---

## Error Handling

### Client-Side Validation
- Form fields show inline errors
- Validation happens on submit
- Fields highlight in red when invalid

### API Error Handling
- Network errors show alert
- 401 errors auto-logout
- User-friendly error messages
- Console logs for debugging

---

## Performance Optimizations

1. **Debounced Search** - Can be added with `useDebounce`
2. **Lazy Loading** - Table rows render efficiently
3. **Optimistic Updates** - Status toggle feels instant
4. **Pagination** - Only 10 items load at once
5. **Conditional Rendering** - Empty/loading states

---

## Testing Checklist

- [ ] Create category with valid data
- [ ] Create category with invalid data (validation errors)
- [ ] Edit category and save changes
- [ ] Toggle category status
- [ ] Delete category with confirmation
- [ ] Search categories by name
- [ ] Filter by active status
- [ ] Filter by inactive status
- [ ] Navigate through pages
- [ ] Handle API errors gracefully
- [ ] Modal closes on escape key
- [ ] Modal closes on outside click
- [ ] Form resets after successful submit

---

## Dependencies Installed

```json
{
  "zod": "^3.x",
  "react-hook-form": "^7.x",
  "@hookform/resolvers": "^3.x"
}
```

---

## Backend Requirements

Your Node.js + MongoDB backend should implement:

1. **Category Model** with fields:
   - `_id` (MongoDB ObjectId)
   - `name` (String, required)
   - `description` (String, optional)
   - `status` (String: 'active' | 'inactive')
   - `createdAt` (Date)
   - `updatedAt` (Date)

2. **API Routes**:
   - `GET /api/categories` - List with pagination
   - `POST /api/categories` - Create
   - `PATCH /api/categories/:id` - Update
   - `DELETE /api/categories/:id` - Delete

3. **Response Format**: Follow the structure shown above

---

## Next Steps

1. **Connect to Backend**: Update `NEXT_PUBLIC_API_URL` in `.env.local`
2. **Test with Real Data**: Create categories via the UI
3. **Customize Validation**: Edit `categorySchema.ts` if needed
4. **Add More Features**:
   - Bulk delete
   - Import/Export CSV
   - Category icons
   - Parent categories (hierarchy)

---

## Troubleshooting

### Modal not opening
- Check browser console for errors
- Verify `isModalOpen` state is updating

### Validation not working
- Check Zod schema in `categorySchema.ts`
- Verify React Hook Form is properly configured

### API calls failing
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Verify backend is running
- Check browser Network tab for errors
- Ensure CORS is enabled on backend

### Status toggle not working
- Verify `toggleStatus` API endpoint exists
- Check that response returns updated category

---

**Built with React Hook Form, Zod validation, and modern design principles**
