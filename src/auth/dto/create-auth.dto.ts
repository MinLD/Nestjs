import { IsEmail, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsEmail()
  @IsNotEmpty({
    message: 'Email không được để trống!',
  })
  email: string;

  @IsNotEmpty({
    message: 'password không được để trống!',
  })
  password: string;

  @IsNotEmpty({
    message: 'name không được để trống!',
  })
  name: string;
}

export class CodeAuthDto {
  @IsNotEmpty({
    message: 'code không được để trống!',
  })
  code: string;

  @IsMongoId()
  @IsNotEmpty({
    message: 'id không được để trống!',
  })
  _id: string;
}
