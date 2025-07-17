CREATE TABLE `business_analysis` (
	`id` text PRIMARY KEY NOT NULL,
	`business_name` text NOT NULL,
	`industry` text,
	`website_url` text,
	`social_links` text,
	`analysis_results` text,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `contacts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text,
	`phone` text,
	`company` text,
	`position` text,
	`status` text DEFAULT 'lead',
	`score` integer,
	`last_contact` integer,
	`notes` text,
	`industry` text,
	`location` text,
	`favorite` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `content_items` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`type` text NOT NULL,
	`url` text NOT NULL,
	`metadata` text,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `deals` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`value` real DEFAULT 0,
	`stage` text NOT NULL,
	`company` text NOT NULL,
	`contact` text NOT NULL,
	`contact_id` text,
	`probability` real DEFAULT 0,
	`priority` text,
	`notes` text,
	`due_date` text,
	`expected_close_date` text,
	`lost_reason` text,
	`products` text,
	`competitors` text,
	`decision_makers` text,
	`last_activity_date` integer,
	`assigned_to` text,
	`currency` text DEFAULT 'USD',
	`discount_amount` real DEFAULT 0,
	`discount_percentage` real DEFAULT 0,
	`next_steps` text,
	`ai_insights` text,
	`days_in_stage` integer DEFAULT 0,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`contact_id`) REFERENCES `contacts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`completed` integer DEFAULT false,
	`due_date` integer,
	`priority` text DEFAULT 'medium',
	`category` text DEFAULT 'other',
	`related_to_type` text,
	`related_to_id` text,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password` text,
	`first_name` text,
	`last_name` text,
	`full_name` text,
	`profile_image_url` text,
	`job_title` text,
	`company` text,
	`phone` text,
	`timezone` text,
	`preferences` text,
	`social_links` text,
	`account_status` text DEFAULT 'active',
	`email_verified` integer DEFAULT false,
	`auth_provider` text DEFAULT 'email',
	`subscription_status` text DEFAULT 'free',
	`subscription_plan` text DEFAULT 'basic',
	`subscription_start_date` integer,
	`subscription_end_date` integer,
	`payment_status` text DEFAULT 'none',
	`is_admin` integer DEFAULT false,
	`role` text DEFAULT 'user',
	`last_login_at` integer,
	`login_attempts` integer DEFAULT 0,
	`locked_until` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);--> statement-breakpoint
CREATE TABLE `voice_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`voice_id` text NOT NULL,
	`settings` text,
	`created_at` integer,
	`updated_at` integer,
	`user_id` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
