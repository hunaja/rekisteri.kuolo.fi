import * as Minio from "minio";

let cachedClient: Minio.Client | null = null;

export const bucketPrefix = "rg-";

export default async function connectMinio() {
  if (cachedClient) {
    return cachedClient;
  }

  try {
    const client = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT!,
      port: parseInt(process.env.MINIO_PORT!),
      useSSL: false,
      accessKey: process.env.MINIO_ACCESS_KEY!,
      secretKey: process.env.MINIO_SECRET_KEY!,
    });

    if (!(await client.bucketExists(bucketPrefix + "exams"))) {
      await client.makeBucket(bucketPrefix + "exams");
    }

    await client.setBucketPolicy(
      bucketPrefix + "exams",
      JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Effect: "Allow",
            Principal: { AWS: ["*"] },
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucketPrefix}exams/*`],
          },
        ],
      })
    );

    cachedClient = client;
    return client;
  } catch (e) {
    console.error(e);
    throw e;
  }
}
