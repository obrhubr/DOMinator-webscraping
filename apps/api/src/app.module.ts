import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScraperModule } from './scraper/scraper.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapeConfigModule } from './config/scrapeconfig.module';
import { ExportModule } from './export/export.module';
import { ScheduleModule } from '@nestjs/schedule';
import * as path from 'path';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: !process.env.ENV ? path.join(process.cwd(), '.dev.env') : null
		}),
		ScraperModule,
		ScrapeConfigModule,
		ExportModule,
		MongooseModule.forRoot(`mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`),
		ScheduleModule.forRoot()
	],
	controllers: [],
	providers: []
})
export class AppModule {}
