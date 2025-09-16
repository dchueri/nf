import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { Invoice, InvoiceSchema } from './schemas/invoice.schema';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Invoice.name, schema: InvoiceSchema },
      { name: User.name, schema: UserSchema }
    ]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get<string>('UPLOAD_PATH', './uploads'),
          filename: (req, file, cb) => {
            // Gera nome único para o arquivo
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = extname(file.originalname);
            cb(null, `invoice-${uniqueSuffix}${ext}`);
          },
        }),
        fileFilter: (req, file, cb) => {
          // Aceita apenas PDF e XML
          if (file.mimetype === 'application/pdf' || file.mimetype === 'text/xml' || file.mimetype === 'application/xml') {
            cb(null, true);
          } else {
            cb(new Error('Apenas arquivos PDF e XML são permitidos'), false);
          }
        },
        limits: {
          fileSize: configService.get<number>('MAX_FILE_SIZE', 10 * 1024 * 1024), // 10MB padrão
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
