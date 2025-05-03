import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { FormsModule } from '../forms/forms.module';
import { AlertsModule } from '../alerts/alerts.module';
import { UserModule } from '../user/user.module';
@Module({
  imports: [FormsModule, AlertsModule, UserModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
