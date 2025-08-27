import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Team, TeamMember, TeamRole, TeamMemberStatus } from './schemas/team.schema';
import { CreateTeamDto } from './dto/create-team.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class TeamsService {
  constructor(
    @InjectModel(Team.name) private teamModel: Model<Team>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createTeamDto: CreateTeamDto, companyId: string, ownerId: string): Promise<Team> {
    const { memberIds, ...teamData } = createTeamDto;

    // Create the team
    const team = new this.teamModel({
      ...teamData,
      companyId: new Types.ObjectId(companyId),
      ownerId: new Types.ObjectId(ownerId),
      members: [
        {
          userId: new Types.ObjectId(ownerId),
          role: TeamRole.OWNER,
          status: TeamMemberStatus.ACTIVE,
          joinedAt: new Date(),
          permissions: ['*'], // Owner has all permissions
        },
      ],
    });

    // Add initial members if specified
    if (memberIds && memberIds.length > 0) {
      const members = await this.userModel.find({
        _id: { $in: memberIds.map(id => new Types.ObjectId(id)) },
        companyId: new Types.ObjectId(companyId),
      });

      for (const member of members) {
        team.members.push({
          userId: member._id as Types.ObjectId,
          role: createTeamDto.settings.defaultRole,
          status: TeamMemberStatus.ACTIVE,
          joinedAt: new Date(),
          permissions: [],
        });
      }
    }

    return team.save();
  }

  async findAll(companyId: string): Promise<Team[]> {
    return this.teamModel
      .find({ companyId: new Types.ObjectId(companyId) })
      .populate('ownerId', 'name email')
      .populate('members.userId', 'name email')
      .exec();
  }

  async findOne(id: string, companyId: string): Promise<Team> {
    const team = await this.teamModel
      .findOne({
        _id: new Types.ObjectId(id),
        companyId: new Types.ObjectId(companyId),
      })
      .populate('ownerId', 'name email')
      .populate('members.userId', 'name email')
      .exec();

    if (!team) {
      throw new NotFoundException('Equipe não encontrada');
    }

    return team;
  }

  async update(id: string, updateTeamDto: Partial<CreateTeamDto>, companyId: string): Promise<Team> {
    const team = await this.findOne(id, companyId);
    
    Object.assign(team, updateTeamDto);
    return team.save();
  }

  async remove(id: string, companyId: string): Promise<void> {
    const team = await this.findOne(id, companyId);
    await this.teamModel.deleteOne({ _id: team._id });
  }

  async addMember(teamId: string, userId: string, role: TeamRole, companyId: string): Promise<Team> {
    const team = await this.findOne(teamId, companyId);
    
    // Check if user is already a member
    const existingMember = team.members.find(
      member => member.userId.toString() === userId
    );
    
    if (existingMember) {
      throw new BadRequestException('Usuário já é membro da equipe');
    }

    // Verify user exists and belongs to company
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
      companyId: new Types.ObjectId(companyId),
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Add member
    team.members.push({
      userId: new Types.ObjectId(userId),
      role,
      status: TeamMemberStatus.ACTIVE,
      joinedAt: new Date(),
      permissions: [],
    });

    return team.save();
  }

  async removeMember(teamId: string, userId: string, companyId: string): Promise<Team> {
    const team = await this.findOne(teamId, companyId);
    
    const memberIndex = team.members.findIndex(
      member => member.userId.toString() === userId
    );
    
    if (memberIndex === -1) {
      throw new NotFoundException('Membro não encontrado na equipe');
    }

    // Prevent removing the owner
    if (team.members[memberIndex].role === TeamRole.OWNER) {
      throw new BadRequestException('Não é possível remover o proprietário da equipe');
    }

    team.members.splice(memberIndex, 1);
    return team.save();
  }

  async updateMemberRole(teamId: string, userId: string, role: TeamRole, companyId: string): Promise<Team> {
    const team = await this.findOne(teamId, companyId);
    
    const member = team.members.find(
      member => member.userId.toString() === userId
    );
    
    if (!member) {
      throw new NotFoundException('Membro não encontrado na equipe');
    }

    // Prevent changing owner role
    if (member.role === TeamRole.OWNER) {
      throw new BadRequestException('Não é possível alterar a função do proprietário');
    }

    member.role = role;
    return team.save();
  }

  async getTeamStats(teamId: string, companyId: string) {
    const team = await this.findOne(teamId, companyId);
    
    const activeMembers = team.members.filter(
      member => member.status === TeamMemberStatus.ACTIVE
    ).length;

    return {
      teamId: team._id,
      totalMembers: team.members.length,
      activeMembers,
      totalInvoices: 0, // TODO: Implement when invoice service is ready
      totalAmount: 0, // TODO: Implement when invoice service is ready
      averageResponseTime: 0, // TODO: Implement when activity tracking is ready
      memberActivity: [], // TODO: Implement when activity tracking is ready
    };
  }

  async getTeamActivities(teamId: string, limit: number = 50): Promise<any[]> {
    // TODO: Implement when activity tracking is ready
    return [];
  }

  async logTeamActivity(teamId: string, activity: { action: string; details: any }): Promise<void> {
    // TODO: Implement when activity tracking is ready
    console.log('Team activity logged:', { teamId, ...activity });
  }
}
