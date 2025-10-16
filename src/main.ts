import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Log JWT Secret status
  console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'undefined');

  const app = await NestFactory.create(AppModule);

  // Set global API prefix
  app.setGlobalPrefix('api/v1');

  // Enable CORS to allow all origins
  app.enableCors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
   
  });

  const port = process.env.PORT || 5000;

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  logger.log(
    `📊 MongoDB URI: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`
  );
  logger.log(
    `🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Missing'}`
  );
}
bootstrap();
