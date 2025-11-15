import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async getMe(@Request() req) {
    // req.user comes from JWT payload
    const user = await this.usersService.findByEmail(req.user.email);

    return {
      _id: user?._id,
      email: user?.email,
      role: user?.role,
    };
  }
}
