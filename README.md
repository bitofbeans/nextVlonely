# Promoter/artist portfolio

This is a Next app with:
- Home page with an about section and upcoming shows
- Archive of past shows and galleries
- Artists page with a grid of cards showing portraits, handles, genres, and bios

The data for shows and artists are all editable by the end user.

## Tech stack

- Next.js, TypeScript, and Tailwind CSS
- Neon PostgreSQL (database and authentication)
- Drizzle ORM
- Cloudflare R2
- Vercel hosting


<br>

# Dev notes
Below are all my notes throughout development.

- The home page hero is intentionally one full stage height.

## Admin/CMS panel

Turn on edit mode and visit each page to make changes:

- Home: add, edit, or delete upcoming shows
- Archive: add, edit, or delete past shows and upload gallery images
- Artists: add, edit, or delete artists

Possible addition: edit the about text.

## TODO: For now

- [x] Finish home page
  - [x] previous tasks...
  - [x] Sort and clear up database for shows and artists
  - [x] Add "add artist" capabilities
  - [x] Color artists' names and add links
  - [x] Info modal on button click
  - [x] Artists pages links
- [x] Archive page
  - [x] Design layout
  - [x] Make template page for each show
  - [x] Implement gallery images
  - [x] Edit mode for old shows and gallery upload
  - [x] ~~Have show page BG be gallery_video~~
  - [x] ~~Moving queue for conveyor belt (fix crop)~~
- [x] Artists page
  - [x] Design layout
  - [x] Implement artists page
  - [x] Featured artists section
  - [x] Page for each artist
  - [x] Make template page for each show
- [x] Backend database server functions
  - [x] Add show
  - [x] Edit existing show
  - [x] Add photos to show
    - [x] Upload image panel for Cloudflare
  - [x] Add artist server function
- [x] ~~Add more hearts and stars around page stylistically~~
- [x] ~~Try replacing nav crosses w logos~~
- [x] FINAL Update Cloudflare URL (next.config.ts, .env)
- [x] FINAL Polish on style
- [x] FINAL Implement Neon/Vercel caching
- [x] FINAL Get domain, edit metadata in layout.tsx
- [x] FINAL Search engine optimization

## Before launching to a new domain name

- Change CORS policy in Cloudflare
- Disable public development URL, route through custom domain

## One-time R2 image conversion

The image conversion script:

- Finds JPEGs by their contents
- Resizes them to at most 2048 pixels on the longest side using Lanczos3
- Compresses them to WebP of at most 500,000 bytes
- Keeps the original object keys
- Skips non-JPEG objects

Preview the conversions and sizes:

```sh
node scripts/optimize-r2-images.mjs
```

To actually replace the JPEGs, choose a **new**, secure local backup directory whose parent already exists:

```sh
node scripts/optimize-r2-images.mjs --write --backup-dir /absolute/path/to/new-r2-backup
```

## Database schema

### SHOWS

- ID -> Identifier
- INFO <sub>(title, desc, venue, date, timezone, ticketurl)</sub>
- poster_media_id -> foreign key, making sure that the media exists

### ARTISTS

- ID -> Identifier
- Slug -> For unique artist URL, if I give them a page
- INFO  <sub>(name, pfp url, ig handle + url, desc)</sub>

### SHOW_ARTISTS

- Primary key is composite from showId and artist id, so can't be the same artist in a show
- Checks for uniqueness on id/position -> positions are unique per show, so can only be used once
- Must be positive position
- show_id -> Foreign references to respective tables, makes sure they exist
- artist_id -> ^
- position -> Order in list

### MEDIA

- ID -> Identifier
- object_key -> Name of file in Cloudflare bucket
- uploadtimestamp
- file_url -> used by the frontend to display media
- show_id -> foreign key for show


## Potential (but unlikely) future for this project

Recreate the frontend as an interactive 3D building, with each page on a different floor: the upper floor showcases artists, and the ground floor contains the about section and upcoming shows. This might be too easy to implement with AI, so I'm on the fence about learning all of it.

| Floor | Section | Content | Interaction |
|---|---|---|---|
| Basement | Archive | Past shows, each in a small room with the show's photos arranged around it like a gallery | Walk between show rooms and explore photos in context |
| Ground | Upcoming Shows / About | Upcoming show listings and an NPC with the artist's bio | Approach the character and press a key to open an information panel |
| Upper | Artists | Artist roster with portraits or plaques, handles, genres, and bios | Walk past or interact with the plaques |
