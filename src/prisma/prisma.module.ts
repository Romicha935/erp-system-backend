// import { defineConfig } from '@prisma/config';

// export default defineConfig({
//   datasource: {
//     url: process.env.DATABASE_URL,
//   },
// });



import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
