import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('first_user')
  getUser() {
    return this.usersService.getUser();
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
