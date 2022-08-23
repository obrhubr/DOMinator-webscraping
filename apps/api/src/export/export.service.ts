import { ScrapeConfigService } from './../config/scrapeconfig.service';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config, ConfigDocument } from '../../src/schemas/config.schema';
import { ScrapeResult, ScrapeDocument } from '../../src/schemas/scrape-result.schema';

import * as converter from 'json-2-csv';

@Injectable()
export class ExportService {
	private logger = new Logger(this.constructor.name);

	constructor(
		@InjectModel(ScrapeResult.name) private scrapeModel: Model<ScrapeDocument>,
		@InjectModel(Config.name) private configModel: Model<ConfigDocument>,
		private readonly configService: ScrapeConfigService
	) {}

	async createTableFromBlob(configId: string): Promise<Record<string, any>[]> {
		let scrapes = await this.scrapeModel.find({ _config: configId }).exec();

		let scraped = [];

		for (let i = 0; i < scrapes.length; i++) {
			for (let key in scrapes[i].blob) {
				if (scrapes[i].blob[key]?.tablebody) {
					scraped = scraped.concat(scrapes[i].blob[key]?.scraped ?? []);
				}
			}
		};

		return scraped;
	}

	async exportScrapesJSON(configId: string): Promise<string> {
		this.logger.debug(`Exporting data of config ${configId} from DB...`);

		const config = await this.configService.getConfigWithId(configId);

		const scraped = await this.createTableFromBlob(config._id);

		return JSON.stringify({ config, data: scraped });
	}

	async exportScrapesCSV(configId: string): Promise<string> {
		this.logger.debug(`Exporting data of config ${configId} from DB...`);

		let config = await this.configService.getConfigWithId(configId);

		const scraped = await this.createTableFromBlob(config._id);
		
		try {
			return converter.json2csvAsync(scraped);
		} catch (err) {
			throw new InternalServerErrorException(err);
		};
	}
}
