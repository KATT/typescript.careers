import aws from 'aws-sdk';
import { NextApiRequest, NextApiResponse } from 'next';
import { env } from 'server/env';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  aws.config.update({
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_ACCESS_KEY_SECRET,
    region: env.S3_REGION,
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();
  const post = s3.createPresignedPost({
    Bucket: env.S3_BUCKET_NAME,
    Fields: {
      key: req.query.file,
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });

  res.status(200).json(post);
}
