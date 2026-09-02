// src/cloudinary/cloudinary.provider.ts
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    return cloudinary.config({
      cloud_name: configService.get('s6tmvcmz'),
      api_key: configService.get('955672548122385'),
      api_secret: configService.get('eJHC7vL3LoJsYMyM9mXJo_Ct7DU'),
    });
  },
};