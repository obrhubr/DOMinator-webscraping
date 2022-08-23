import { forwardRef, Inject, Injectable, InternalServerErrorException, Logger } from "@nestjs/common";
import { FetchService } from "./fetch.service";
import { JSDOM }  from "jsdom";
import { ScrapeDocument, ScrapeResult } from "../../src/schemas/scrape-result.schema";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ScrapeConfigService } from "../../src/config/scrapeconfig.service";
import { DOMinator } from "@dominator/parser";
import { PreviewDto } from '@dominator/api-interfaces';
import { Cron } from "@nestjs/schedule";
import * as cronConverter from "cron-converter";

// Testing deps
import { text } from "../../data/preview";

@Injectable()
export class ScraperService {
	private logger = new Logger(this.constructor.name);

	constructor(
		@Inject(forwardRef(() => FetchService))
		private readonly fetchService: FetchService,
		private readonly scrapeConfigService: ScrapeConfigService,

		@InjectModel(ScrapeResult.name) private scrapeModel: Model<ScrapeDocument>
	) {}

	async scrape(configId: string): Promise<void> {

		this.logger.debug(`Fetch config...`);

		const config = await this.scrapeConfigService.getConfigWithId(configId);

		this.logger.debug(`Fetch page...`);

		const page = await this.fetchService.fetch(config.url);
		const dom = new JSDOM(page);

		this.logger.debug(`Executing scrape...`);

		let result: any;
		try {
			const parser = new DOMinator(config.config);
			result = parser.parse(dom);
		} catch (err) {
			return;
		};

		this.logger.debug(`Finished extracting data, saving to db...`);

		const createdScrape = new this.scrapeModel({ blob: result, _config: configId });
		await createdScrape.save();
	}

	async preview(url: string): Promise<PreviewDto> {
		this.logger.debug(`Fetch page...`);

		if (process.env.ENV == "PROD") {
			return this.fetchService.fetchFromUrlAndGetImage(url);
		} else {
			return text;
		};
	}

	checkCron(cron: string): boolean {
		let hourAgo = new Date(new Date().setHours(new Date().getHours() - 1));
		let now = new Date();

		let previousRun = new cronConverter().fromString(cron).schedule().prev().format();

		if (new Date(previousRun) > hourAgo && new Date(previousRun) < now) {
			return true;
		}

		return false;
	};
	
	async periodicScrape() {
		this.logger.log('Checking for scrape jobs to run...');
		let configs = await this.scrapeConfigService.getAllConfigs();

		for (let config of configs) {
			if (this.checkCron(config.cron)) {
				this.logger.log(`Running scrapejob ${config._id} ...`);
				this.scrape((config as any)._id);
			};
		}
	}
}