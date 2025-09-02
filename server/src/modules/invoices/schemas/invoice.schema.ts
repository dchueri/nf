import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InvoiceStatus {
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IGNORED = 'ignored',
}

export enum InvoiceType {
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Company' })
  companyId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  submittedBy: Types.ObjectId;

  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ required: true })
  issueDate: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: InvoiceType })
  type: InvoiceType;

  @Prop({ required: true, enum: InvoiceStatus, default: InvoiceStatus.SUBMITTED })
  status: InvoiceStatus;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  filePath: string;

  @Prop()
  fileSize: number;

  @Prop()
  mimeType: string;

  @Prop()
  notes?: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  rejectionReason?: string;

  @Prop()
  paymentDate?: Date;

  @Prop()
  reminderSentAt?: Date;

  @Prop({ default: 0 })
  reminderCount: number;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Indexes for better query performance
InvoiceSchema.index({ companyId: 1, status: 1 });
InvoiceSchema.index({ submittedBy: 1 });
InvoiceSchema.index({ dueDate: 1 });
InvoiceSchema.index({ issueDate: 1 });
InvoiceSchema.index({ companyId: 1, dueDate: 1 });
