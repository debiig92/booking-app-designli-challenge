import { IsISO8601, IsNotEmpty, MinLength } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @MinLength(2)
  title!: string;

  @IsISO8601()
  start!: string;

  @IsISO8601()
  end!: string;
}
