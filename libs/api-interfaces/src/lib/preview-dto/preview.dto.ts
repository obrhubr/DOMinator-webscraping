import { ApiProperty } from "@nestjs/swagger";

export class PreviewDto {
    @ApiProperty({ description: 'Base64 encoded preview image of the site.' })
    image: string;

    @ApiProperty({ description: 'The DOM of the site.' })
    dom: string;
}
  