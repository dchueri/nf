import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { Company, CompanySchema } from './schemas/company.schema';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Company.name, schema: CompanySchema },
      { name: Invitation.name, schema: InvitationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [CompaniesController, InvitationsController],
  providers: [CompaniesService, InvitationsService],
  exports: [CompaniesService, InvitationsService],
})
export class CompaniesModule {}
