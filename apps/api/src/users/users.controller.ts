import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string }) {
    try {
      const user = await this.usersService.findByEmail(loginDto.email);
      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }
      /* Verify hashed password */
      const isPasswordValid = await this.usersService.verifyPassword(
        loginDto.password,
        user.password,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      /* Generate JWT token sended to ./auth */
      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      };

      const token = this.jwtService.sign(payload);

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
        access_token: token,
      };
    } catch (error) {
      throw new UnauthorizedException(`Invalid credentials: ${error}`);
    }
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('coordinador', 'admin')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('coordinador', 'admin')
  @Get('roles')
  findAllWithRoles() {
    return this.usersService.findAllWithRoles();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
