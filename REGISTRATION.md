# User Registration Documentation

## Overview

The Solar Projects SPA now includes a complete user registration system that integrates with the API at `http://localhost:5002/api/v1/auth/register`.

## Features

### ✅ Registration Form
- **Component**: `src/components/RegisterForm.tsx`
- **Page**: `src/pages/Register.tsx`
- **Route**: `/register`

### ✅ Form Validation
- **Client-side validation** for all fields
- **Real-time password strength indicator**
- **Comprehensive error handling**
- **Server-side error integration**

### ✅ Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character (@$!%*?&)

### ✅ User Experience
- **Modern UI** with Tailwind CSS styling
- **Loading states** during registration
- **Error display** for validation failures
- **Success handling** with redirect to login
- **Password visibility toggle**
- **Easy navigation** to/from login page

## API Integration

### Request Format
```json
POST /api/v1/auth/register
{
  "username": "john_tech",
  "email": "john@solartech.com",
  "password": "SecurePass123!",
  "fullName": "John Technician",
  "roleId": 3
}
```

### Success Response (201)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "userId": "456e7890-e89b-12d3-a456-426614174001",
    "username": "john_tech",
    "email": "john@solartech.com",
    "fullName": "John Technician",
    "roleName": "User",
    "isActive": true
  },
  "errors": []
}
```

### Error Handling
- **Validation errors** are displayed per field
- **Server errors** are shown with context
- **Duplicate username/email** handled gracefully
- **Network errors** provide user feedback

## User Roles

### Available During Registration
- **User (roleId: 3)** - Standard access (default)
- **Viewer (roleId: 4)** - Read-only access

### Admin-Only Roles
- **Admin (roleId: 1)** - Full system access
- **Manager (roleId: 2)** - Project management access

> **Note**: Admin and Manager roles require manual approval and cannot be self-registered.

## Navigation Integration

### ✅ Added to Navigation Bar
- **Register button** appears for non-authenticated users
- **Green styling** to differentiate from login
- **Responsive design** for mobile/desktop

### ✅ Login Form Integration
- **"Create Account" link** in LoginForm
- **Seamless navigation** between login/register
- **Consistent user experience**

## File Structure

```
src/
├── components/
│   ├── RegisterForm.tsx     # Registration form component
│   ├── LoginForm.tsx        # Updated with register link
│   └── Navigation.tsx       # Updated with register button
├── pages/
│   ├── Register.tsx         # Registration page
│   └── Login.tsx           # Login page (reference)
├── types/
│   └── auth.ts             # Authentication types
├── utils/
│   └── authService.ts      # Auth API integration
└── contexts/
    └── AuthContext.tsx     # Auth state management
```

## Testing

### ✅ Manual Testing
1. Visit `http://localhost:3001/register`
2. Fill out the registration form
3. Submit with valid data
4. Verify success message and redirect
5. Test login with new credentials

### ✅ Error Testing
1. Test validation errors (weak password, invalid email)
2. Test duplicate username/email scenarios
3. Test network error handling
4. Test password confirmation mismatch

## Security Features

### ✅ Client-Side Validation
- **Input sanitization** and validation
- **Password strength** requirements
- **Email format** validation
- **Username format** restrictions

### ✅ Server Integration
- **API error handling** with proper messaging
- **Secure password** transmission
- **Role-based** registration limits
- **Proper error** feedback without exposing system details

## Future Enhancements

### Possible Additions
- **Email verification** workflow
- **Captcha integration** for bot protection
- **Social login** options (Google, Microsoft)
- **Password reset** during registration
- **Terms of service** acceptance
- **Profile picture** upload during registration

## Usage Examples

### Basic Registration
```tsx
import { RegisterForm } from '../components';

const MyPage = () => {
  const handleSuccess = () => {
    console.log('User registered successfully!');
  };

  return (
    <RegisterForm 
      onSuccess={handleSuccess}
      onSwitchToLogin={() => navigate('/login')}
    />
  );
};
```

### Custom Error Handling
```tsx
const { register } = useAuth();

const handleRegister = async (userData) => {
  try {
    const success = await register(userData);
    if (success) {
      // Handle success
    }
  } catch (error) {
    // Handle API errors
    console.error('Registration failed:', error);
  }
};
```

---

The registration system is now fully integrated and ready for production use with your Solar Projects management platform! 🎉
