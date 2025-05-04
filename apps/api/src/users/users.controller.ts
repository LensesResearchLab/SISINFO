import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        roles: user.roles,
      };
    } catch (error) {
      throw new UnauthorizedException(`Invalid credentials: ${error}`);
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}
