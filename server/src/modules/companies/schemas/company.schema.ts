import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Company extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  cnpj: string;

  @Prop({ required: true })
  address: string;

  @Prop()
  city: string;

  @Prop()
  state: string;

  @Prop()
  zipCode: string;

  @Prop()
  phone: string;

  @Prop()
  email?: string;

  @Prop({ default: {}, type: Object })
  settings: {
    reminderSchedule: {
      firstReminder: number; // days before deadline
      secondReminder: number;
      finalReminder: number;
      escalationReminder: number;
    };
    invoiceDeadline: number; // day of month
    autoReminders: boolean;
    emailNotifications: boolean;
    deadline: {
      strategy: 'fixed_day' | 'start_month' | 'end_month';
      day: number;
      daysFromStart: number;
      daysFromEnd: number;
    };
  };

  @Prop({ default: 'active' })
  status: 'active' | 'inactive' | 'suspended';
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// Indexes for better query performance
CompanySchema.index({ cnpj: 1 });
CompanySchema.index({ email: 1 });
CompanySchema.index({ status: 1 });
