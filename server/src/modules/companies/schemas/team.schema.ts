import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum TeamRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  VIEWER = 'viewer',
}

export enum TeamPrivacy {
  PUBLIC = 'public',
  PRIVATE = 'private',
  RESTRICTED = 'restricted',
}

export enum TeamMemberStatus {
  ACTIVE = 'active',
  PENDING = 'pending',
  INACTIVE = 'inactive',
}

@Schema({ _id: false })
export class TeamMember {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ required: true, enum: TeamRole })
  role: TeamRole;

  @Prop({ required: true, enum: TeamMemberStatus, default: TeamMemberStatus.ACTIVE })
  status: TeamMemberStatus;

  @Prop({ required: true, default: Date.now })
  joinedAt: Date;

  @Prop({ type: [String], default: [] })
  permissions: string[];
}

@Schema({ _id: false })
export class TeamSettings {
  @Prop({ default: true })
  allowMemberInvites: boolean;

  @Prop({ default: false })
  requireApproval: boolean;

  @Prop({ required: true, enum: TeamRole, default: TeamRole.MEMBER })
  defaultRole: TeamRole;

  @Prop({ default: 10 })
  maxMembers: number;

  @Prop({ required: true, enum: TeamPrivacy, default: TeamPrivacy.PRIVATE })
  privacy: TeamPrivacy;
}

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Company', required: true })
  companyId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: [TeamMember], default: [] })
  members: TeamMember[];

  @Prop({ type: TeamSettings, required: true })
  settings: TeamSettings;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

// Indexes for better query performance
TeamSchema.index({ companyId: 1 });
TeamSchema.index({ ownerId: 1 });
TeamSchema.index({ 'members.userId': 1 });
TeamSchema.index({ name: 1, companyId: 1 });
