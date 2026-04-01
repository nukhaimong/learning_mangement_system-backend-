# Learning Management System (LMS) - Backend

A comprehensive backend system for a Learning Management Platform where instructors can create and manage courses, learners can enroll in them, and admins oversee the entire platform. The platform supports both free and paid courses with secure payment processing.

## 🚀 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **ORM**: Prisma with PostgreSQL
- **Database**: PostgreSQL
- **Validation**: Zod
- **Authentication**: Better-Auth
- **File Storage**: Cloudinary
- **Payment Gateway**: Stripe

## ✨ Features

### 🔐 Authentication & Authorization

- **Role-based Authentication** using Better-Auth with custom routes
- **User Roles**: Learner, Instructor, and Super Admin (seeded manually)
- **Email Verification** with OTP
- **Google Login** integration
- **Role-based Authorization** with public routes support

### 📚 Course Management

- **Categories**: Admin-only CRUD operations, public viewing
- **Courses**: Instructor-only CRUD operations, public viewing
- **Modules**: Instructor-only CRUD operations
- **Lectures**: Instructor-only CRUD operations with video upload support

### 👨‍🎓 Learner Features

- **Course Enrollment**: One-time enrollment per course
- **Payment Processing**: Stripe integration for course payments
- **Favorites**: Save courses for later enrollment
- **Reviews**: Leave reviews after course completion
- **Profile Management**: Update personal information

### 👨‍🏫 Instructor Features

- **Course Management**: Create, update, and delete courses, modules, and lectures
- **Profile Management**: Update personal information

### 👑 Admin Features

- **Category Management**: Create, update, and delete categories
- **Platform Monitoring**: Oversee all platform activities
- **Profile Management**: Update personal information

### 📧 Additional Features

- **Email Service**: Send OTP for verification, password reset, and invoice PDFs
- **File Upload**: Cloudinary integration for photos and videos
- **Invoice Generation**: Automatic PDF invoice generation after successful payment

## follow .env.example to use the code base
