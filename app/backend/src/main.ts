import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = 3001;

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? port).then(() =>
    console.log(`Server started at port ${port}`)
  );
}
bootstrap();
