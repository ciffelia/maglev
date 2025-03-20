import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const runs = sqliteTable("runs", {
  commit: text("commit").notNull(),
  id: text("id").primaryKey(),
  started_at: integer("started_at").notNull(),
});

export const results = sqliteTable(
  "results",
  {
    duration: integer("duration"),
    run_id: text("run_id")
      .notNull()
      .references(() => runs.id),
    status: text("status", {
      enum: ["running", "success", "failure"],
    }).notNull(),
    test_name: text("test_name").notNull(),
  },
  (table) => [primaryKey({ columns: [table.run_id, table.test_name] })],
);
