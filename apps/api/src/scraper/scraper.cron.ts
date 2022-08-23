import { ScraperService } from './scraper.service';
import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class ScraperCron {
	private logger = new Logger(this.constructor.name);

	constructor(
        private readonly scraperService: ScraperService
	) {}

	@Cron('0 0 * * * *')
	async periodicScrape() {
		this.scraperService.periodicScrape();
	}
}