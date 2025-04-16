import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsMongoId({
    message: '_id không hợp lệ',
  })
  @IsNotEmpty({
    message: '_id không được rỗng!',
  })
  _id: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  image: string;
}
