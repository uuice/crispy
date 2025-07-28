-- Add performance indexes for better query performance
-- This migration adds indexes to improve query speed

-- Articles table indexes
ALTER TABLE `articles` ADD INDEX `idx_status` (`status`);
ALTER TABLE `articles` ADD INDEX `idx_type_id` (`type_id`);
ALTER TABLE `articles` ADD INDEX `idx_create_time` (`create_time`);
ALTER TABLE `articles` ADD INDEX `idx_status_create_time` (`status`, `create_time`);
ALTER TABLE `articles` ADD INDEX `idx_type_id_status` (`type_id`, `status`);
ALTER TABLE `articles` ADD INDEX `idx_url` (`url`);
ALTER TABLE `articles` ADD INDEX `idx_tags` (`tags`);

-- Categories table indexes
ALTER TABLE `categories` ADD INDEX `idx_parent_id` (`parent_id`);
ALTER TABLE `categories` ADD INDEX `idx_status` (`status`);
ALTER TABLE `categories` ADD INDEX `idx_alias` (`alias`);

-- Tags table indexes
ALTER TABLE `tags` ADD INDEX `idx_status` (`status`);
ALTER TABLE `tags` ADD INDEX `idx_type_id` (`type_id`);
ALTER TABLE `tags` ADD INDEX `idx_sort` (`sort`);

-- Pages table indexes
ALTER TABLE `pages` ADD INDEX `idx_status` (`status`);
ALTER TABLE `pages` ADD INDEX `idx_create_time` (`create_time`);
ALTER TABLE `pages` ADD INDEX `idx_url` (`url`);

-- Caches table indexes
ALTER TABLE `caches` ADD INDEX `idx_hash` (`hash`);
ALTER TABLE `caches` ADD INDEX `idx_status` (`status`);
ALTER TABLE `caches` ADD INDEX `idx_create_time` (`create_time`);

-- Users table indexes
ALTER TABLE `users` ADD INDEX `idx_status` (`status`);
ALTER TABLE `users` ADD INDEX `idx_role_id` (`role_id`);

-- Comments table indexes
ALTER TABLE `comments` ADD INDEX `idx_status` (`status`);
ALTER TABLE `comments` ADD INDEX `idx_create_time` (`create_time`);
