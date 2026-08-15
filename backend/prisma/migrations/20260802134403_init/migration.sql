-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'VIEWER', 'CONTENT_MANAGER', 'SUPPORT', 'OPERATIONS');

-- CreateEnum
CREATE TYPE "public"."PublishStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'UNPUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."Visibility" AS ENUM ('PUBLIC', 'PRIVATE', 'UNLISTED');

-- CreateEnum
CREATE TYPE "public"."BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED', 'NO_SHOW', 'REFUNDED');

-- CreateEnum
CREATE TYPE "public"."BookingType" AS ENUM ('LESSON', 'EXPERIENCE', 'EVENT');

-- CreateEnum
CREATE TYPE "public"."BookingActivityAction" AS ENUM ('CREATED', 'STATUS_CHANGED', 'UPDATED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."EventStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'LIVE', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."EventDifficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');

-- CreateEnum
CREATE TYPE "public"."EventType" AS ENUM ('WORKSHOP', 'CAMP', 'RETREAT', 'COMPETITION', 'COMMUNITY', 'PRIVATE_SESSION', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."CurrencyCode" AS ENUM ('INR', 'USD', 'EUR', 'GBP');

-- CreateEnum
CREATE TYPE "public"."LessonLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS');

-- CreateEnum
CREATE TYPE "public"."MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT', 'AUDIO', 'EMBED');

-- CreateEnum
CREATE TYPE "public"."ContactMessageStatus" AS ENUM ('NEW', 'IN_REVIEW', 'RESOLVED', 'SPAM', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."BookingSource" AS ENUM ('WEBSITE', 'ADMIN', 'PHONE', 'WHATSAPP', 'PARTNER');

-- CreateEnum
CREATE TYPE "public"."NavigationType" AS ENUM ('HEADER', 'FOOTER', 'SIDEBAR');

-- CreateEnum
CREATE TYPE "public"."SiteSettingType" AS ENUM ('STRING', 'NUMBER', 'BOOLEAN', 'JSON');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('UNPAID', 'PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateTable
CREATE TABLE "public"."Locale" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Locale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Beach" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Beach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "addressLine" TEXT,
    "city" TEXT,
    "region" TEXT,
    "country" TEXT,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminUser" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "avatar" TEXT,
    "phone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "userRole" "public"."UserRole" NOT NULL DEFAULT 'ADMIN',
    "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AdminUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminSession" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT,
    "name" TEXT,
    "title" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "adminUserId" INTEGER NOT NULL,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Role" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Permission" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdminUserRole" (
    "adminUserId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminUserRole_pkey" PRIMARY KEY ("adminUserId","roleId")
);

-- CreateTable
CREATE TABLE "public"."RolePermission" (
    "roleId" INTEGER NOT NULL,
    "permissionId" INTEGER NOT NULL,
    "assignedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "public"."ExperienceCategory" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ExperienceCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Experience" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "fullDescription" TEXT,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "galleryImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "categoryId" INTEGER,
    "category" TEXT,
    "difficulty" "public"."LessonLevel" NOT NULL DEFAULT 'ALL_LEVELS',
    "recommendedAge" TEXT,
    "duration" TEXT,
    "maxParticipants" INTEGER,
    "defaultLocaleCode" TEXT DEFAULT 'en',
    "durationMinutes" INTEGER,
    "basePrice" DECIMAL(10,2),
    "discountPrice" DECIMAL(10,2),
    "instructor" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "linkedLessonsCount" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "capacityMin" INTEGER,
    "capacityMax" INTEGER,
    "metadata" JSONB,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Lesson" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "shortDescription" TEXT,
    "fullDescription" TEXT,
    "coverImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "level" "public"."LessonLevel" NOT NULL DEFAULT 'BEGINNER',
    "difficulty" "public"."LessonLevel" NOT NULL DEFAULT 'BEGINNER',
    "experienceId" INTEGER,
    "beachId" INTEGER,
    "defaultLocaleCode" TEXT DEFAULT 'en',
    "duration" TEXT,
    "durationMinutes" INTEGER,
    "price" DECIMAL(10,2),
    "maxParticipants" INTEGER,
    "instructor" TEXT,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "metadata" JSONB,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Coach" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "profilePhotoUrl" TEXT,
    "shortBio" TEXT,
    "fullBio" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "specialization" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languages" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "email" TEXT,
    "phone" TEXT,
    "instagramUrl" TEXT,
    "facebookUrl" TEXT,
    "linkedinUrl" TEXT,
    "yearsExperience" INTEGER,
    "certifications" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "metadata" JSONB,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Coach_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LessonCoach" (
    "lessonId" INTEGER NOT NULL,
    "coachId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LessonCoach_pkey" PRIMARY KEY ("lessonId","coachId")
);

-- CreateTable
CREATE TABLE "public"."ExperienceBeach" (
    "experienceId" INTEGER NOT NULL,
    "beachId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperienceBeach_pkey" PRIMARY KEY ("experienceId","beachId")
);

-- CreateTable
CREATE TABLE "public"."CoachBeach" (
    "coachId" INTEGER NOT NULL,
    "beachId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachBeach_pkey" PRIMARY KEY ("coachId","beachId")
);

-- CreateTable
CREATE TABLE "public"."CoachExperience" (
    "coachId" INTEGER NOT NULL,
    "experienceId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachExperience_pkey" PRIMARY KEY ("coachId","experienceId")
);

-- CreateTable
CREATE TABLE "public"."CoachEvent" (
    "coachId" INTEGER NOT NULL,
    "eventId" INTEGER NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CoachEvent_pkey" PRIMARY KEY ("coachId","eventId")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "fullDescription" TEXT,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "galleryImageUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category" TEXT,
    "difficulty" "public"."EventDifficulty" NOT NULL DEFAULT 'ALL_LEVELS',
    "eventType" "public"."EventType" NOT NULL DEFAULT 'WORKSHOP',
    "locationName" TEXT,
    "googleMapsUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "eventStatus" "public"."EventStatus" NOT NULL DEFAULT 'DRAFT',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "beachId" INTEGER,
    "locationId" INTEGER,
    "defaultLocaleCode" TEXT DEFAULT 'en',
    "eventStartsAt" TIMESTAMP(3) NOT NULL,
    "eventEndsAt" TIMESTAMP(3),
    "registrationOpensAt" TIMESTAMP(3),
    "registrationClosesAt" TIMESTAMP(3),
    "startTimeLabel" TEXT,
    "endTimeLabel" TEXT,
    "capacityMin" INTEGER,
    "capacityMax" INTEGER,
    "currentParticipants" INTEGER NOT NULL DEFAULT 0,
    "instructorName" TEXT,
    "basePrice" DECIMAL(10,2),
    "discountPrice" DECIMAL(10,2),
    "currencyCode" "public"."CurrencyCode" NOT NULL DEFAULT 'INR',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "metaKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metadata" JSONB,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Booking" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "bookingStatus" "public"."BookingStatus" NOT NULL DEFAULT 'PENDING',
    "bookingType" "public"."BookingType" NOT NULL,
    "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "source" "public"."BookingSource" NOT NULL DEFAULT 'WEBSITE',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "emergencyContact" TEXT,
    "notes" TEXT,
    "internalNotes" TEXT,
    "assignedInstructor" TEXT,
    "participantCount" INTEGER NOT NULL DEFAULT 1,
    "bookingDate" TIMESTAMP(3) NOT NULL,
    "preferredTime" TEXT,
    "lessonId" INTEGER,
    "experienceId" INTEGER,
    "eventId" INTEGER,
    "beachId" INTEGER,
    "locationId" INTEGER,
    "localeCode" TEXT DEFAULT 'en',
    "paymentReference" TEXT,
    "couponCodeSnapshot" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BookingActivity" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "action" "public"."BookingActivityAction" NOT NULL,
    "oldStatus" "public"."BookingStatus",
    "newStatus" "public"."BookingStatus",
    "note" TEXT,
    "metadata" JSONB,
    "adminUserId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BookingActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Media" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "mediaType" "public"."MediaType" NOT NULL,
    "mimeType" TEXT,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "thumbnailPath" TEXT,
    "cloudinaryPublicId" TEXT,
    "cloudinaryThumbId" TEXT,
    "folderPath" TEXT NOT NULL DEFAULT 'library/general',
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "caption" TEXT,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "fileSizeBytes" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "durationSeconds" INTEGER,
    "altText" TEXT,
    "localeCode" TEXT DEFAULT 'en',
    "beachId" INTEGER,
    "metadata" JSONB,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GalleryCategory" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "coverImageUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GalleryCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GalleryImage" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "altText" TEXT,
    "caption" TEXT,
    "description" TEXT,
    "photographer" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "categoryId" INTEGER,
    "mediaId" INTEGER NOT NULL,
    "localeCode" TEXT DEFAULT 'en',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "capturedAt" TIMESTAMP(3),
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ContactMessage" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT,
    "name" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "status" "public"."ContactMessageStatus" NOT NULL DEFAULT 'NEW',
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'website',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FAQ" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "localeCode" TEXT DEFAULT 'en',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Testimonial" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "authorName" TEXT NOT NULL,
    "authorEmail" TEXT,
    "authorLocation" TEXT,
    "rating" INTEGER,
    "quote" TEXT NOT NULL,
    "localeCode" TEXT DEFAULT 'en',
    "coachId" INTEGER,
    "bookingId" INTEGER,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SEOPage" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "routePath" TEXT NOT NULL,
    "canonicalUrl" TEXT,
    "metaTitle" TEXT NOT NULL,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],
    "robots" TEXT,
    "openGraphTitle" TEXT,
    "openGraphDescription" TEXT,
    "openGraphImage" TEXT,
    "schemaJson" JSONB,
    "localeCode" TEXT DEFAULT 'en',
    "lessonId" INTEGER,
    "experienceId" INTEGER,
    "eventId" INTEGER,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SEOPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SiteSetting" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "settingKey" TEXT NOT NULL,
    "settingType" "public"."SiteSettingType" NOT NULL DEFAULT 'STRING',
    "valueString" TEXT,
    "valueNumber" DECIMAL(14,4),
    "valueBoolean" BOOLEAN,
    "valueJson" JSONB,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Navigation" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "navigationType" "public"."NavigationType" NOT NULL DEFAULT 'HEADER',
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "icon" TEXT,
    "parentId" INTEGER,
    "localeCode" TEXT DEFAULT 'en',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Navigation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FooterLink" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "publishStatus" "public"."PublishStatus" NOT NULL DEFAULT 'DRAFT',
    "visibility" "public"."Visibility" NOT NULL DEFAULT 'PUBLIC',
    "section" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "icon" TEXT,
    "localeCode" TEXT DEFAULT 'en',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdById" INTEGER,
    "updatedById" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FooterLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Locale_uuid_key" ON "public"."Locale"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Locale_code_key" ON "public"."Locale"("code");

-- CreateIndex
CREATE INDEX "Locale_status_idx" ON "public"."Locale"("status");

-- CreateIndex
CREATE INDEX "Locale_deletedAt_idx" ON "public"."Locale"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Beach_uuid_key" ON "public"."Beach"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Beach_slug_key" ON "public"."Beach"("slug");

-- CreateIndex
CREATE INDEX "Beach_status_idx" ON "public"."Beach"("status");

-- CreateIndex
CREATE INDEX "Beach_deletedAt_idx" ON "public"."Beach"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Location_uuid_key" ON "public"."Location"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "public"."Location"("slug");

-- CreateIndex
CREATE INDEX "Location_status_idx" ON "public"."Location"("status");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "public"."Location"("city");

-- CreateIndex
CREATE INDEX "Location_deletedAt_idx" ON "public"."Location"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_uuid_key" ON "public"."AdminUser"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_slug_key" ON "public"."AdminUser"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUser_email_key" ON "public"."AdminUser"("email");

-- CreateIndex
CREATE INDEX "AdminUser_status_idx" ON "public"."AdminUser"("status");

-- CreateIndex
CREATE INDEX "AdminUser_userRole_idx" ON "public"."AdminUser"("userRole");

-- CreateIndex
CREATE INDEX "AdminUser_deletedAt_idx" ON "public"."AdminUser"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_uuid_key" ON "public"."AdminSession"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_slug_key" ON "public"."AdminSession"("slug");

-- CreateIndex
CREATE INDEX "AdminSession_adminUserId_idx" ON "public"."AdminSession"("adminUserId");

-- CreateIndex
CREATE INDEX "AdminSession_expiresAt_idx" ON "public"."AdminSession"("expiresAt");

-- CreateIndex
CREATE INDEX "AdminSession_status_idx" ON "public"."AdminSession"("status");

-- CreateIndex
CREATE INDEX "AdminSession_revokedAt_idx" ON "public"."AdminSession"("revokedAt");

-- CreateIndex
CREATE INDEX "AdminSession_deletedAt_idx" ON "public"."AdminSession"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Role_uuid_key" ON "public"."Role"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Role_slug_key" ON "public"."Role"("slug");

-- CreateIndex
CREATE INDEX "Role_status_idx" ON "public"."Role"("status");

-- CreateIndex
CREATE INDEX "Role_deletedAt_idx" ON "public"."Role"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_uuid_key" ON "public"."Permission"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_slug_key" ON "public"."Permission"("slug");

-- CreateIndex
CREATE INDEX "Permission_status_idx" ON "public"."Permission"("status");

-- CreateIndex
CREATE INDEX "Permission_deletedAt_idx" ON "public"."Permission"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_resource_action_key" ON "public"."Permission"("resource", "action");

-- CreateIndex
CREATE INDEX "AdminUserRole_roleId_idx" ON "public"."AdminUserRole"("roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "public"."RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceCategory_uuid_key" ON "public"."ExperienceCategory"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceCategory_slug_key" ON "public"."ExperienceCategory"("slug");

-- CreateIndex
CREATE INDEX "ExperienceCategory_status_idx" ON "public"."ExperienceCategory"("status");

-- CreateIndex
CREATE INDEX "ExperienceCategory_sortOrder_idx" ON "public"."ExperienceCategory"("sortOrder");

-- CreateIndex
CREATE INDEX "ExperienceCategory_deletedAt_idx" ON "public"."ExperienceCategory"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_uuid_key" ON "public"."Experience"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Experience_slug_key" ON "public"."Experience"("slug");

-- CreateIndex
CREATE INDEX "Experience_status_idx" ON "public"."Experience"("status");

-- CreateIndex
CREATE INDEX "Experience_publishStatus_idx" ON "public"."Experience"("publishStatus");

-- CreateIndex
CREATE INDEX "Experience_visibility_idx" ON "public"."Experience"("visibility");

-- CreateIndex
CREATE INDEX "Experience_difficulty_idx" ON "public"."Experience"("difficulty");

-- CreateIndex
CREATE INDEX "Experience_isFeatured_idx" ON "public"."Experience"("isFeatured");

-- CreateIndex
CREATE INDEX "Experience_displayOrder_idx" ON "public"."Experience"("displayOrder");

-- CreateIndex
CREATE INDEX "Experience_categoryId_idx" ON "public"."Experience"("categoryId");

-- CreateIndex
CREATE INDEX "Experience_deletedAt_idx" ON "public"."Experience"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_uuid_key" ON "public"."Lesson"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Lesson_slug_key" ON "public"."Lesson"("slug");

-- CreateIndex
CREATE INDEX "Lesson_status_idx" ON "public"."Lesson"("status");

-- CreateIndex
CREATE INDEX "Lesson_publishStatus_idx" ON "public"."Lesson"("publishStatus");

-- CreateIndex
CREATE INDEX "Lesson_visibility_idx" ON "public"."Lesson"("visibility");

-- CreateIndex
CREATE INDEX "Lesson_level_idx" ON "public"."Lesson"("level");

-- CreateIndex
CREATE INDEX "Lesson_difficulty_idx" ON "public"."Lesson"("difficulty");

-- CreateIndex
CREATE INDEX "Lesson_isFeatured_idx" ON "public"."Lesson"("isFeatured");

-- CreateIndex
CREATE INDEX "Lesson_displayOrder_idx" ON "public"."Lesson"("displayOrder");

-- CreateIndex
CREATE INDEX "Lesson_experienceId_idx" ON "public"."Lesson"("experienceId");

-- CreateIndex
CREATE INDEX "Lesson_beachId_idx" ON "public"."Lesson"("beachId");

-- CreateIndex
CREATE INDEX "Lesson_deletedAt_idx" ON "public"."Lesson"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_uuid_key" ON "public"."Coach"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_slug_key" ON "public"."Coach"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Coach_email_key" ON "public"."Coach"("email");

-- CreateIndex
CREATE INDEX "Coach_status_idx" ON "public"."Coach"("status");

-- CreateIndex
CREATE INDEX "Coach_publishStatus_idx" ON "public"."Coach"("publishStatus");

-- CreateIndex
CREATE INDEX "Coach_isFeatured_idx" ON "public"."Coach"("isFeatured");

-- CreateIndex
CREATE INDEX "Coach_displayOrder_idx" ON "public"."Coach"("displayOrder");

-- CreateIndex
CREATE INDEX "Coach_deletedAt_idx" ON "public"."Coach"("deletedAt");

-- CreateIndex
CREATE INDEX "LessonCoach_coachId_idx" ON "public"."LessonCoach"("coachId");

-- CreateIndex
CREATE INDEX "ExperienceBeach_beachId_idx" ON "public"."ExperienceBeach"("beachId");

-- CreateIndex
CREATE INDEX "CoachBeach_beachId_idx" ON "public"."CoachBeach"("beachId");

-- CreateIndex
CREATE INDEX "CoachExperience_experienceId_idx" ON "public"."CoachExperience"("experienceId");

-- CreateIndex
CREATE INDEX "CoachEvent_eventId_idx" ON "public"."CoachEvent"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "Event_uuid_key" ON "public"."Event"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "public"."Event"("slug");

-- CreateIndex
CREATE INDEX "Event_status_idx" ON "public"."Event"("status");

-- CreateIndex
CREATE INDEX "Event_eventStatus_idx" ON "public"."Event"("eventStatus");

-- CreateIndex
CREATE INDEX "Event_publishStatus_idx" ON "public"."Event"("publishStatus");

-- CreateIndex
CREATE INDEX "Event_isFeatured_idx" ON "public"."Event"("isFeatured");

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "public"."Event"("category");

-- CreateIndex
CREATE INDEX "Event_instructorName_idx" ON "public"."Event"("instructorName");

-- CreateIndex
CREATE INDEX "Event_eventStartsAt_idx" ON "public"."Event"("eventStartsAt");

-- CreateIndex
CREATE INDEX "Event_registrationClosesAt_idx" ON "public"."Event"("registrationClosesAt");

-- CreateIndex
CREATE INDEX "Event_beachId_idx" ON "public"."Event"("beachId");

-- CreateIndex
CREATE INDEX "Event_locationId_idx" ON "public"."Event"("locationId");

-- CreateIndex
CREATE INDEX "Event_deletedAt_idx" ON "public"."Event"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_uuid_key" ON "public"."Booking"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_slug_key" ON "public"."Booking"("slug");

-- CreateIndex
CREATE INDEX "Booking_status_idx" ON "public"."Booking"("status");

-- CreateIndex
CREATE INDEX "Booking_bookingStatus_idx" ON "public"."Booking"("bookingStatus");

-- CreateIndex
CREATE INDEX "Booking_bookingType_idx" ON "public"."Booking"("bookingType");

-- CreateIndex
CREATE INDEX "Booking_paymentStatus_idx" ON "public"."Booking"("paymentStatus");

-- CreateIndex
CREATE INDEX "Booking_email_idx" ON "public"."Booking"("email");

-- CreateIndex
CREATE INDEX "Booking_assignedInstructor_idx" ON "public"."Booking"("assignedInstructor");

-- CreateIndex
CREATE INDEX "Booking_bookingDate_idx" ON "public"."Booking"("bookingDate");

-- CreateIndex
CREATE INDEX "Booking_eventId_idx" ON "public"."Booking"("eventId");

-- CreateIndex
CREATE INDEX "Booking_lessonId_idx" ON "public"."Booking"("lessonId");

-- CreateIndex
CREATE INDEX "Booking_experienceId_idx" ON "public"."Booking"("experienceId");

-- CreateIndex
CREATE INDEX "Booking_deletedAt_idx" ON "public"."Booking"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BookingActivity_uuid_key" ON "public"."BookingActivity"("uuid");

-- CreateIndex
CREATE INDEX "BookingActivity_bookingId_idx" ON "public"."BookingActivity"("bookingId");

-- CreateIndex
CREATE INDEX "BookingActivity_action_idx" ON "public"."BookingActivity"("action");

-- CreateIndex
CREATE INDEX "BookingActivity_createdAt_idx" ON "public"."BookingActivity"("createdAt");

-- CreateIndex
CREATE INDEX "BookingActivity_adminUserId_idx" ON "public"."BookingActivity"("adminUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Media_uuid_key" ON "public"."Media"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Media_slug_key" ON "public"."Media"("slug");

-- CreateIndex
CREATE INDEX "Media_status_idx" ON "public"."Media"("status");

-- CreateIndex
CREATE INDEX "Media_publishStatus_idx" ON "public"."Media"("publishStatus");

-- CreateIndex
CREATE INDEX "Media_visibility_idx" ON "public"."Media"("visibility");

-- CreateIndex
CREATE INDEX "Media_mediaType_idx" ON "public"."Media"("mediaType");

-- CreateIndex
CREATE INDEX "Media_folderPath_idx" ON "public"."Media"("folderPath");

-- CreateIndex
CREATE INDEX "Media_createdById_idx" ON "public"."Media"("createdById");

-- CreateIndex
CREATE INDEX "Media_usageCount_idx" ON "public"."Media"("usageCount");

-- CreateIndex
CREATE INDEX "Media_createdAt_idx" ON "public"."Media"("createdAt");

-- CreateIndex
CREATE INDEX "Media_deletedAt_idx" ON "public"."Media"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCategory_uuid_key" ON "public"."GalleryCategory"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryCategory_slug_key" ON "public"."GalleryCategory"("slug");

-- CreateIndex
CREATE INDEX "GalleryCategory_status_idx" ON "public"."GalleryCategory"("status");

-- CreateIndex
CREATE INDEX "GalleryCategory_publishStatus_idx" ON "public"."GalleryCategory"("publishStatus");

-- CreateIndex
CREATE INDEX "GalleryCategory_isFeatured_idx" ON "public"."GalleryCategory"("isFeatured");

-- CreateIndex
CREATE INDEX "GalleryCategory_sortOrder_idx" ON "public"."GalleryCategory"("sortOrder");

-- CreateIndex
CREATE INDEX "GalleryCategory_deletedAt_idx" ON "public"."GalleryCategory"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_uuid_key" ON "public"."GalleryImage"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "GalleryImage_slug_key" ON "public"."GalleryImage"("slug");

-- CreateIndex
CREATE INDEX "GalleryImage_status_idx" ON "public"."GalleryImage"("status");

-- CreateIndex
CREATE INDEX "GalleryImage_publishStatus_idx" ON "public"."GalleryImage"("publishStatus");

-- CreateIndex
CREATE INDEX "GalleryImage_isFeatured_idx" ON "public"."GalleryImage"("isFeatured");

-- CreateIndex
CREATE INDEX "GalleryImage_categoryId_idx" ON "public"."GalleryImage"("categoryId");

-- CreateIndex
CREATE INDEX "GalleryImage_sortOrder_idx" ON "public"."GalleryImage"("sortOrder");

-- CreateIndex
CREATE INDEX "GalleryImage_capturedAt_idx" ON "public"."GalleryImage"("capturedAt");

-- CreateIndex
CREATE INDEX "GalleryImage_deletedAt_idx" ON "public"."GalleryImage"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ContactMessage_uuid_key" ON "public"."ContactMessage"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "ContactMessage_slug_key" ON "public"."ContactMessage"("slug");

-- CreateIndex
CREATE INDEX "ContactMessage_status_idx" ON "public"."ContactMessage"("status");

-- CreateIndex
CREATE INDEX "ContactMessage_email_idx" ON "public"."ContactMessage"("email");

-- CreateIndex
CREATE INDEX "ContactMessage_createdAt_idx" ON "public"."ContactMessage"("createdAt");

-- CreateIndex
CREATE INDEX "ContactMessage_deletedAt_idx" ON "public"."ContactMessage"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FAQ_uuid_key" ON "public"."FAQ"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "FAQ_slug_key" ON "public"."FAQ"("slug");

-- CreateIndex
CREATE INDEX "FAQ_status_idx" ON "public"."FAQ"("status");

-- CreateIndex
CREATE INDEX "FAQ_publishStatus_idx" ON "public"."FAQ"("publishStatus");

-- CreateIndex
CREATE INDEX "FAQ_sortOrder_idx" ON "public"."FAQ"("sortOrder");

-- CreateIndex
CREATE INDEX "FAQ_deletedAt_idx" ON "public"."FAQ"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Testimonial_uuid_key" ON "public"."Testimonial"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Testimonial_slug_key" ON "public"."Testimonial"("slug");

-- CreateIndex
CREATE INDEX "Testimonial_status_idx" ON "public"."Testimonial"("status");

-- CreateIndex
CREATE INDEX "Testimonial_publishStatus_idx" ON "public"."Testimonial"("publishStatus");

-- CreateIndex
CREATE INDEX "Testimonial_rating_idx" ON "public"."Testimonial"("rating");

-- CreateIndex
CREATE INDEX "Testimonial_coachId_idx" ON "public"."Testimonial"("coachId");

-- CreateIndex
CREATE INDEX "Testimonial_deletedAt_idx" ON "public"."Testimonial"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SEOPage_uuid_key" ON "public"."SEOPage"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SEOPage_slug_key" ON "public"."SEOPage"("slug");

-- CreateIndex
CREATE INDEX "SEOPage_status_idx" ON "public"."SEOPage"("status");

-- CreateIndex
CREATE INDEX "SEOPage_publishStatus_idx" ON "public"."SEOPage"("publishStatus");

-- CreateIndex
CREATE INDEX "SEOPage_deletedAt_idx" ON "public"."SEOPage"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SEOPage_routePath_localeCode_key" ON "public"."SEOPage"("routePath", "localeCode");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_uuid_key" ON "public"."SiteSetting"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_slug_key" ON "public"."SiteSetting"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "SiteSetting_settingKey_key" ON "public"."SiteSetting"("settingKey");

-- CreateIndex
CREATE INDEX "SiteSetting_status_idx" ON "public"."SiteSetting"("status");

-- CreateIndex
CREATE INDEX "SiteSetting_isPublic_idx" ON "public"."SiteSetting"("isPublic");

-- CreateIndex
CREATE INDEX "SiteSetting_deletedAt_idx" ON "public"."SiteSetting"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Navigation_uuid_key" ON "public"."Navigation"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Navigation_slug_key" ON "public"."Navigation"("slug");

-- CreateIndex
CREATE INDEX "Navigation_status_idx" ON "public"."Navigation"("status");

-- CreateIndex
CREATE INDEX "Navigation_publishStatus_idx" ON "public"."Navigation"("publishStatus");

-- CreateIndex
CREATE INDEX "Navigation_navigationType_idx" ON "public"."Navigation"("navigationType");

-- CreateIndex
CREATE INDEX "Navigation_parentId_idx" ON "public"."Navigation"("parentId");

-- CreateIndex
CREATE INDEX "Navigation_sortOrder_idx" ON "public"."Navigation"("sortOrder");

-- CreateIndex
CREATE INDEX "Navigation_deletedAt_idx" ON "public"."Navigation"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FooterLink_uuid_key" ON "public"."FooterLink"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "FooterLink_slug_key" ON "public"."FooterLink"("slug");

-- CreateIndex
CREATE INDEX "FooterLink_status_idx" ON "public"."FooterLink"("status");

-- CreateIndex
CREATE INDEX "FooterLink_publishStatus_idx" ON "public"."FooterLink"("publishStatus");

-- CreateIndex
CREATE INDEX "FooterLink_section_idx" ON "public"."FooterLink"("section");

-- CreateIndex
CREATE INDEX "FooterLink_sortOrder_idx" ON "public"."FooterLink"("sortOrder");

-- CreateIndex
CREATE INDEX "FooterLink_deletedAt_idx" ON "public"."FooterLink"("deletedAt");

-- AddForeignKey
ALTER TABLE "public"."AdminSession" ADD CONSTRAINT "AdminSession_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "public"."AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminUserRole" ADD CONSTRAINT "AdminUserRole_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "public"."AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdminUserRole" ADD CONSTRAINT "AdminUserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "public"."Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "public"."Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Experience" ADD CONSTRAINT "Experience_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."ExperienceCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Experience" ADD CONSTRAINT "Experience_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Experience" ADD CONSTRAINT "Experience_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_beachId_fkey" FOREIGN KEY ("beachId") REFERENCES "public"."Beach"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Lesson" ADD CONSTRAINT "Lesson_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Coach" ADD CONSTRAINT "Coach_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Coach" ADD CONSTRAINT "Coach_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LessonCoach" ADD CONSTRAINT "LessonCoach_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LessonCoach" ADD CONSTRAINT "LessonCoach_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "public"."Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExperienceBeach" ADD CONSTRAINT "ExperienceBeach_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExperienceBeach" ADD CONSTRAINT "ExperienceBeach_beachId_fkey" FOREIGN KEY ("beachId") REFERENCES "public"."Beach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoachBeach" ADD CONSTRAINT "CoachBeach_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "public"."Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoachBeach" ADD CONSTRAINT "CoachBeach_beachId_fkey" FOREIGN KEY ("beachId") REFERENCES "public"."Beach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoachExperience" ADD CONSTRAINT "CoachExperience_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "public"."Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoachExperience" ADD CONSTRAINT "CoachExperience_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoachEvent" ADD CONSTRAINT "CoachEvent_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "public"."Coach"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CoachEvent" ADD CONSTRAINT "CoachEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_beachId_fkey" FOREIGN KEY ("beachId") REFERENCES "public"."Beach"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Event" ADD CONSTRAINT "Event_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_beachId_fkey" FOREIGN KEY ("beachId") REFERENCES "public"."Beach"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "public"."Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingActivity" ADD CONSTRAINT "BookingActivity_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BookingActivity" ADD CONSTRAINT "BookingActivity_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_beachId_fkey" FOREIGN KEY ("beachId") REFERENCES "public"."Beach"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Media" ADD CONSTRAINT "Media_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GalleryImage" ADD CONSTRAINT "GalleryImage_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."GalleryCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GalleryImage" ADD CONSTRAINT "GalleryImage_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "public"."Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GalleryImage" ADD CONSTRAINT "GalleryImage_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "public"."Locale"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GalleryImage" ADD CONSTRAINT "GalleryImage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GalleryImage" ADD CONSTRAINT "GalleryImage_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "public"."Locale"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FAQ" ADD CONSTRAINT "FAQ_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonial" ADD CONSTRAINT "Testimonial_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "public"."Locale"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonial" ADD CONSTRAINT "Testimonial_coachId_fkey" FOREIGN KEY ("coachId") REFERENCES "public"."Coach"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonial" ADD CONSTRAINT "Testimonial_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "public"."Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonial" ADD CONSTRAINT "Testimonial_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Testimonial" ADD CONSTRAINT "Testimonial_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SEOPage" ADD CONSTRAINT "SEOPage_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "public"."Locale"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SEOPage" ADD CONSTRAINT "SEOPage_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "public"."Lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SEOPage" ADD CONSTRAINT "SEOPage_experienceId_fkey" FOREIGN KEY ("experienceId") REFERENCES "public"."Experience"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SEOPage" ADD CONSTRAINT "SEOPage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "public"."Event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SEOPage" ADD CONSTRAINT "SEOPage_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SEOPage" ADD CONSTRAINT "SEOPage_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SiteSetting" ADD CONSTRAINT "SiteSetting_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SiteSetting" ADD CONSTRAINT "SiteSetting_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Navigation" ADD CONSTRAINT "Navigation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Navigation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Navigation" ADD CONSTRAINT "Navigation_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "public"."Locale"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Navigation" ADD CONSTRAINT "Navigation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Navigation" ADD CONSTRAINT "Navigation_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FooterLink" ADD CONSTRAINT "FooterLink_localeCode_fkey" FOREIGN KEY ("localeCode") REFERENCES "public"."Locale"("code") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FooterLink" ADD CONSTRAINT "FooterLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FooterLink" ADD CONSTRAINT "FooterLink_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "public"."AdminUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;
