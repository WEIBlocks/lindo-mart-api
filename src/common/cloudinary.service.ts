import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadSignature(base64Image: string, userId: string): Promise<string> {
    // Remove the data URL prefix and get just the base64 string
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    try {
      // Use a promise to handle the upload
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'signatures',
            public_id: `signature-${userId}-${Date.now()}`,
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        // Pass the buffer to the upload stream
        streamifier.createReadStream(buffer).pipe(uploadStream);
      });
    } catch (error) {
      throw new Error(`Failed to upload signature: ${error.message}`);
    }
  }
}
