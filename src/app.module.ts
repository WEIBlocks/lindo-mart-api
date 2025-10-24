import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { FormsModule } from './forms/forms.module';
import { AlertsModule } from './alerts/alerts.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ContactModule } from './contact/contact.module';
import { ItemsModule } from './items/items.module';
import { InventoryModule } from './itemlist/inventory/inventory.module';
import { EquipmentModule } from './itemlist/equipment/equipment.module';
import { ItemListCommonModule } from './itemlist/common/common.module';
import { OperationalAlertsModule } from './itemlist/operational-alerts/operational-alerts.module';
import { Logger } from '@nestjs/common';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI, {
      connectionFactory: (connection) => {
        const logger = new Logger('MongoDB');

        connection.on('connected', () => {
          logger.log('✅ MongoDB Connected successfully');
        });

        connection.on('error', (err) => {
          logger.error('❌ MongoDB Connection error:', err);
        });

        connection.on('disconnected', () => {
          logger.warn('⚠️ MongoDB Disconnected');
        });

        return connection;
      },
    }),
    AuthModule,
    UserModule,
    FormsModule,
    AlertsModule,
    DashboardModule,
    ContactModule,
    ItemsModule,
    InventoryModule,
    EquipmentModule,
    ItemListCommonModule,
    OperationalAlertsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
