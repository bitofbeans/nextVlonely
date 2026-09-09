import { integer, pgTable, varchar, text } from "drizzle-orm/pg-core";

export const showsTable = pgTable("shows", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar({ length: 255 }).notNull(),
  venue: varchar({ length: 255 }).notNull(),
  date: varchar({ length: 255 }).notNull(),
  imageUrl: text().notNull(),
  ticketUrl: text(),
  description: text().notNull(),
});
export const artistsTable = pgTable("artists", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull(),
  pfpUrl: text().notNull(),
  instagramHandle: text(),
  instagramUrl: text(),
  description: text().notNull(),
});
export const showsArtistsTable = pgTable("shows_artists", {
  showID: integer().notNull(),
  artistID: integer().notNull(),
  position: integer().notNull(),
});



// On update, use `npx drizzle-kit push`