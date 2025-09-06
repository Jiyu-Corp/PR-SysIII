import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';

function extractDTOErrorMessages(errors: ValidationError[]): string[] {
  const msgs: string[] = [];

  function recurse(err: ValidationError) {
    if (err.constraints) {
      msgs.push(...Object.values(err.constraints));
    }
    if (err.children && err.children.length) {
      err.children.forEach(recurse);
    }
  }

  errors.forEach(recurse);
  return msgs;
}
const formatErrorPipe = new ValidationPipe({
  whitelist: true,
  transform: true,
  exceptionFactory: (errors: ValidationError[]) =>
    new BadRequestException(extractDTOErrorMessages(errors)),
});


async function bootstrap() {
  const port = 3001;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Allow your frontend's origin
    methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
    allowedHeaders: '*', // Allow specific headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  // Check DTO 
  app.useGlobalPipes(formatErrorPipe);

  await app.listen(process.env.PORT ?? port).then(() =>
    console.log(`Server started at port ${port}`)
  );
}
bootstrap();