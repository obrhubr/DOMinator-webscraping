import { ApiProperty } from "@nestjs/swagger";
import { IsUrl } from "class-validator";

export class PreviewRequestDto {
    @ApiProperty({ description: 'Url of the site to preview.' })
    @IsUrl()
    url: string;
}
  