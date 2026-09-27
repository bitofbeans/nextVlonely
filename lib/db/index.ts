import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';

export const db = drizzle(process.env.DATABASE_URL!);

/* Show:
    id: number;
	title: string;
    venue: string;
    date: string;
	imageUrl?: string;
    ticketUrl?: string;
	description?: string;
*/

/*
artistsTable:
  id: number serial,
  name: string notnull,
  slug: string notnull,
  profileMediaID: from mediaTable, number id
  instagramHandle: string,
  instagramUrl: string,
  description: string,
*/