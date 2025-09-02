import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { InvoiceStatus } from '../../invoices/schemas/invoice.schema';

export enum UserRole {
  MANAGER = 'manager',
  COLLABORATOR = 'collaborator',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: UserRole })
  role: UserRole;

  @Prop({ required: true, enum: UserStatus, default: UserStatus.PENDING })
  status: UserStatus;

  @Prop()
  department?: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: false })
  companyId?: Types.ObjectId;

  @Prop({
    type: [
      {
        month: String,
        submittedAt: Date,
        invoices: Number,
        status: { type: String, enum: InvoiceStatus },
      },
    ],
    default: [],
  })
  monthsWithInvoices: [
    {
      month: string;
      submittedAt: Date;
      invoices: number;
      status: InvoiceStatus;
    },
  ];

  @Prop()
  phone?: string;

  @Prop()
  cpfCnpj?: string;

  @Prop({ default: false })
  emailVerified: boolean;

  @Prop()
  lastLoginAt?: Date;

  @Prop({ type: Object })
  reminderPreferences?: {
    email: boolean;
    whatsapp: boolean;
    frequency: number; // days before deadline
  };
}

export const UserSchema = SchemaFactory.createForClass(User);

// Indexes for better query performance
UserSchema.index({ email: 1 });
UserSchema.index({ companyId: 1 });
UserSchema.index({ role: 1, status: 1 });
