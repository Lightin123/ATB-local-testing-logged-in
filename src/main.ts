import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './app.module';
import { ServerOptions } from 'socket.io';

const devOrigin = process.env.DEV_FRONTEND_URL;
const prodOrigin = process.env.PROD_FRONTEND_URL;

class CorsIoAdapter extends IoAdapter {
  constructor(private app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const cors = {
      origin: [devOrigin, prodOrigin].filter(Boolean),
      credentials: true,
    };
    return super.createIOServer(port, { ...(options || {}), cors });
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [devOrigin, prodOrigin].filter(Boolean),
    credentials: true,
  });
  app.useWebSocketAdapter(new CorsIoAdapter(app));
  await app.listen(3000);
}
bootstrap();
