import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserService } from './user.service';
import { CustomRequest } from '../types/custom-request.interface';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';

@Controller('/users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  getProfile(@Request() req: CustomRequest) {
    return this.userService.getProfile(req.user.userId);
  }

  @Put('profile')
  updateProfile(@Request() req: CustomRequest, @Body() updateProfileDto: any) {
    return this.userService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Get('roles')
  getRoles() {
    return this.userService.getRoles();
  }

  @Put(':id/role')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('Super-Admin')
  updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.userService.updateRole(id, role);
  }

  @Get()
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super-Admin')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
