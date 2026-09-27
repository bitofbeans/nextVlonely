
# Promoter/Artist portfolio. 

- Home/about/upcoming shows page, 
- archive (shows plus gallery), 
- artists page (portrait, handle, genre, bio) - grid of artist cards

The artist needs to be able to add shows to past shows, add photos for that show's gallery, update their about me, add artists to the artists page.

### Admin/CMS panel:
Login page
Dashboard to add/edit/delete shows, upload photos to a show
Add/edit/delete artists
Edit the about/bio text.. ? maybe


## Planned Stack:
- Next.js + TS + Tailwind,
- Neon PostgreSQL (Database + Auth)
- Drizzle ORM 
- Cloudflare R2 (10mil reads a month free and free 10gb),
- Vercel Hosting  
- Maybe: Zod, Markdown for rich text

## DB Schema

SHOWS
- ID -> Identifier
- INFO <sub>(title, desc, venue, date, timezone, ticketurl)</sub>
- poster_media_id ->  foreign key, making sure that the media exists

ARTISTS
- ID -> Identifier
- Slug -> For unique artist url, if I give them a page
- INFO  <sub>(name, pfp url, ig handle + url, desc)</sub>

SHOW_ARTISTS
  - Primary key is composite from showId and artist id, so can't be the same artist in a show
  - Checks for uniqueness on id/position -> positions are unique per show, so can only be used once
  - Must be positive position
- show_id -> Foreign references to respective tables, makes sure they exist
- artist_id -> ^
- position -> Order in list

MEDIA
- ID -> Identifier
- object_key -> Name of file in cloudflare bucket
- uploadtimestamp
- file_url -> used by frontend to display media
- show_id -> foreign key for show



## TODO: For now

- [ ] Review EditMode.tsx
- [ ] Review admin/page.tsx
- [x] Sort and clear up database for shows and artists  
- [ ] Add "add artist" capabilities
- [ ] Color artists names/add links
- [ ] Info modal on button click

- [ ] Archive page
  - [ ] Design layout   
  - [ ] Make template page for each show
  - [ ] Implement...
- [ ] Artists page
  - [ ] Maybe this can be left as "coming soon"
  - [ ] Design layout   
  - [ ] Make template page for each show
- [ ] Backend database server functions
  - [x] Add show
  - [x] Edit existing show
  - [ ] Add photos to show
    - [x] Upload image panel for cloudflare 
  - [ ] Add artist server function
- [ ] Add more hearts and stars around page stylistically
- [ ] FINAL Update Cloudflare URL (next.config.ts, .env)
- [ ] FINAL Polish on style
- [ ] FINAL Implement neon/vercel caching
- [ ] FINAL Get domain, edit metadata in layout.tsx
- [ ] FINAL Search engine optimization


## Before launching to a new domain name
- Change CORS policy in cloudflare
- Disable public dev url, route through custom domain



# Far future plan: 

Recreate frontend, make an interactive 3d version where each page is a different floor in a building: highest floor is the artists showcase, ground floor is about/upcoming shows. This might be way too easy to implement with AI so I'm on the fence of actually learning all of it


| Floor | Section | Content | Interaction |
|---|---|---|---|
| Basement | Archive | Past shows, each in a small room with the show's photos arranged around it like a gallery| Walk between show rooms and explore photos in context |
| Ground | Upcoming Shows / About | Upcoming show listings and an NPC with the artist's bio | Approach the character and press a key to open an information panel |
| Upper | Artists | Showcase artists > Artist roster with portraits or plaques, handles, genres, and bios | Walk past or interact with the plaques |


## Goals
