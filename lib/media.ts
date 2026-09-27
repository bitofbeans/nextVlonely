import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// interact with with sdk
const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
})

/** 
 * Uploads a file to Cloudflare R2 bucket using a signed URL
 * This avoids vercel bandwith coming from sending the file through the server itself
 */
export async function uploadFile(file: File, key: string) {
    const uploadUrl = await getSignedUrl(
        S3,
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            ContentType: file.type
        }),
        { expiresIn: 600 }
    )

    const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
            "Content-Type": file.type,
        }
    })

    if (!response.ok) {
        throw new Error("Upload failed")
    }

    return response
}

/** 
 * Deletes a file from the Cloudflare R2 bucket by its key
 */
export async function deleteFile(key: string) {

    const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
    })

    const response = await S3.send(command)

    return response
}

/** 
 * Returns the key to access a file from the Cloudflare R2 bucket based on its key
 */
export function getMediaUrl(objectKey: string) {
    return `${process.env.R2_PUBLIC_BASE_URL!}/${objectKey}`;
}