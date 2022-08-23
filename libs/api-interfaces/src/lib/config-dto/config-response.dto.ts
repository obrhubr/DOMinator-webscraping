import { ApiProperty } from '@nestjs/swagger';
import { ConfigDto } from './config.dto';

export class ConfigResponseDto extends ConfigDto {
    @ApiProperty({ description: 'The id of the scrape job' })
    _id: string;

    @ApiProperty({ description: 'The datetime of the last update' })
    updatedAt: string;

    @ApiProperty({ description: 'The datetime of the creation' })
    createdAt: string;
}
