/*
  Warnings:

  - A unique constraint covering the columns `[phone,eventId]` on the table `Inscription` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Inscription_phone_key";

-- CreateIndex
CREATE UNIQUE INDEX "Inscription_phone_eventId_key" ON "public"."Inscription"("phone", "eventId");
