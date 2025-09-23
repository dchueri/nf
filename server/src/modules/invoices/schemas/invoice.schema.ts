import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/users/schemas/user.schema';

export enum InvoiceStatus {
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  IGNORED = 'ignored',
}

@Schema({ timestamps: true })
export class Invoice extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'Company' })
  companyId: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  userId: Types.ObjectId | User;

  @Prop({ required: true })
  invoiceNumber: string;

  @Prop({ required: true })
  referenceMonth: Date;

  @Prop({
    required: true,
    enum: InvoiceStatus,
    default: InvoiceStatus.SUBMITTED,
  })
  status: InvoiceStatus;

  @Prop({ required: true })
  fileName: string;

  @Prop({ required: true })
  filePath: string;

  @Prop()
  mimeType: string;

  @Prop()
  amount?: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  reviewedBy?: Types.ObjectId;

  @Prop()
  reviewedAt?: Date;

  @Prop()
  rejectionReason?: string;

  @Prop()
  deletedAt?: Date;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

// Indexes for better query performance
InvoiceSchema.index({ companyId: 1, status: 1 });
InvoiceSchema.index({ user: 1 });
InvoiceSchema.index({ referenceMonth: 1 });
InvoiceSchema.index({ companyId: 1, referenceMonth: 1 });
