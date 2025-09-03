import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invoice, InvoiceStatus } from './schemas/invoice.schema';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { UploadInvoiceDto } from './dto/upload-invoice.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto, userId: string, companyId: string): Promise<Invoice> {
    const invoice = new this.invoiceModel({
      ...createInvoiceDto,
      submittedBy: userId,
      companyId,
      status: InvoiceStatus.SUBMITTED,
    });

    return invoice.save();
  }

  async uploadFile(
    file: Express.Multer.File,
    uploadData: UploadInvoiceDto,
    userId: string,
    companyId: string,
  ): Promise<Invoice> {
    // Validar arquivo
    if (!file) {
      throw new BadRequestException('Arquivo é obrigatório');
    }

    // Validar tipo de arquivo
    const allowedMimeTypes = ['application/pdf', 'text/xml', 'application/xml'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Tipo de arquivo não suportado. Use PDF ou XML');
    }

    // Criar invoice com dados do arquivo
    const invoiceData = {
      invoiceNumber: uploadData.invoiceNumber || `NF-${Date.now()}`,
      issueDate: uploadData.issueDate ? new Date(uploadData.issueDate) : new Date(),
      dueDate: uploadData.dueDate ? new Date(uploadData.dueDate) : new Date(),
      amount: uploadData.amount ? parseFloat(uploadData.amount) : 0,
      description: uploadData.description || 'Nota fiscal enviada via upload',
      type: 'invoice' as any,
      notes: uploadData.notes,
      tags: uploadData.tags || [],
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      submittedBy: userId,
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

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.startDate && filters?.endDate) {
      query.issueDate = {
        $gte: new Date(filters.startDate),
        $lte: new Date(filters.endDate),
      };
    }

    if (filters?.search) {
      query.$or = [
        { invoiceNumber: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } },
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

  async update(id: string, updateInvoiceDto: UpdateInvoiceDto, companyId: string): Promise<Invoice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de invoice inválido');
    }

    const invoice = await this.invoiceModel
      .findOneAndUpdate(
        { _id: id, companyId },
        updateInvoiceDto,
        { new: true }
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

  async updateStatus(id: string, status: InvoiceStatus, companyId: string, reviewedBy?: string): Promise<Invoice> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de invoice inválido');
    }

    const updateData: any = { status };
    
    if (status === InvoiceStatus.APPROVED || status === InvoiceStatus.REJECTED) {
      updateData.reviewedBy = reviewedBy;
      updateData.reviewedAt = new Date();
    }

    if (status === InvoiceStatus.REJECTED) {
      // Aqui você pode adicionar lógica para solicitar motivo da rejeição
    }

    const invoice = await this.invoiceModel
      .findOneAndUpdate(
        { _id: id, companyId },
        updateData,
        { new: true }
      )
      .exec();

    if (!invoice) {
      throw new NotFoundException('Invoice não encontrado');
    }

    return invoice;
  }

  async getMonthlySummary(companyId: string, year: number, month: number): Promise<any> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const invoices = await this.invoiceModel
      .find({
        companyId,
        issueDate: { $gte: startDate, $lte: endDate }
      })
      .exec();

    const totalAmount = invoices.reduce((sum, invoice) => sum + invoice.amount, 0);
    const statusCounts = {
      submitted: invoices.filter(i => i.status === InvoiceStatus.SUBMITTED).length,
      approved: invoices.filter(i => i.status === InvoiceStatus.APPROVED).length,
      rejected: invoices.filter(i => i.status === InvoiceStatus.REJECTED).length,
    };

    return {
      period: { year, month },
      totalInvoices: invoices.length,
      totalAmount,
      statusCounts,
      invoices: invoices.map(invoice => ({
        id: invoice._id,
        invoiceNumber: invoice.invoiceNumber,
        amount: invoice.amount,
        status: invoice.status,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
      })),
    };
  }

  async downloadFile(id: string, companyId: string): Promise<{ filePath: string; fileName: string }> {
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
        status: { $in: [InvoiceStatus.SUBMITTED] }
      })
      .populate('submittedBy', 'name email')
      .sort({ dueDate: 1 })
      .exec();
  }
}
