import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { showsTable } from './db/schema';
import { eq, max } from 'drizzle-orm';


const db = drizzle(process.env.DATABASE_URL!);

/* Show:
    id: number;
	title: string;
    venue: string;
    date: string;
	imageUrl?: string;
    ticketUrl?: string;
	description?: string;
*/

async function addDemoShow() {
    const show: typeof showsTable.$inferInsert = {
        title: "THE AFTERS _ MATT OX",
        venue: "Trans-Pecos (NY)",
        date: "2026-09-16T03:00:00Z",
        imageUrl: "https://scontent-ord5-2.cdninstagram.com/v/t51.82787-15/765051098_18075894044472506_6260223882177529504_n.jpg?stp=dst-jpg_e35_p720x720_tt6&_nc_cat=103&ig_cache_key=Mzk1NTczMjM0OTM3MDk4MzE3Nw%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTU2MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=Ww9SxYh-Ho0Q7kNvwENM3rR&_nc_oc=AdqbsM0pdnHvvTH_SynVm5IfgGuKPKYqIqWwBWj3vDuzU6TFASuPVme94zN4iVRRR1HbcLIq0bg4TCD71qXdxilV&_nc_ad=z-m&_nc_cid=3&_nc_zt=23&_nc_ht=scontent-ord5-2.cdninstagram.com&_nc_gid=yKMlc0qPrkON4esSTynNeQ&_nc_ss=7a22e&oh=00_AQLL-88-4TxsRubjgZFy_liNFcfbJ6v-CyzIYVwQMvIuxw&oe=6AA0AF09",
        ticketUrl: "https://tickets.venuepilot.com/e/matt-ox-fashion-week-2026-09-12-trans-pecos-ridgewood-queens-01d018",
        description: "@syndicatemusicgroupllc + @free.platoon + @vlonelyandfriends presents: MATT OX LIVE @ NYFW",
    };
    await db.insert(showsTable).values(show);
    console.log("New show Created");
}

async function removeRecent() {
    const deleted = await db
        .delete(showsTable)
        .where(eq(showsTable.id, db.select({ id: max(showsTable.id)}).from(showsTable)))
        .returning()

    console.log(deleted.length ? `Removed ID ${deleted[0].id}` : "No shows to delete.")
}

addDemoShow()