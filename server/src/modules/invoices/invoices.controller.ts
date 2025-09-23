import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UseInterceptors,
  UploadedFile,
  Res,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UploadInvoiceDto } from './dto/upload-invoice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { PdfFileValidator } from './validators/pdf-file.validator';
import { GetInvoicesFiltersDto } from './dto/get-invoices-filters.dto';
import { CreateIgnoredInvoiceDto } from './dto/create-ignored-invoice.dto';

@ApiTags('invoices')
@Controller('invoices')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}
  @Post('upload')
  @Roles(UserRole.MANAGER, UserRole.COLLABORATOR)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload de arquivo de nota fiscal' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload de arquivo PDF ou XML',
    type: UploadInvoiceDto,
  })
  @ApiResponse({ status: 201, description: 'Arquivo enviado com sucesso' })
  @ApiResponse({ status: 400, description: 'Arquivo inválido' })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }), // 10MB
          new PdfFileValidator(),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() uploadData: UploadInvoiceDto,
    @Request() req,
  ) {
    return this.invoicesService.uploadFile(
      file,
      uploadData,
      req.user._id,
      req.user.companyId,
    );
  }

  @Get()
  @Roles(UserRole.MANAGER, UserRole.COLLABORATOR)
  @ApiOperation({ summary: 'Listar notas fiscais' })
  @ApiResponse({ status: 200, description: 'Lista de notas fiscais' })
  findAll(@Request() req, @Query() filters: GetInvoicesFiltersDto) {
    return this.invoicesService.findAll(req.user.companyId, filters);
  }

  @Get('summary/:year/:month')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Resumo mensal de notas fiscais' })
  @ApiResponse({ status: 200, description: 'Resumo mensal' })
  getMonthlySummary(
    @Param('year') year: string,
    @Param('month') month: string,
    @Request() req,
  ) {
    return this.invoicesService.getMonthlySummary(
      req.user.companyId,
      parseInt(year),
      parseInt(month),
    );
  }

  @Get('overdue')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Notas fiscais em atraso' })
  @ApiResponse({ status: 200, description: 'Lista de notas em atraso' })
  getOverdueInvoices(@Request() req) {
    return this.invoicesService.getOverdueInvoices(req.user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter nota fiscal por ID' })
  @ApiResponse({ status: 200, description: 'Nota fiscal encontrada' })
  @ApiResponse({ status: 404, description: 'Nota fiscal não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.invoicesService.findById(id, req.user.companyId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar nota fiscal' })
  @ApiResponse({ status: 200, description: 'Nota fiscal atualizada' })
  @ApiResponse({ status: 404, description: 'Nota fiscal não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
    @Request() req,
  ) {
    return this.invoicesService.update(
      id,
      updateInvoiceDto,
      req.user.companyId,
    );
  }

  @Post('ignored')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Criar nota fiscal ignorada' })
  @ApiResponse({ status: 201, description: 'Nota fiscal ignorada criada' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  createIgnoredInvoice(
    @Body() createIgnoredInvoiceDto: CreateIgnoredInvoiceDto,
    @Request() req,
  ) {
    return this.invoicesService.createIgnoredInvoice(createIgnoredInvoiceDto);
  }

  @Patch(':id/status')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Atualizar status da nota fiscal' })
  @ApiResponse({ status: 200, description: 'Status atualizado' })
  @ApiResponse({ status: 404, description: 'Nota fiscal não encontrada' })
  updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; rejectionReason: string },
    @Request() req,
  ) {
    return this.invoicesService.updateStatus(
      id,
      body.status as any,
      req.user.companyId,
      body.rejectionReason,
      req.user._id,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover nota fiscal' })
  @ApiResponse({ status: 200, description: 'Nota fiscal removida' })
  @ApiResponse({ status: 404, description: 'Nota fiscal não encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  remove(@Param('id') id: string, @Request() req) {
    return this.invoicesService.remove(id, req.user.companyId);
  }

  @Get(':id/download')
  @ApiOperation({ summary: 'Download do arquivo da nota fiscal' })
  @ApiResponse({ status: 200, description: 'Arquivo baixado' })
  @ApiResponse({ status: 404, description: 'Arquivo não encontrado' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async downloadFile(
    @Param('id') id: string,
    @Request() req,
    @Res() res: Response,
  ) {
    const fileInfo = await this.invoicesService.downloadFile(
      id,
      req.user._id,
      req.user.companyId,
    );

    res.download(fileInfo.filePath, fileInfo.fileName, (err) => {
      if (err) {
        res.status(500).json({ message: 'Erro ao baixar arquivo' });
      }
    });
  }

  @Post('compile')
  @Roles(UserRole.MANAGER)
  @ApiOperation({ summary: 'Compilar todas as notas fiscais de um mês em ZIP' })
  @ApiResponse({ status: 200, description: 'ZIP compilado com sucesso' })
  @ApiResponse({ status: 404, description: 'Nenhuma nota fiscal encontrada' })
  @ApiResponse({ status: 403, description: 'Acesso negado' })
  async compileInvoicesByMonth(
    @Body() body: { referenceMonth: string },
    @Request() req,
    @Res() res: Response,
  ) {
    const { referenceMonth } = body;

    if (!referenceMonth) {
      return res
        .status(400)
        .json({ message: 'Mês de referência é obrigatório' });
    }

    const result = await this.invoicesService.compileInvoicesByMonth(
      referenceMonth,
      req.user._id,
      req.user.companyId,
    );

    // Configurar headers para download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${result.fileName}"`,
    );

    // Enviar arquivo ZIP
    const fileStream = require('fs').createReadStream(result.zipPath);
    fileStream.pipe(res);

    // Limpar arquivo temporário após envio
    fileStream.on('end', () => {
      require('fs').unlinkSync(result.zipPath);
    });

    fileStream.on('error', (err) => {
      console.error('Erro ao enviar arquivo ZIP:', err);
      res.status(500).json({ message: 'Erro ao enviar arquivo ZIP' });
    });
  }
}
