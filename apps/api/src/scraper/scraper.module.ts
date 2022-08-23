import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrapeConfigService } from '../../src/config/scrapeconfig.service';
import { Config, ConfigSchema } from '../../src/schemas/config.schema';
import { ScrapeResult, ScrapeResultSchema } from '../../src/schemas/scrape-result.schema';
import { FetchService } from './fetch.service';
import { ScrapeDBService } from './scrape-db.service';
import { ScraperController } from './scraper.controller';
import { ScraperService } from './scraper.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: ScrapeResult.name, schema: ScrapeResultSchema }]),
		MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),
	],
	controllers: [ScraperController],
	providers: [ScraperService, FetchService, ScrapeConfigService, ScrapeDBService],
	exports: [ScraperService, FetchService, ScrapeDBService]
})
export class ScraperModule {}
