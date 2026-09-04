
# Promoter/Artist portfolio. 

- Home/about/upcoming shows page, 
- archive (shows plus gallery), 
- artists page (portrait, handle, genre, bio)
- 
The artist needs to be able to add shows to past shows, add photos for that show's gallery, update their about me, add artists to the artists page.


## Planned Stack:
- Next.js + TS + Tailwind,
- Neon PostgreSQL (Database + Auth)
-  Drizzle ORM 
- Cloudflare R2 (10mil reads a month free and free 10gb),
-  Vercel Hosting  
- Maybe: Zod, Markdown for rich text
## Far future plan: 

Recreate frontend, make an interactive 3d version where each page is a different floor in a building: highest floor is the artists showcase, ground floor is about/upcoming shows.


| Floor | Section | Content | Interaction |
|---|---|---|---|
| Basement | Archive | Past shows, each in a small room with the show's photos arranged around it | Walk between show rooms and explore photos in context |
| Ground | Upcoming Shows / About | Upcoming show listings and an NPC with the artist's bio | Approach the character and press a key to open an information panel |
| Upper | Artists | Artist roster with portraits or plaques, handles, genres, and bios | Walk past or interact with the plaques |