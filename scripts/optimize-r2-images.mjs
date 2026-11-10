#!/usr/bin/env node
// Converts JPEG objects in place, preserving their keys and saving local originals.
import { S3Client, ListObjectsV2Command, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import dotenv from 'dotenv'
dotenv.config({ quiet: true });

const MAX_BYTES = 500_000;
const MAX_DIMENSION = 2048;

async function optimizeJpeg(original) {
  const metadata = await sharp(original).metadata();
  let maxDimension = Math.min(MAX_DIMENSION, Math.max(metadata.width || 0, metadata.height || 0));
  if (!maxDimension) throw new Error('Cannot determine image dimensions');

  while (maxDimension >= 1) {
    for (const quality of [80, 70, 60, 50, 40]) {
      const webp = await sharp(original).rotate().resize({
        width: maxDimension, height: maxDimension, fit: 'inside',
        withoutEnlargement: true, kernel: sharp.kernel.lanczos3,
      }).webp({ quality }).toBuffer();
      if (webp.length <= MAX_BYTES) return webp;
    }
    if (maxDimension === 1) break;
    maxDimension = Math.max(1, Math.floor(maxDimension * 0.8));
  }
  throw new Error('Could not fit image within 500 KB');
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help')) {
    console.log('Usage: node scripts/optimize-r2-images.mjs [--write --backup-dir /path/to/new-directory]\nWithout --write, downloads and measures images without changing the bucket.');
    return;
  }
  const write = args.includes('--write');
  const index = args.indexOf('--backup-dir');
  if (args.some((arg, i) => arg !== '--write' && arg !== '--backup-dir' && !(index >= 0 && i === index + 1)) ||
      (index >= 0 && (!args[index + 1] || args[index + 1].startsWith('--'))) ||
      (write && index < 0) || (!write && index >= 0)) {
    throw new Error('Invalid options. Use --help. A new --backup-dir is required with --write.');
  }
  const required = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length) throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  const backupDir = write ? path.resolve(args[index + 1]) : null;
  if (write) {
    // Refuse an existing directory to avoid overwriting any earlier backup.
    await mkdir(backupDir, { recursive: false, mode: 0o700 });
    console.log(`Saving originals and metadata to ${backupDir}`);
  }
  const client = new S3Client({
    region: 'auto', endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY },
  });
  const bucket = process.env.R2_BUCKET_NAME;
  let token, converted = 0, skipped = 0, failed = 0, before = 0, after = 0;
  do {
    const page = await client.send(new ListObjectsV2Command({ Bucket: bucket, ContinuationToken: token }));
    for (const item of page.Contents || []) {
      const key = item.Key;
      try {
        const object = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
        const original = Buffer.from(await object.Body.transformToByteArray());
        // Check bytes, not the name or content type: keys in this project have no extension.
        if (original.length < 3 || original[0] !== 0xff || original[1] !== 0xd8 || original[2] !== 0xff) {
          skipped++;
          continue;
        }
        if (!object.ETag) throw new Error('Object has no ETag; cannot safely replace it');
        const webp = await optimizeJpeg(original);
        if (write) {
          const name = createHash('sha256').update(key).digest('hex');
          const metadata = {
            key, etag: object.ETag, contentType: object.ContentType, cacheControl: object.CacheControl,
            contentDisposition: object.ContentDisposition, contentEncoding: object.ContentEncoding,
            contentLanguage: object.ContentLanguage, expires: object.Expires, metadata: object.Metadata,
          };
          await writeFile(path.join(backupDir, `${name}.jpg`), original, { flag: 'wx', mode: 0o600 });
          await writeFile(path.join(backupDir, `${name}.json`), JSON.stringify(metadata, null, 2), { flag: 'wx', mode: 0o600 });
          await client.send(new PutObjectCommand({
            Bucket: bucket, Key: key, Body: webp, ContentType: 'image/webp', IfMatch: object.ETag,
            CacheControl: object.CacheControl, ContentDisposition: object.ContentDisposition,
            ContentLanguage: object.ContentLanguage, Expires: object.Expires, Metadata: object.Metadata,
          }));
        }
        converted++; before += original.length; after += webp.length;
        console.log(`${write ? 'Converted' : 'Would convert'} ${JSON.stringify(key)}: ${original.length} → ${webp.length} bytes`);
      } catch (error) {
        failed++;
        console.error(`Failed ${JSON.stringify(key)}: ${error.message}`);
      }
    }
    token = page.NextContinuationToken;
    if (page.IsTruncated && !token) throw new Error('R2 returned a truncated listing without a continuation token');
  } while (token);
  console.log(`${write ? 'Converted' : 'Would convert'} ${converted}; skipped ${skipped}; failed ${failed}. Bytes: ${before} → ${after}.`);
  if (failed) process.exitCode = 1;
}
main().catch((error) => { console.error(error.message); process.exitCode = 1; });
