import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>; //là type đại diện cho document đã được "hydrate" từ class T.
//Nói đơn giản: nó là kiểu dữ liệu mà bạn sẽ nhận được khi truy vấn từ MongoDB.
@Schema({ timestamps: true })
//Decorator đánh dấu class là một Mongoose Schema.
// /timestamps: true sẽ tự động thêm 2 trường:
//createdAt: ngày tạo document.
//updatedAt: ngày cập nhật gần nhất.
export class User {
  @Prop()
  name: string;

  @Prop()
  email: string;

  @Prop()
  password: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  image: string;

  @Prop({ default: 'USERS' })
  role: string;

  @Prop({ default: 'LOCAL' })
  accountType: string;

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  codeId: string;

  @Prop()
  codeExpired: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
