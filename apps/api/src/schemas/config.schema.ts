import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

export type ConfigDocument = Config & Document;

@Schema({ timestamps: true })
export class Config {
	@Prop({ type: SchemaTypes.String })
	name: string;

	@Prop({ type: SchemaTypes.String })
	url: string;

	@Prop({ type: SchemaTypes.String })
	cron: string;

	@Prop({ type: SchemaTypes.Mixed })
	config: any;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);