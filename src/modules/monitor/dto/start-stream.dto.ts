import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class StartStreamDto {
  @ApiProperty({
    description: 'List of monitor IDs to start streaming',
    example: ['monitor-1', 'monitor-2'],
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  monitor_ids: string[];
}
