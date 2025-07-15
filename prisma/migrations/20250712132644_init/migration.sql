-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('track', 'identify', 'alias', 'screen', 'page');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('string', 'number', 'boolean');

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "description" TEXT NOT NULL,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "PropertyType" NOT NULL,
    "description" TEXT NOT NULL,
    "validationRules" JSONB,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingPlan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TrackingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TrackingPlanEvent" (
    "id" TEXT NOT NULL,
    "trackingPlanId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "additionalProperties" BOOLEAN NOT NULL,

    CONSTRAINT "TrackingPlanEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventProperty" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL,

    CONSTRAINT "EventProperty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Event_name_type_key" ON "Event"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Property_name_type_key" ON "Property"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "TrackingPlan_name_key" ON "TrackingPlan"("name");

-- AddForeignKey
ALTER TABLE "TrackingPlanEvent" ADD CONSTRAINT "TrackingPlanEvent_trackingPlanId_fkey" FOREIGN KEY ("trackingPlanId") REFERENCES "TrackingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrackingPlanEvent" ADD CONSTRAINT "TrackingPlanEvent_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProperty" ADD CONSTRAINT "EventProperty_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventProperty" ADD CONSTRAINT "EventProperty_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
