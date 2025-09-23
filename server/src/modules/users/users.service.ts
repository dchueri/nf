import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as dayjs from 'dayjs';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, FlattenMaps, Model, Types } from 'mongoose';
import { User, UserRole, UserStatus } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginatedResponseDto } from 'src/common/dto/response.dto';
import { Invoice, InvoiceStatus } from '../invoices/schemas/invoice.schema';
import { comparePassword, hashPassword } from '../../utils/crypt';
import { Company, CompanyDocument } from '../companies/schemas/company.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
  ) {}

  async validateInvite(email: string): Promise<void> {
    const user = await this.userModel
      .findOne({ email, status: UserStatus.PENDING })
      .exec();
    if (!user) {
      throw new NotFoundException('Convite não encontrado');
    }
  }

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

  async getOneUserStatsByMonth(
    user: User,
    referenceMonth: string,
  ): Promise<{
    invoices: Invoice[];
    limitDate: Date;
  }> {
    const company = await this.companyModel.findById(user.companyId);
    const [year, month] = referenceMonth.split('-').map(Number);

    const limitDate = company.getDateLimit(year, month);

    const monthInvoices = await this.invoiceModel
      .find({
        userId: user._id,
        referenceMonth: { $eq: dayjs(referenceMonth).toDate() },
      })
      .sort({ createdAt: -1 });

    return {
      invoices: monthInvoices,
      limitDate,
    };
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
    const monthInvoices = await this.invoiceModel.find({
      companyId,
      referenceMonth: { $eq: new Date(referenceMonth) },
    });
    console.log('monthInvoices', monthInvoices);
    const approvedUsers = new Set<string>();
    const pendingUsers = new Set<string>();
    monthInvoices.forEach((invoice) => {
      if (invoice.status === InvoiceStatus.APPROVED || invoice.status === InvoiceStatus.IGNORED) {
        approvedUsers.add(invoice.userId.toString());
      } else {
        pendingUsers.add(invoice.userId.toString());
      }
    });

    const notSubmittedUsers = companyUsers.filter(
      (user) => !monthInvoices.some(
        (invoice) => invoice.userId.toString() === user._id.toString(),
      ),
    );

    stats.approved = approvedUsers.size;
    stats.pending = pendingUsers.size + notSubmittedUsers.length;
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

  async getUsersWithInvoiceStatus(
    companyId: string,
    referenceMonth: string,
    userInvoiceStatus: string,
    search: string,
    page: number,
    limit: number,
  ): Promise<(FlattenMaps<User> & { invoice: FlattenMaps<Invoice> })[]> {
    console.log(
      companyId,
      referenceMonth,
      userInvoiceStatus,
      search,
      page,
      limit,
    );

    const filters = this.usersThatMustSendInvoicesFilterByReferenceMonth(referenceMonth);
    const companyUsers = await this.userModel
      .find({
        companyId,
        ...filters,
      })
      .lean();

    const userIds = companyUsers.map((user) => user._id);
    const invoiceFilter: FilterQuery<Invoice> = {
      userId: { $in: userIds },
      deletedAt: { $exists: false },
    };
    if (search) {
      invoiceFilter.$or = [
        { invoiceNumber: { $regex: search, $options: 'i' } },
      ];
    }
    if (referenceMonth) {
      invoiceFilter.referenceMonth = {
        $gte: dayjs(referenceMonth).startOf('month').toISOString(),
        $lte: dayjs(referenceMonth).endOf('month').toISOString(),
      };
    }

    let invoicesOfMonth = await this.invoiceModel
      .find(invoiceFilter)
      .sort({ referenceMonth: -1 })
      .lean();

    const usersWithoutInvoice = companyUsers
      .filter(
        (user) =>
          !invoicesOfMonth.some(
            (invoice) => invoice.userId.toString() === user._id.toString(),
          ),
      )
      .map((user) => {
        return {
          ...user,
          invoice: null,
        };
      });
    if (userInvoiceStatus === 'not_submitted') {
      return usersWithoutInvoice;
    }

    const usersThatHaveInvoice = companyUsers.filter((user) =>
      invoicesOfMonth.some(
        (invoice) => invoice.userId.toString() === user._id.toString(),
      ),
    );

    const usersWithInvoice = usersThatHaveInvoice
      .map((user) => {
        const userInvoices = this.getInvoicesByUserId(
          user._id.toString(),
          invoicesOfMonth,
        );

        const invoice = this.getUserInvoiceByPriority(userInvoices);
        if (
          userInvoiceStatus === 'approved' &&
          (invoice.status === InvoiceStatus.APPROVED ||
            invoice.status === InvoiceStatus.IGNORED)
        ) {
          return {
            ...user,
            invoice,
          };
        }
        if (
          userInvoiceStatus === 'rejected' &&
          invoice.status === InvoiceStatus.REJECTED
        ) {
          return {
            ...user,
            invoice,
          };
        }
        if (
          userInvoiceStatus === 'pending' &&
          invoice.status === InvoiceStatus.SUBMITTED
        ) {
          return {
            ...user,
            invoice,
          };
        }
        if (userInvoiceStatus === 'all' || !userInvoiceStatus) {
          return {
            ...user,
            invoice,
          };
        }
      })
      .filter(Boolean);

    if (userInvoiceStatus === 'all' || !userInvoiceStatus) {
      return [...usersWithInvoice, ...usersWithoutInvoice];
    }
    return usersWithInvoice;
  }

  private getUserInvoiceByPriority(
    userInvoices: Invoice[],
    priorityLimit?: InvoiceStatus,
  ): Invoice {
    let invoice = userInvoices.find(
      (invoice) => invoice.status === InvoiceStatus.SUBMITTED,
    );

    if (!invoice) {
      invoice = userInvoices.find(
        (invoice) =>
          invoice.status === InvoiceStatus.APPROVED ||
          invoice.status === InvoiceStatus.IGNORED,
      );
    }
    if (!invoice) {
      invoice = userInvoices.find(
        (invoice) => invoice.status === InvoiceStatus.REJECTED,
      );
    }
    return invoice;
  }

  async findByCompanyPaginated(
    companyId: string,
    page: number = 1,
    limit: number = 10,
    search: string,
    status: UserStatus,
    role: UserRole,
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

    const users = await this.userModel
      .find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    const totalUsers = await this.userModel.countDocuments(filters).exec();

    return {
      docs: users,
      total: totalUsers,
      page,
      limit,
      totalPages: Math.ceil(totalUsers / limit),
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

  async updateWithAuth(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('ID de usuário inválido');
    }

    if (updateUserDto.email) {
      const existingUser = await this.userModel
        .findOne({
          email: updateUserDto.email,
          status: { $ne: UserStatus.INACTIVE },
          _id: { $ne: id },
        })
        .exec();

      if (existingUser) {
        throw new ConflictException('Email já está em uso por outro usuário');
      }
    }

    if (updateUserDto.password) {
      const user = await this.userModel.findById(id).exec();
      if (!user) {
        throw new NotFoundException('Usuário não encontrado');
      }
      const isPasswordValid = await comparePassword(
        updateUserDto.password,
        user.password,
      );
      if (!isPasswordValid) {
        throw new BadRequestException('Senha incorreta');
      }
      updateUserDto.password = await hashPassword(updateUserDto.newPassword);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!updatedUser) {
      throw new NotFoundException('Usuário não encontrado');
    }

    updatedUser.password = undefined;
    return updatedUser;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await hashPassword(updateUserDto.password);
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

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
  ): FilterQuery<User> {
    return {
      createdAt: {
        $lte: dayjs(referenceMonth).endOf('month').toDate(),
      },
      status: UserStatus.ACTIVE,
      role: UserRole.COLLABORATOR,
      deletedAt: { $exists: false },
    };
  }

  private getInvoicesByUserId(userId: string, invoices: Invoice[]): Invoice[] {
    return invoices.filter(
      (invoice) => invoice.userId.toString() === userId.toString(),
    );
  }
}
