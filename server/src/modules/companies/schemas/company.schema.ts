import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { calculateDeadlineDate } from '../../../utils/dateUtils';

// Interface for Company document with methods
export interface CompanyDocument extends Company {
  getDateLimit(year?: number, month?: number): Date;
}

@Schema({ timestamps: false, _id: false })
export class ReminderScheduleSettings {
  @Prop({ default: 0 })
  firstReminder: number;
  @Prop({ default: 0 })
  secondReminder: number;
  @Prop({ default: 0 })
  finalReminder: number;
  @Prop({ default: 0 })
  escalationReminder: number;
}

@Schema({ timestamps: false, _id: false })
export class DeadlineSettings {
  @Prop({ default: 'fixed_day' })
  strategy: 'fixed_day' | 'start_month' | 'end_month';
  @Prop({ default: 5 })
  day: number;
  @Prop({ default: 1 })
  daysFromStart: number;
  @Prop({ default: 1 })
  daysFromEnd: number;
}

@Schema({ timestamps: false, _id: false })
export class CompanySettings {
  @Prop({ type: ReminderScheduleSettings })
  reminderSchedule: ReminderScheduleSettings;

  @Prop({ default: false })
  autoReminders: boolean;

  @Prop({ default: false })
  emailNotifications: boolean;

  @Prop({ type: DeadlineSettings })
  deadline: DeadlineSettings;
}

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

  @Prop({ type: CompanySettings })
  settings: CompanySettings;

  @Prop({ default: 'active' })
  status: 'active' | 'inactive' | 'suspended';
}

export const CompanySchema = SchemaFactory.createForClass(Company);

// Add instance methods to the schema
CompanySchema.methods.getDateLimit = function(year?: number, month?: number): Date {
  if (!this.settings?.deadline) {
    // Fallback to default settings if deadline settings are not configured
    return calculateDeadlineDate('fixed_day', 5, 1, 1, year, month);
  }

  const { strategy, day, daysFromStart, daysFromEnd } = this.settings.deadline;
  
  return calculateDeadlineDate(
    strategy,
    day,
    daysFromStart,
    daysFromEnd,
    year,
    month
  );
};

// Indexes for better query performance
CompanySchema.index({ cnpj: 1 });
CompanySchema.index({ email: 1 });
CompanySchema.index({ status: 1 });
