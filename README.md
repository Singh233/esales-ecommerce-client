# eSales eCommerce Client

A modern React/Next.js frontend for an eCommerce checkout flow simulation built as a coding assignment.

![esales-mockup](https://github.com/user-attachments/assets/6b561ed8-8e01-444c-bbc4-99e7e5b8b3b4)


## Features

- **Product Landing Page**: Display product with image carousel, variants, and quantity selector
- **Shopping Cart**: Add/remove items, update quantities, persistent storage
- **Checkout Form**: Complete form validation for customer and payment details
- **Payment Simulation**: Test different payment scenarios (approved, declined, gateway error)
- **Order Confirmation**: Display order details with unique order number
- **Order History**: View past orders with status tracking
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Real-time Updates**: React Query for efficient data fetching and caching

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Redux Toolkit for cart state
- **Data Fetching**: TanStack React Query
- **Authentication**: BetterAuth client integration
- **Forms**: Custom validation with real-time feedback
- **Icons**: Lucide React
- **Notifications**: Sonner for toast messages


## Pages & Flow

### 1. Landing Page (`/`)

- **Product Display**: Image carousel, title, price, description
- **Variant Selection**: Color and size dropdowns
- **Quantity Selector**: Increment/decrement with stock validation
- **Add to Cart**: Adds selected item with variants to cart

### 2. Cart Page (`/cart`)

- **Item Management**: View, update quantities, remove items
- **Order Summary**: Subtotal, tax, total calculations
- **Persistent Storage**: Cart synced between Redux and API
- **Checkout Button**: Navigate to checkout when ready

### 3. Checkout Page (`/checkout`)

- **Contact Information**: Name, email, phone validation
- **Shipping Address**: Street, city, state, zip validation
- **Payment Details**: Card number (16-digit), expiry (MM/YY), CVV validation
- **Payment Simulation**: Choose approved/declined/error scenarios
- **Order Summary**: Review items before submission

### 4. Order Confirmation (`/order-confirmation/[orderNumber]`)

- **Order Details**: Unique order number, items, customer info
- **Confirmation Message**: Success notification
- **Email Notification**: Automatic confirmation email sent

### 5. Order History (`/orders`)

- **Past Orders**: List of user's orders with status
- **Order Details**: Expandable view with full order information
- **Status Tracking**: Payment and order status badges

## Form Validations

All forms include real-time validation:

- **Email**: Valid email format required
- **Phone**: International phone number format
- **Card Number**: Exactly 16 digits with formatting
- **Expiry Date**: MM/YY format, must be future date
- **CVV**: Exactly 3 digits
- **Required Fields**: All mandatory fields validated

## Payment Simulation

The checkout form includes a simulation panel to test:

1. **Approved Transaction**: Order created successfully
2. **Declined Transaction**: Payment fails, error message shown
3. **Gateway Error**: Network/processing error simulation

## State Management

- **Redux**: Global cart state management
- **React Query**: Server state caching and synchronization
- **Local Storage**: Cart persistence for unauthenticated users
- **Session Storage**: Temporary form data preservation

## Authentication

- **Sign Up**: New user registration
- **Sign In**: Existing user login
- **Protected Routes**: Cart and orders require authentication
- **Session Management**: Automatic session handling

## API Integration

The client communicates with the API for:

- **Products**: Fetch product details
- **Cart**: CRUD operations on cart items
- **Orders**: Create and retrieve orders
- **User**: Authentication and profile management

## Component Structure

```
src/
├── app/                # Next.js app router pages
├── components/         # Reusable UI components
│   ├── ui/            # shadcn/ui base components
│   └── custom/        # Custom business components
├── lib/               # Utilities and configurations
│   ├── redux/         # Redux store and slices
│   ├── hooks/         # Custom React hooks
│   └── providers/     # Context providers
└── types/             # TypeScript type definitions
```
