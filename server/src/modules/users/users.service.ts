import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types } from 'mongoose';
import { User, UserRole, UserStatus } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedResponseDto } from 'src/common/dto/response.dto';
import { InvoiceStatus } from '../invoices/schemas/invoice.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async cancelInvitation(userId: string, companyId: string): Promise<void> {
    const user = await this.userModel
      .findOne({ _id: userId, status: UserStatus.PENDING, companyId })
      .exec();
    if (!user) {
      throw new NotFoundException(
        'Usuário não encontrado ou não possui um convite pendente',
      );
    }

    await this.userModel.deleteOne({ _id: userId }).exec();
  }

  async getUsersStatsByMonth(
    companyId: string,
    referenceMonth: string,
  ): Promise<{ total: number; approved: number; pending: number }> {
    const filters =
      this.usersThatMustSendInvoicesFilterByReferenceMonth(referenceMonth);
    const companyUsers = await this.userModel.find({ companyId, ...filters });

    const stats = {
      total: companyUsers.length,
      approved: 0,
      pending: 0,
    };
    for (const user of companyUsers) {
      const monthUser = user.monthsWithInvoices.find(
        (month) => month.month === referenceMonth,
      );
      if (monthUser) {
        stats[monthUser.status]++;
      } else {
        stats.pending++;
      }
    }
    return stats;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de usuário inválido');
    }

    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findByCompanyPaginated(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search: string,
    status: UserStatus,
    role: UserRole,
    selectedMonth: string,
    toDashboard: boolean,
    authorId: string,
  ): Promise<PaginatedResponseDto<User>> {
    let filters: FilterQuery<User> = { companyId };
    if (search) {
      filters.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) {
      filters.role = role;
    }

    if (authorId) {
      filters._id = { $ne: authorId };
    }

    filters.status = status ? status : { $ne: UserStatus.INACTIVE };
    if (toDashboard) {
      filters = {
        ...filters,
        ...this.usersThatMustSendInvoicesFilterByReferenceMonth(
          selectedMonth,
          status,
        ),
      };
    }

    const users = await this.userModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    return {
      docs: users,
      total: users.length,
      page,
      limit,
      totalPages: Math.ceil(users.length / limit),
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel
      .findOne({ email, status: { $ne: UserStatus.INACTIVE } })
      .exec();
  }

  async bulkUpdateStatus(userIds: string[], status: UserStatus): Promise<void> {
    await this.userModel
      .updateMany({ _id: { $in: userIds } }, { status })
      .exec();
  }

  async findByCompany(companyId: string): Promise<User[]> {
    return this.userModel.find({ companyId }).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de usuário inválido');
    }

    if (updateUserDto.email) {
      const existingUser = await this.userModel
        .findOne({
          email: updateUserDto.email,
          _id: { $ne: id },
        })
        .exec();

      if (existingUser) {
        throw new ConflictException('Email já está em uso por outro usuário');
      }
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de usuário inválido');
    }

    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async updateLastLogin(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      return;
    }

    await this.userModel
      .findByIdAndUpdate(id, { lastLoginAt: new Date() })
      .exec();
  }

  async updateStatus(id: string, status: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de usuário inválido');
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return updatedUser;
  }

  async inviteCollaborator(email: string, companyId: string): Promise<User> {
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('Usuário com este email já existe');
    }

    const createUserDto: CreateUserDto = {
      email,
      name: email.split('@')[0],
      password: '123456',
      role: 'collaborator' as any,
      companyId,
      status: UserStatus.PENDING,
    };

    return this.create(createUserDto);
  }

  private usersThatMustSendInvoicesFilterByReferenceMonth(
    referenceMonth: string,
    status?: string,
  ): FilterQuery<User> {
    const filters: FilterQuery<User> = {
      createdAt: {
        $lte: dayjs(referenceMonth).endOf('month').toDate(),
      },
      status: UserStatus.ACTIVE,
      role: UserRole.COLLABORATOR,
    };

    if (status) {
      if (status === 'pending') {
        filters.monthsWithInvoices = {
          $elemMatch: {
            month: referenceMonth,
            status: InvoiceStatus.SUBMITTED,
          },
        };
      }

      if (status === 'not_submitted') {
        filters.monthsWithInvoices = {
          $or: [
            {
              $not: {
                $elemMatch: {
                  month: referenceMonth,
                },
              },
            },
            {
              $elemMatch: {
                month: referenceMonth,
                status: InvoiceStatus.REJECTED,
              },
            },
          ],
        };
      }

      if (status === 'approved') {
        filters.monthsWithInvoices = {
          $elemMatch: {
            month: referenceMonth,
            status: { $in: [InvoiceStatus.APPROVED, InvoiceStatus.IGNORED] },
          },
        };
      }
    }
    return filters;
  }
}
