import { IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsNotEmpty({
    message: 'Username không được để trống!',
  })
  username: string;

  @IsNotEmpty({
    message: 'password không được để trống!',
  })
  password: string;
}
