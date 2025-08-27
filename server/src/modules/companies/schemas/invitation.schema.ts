import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum InvitationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

@Schema({ timestamps: true })
export class Invitation extends Document {
  @Prop({ required: true })
  email: string;

  @Prop()
  name?: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  teamId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  invitedBy: Types.ObjectId;

  @Prop({ required: true, enum: ['owner', 'admin', 'member', 'viewer'] })
  role: string;

  @Prop({ required: true, enum: InvitationStatus, default: InvitationStatus.PENDING })
  status: InvitationStatus;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop()
  message?: string;

  @Prop()
  acceptedAt?: Date;

  @Prop()
  declinedAt?: Date;
}

export const InvitationSchema = SchemaFactory.createForClass(Invitation);

// Indexes for better query performance
InvitationSchema.index({ email: 1, companyId: 1 });
InvitationSchema.index({ companyId: 1, status: 1 });
InvitationSchema.index({ expiresAt: 1 });
InvitationSchema.index({ invitedBy: 1 });
