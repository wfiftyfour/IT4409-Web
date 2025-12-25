-- AlterTable
ALTER TABLE `Conversation` ADD COLUMN `workspaceId` VARCHAR(191) NULL;

-- CreateIndex
CREATE INDEX `Conversation_workspaceId_idx` ON `Conversation`(`workspaceId`);

-- AddForeignKey
ALTER TABLE `Conversation` ADD CONSTRAINT `Conversation_workspaceId_fkey` FOREIGN KEY (`workspaceId`) REFERENCES `Workspace`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
