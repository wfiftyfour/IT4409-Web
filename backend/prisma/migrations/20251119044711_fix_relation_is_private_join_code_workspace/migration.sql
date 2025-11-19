/*
  Warnings:

  - You are about to drop the `JoinRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `JoinRequest` DROP FOREIGN KEY `JoinRequest_channelId_fkey`;

-- DropForeignKey
ALTER TABLE `JoinRequest` DROP FOREIGN KEY `JoinRequest_reviewedBy_fkey`;

-- DropForeignKey
ALTER TABLE `JoinRequest` DROP FOREIGN KEY `JoinRequest_userId_fkey`;

-- DropTable
DROP TABLE `JoinRequest`;

-- CreateTable
CREATE TABLE `WorkspaceJoinRequest` (
    `id` VARCHAR(191) NOT NULL,
    `workspaceId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` VARCHAR(191) NULL,

    INDEX `WorkspaceJoinRequest_workspaceId_userId_status_idx`(`workspaceId`, `userId`, `status`),
    INDEX `WorkspaceJoinRequest_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChannelJoinRequest` (
    `id` VARCHAR(191) NOT NULL,
    `channelId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `reviewedAt` DATETIME(3) NULL,
    `reviewedBy` VARCHAR(191) NULL,

    INDEX `ChannelJoinRequest_channelId_userId_status_idx`(`channelId`, `userId`, `status`),
    INDEX `ChannelJoinRequest_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkspaceJoinRequest` ADD CONSTRAINT `WorkspaceJoinRequest_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkspaceJoinRequest` ADD CONSTRAINT `WorkspaceJoinRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkspaceJoinRequest` ADD CONSTRAINT `WorkspaceJoinRequest_reviewedBy_fkey` FOREIGN KEY (`reviewedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChannelJoinRequest` ADD CONSTRAINT `ChannelJoinRequest_channelId_fkey` FOREIGN KEY (`channelId`) REFERENCES `Channel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChannelJoinRequest` ADD CONSTRAINT `ChannelJoinRequest_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChannelJoinRequest` ADD CONSTRAINT `ChannelJoinRequest_reviewedBy_fkey` FOREIGN KEY (`reviewedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
