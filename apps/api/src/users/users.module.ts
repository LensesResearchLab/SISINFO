import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleSimpleFactory } from '../users/helpers/RoleSimpleFactory';
import { StudentsModule } from '../students/students.module';
import { ProfessorsModule } from '../professors/professors.module';
import { CoordinatorsModule } from '../coordinators/coordinators.module';
import { AdministratorsModule } from '../administrators/administrators.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, RoleSimpleFactory],
  imports: [
    TypeOrmModule.forFeature([User]),
    StudentsModule,
    ProfessorsModule,
    CoordinatorsModule,
    AdministratorsModule,
  ],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
