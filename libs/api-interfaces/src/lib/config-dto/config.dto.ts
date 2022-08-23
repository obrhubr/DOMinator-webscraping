import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString, IsUrl, IsUUID, MinLength } from 'class-validator';

export class ConfigDto {
  @ApiProperty({ description: 'The name of the scrape job' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'The url of the scrape job' })
  @IsUrl()
  @MinLength(1)
  url: string;

  @ApiProperty({ description: 'The cronjob interval for the scrape job' })
  @IsString()
  @MinLength(9)
  cron: string;

  @ApiProperty({ description: 'The dom parsing config' })
  @IsObject()
  config: object;
}
