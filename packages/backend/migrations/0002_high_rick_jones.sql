CREATE TABLE `meta` (
	`id` integer PRIMARY KEY DEFAULT 0 NOT NULL,
	`revision` text NOT NULL,
	CONSTRAINT "id" CHECK("meta"."id" = 0)
);
