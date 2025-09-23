import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceStatus } from './schemas/invoice.schema';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UploadInvoiceDto } from './dto/upload-invoice.dto';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { User, UserRole } from '../users/schemas/user.schema';
import { GetInvoicesFiltersDto } from './dto/get-invoices-filters.dto';
import * as dayjs from 'dayjs';
import { PaginatedResponseDto } from 'src/common/dto/response.dto';
import { CreateIgnoredInvoiceDto } from './dto/create-ignored-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async createIgnoredInvoice({
    userId,
    referenceMonth,
  }: CreateIgnoredInvoiceDto): Promise<Invoice> {
    const user = await this.userModel.findById(userId);
    const invoiceData = {
      referenceMonth,
      companyId: user.companyId,
      userId: user._id,
      status: InvoiceStatus.IGNORED,
      invoiceNumber: '999',
      fileName: 'invoice-ignored.pdf',
      filePath: 'invoice-ignored.pdf',
      mimeType: 'application/pdf',
    };

    return await this.invoiceModel.create(invoiceData);
  }

  async uploadFile(
    file: Express.Multer.File,
    uploadData: UploadInvoiceDto,
    userId: string,
    companyId: string,
  ): Promise<Invoice> {
    // Criar invoice com dados do arquivo
    const invoiceData = {
      invoiceNumber: uploadData.invoiceNumber,
      referenceMonth: uploadData.referenceMonth
        ? dayjs(uploadData.referenceMonth).set('date', 2).toDate()
        : dayjs().set('date', 2).toDate(),
      fileName: file.originalname,
      filePath: file.path,
      mimeType: file.mimetype,
      userId,
      companyId,
      status: InvoiceStatus.SUBMITTED,
    };

    const invoice = new this.invoiceModel(invoiceData);
    return invoice.save();
  }

  async findAll(
    companyId: string,
    filters?: GetInvoicesFiltersDto,
  ): Promise<PaginatedResponseDto<Invoice>> {
    const query: any = { companyId };

    if (filters?.status) {
      query.status = filters.status;
    } else {
      query.status = { $ne: InvoiceStatus.IGNORED };
    }

    if (filters?.referenceMonth) {
      query.referenceMonth = filters.referenceMonth;
    }

    if (filters?.startDate && filters?.endDate) {
      query.referenceMonth = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    if (filters?.search) {
      query.$or = [
        { invoiceNumber: { $regex: filters.search, $options: 'i' } },
      ];
    }

    const invoices = await this.invoiceModel
      .find(query)
      .skip((filters.page - 1) * filters.limit)
      .limit(filters.limit)
      .populate('userId', 'name email')
      .sort({ referenceMonth: -1 })
      .exec();

    const totalInvoices = await this.invoiceModel.countDocuments(query).exec();

    return {
      docs: invoices,
      total: totalInvoices,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(totalInvoices / filters.limit),
    };
  }

  async findById(
    id: string,
    companyId: string,
    userId?: string,
  ): Promise<Invoice> {
    const query: any = { _id: id, companyId };
    if (userId) {
      query.userId = userId;
    }
    const invoice = await this.invoiceModel
      .findOne(query)
      .populate('userId', 'name email')
      .populate('reviewedBy', 'name email')
      .exec();

    if (!invoice) {
      throw new NotFoundException('Invoice não encontrado');
    }

    return invoice;
  }

  async update(
    id: string,
    updateInvoiceDto: UpdateInvoiceDto,
    user: User,
  ): Promise<Invoice> {
    const newUpdateInvoiceDto: any = { ...updateInvoiceDto };
    if (updateInvoiceDto.status === InvoiceStatus.REJECTED) {
      newUpdateInvoiceDto.rejectionReason =
        newUpdateInvoiceDto.rejectionReason || 'Não informado';
      newUpdateInvoiceDto.reviewedBy = user._id;
      newUpdateInvoiceDto.reviewedAt = new Date();
    }

    const invoice = await this.invoiceModel
      .findOneAndUpdate(
        { _id: id, companyId: user.companyId },
        newUpdateInvoiceDto,
        { new: true },
      )
      .exec();

    if (!invoice) {
      throw new NotFoundException('Invoice não encontrado');
    }

    return invoice;
  }

  async remove(id: string, companyId: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de invoice inválido');
    }

    const invoice = await this.invoiceModel.findById(id).exec();
    if (!invoice) {
      throw new NotFoundException('Invoice não encontrado');
    }

    if (invoice.companyId.toString() !== companyId) {
      throw new ForbiddenException('Acesso negado');
    }

    // Remover arquivo físico
    if (invoice.filePath && fs.existsSync(invoice.filePath)) {
      fs.unlinkSync(invoice.filePath);
    }

    await this.invoiceModel.findByIdAndDelete(id).exec();
  }

  async updateStatus(
    id: string,
    status: InvoiceStatus,
    companyId: string,
    rejectionReason: string,
    reviewedBy?: string,
  ): Promise<Invoice> {
    const updateData: any = { status };

    if (
      status === InvoiceStatus.APPROVED ||
      status === InvoiceStatus.REJECTED
    ) {
      updateData.reviewedBy = reviewedBy;
      updateData.reviewedAt = new Date();
    }

    if (status === InvoiceStatus.REJECTED) {
      updateData.rejectionReason = rejectionReason;
    }

    const invoice = await this.invoiceModel
      .findOneAndUpdate({ _id: id, companyId }, updateData, { new: true })
      .exec();

    if (!invoice) {
      throw new NotFoundException('Invoice não encontrado');
    }

    return invoice;
  }

  async getMonthlySummary(
    companyId: string,
    year: number,
    month: number,
  ): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const invoices = await this.invoiceModel
      .find({
        companyId,
        issueDate: { $gte: startDate, $lte: endDate },
      })
      .exec();

    const totalAmount = invoices.reduce(
      (sum, invoice) => sum + invoice.amount,
      0,
    );
    const statusCounts = {
      submitted: invoices.filter((i) => i.status === InvoiceStatus.SUBMITTED)
        .length,
      approved: invoices.filter((i) => i.status === InvoiceStatus.APPROVED)
        .length,
      rejected: invoices.filter((i) => i.status === InvoiceStatus.REJECTED)
        .length,
    };

    return {
      period: { year, month },
      totalInvoices: invoices.length,
      totalAmount,
      statusCounts,
      invoices: invoices.map((invoice) => ({
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        status: invoice.status,
        referenceMonth: invoice.referenceMonth,
      })),
    };
  }

  async downloadFile(
    id: string,
    userId: string,
    companyId: string,
  ): Promise<{ filePath: string; fileName: string }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    let userIdQuery: string | undefined;
    if (user.role === UserRole.MANAGER) {
      userIdQuery = undefined;
    } else {
      userIdQuery = user._id.toString();
    }

    const invoice = await this.findById(id, companyId, userIdQuery);

    if (!invoice.filePath || !fs.existsSync(invoice.filePath)) {
      throw new NotFoundException('Arquivo não encontrado');
    }

    return {
      filePath: invoice.filePath,
      fileName: invoice.fileName,
    };
  }

  async getOverdueInvoices(companyId: string): Promise<Invoice[]> {
    const today = new Date();

    return this.invoiceModel
      .find({
        companyId,
        dueDate: { $lt: today },
        status: { $in: [InvoiceStatus.SUBMITTED] },
      })
      .populate('submittedBy', 'name email')
      .sort({ dueDate: 1 })
      .exec();
  }

  async compileInvoicesByMonth(
    referenceMonth: string,
    userId: string,
    companyId: string,
  ): Promise<{ zipPath: string; fileName: string; count: number }> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Verificar se o usuário tem permissão para compilar notas fiscais
    if (user.role !== UserRole.MANAGER) {
      throw new ForbiddenException(
        'Apenas gestores podem compilar notas fiscais',
      );
    }

    const query: any = {
      companyId,
      referenceMonth: {
        $lte: dayjs(referenceMonth).endOf('month').toDate(),
        $gte: dayjs(referenceMonth).startOf('month').toDate(),
      },
    };
    if (user.role === UserRole.MANAGER) {
      query.status = InvoiceStatus.APPROVED;
    }
    const invoices = await this.invoiceModel
      .find(query)
      .populate('userId', 'name email')
      .exec();

    if (invoices.length === 0) {
      throw new NotFoundException(
        'Nenhuma nota fiscal encontrada para o mês selecionado',
      );
    }

    // Criar diretório temporário para o ZIP
    const tempDir = path.join(process.cwd(), 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Nome do arquivo ZIP
    const zipFileName = `notas-fiscais-${referenceMonth}-${Date.now()}.zip`;
    const zipPath = path.join(tempDir, zipFileName);

    // Criar arquivo ZIP
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Máxima compressão
    });

    return new Promise((resolve, reject) => {
      output.on('close', () => {
        resolve({
          zipPath,
          fileName: zipFileName,
          count: invoices.length,
        });
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      // Adicionar cada nota fiscal ao ZIP
      invoices.forEach((invoice) => {
        if (invoice.filePath && fs.existsSync(invoice.filePath)) {
          const user = invoice.userId as any;
          const fileName = `${user?.name || 'Usuario'}-${invoice.invoiceNumber}-${invoice.fileName}`;
          archive.file(invoice.filePath, { name: fileName });
        }
      });

      archive.finalize();
    });
  }
}
