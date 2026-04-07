-- CreateEnum
CREATE TYPE "Level" AS ENUM ('Beginner', 'Intermediate', 'Advance');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PAID', 'UNPAID');

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "isDeleted" SET DEFAULT false;

-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_photo" TEXT,
    "contact_number" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "course_fee" DOUBLE PRECISION NOT NULL,
    "isFree" BOOLEAN NOT NULL,
    "level" "Level" NOT NULL,
    "isPublished" BOOLEAN NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instructor_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,

    CONSTRAINT "course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enrollment" (
    "id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favourites" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,

    CONSTRAINT "favourites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_photo" TEXT,
    "address" TEXT,
    "contact_number" TEXT,
    "profession" TEXT,
    "about_me" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "instructor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "profile_photo" TEXT,
    "address" TEXT,
    "contact_number" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "learner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lecture" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "video_url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "module_id" TEXT NOT NULL,

    CONSTRAINT "lecture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" TEXT NOT NULL,
    "payment_Status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "amount" DOUBLE PRECISION NOT NULL,
    "stripe_event_id" TEXT NOT NULL,
    "transaction_id" TEXT NOT NULL,
    "invoice_url" TEXT NOT NULL,
    "payment_gateway_data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "enrollment_id" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "course_id" TEXT NOT NULL,
    "learner_id" TEXT NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_id_key" ON "admin"("user_id");

-- CreateIndex
CREATE INDEX "admin_email_idx" ON "admin"("email");

-- CreateIndex
CREATE INDEX "course_instructor_id_idx" ON "course"("instructor_id");

-- CreateIndex
CREATE INDEX "enrollment_course_id_idx" ON "enrollment"("course_id");

-- CreateIndex
CREATE INDEX "enrollment_learner_id_idx" ON "enrollment"("learner_id");

-- CreateIndex
CREATE INDEX "favourites_course_id_idx" ON "favourites"("course_id");

-- CreateIndex
CREATE INDEX "favourites_learner_id_idx" ON "favourites"("learner_id");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_email_key" ON "instructor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "instructor_user_id_key" ON "instructor"("user_id");

-- CreateIndex
CREATE INDEX "instructor_email_idx" ON "instructor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "learner_email_key" ON "learner"("email");

-- CreateIndex
CREATE UNIQUE INDEX "learner_user_id_key" ON "learner"("user_id");

-- CreateIndex
CREATE INDEX "learner_email_idx" ON "learner"("email");

-- CreateIndex
CREATE INDEX "lecture_module_id_idx" ON "lecture"("module_id");

-- CreateIndex
CREATE INDEX "module_course_id_idx" ON "module"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_stripe_event_id_key" ON "payment"("stripe_event_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_transaction_id_key" ON "payment"("transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_enrollment_id_key" ON "payment"("enrollment_id");

-- CreateIndex
CREATE INDEX "payment_enrollment_id_idx" ON "payment"("enrollment_id");

-- CreateIndex
CREATE INDEX "payment_transaction_id_idx" ON "payment"("transaction_id");

-- CreateIndex
CREATE INDEX "reviews_course_id_idx" ON "reviews"("course_id");

-- CreateIndex
CREATE INDEX "reviews_learner_id_idx" ON "reviews"("learner_id");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_instructor_id_fkey" FOREIGN KEY ("instructor_id") REFERENCES "instructor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course" ADD CONSTRAINT "course_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enrollment" ADD CONSTRAINT "enrollment_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favourites" ADD CONSTRAINT "favourites_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instructor" ADD CONSTRAINT "instructor_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learner" ADD CONSTRAINT "learner_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lecture" ADD CONSTRAINT "lecture_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module" ADD CONSTRAINT "module_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_enrollment_id_fkey" FOREIGN KEY ("enrollment_id") REFERENCES "enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_learner_id_fkey" FOREIGN KEY ("learner_id") REFERENCES "learner"("id") ON DELETE CASCADE ON UPDATE CASCADE;
