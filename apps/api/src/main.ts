import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);

	const options = new DocumentBuilder()
		.setTitle('DOMinator API')
		.setDescription('An API for the dominator project.')
		.setVersion('0.0.1')
		.build();
	const document = SwaggerModule.createDocument(app, options);
	SwaggerModule.setup('docs', app, document);

	app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
	app.enableCors();

	await app.listen(process.env.PORT ? process.env.PORT : 3000);
}
bootstrap();
