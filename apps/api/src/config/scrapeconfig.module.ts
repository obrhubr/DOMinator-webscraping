import { Module } from '@nestjs/common';
import { ScrapeConfigService } from './scrapeconfig.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Config, ConfigSchema } from '../../src/schemas/config.schema';
import { ScrapeConfigController } from './scrapeconfig.controller';

@Module({
	imports: [MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }]),],
	controllers: [ScrapeConfigController],
	providers: [ScrapeConfigService],
	exports: [ScrapeConfigService]
})
export class ScrapeConfigModule {}
