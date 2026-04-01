Project Name: Learning Managament system

A Backend project where people who want to learn and who want to tech can get together and instructor can offer courses for free or with reasonable price and learner can enroll courses and start learning.
and Admin will manage and monitor the app.

Tech Stack
Node.js
Express
TypeScript
Prisma ORM for Postgresql
Database-> Postgresql
Zod validation
Better-Auth

Features:
Authentication: authentication is implemented using better-auth with custom routes for better flexibility where users can register base on there role (Learner or Instructor). And Super admin is seeded manually. and user must verify there email, and google login also implemented here.

Authirization: Role based authorization is implemented. and there are also some publich routes

Category: Only Admin can create, edit, and delete category. And every one can get category

course | Module | lecture: Only admin can create, edit and delete course, module and lecture. and every one can get courses

enrollment: Only learner can enroll each course in one time.

payment: learner must complete payment to complete enrollment. Stripe is integrated as payment gateway.

favorites: learning can add courses to favorites so they can enroll them later.

review: learner can leaves reviews after enrollment.

profile: learner, instructor and admin can update their profile.

cloudinary: Cloudinary integrated for photo and video uploading.

sendEmail: sendEmail function is implemented to send otp for email verification and reset password, and invoice pdf.

env: follow .env.example to set up .evn file
