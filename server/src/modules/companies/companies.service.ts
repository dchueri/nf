import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Company } from './schemas/company.schema';
import { CreateCompanyDto } from './dto/create-company.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<Company>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(
    createCompanyDto: CreateCompanyDto,
    userId: string,
  ): Promise<Company> {
    const cpnjExists = await this.companyModel.findOne({
      cnpj: createCompanyDto.cnpj,
    });
    if (cpnjExists) {
      throw new BadRequestException('CNPJ já existe');
    }

    const company = await this.companyModel.create(createCompanyDto);

    console.log('company', company._id)
    console.log('userId', userId)
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { companyId: company._id } },
    );

    return company;
  }

  async findAll(companyId: string): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async findOne(id: string, companyId: string): Promise<Company> {
    const company = await this.companyModel
      .findOne({
        _id: new Types.ObjectId(id),
        companyId: new Types.ObjectId(companyId),
      })
      .populate('ownerId', 'name email')
      .populate('members.userId', 'name email')
      .exec();

    if (!company) {
      throw new NotFoundException('Equipe não encontrada');
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: Partial<CreateCompanyDto>,
    companyId: string,
  ): Promise<Company> {
    const company = await this.findOne(id, companyId);

    Object.assign(company, updateCompanyDto);
    return company.save();
  }

  async remove(id: string, companyId: string): Promise<void> {
    const company = await this.findOne(id, companyId);
    await this.companyModel.deleteOne({ _id: company._id });
  }

  async addMember(
    teamId: string,
    userId: string,
    role: any,
    companyId: string,
  ): Promise<Company> {
    const company = await this.findOne(teamId, companyId);

    // Verify user exists and belongs to company
    const user = await this.userModel.findOne({
      _id: new Types.ObjectId(userId),
      companyId: new Types.ObjectId(companyId),
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Add member

    return company.save();
  }

  async removeMember(
    teamId: string,
    userId: string,
    companyId: string,
  ): Promise<Company> {
    const company = await this.findOne(teamId, companyId);
    return company.save();
  }

  async updateMemberRole(
    teamId: string,
    userId: string,
    role: any,
    companyId: string,
  ): Promise<Company> {
    const company = await this.findOne(teamId, companyId);

    return company.save();
  }

  async getTeamStats(teamId: string, companyId: string) {
    const company = await this.findOne(teamId, companyId);

    return {
      teamId: company._id,
      totalMembers: 0,
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

  async logTeamActivity(
    teamId: string,
    activity: { action: string; details: any },
  ): Promise<void> {
    // TODO: Implement when activity tracking is ready
    console.log('Team activity logged:', { teamId, ...activity });
  }
}
