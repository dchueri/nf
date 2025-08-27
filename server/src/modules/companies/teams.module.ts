import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamsController } from './teams.controller';
import { TeamsService } from './teams.service';
import { InvitationsController } from './invitations.controller';
import { InvitationsService } from './invitations.service';
import { Team, TeamSchema } from './schemas/team.schema';
import { Invitation, InvitationSchema } from './schemas/invitation.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Team.name, schema: TeamSchema },
      { name: Invitation.name, schema: InvitationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [TeamsController, InvitationsController],
  providers: [TeamsService, InvitationsService],
  exports: [TeamsService, InvitationsService],
})
export class TeamsModule {}
