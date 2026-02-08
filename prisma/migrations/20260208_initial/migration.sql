-- Initial schema migration for PostgreSQL
-- Generated manually to match prisma/schema.prisma

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table
CREATE TABLE "User" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "email" text NOT NULL,
  "passwordHash" text NOT NULL,
  "friendCode" text NOT NULL,
  "username" text,
  "displayName" text,
  "vibeEmoji" text,
  "vibeLabel" text,
  "statusMessage" text,
  "statusUpdatedAt" timestamptz NOT NULL DEFAULT now(),
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User.email_unique" ON "User" ("email");
CREATE UNIQUE INDEX "User.friendCode_unique" ON "User" ("friendCode");
CREATE UNIQUE INDEX "User.username_unique" ON "User" ("username");

-- Friendship table
CREATE TABLE "Friendship" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "userAId" uuid NOT NULL,
  "userBId" uuid NOT NULL,
  "createdAt" timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Friendship.userAId_userBId_unique" ON "Friendship" ("userAId", "userBId");

-- Foreign keys
ALTER TABLE "Friendship"
  ADD CONSTRAINT "Friendship_userA_fkey" FOREIGN KEY ("userAId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Friendship"
  ADD CONSTRAINT "Friendship_userB_fkey" FOREIGN KEY ("userBId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE;
