import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, SchemaTypes } from 'mongoose';
import { Config } from './config.schema';

export type ScrapeDocument = ScrapeResult & Document;

@Schema({ timestamps: true })
export class ScrapeResult {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Config' })
	_config: Config;

	@Prop({ type: SchemaTypes.Mixed })
	blob: any;
}

export const ScrapeResultSchema = SchemaFactory.createForClass(ScrapeResult);