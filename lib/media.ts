import { S3Client, DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3 = new S3Client({
    region: "auto",
    endpoint: `https://${process.env.R2_ACCOUNT_ID!}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!
    }
})

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

}

export async function deleteFile(key: string) {

    const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
    })

    const response = await S3.send(command)
}

export function getMediaUrl(objectKey: string) {
    return `${process.env.R2_PUBLIC_BASE_URL!}/${objectKey}`;
}