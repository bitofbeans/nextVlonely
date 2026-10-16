import { queryShowGalleryPhotos } from "@/lib/queries";
import { getMediaUrl } from "@/lib/media";
import { GalleryPhotoUpload } from "../../components/ShowEdit";
import GalleryPhotos from "./GalleryPhotos";
import styles from "./Gallery.module.css";

export default async function Gallery({ showID }: { showID: number }) {
    const photos = await queryShowGalleryPhotos(showID);
    const galleryPhotos = await Promise.all(photos.map(async (photo) => ({
        id: photo.id,
        src: await getMediaUrl(photo.objectKey),
    })));

    return (
        <div className={styles.gallery}>
            <GalleryPhotoUpload showID={showID} />
            {galleryPhotos.length > 0 ? (
                <GalleryPhotos photos={galleryPhotos} />
            ) : (
                <div className="my-20 text-3xl">
                    no photos yet...
                </div>
            )}
        </div>
    );
}
