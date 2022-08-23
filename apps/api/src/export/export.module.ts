import { ScrapeConfigModule } from './../config/scrapeconfig.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from '../../src/schemas/config.schema';
import { ScrapeResult, ScrapeResultSchema } from '../../src/schemas/scrape-result.schema';
import { ExportController } from './export.controller';
import { ExportService } from './export.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: ScrapeResult.name, schema: ScrapeResultSchema }]),
		MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
		ScrapeConfigModule
	],
	controllers: [ExportController],
	providers: [ExportService],
	exports: []
})
export class ExportModule {}
