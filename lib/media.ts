export function getMediaUrl(objectKey: string) {
  const base = process.env.R2_PUBLIC_BASE_URL!.replace(/\/+$/, "");
  const path = objectKey.split("/").map(encodeURIComponent).join("/");
  return `${base}/${path}`;
}