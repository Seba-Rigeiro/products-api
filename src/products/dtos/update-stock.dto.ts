import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty()
  @IsNumber()
  stock: number;
}
