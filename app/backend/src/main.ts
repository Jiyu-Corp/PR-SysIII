import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3001;

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Allow your frontend's origin
    methods: 'GET,POST,PUT,DELETE', // Allow specific HTTP methods
    allowedHeaders: '*', // Allow specific headers
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  });

  await app.listen(process.env.PORT ?? port).then(() =>
    console.log(`Server started at port ${port}`)
  );
}
bootstrap();
