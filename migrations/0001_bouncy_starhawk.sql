CREATE TABLE `results` (
	`duration` integer,
	`run_id` text NOT NULL,
	`status` text NOT NULL,
	`test_name` text NOT NULL,
	PRIMARY KEY(`run_id`, `test_name`),
	FOREIGN KEY (`run_id`) REFERENCES `runs`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `runs` (
	`commit` text NOT NULL,
	`id` text PRIMARY KEY NOT NULL,
	`started_at` integer NOT NULL
);
--> statement-breakpoint
DROP TABLE `users`;