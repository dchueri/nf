import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Invitation, InvitationStatus } from './schemas/invitation.schema';
import { CreateInvitationDto } from './dto/create-invitation.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class InvitationsService {
  constructor(
    @InjectModel(Invitation.name) private invitationModel: Model<Invitation>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createInvitationDto: CreateInvitationDto, companyId: string, invitedBy: string): Promise<Invitation> {
    // Check if user already exists
    const existingUser = await this.userModel.findOne({
      email: createInvitationDto.email,
      companyId: new Types.ObjectId(companyId),
    });

    if (existingUser) {
      throw new BadRequestException('Usuário já existe na empresa');
    }

    // Check if invitation already exists
    const existingInvitation = await this.invitationModel.findOne({
      email: createInvitationDto.email,
      companyId: new Types.ObjectId(companyId),
      status: InvitationStatus.PENDING,
    });

    if (existingInvitation) {
      throw new BadRequestException('Convite já existe para este email');
    }

    const invitation = new this.invitationModel({
      ...createInvitationDto,
      companyId: new Types.ObjectId(companyId),
      invitedBy: new Types.ObjectId(invitedBy),
      status: InvitationStatus.PENDING,
    });

    return invitation.save();
  }

  async findAll(companyId: string): Promise<Invitation[]> {
    return this.invitationModel
      .find({ companyId: new Types.ObjectId(companyId) })
      .populate('invitedBy', 'name email')
      .populate('teamId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string, companyId: string): Promise<Invitation> {
    const invitation = await this.invitationModel
      .findOne({
        _id: new Types.ObjectId(id),
        companyId: new Types.ObjectId(companyId),
      })
      .populate('invitedBy', 'name email')
      .populate('teamId', 'name')
      .exec();

    if (!invitation) {
      throw new NotFoundException('Convite não encontrado');
    }

    return invitation;
  }

  async update(id: string, updateInvitationDto: Partial<CreateInvitationDto>, companyId: string): Promise<Invitation> {
    const invitation = await this.findOne(id, companyId);
    
    Object.assign(invitation, updateInvitationDto);
    return invitation.save();
  }

  async cancel(id: string, companyId: string): Promise<Invitation> {
    const invitation = await this.findOne(id, companyId);
    
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Apenas convites pendentes podem ser cancelados');
    }

    invitation.status = InvitationStatus.CANCELLED;
    return invitation.save();
  }

  async resend(id: string, companyId: string): Promise<Invitation> {
    const invitation = await this.findOne(id, companyId);
    
    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Apenas convites pendentes podem ser reenviados');
    }

    // Update expiration date to extend the invitation
    invitation.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    return invitation.save();
  }

  async accept(id: string, userId: string): Promise<Invitation> {
    const invitation = await this.invitationModel.findById(id);
    
    if (!invitation) {
      throw new NotFoundException('Convite não encontrado');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Convite não está mais válido');
    }

    if (new Date() > new Date(invitation.expiresAt)) {
      invitation.status = InvitationStatus.EXPIRED;
      await invitation.save();
      throw new BadRequestException('Convite expirado');
    }

    invitation.status = InvitationStatus.ACCEPTED;
    invitation.acceptedAt = new Date();
    await invitation.save();

    // TODO: Add user to teams if specified
    // This will be implemented when team management is ready

    return invitation;
  }

  async decline(id: string): Promise<Invitation> {
    const invitation = await this.invitationModel.findById(id);
    
    if (!invitation) {
      throw new NotFoundException('Convite não encontrado');
    }

    if (invitation.status !== InvitationStatus.PENDING) {
      throw new BadRequestException('Convite não está mais válido');
    }

    invitation.status = InvitationStatus.DECLINED;
    invitation.declinedAt = new Date();
    return invitation.save();
  }

  async findByEmail(email: string, companyId: string): Promise<Invitation[]> {
    return this.invitationModel
      .find({
        email,
        companyId: new Types.ObjectId(companyId),
      })
      .populate('invitedBy', 'name email')
      .populate('teamId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getPendingInvitations(companyId: string): Promise<Invitation[]> {
    return this.invitationModel
      .find({
        companyId: new Types.ObjectId(companyId),
        status: InvitationStatus.PENDING,
      })
      .populate('invitedBy', 'name email')
      .populate('teamId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getInvitationStats(companyId: string) {
    const total = await this.invitationModel.countDocuments({
      companyId: new Types.ObjectId(companyId),
    });

    const pending = await this.invitationModel.countDocuments({
      companyId: new Types.ObjectId(companyId),
      status: InvitationStatus.PENDING,
    });

    const accepted = await this.invitationModel.countDocuments({
      companyId: new Types.ObjectId(companyId),
      status: InvitationStatus.ACCEPTED,
    });

    const declined = await this.invitationModel.countDocuments({
      companyId: new Types.ObjectId(companyId),
      status: InvitationStatus.DECLINED,
    });

    const expired = await this.invitationModel.countDocuments({
      companyId: new Types.ObjectId(companyId),
      status: InvitationStatus.EXPIRED,
    });

    return {
      total,
      pending,
      accepted,
      declined,
      expired,
    };
  }
}
