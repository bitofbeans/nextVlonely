import { sql } from "drizzle-orm";
import { 
  check, integer, pgTable, 
  varchar, text, serial, 
  timestamp, primaryKey, unique,
  type AnyPgColumn
} from "drizzle-orm/pg-core";

export const showsTable = pgTable(
  "shows", 
  {
    id: serial().primaryKey(),
    title: varchar({ length: 255 }).notNull(),
    description: text().notNull(),
    venue: varchar({ length: 255 }).notNull(),
    date: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    timezone: text().notNull().default("America/Chicago"),
    ticketUrl: text("ticket_url"),
    posterMediaID: integer("poster_media_id")
      .references((): AnyPgColumn => mediaTable.id, { onDelete: "set null" }), // media deleted -> show poster null
  }
);

export const artistsTable = pgTable("artists", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(),
  profileMediaID: integer("profile_media_id")
    .references(() => mediaTable.id),
  instagramHandle: text("instagram_handle"),
  instagramUrl: text("instagram_url"),
  description: text().notNull(),
});

export const showsArtistsTable = pgTable(
  "shows_artists", 
  {
    showID: integer("show_id")
      .notNull()
      .references(() => showsTable.id, { onDelete: "cascade"}), // foreign constraint --> show must exist in shows table 
    artistID: integer("artist_id")
      .notNull()
      .references(() => artistsTable.id),
    position: integer().notNull(),
  },
  (table) => [
      primaryKey({
        columns: [table.showID, table.artistID]
      }),
      unique("shows_artists_show_position_unique") // positions are unique per show, no artists can both have one position
        .on(table.showID, table.position),
      check("show_artsits_position_positive", sql`${table.position} >= 1`)

  ]);

export const mediaTable = pgTable("media", {
  id: serial().primaryKey(),
  objectKey: text("object_key").notNull().unique(),
  uploadTimestamp: timestamp("upload_timestamp", { withTimezone: true })
    .notNull().defaultNow(),
  showID: integer("show_id")
    .references((): AnyPgColumn => showsTable.id, { onDelete: "cascade" })// show deleted --> delete media
});



// On update, use `npx drizzle-kit push`
