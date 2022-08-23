import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ScrapeConfigService } from './scrapeconfig.service';
import { ApiTags } from '@nestjs/swagger';
import { Config } from '../../src/schemas/config.schema';
import { ConfigRequestDto } from '@dominator/api-interfaces';

@ApiTags('Config')
@Controller('config')
export class ScrapeConfigController {

	constructor(
		private readonly configService: ScrapeConfigService
	) {}

	@Get()
	async getAllConfigs(): Promise<Config[]> {
		return this.configService.getAllConfigs();
	}
  
	@Get(':id')
	async getConfigWithId(@Param('id') configId: string): Promise<Config> {
		return this.configService.getConfigWithId(configId);
	}

	@Post()
	async saveConfig(@Body() body: ConfigRequestDto): Promise<Config> {
		return this.configService.saveConfig(body);
	}
  
	@Delete(':id')
	async deleteConfig(@Param('id') configId: string): Promise<void> {
		return this.configService.deleteConfig(configId);
	}
}
