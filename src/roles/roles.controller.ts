import { Controller, Post, Param, Body, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post('assign/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('Super-Admin')
  async assignRole(
    @Param('userId') userId: string,
    @Body('role') role: string
  ) {
    return this.rolesService.assignRole(userId, role);
  }
}
