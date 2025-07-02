import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Log JWT Secret status
  console.log('JWT Secret:', process.env.JWT_SECRET ? 'Set' : 'undefined');

  const app = await NestFactory.create(AppModule);

  // Enable CORS with proper configuration for credentialed requests
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:3000',
      'https://lindo-mart-nest-production.up.railway.app',
      'https://ubiquitous-meringue-177a4c.netlify.app/',
      'https://lindo-mart-flow-forms.netlify.app',
      'https://lindo-mart-flow-forms.netlify.app/login',
    ], // Specific origins instead of '*'
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
    ],
    credentials: true, // Enable credentials
    optionsSuccessStatus: 200, // Some legacy browsers (IE11, various SmartTVs) choke on 204
  });

  const port = process.env.PORT || 5000;

  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(
    `📊 MongoDB URI: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`
  );
  logger.log(
    `🔐 JWT Secret: ${process.env.JWT_SECRET ? 'Configured' : 'Missing'}`
  );
}
bootstrap();
