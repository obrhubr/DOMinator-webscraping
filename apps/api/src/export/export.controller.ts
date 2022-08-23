import { Body, Controller, Delete, Get, Logger, Param, Post, Res, StreamableFile, Response, Header } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ExportService } from './export.service';

@ApiTags('Exporting')
@Controller('export')
export class ExportController {
	constructor(
		private readonly exportService: ExportService,
	) {}
  
	@Get('json/:id')
	@Header('Content-Type', 'application/json')
	@Header('Content-Disposition', 'attachment; filename=export.json')
	async exportScrapesJSON(@Param('id') configId: string): Promise<string> {
		return this.exportService.exportScrapesJSON(configId);
	}
  
	@Get('csv/:id')
	@Header('Content-Type', 'application/csv')
	@Header('Content-Disposition', 'attachment; filename=export.csv')
	async exportScrapesCSV(@Param('id') configId: string): Promise<string> {
		return this.exportService.exportScrapesCSV(configId);
	}
}
