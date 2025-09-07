import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
  @Prop({ default: 0 })
  day: number;
  @Prop({ default: 0 })
  daysFromStart: number;
  @Prop({ default: 0 })
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

// Indexes for better query performance
CompanySchema.index({ cnpj: 1 });
CompanySchema.index({ email: 1 });
CompanySchema.index({ status: 1 });
