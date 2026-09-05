import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

export const showsTable = pgTable("shows", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  venue: varchar({ length: 255 }).notNull(),
  date: varchar({ length: 255 }).notNull(),
  imageUrl: text(),
  ticketUrl: text(),
  description: text().notNull(),
});

// On update, use `npx drizzle-kit push`