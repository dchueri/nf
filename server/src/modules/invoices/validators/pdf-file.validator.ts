import { FileValidator } from '@nestjs/common';

export class PdfFileValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file?: Express.Multer.File): boolean {
    return (
      (!!file && file.mimetype === 'application/pdf') ||
      file.mimetype === 'text/xml' ||
      file.mimetype === 'application/xml'
    );
  }

  buildErrorMessage(file: Express.Multer.File): string {
    return `Invalid file type ${file.mimetype}. Only PDF and XML are allowed.`;
  }
}
