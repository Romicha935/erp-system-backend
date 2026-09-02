// profile.controller.ts
import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { BadRequestException } from '@nestjs/common';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { SettingService } from './setting.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';


@Controller('profile')
@UseGuards(JwtAuthGuard)
export class SettingController {
  constructor(
    private readonly settingService: SettingService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Get('me')
  getMe(@Req() req) {
    return this.settingService.getMe(req.user.id);
  }

  @Patch('me')
  updateProfile(@Req() req, @Body() dto: UpdateProfileDto) {
    return this.settingService.updateProfile(req.user.id, dto);
  }

  @Patch('me/password')
  changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.settingService.changePassword(req.user.id, dto);
  }

@Post('me/photo')
@UseInterceptors(
  FileInterceptor('image', {
    limits: { fileSize: 2 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      console.log('Received file:', file?.originalname, file?.mimetype);
      const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!allowed.includes(file.mimetype)) {
        return cb(new BadRequestException('Only JPG, JPEG and PNG images are allowed'), false);
      }
      cb(null, true);
    },
  }),
)
async uploadPhoto(@Req() req, @UploadedFile() image: Express.Multer.File) {
  console.log('req.file:', image);        // 👈 নতুন
  console.log('req.body:', req.body);      // 👈 নতুন
  const uploaded = await this.cloudinaryService.uploadImage(image);
  return this.settingService.updateProfilePicture(req.user.id, uploaded.secure_url);
}
  

}