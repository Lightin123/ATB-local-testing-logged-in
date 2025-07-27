-- CreateTable
CREATE TABLE "contact_requests" (
  "id" SERIAL PRIMARY KEY,
  "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT NOW(),
  "first_name" TEXT NOT NULL,
  "last_name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "board_positions" TEXT[] NOT NULL,
  "community_name" TEXT,
  "community_location" TEXT,
  "community_description" TEXT,
  "referral_source" TEXT,
  "number_of_units" INTEGER,
  "property_type" TEXT NOT NULL
);
