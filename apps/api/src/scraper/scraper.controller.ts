import { PreviewDto } from '@dominator/api-interfaces';
import { Body, Controller, Delete, Get, Logger, Param, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ScrapeDBService } from './scrape-db.service';
import { ScraperService } from './scraper.service';
import { ScrapeResult } from '../../src/schemas/scrape-result.schema';
import { PreviewRequestDto } from '@dominator/api-interfaces';

@ApiTags('Scraping')
@Controller('scrape')
export class ScraperController {
	private logger = new Logger(this.constructor.name);

	constructor(
		private readonly scraperService: ScraperService,
		private readonly scraperDBService: ScrapeDBService
	) {}

	@Get('start/:id')
	@ApiOperation({ description: 'Start scraping job.' })
	@ApiOkResponse({ description: 'Successfully started scraping.' })
	async scrape(@Param('id') configId: string): Promise<void> {
		// Add scrape in background
		this.scraperService.scrape(configId);

		return;
	}

	@Post('preview')
	@ApiOperation({ description: 'Get Page preview.' })
	@ApiOkResponse({ description: 'Successfully returned page preview and dom.' })
	async preview(@Body() body: PreviewRequestDto): Promise<PreviewDto> {
		return this.scraperService.preview(body.url);
	}

	@Get('all')
	async getAllConfigs(): Promise<ScrapeResult[]> {
		return this.scraperDBService.getAllScrapes();
	}
  
	@Get('one/:id')
	async getScrapeWithId(@Param('id') scrapeId: string): Promise<ScrapeResult> {
		return this.scraperDBService.getScrapeWithId(scrapeId);
	}
  
	@Get('config/:id')
	async getConfigWithId(@Param('id') configId: string): Promise<ScrapeResult[]> {
		return this.scraperDBService.getScrapesWithConfigId(configId);
	}
  
	@Delete(':id')
	async deleteConfig(@Param('id') scrapeId: string): Promise<void> {
		return this.scraperDBService.deleteScrape(scrapeId);
	}
}
