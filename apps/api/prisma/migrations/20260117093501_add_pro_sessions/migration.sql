-- CreateTable
CREATE TABLE "WeeklySession" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "youtubeUrl" TEXT NOT NULL,
    "sessionDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklySession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionTopic" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "timestamp" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "SessionTopic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WeeklySession_sessionDate_idx" ON "WeeklySession"("sessionDate");

-- CreateIndex
CREATE INDEX "WeeklySession_createdAt_idx" ON "WeeklySession"("createdAt");

-- CreateIndex
CREATE INDEX "SessionTopic_sessionId_order_idx" ON "SessionTopic"("sessionId", "order");

-- AddForeignKey
ALTER TABLE "SessionTopic" ADD CONSTRAINT "SessionTopic_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "WeeklySession"("id") ON DELETE CASCADE ON UPDATE CASCADE;
