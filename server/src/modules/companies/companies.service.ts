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

    await this.userModel.updateOne(
      { _id: userId },
      { $set: { companyId: company._id } },
    );

    return company;
  }

  async findAll(companyId: string): Promise<Company[]> {
    return this.companyModel.find().exec();
  }

  async findOneById(id: string): Promise<Company> {
    const company = await this.companyModel.findById(id);

    if (!company) {
      throw new NotFoundException('Equipe não encontrada');
    }

    return company;
  }

  async update(
    id: string,
    updateCompanyDto: Partial<CreateCompanyDto>,
  ): Promise<Company> {
    return this.companyModel.findByIdAndUpdate(id, updateCompanyDto, {
      new: true,
    });
  }
}
