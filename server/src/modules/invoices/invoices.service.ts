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

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    uploadData: UploadInvoiceDto,
    userId: string,
    companyId: string,
  ): Promise<Invoice> {
    // Criar invoice com dados do arquivo
    console.log(userId)
    const invoiceData = {
      invoiceNumber: uploadData.invoiceNumber,
      referenceMonth: uploadData.referenceMonth
        ? new Date(uploadData.referenceMonth)
        : new Date(),
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

  async findAll(companyId: string, filters?: any): Promise<Invoice[]> {
    const query: any = { companyId };

    // Aplicar filtros
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

    return this.invoiceModel
      .find(query)
      .populate('submittedBy', 'name email')
      .sort({ issueDate: -1 })
      .exec();
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
      // Aqui você pode adicionar lógica para solicitar motivo da rejeição
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
