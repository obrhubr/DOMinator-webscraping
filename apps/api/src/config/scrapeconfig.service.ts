import { ConfigRequestDto } from '@dominator/api-interfaces';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config, ConfigDocument } from '../../src/schemas/config.schema';

@Injectable()
export class ScrapeConfigService {
	private logger = new Logger(this.constructor.name);

	constructor(
		@InjectModel(Config.name) private configModel: Model<ConfigDocument>
	) {}

	async saveConfig(newConfig: ConfigRequestDto): Promise<ConfigDocument> {
		this.logger.debug(`Saving new config "${newConfig.name}"...`);

		const createdConfig = new this.configModel(newConfig);

		return createdConfig.save();
	}

	async deleteConfig(configId: string): Promise<void> {
		this.logger.debug(`Deleting config #${configId}" from database...`);

		await this.configModel.deleteOne({ _id: configId }).exec();
		return;
	}

	async getAllConfigs(): Promise<ConfigDocument[]> {
		this.logger.debug(`Returning all configs from DB...`);

		return this.configModel.find().exec();
	}

	async getConfigWithId(configId: string): Promise<ConfigDocument> {
		this.logger.debug(`Returning config ${configId} from DB...`);

		let config = await this.configModel.findOne({ _id: configId }).exec();
		if (!config) {
			throw new NotFoundException('Could not find config with this id.');
		}
		return config;
	}
}
