import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScrapeResult, ScrapeDocument } from '../../src/schemas/scrape-result.schema';

@Injectable()
export class ScrapeDBService {
	private logger = new Logger(this.constructor.name);

	constructor(
		@InjectModel(ScrapeResult.name) private scrapeModel: Model<ScrapeDocument>
	) {}

	async deleteScrape(scrapeId: string): Promise<void> {
		this.logger.debug(`Deleting config #${scrapeId}" from database...`);

		await this.scrapeModel.deleteOne({ _id: scrapeId }).exec();
		return;
	}

	async getAllScrapes(): Promise<ScrapeResult[]> {
		this.logger.debug(`Returning all configs from DB...`);

		return this.scrapeModel.find().exec();
	}

	async getScrapesWithConfigId(configId: string): Promise<ScrapeResult[]> {
		this.logger.debug(`Returning config ${configId} from DB...`);

		let config = await this.scrapeModel.find({ _config: configId }).exec();
		return config;
	}

	async getScrapeWithId(scrapeId: string): Promise<ScrapeResult> {
		this.logger.debug(`Returning config ${scrapeId} from DB...`);

		let config = await this.scrapeModel.findOne({ _id: scrapeId }).exec();
		if (!config) {
			throw new NotFoundException('Could not find scrape with this id.');
		}
		return config;
	}
}
