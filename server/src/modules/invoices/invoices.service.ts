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
import { User } from '../users/schemas/user.schema';
import { GetInvoicesFiltersDto } from './dto/get-invoices-filters.dto';
import dayjs from 'dayjs';
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

  async findById(id: string, companyId: string): Promise<Invoice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de invoice inválido');
    }

    const invoice = await this.invoiceModel
      .findOne({ _id: id, companyId })
      .populate('submittedBy', 'name email')
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
    companyId: string,
  ): Promise<Invoice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de invoice inválido');
    }

    const invoice = await this.invoiceModel
      .findOneAndUpdate({ _id: id, companyId }, updateInvoiceDto, { new: true })
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
    reviewedBy?: string,
  ): Promise<Invoice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de invoice inválido');
    }

    const updateData: any = { status };

    if (
      status === InvoiceStatus.APPROVED ||
      status === InvoiceStatus.REJECTED
    ) {
      updateData.reviewedBy = reviewedBy;
      updateData.reviewedAt = new Date();
    }

    if (status === InvoiceStatus.REJECTED) {
      // lógica para solicitar motivo da rejeição
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
    companyId: string,
  ): Promise<{ filePath: string; fileName: string }> {
    const invoice = await this.findById(id, companyId);

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
}
