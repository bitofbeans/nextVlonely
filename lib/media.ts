"use server"
import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { auth } from '@/lib/auth/server'


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
 * Gets signed url from cloudflare to upload to
 */
export async function getUploadMediaUrl(key: string, fileType: string) {
    // Check if authenticated
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const uploadUrl = await getSignedUrl(
        S3,
        new PutObjectCommand({
            Bucket: process.env.R2_BUCKET_NAME!,
            Key: key,
            ContentType: fileType
        }),
        { expiresIn: 600 }
    )
    return uploadUrl
}

/** 
 * Deletes a file from the Cloudflare R2 bucket by its key
 */
export async function deleteFile(key: string) {
    // Check if authenticated
    const { data: session } = await auth.getSession();
    
    if (!session?.user) {
        throw new Error("Unauthorized")
    }


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
export async function getMediaUrl(objectKey: string) {
    return `${process.env.R2_PUBLIC_BASE_URL!}/${objectKey}`;
}