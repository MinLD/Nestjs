import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/modules/users/schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { hashPasswordHelper } from 'src/helpers/util';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  isEmailExist = async (email: string) => {
    const user = await this.userModel.exists({ email }); // Đây là Mongoose method giúp bạn kiểm tra sự tồn tại nhanh của 1 document thỏa mãn điều kiện.
    //Nó không load toàn bộ document, chỉ kiểm tra có hay không → rất nhanh và nhẹ.
    if (user) return true;
    return false;
  };
  async create(createUserDto: CreateUserDto) {
    //Dữ liệu gửi từ client (POST /users) sẽ được truyền vào createUserDto.

    const { name, email, password, phone, address, image } = createUserDto;
    // kiểm tra email đã tồn tại ch?
    const isEmailExist = await this.isEmailExist(email);
    if (isEmailExist) {
      throw new BadRequestException(`Email: ${email} already exists`);
    }

    //Hash Password
    const hashPassword = await hashPasswordHelper(password);

    const user = await this.userModel.create({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      image,
    });
    //Sử dụng this.userModel (được inject từ Mongoose) để tạo mới 1 document trong MongoDB.

    return {
      _id: user._id, //MongoDB sẽ tự động sinh một _id duy nhất (dạng ObjectId) để làm khóa chính cho document này
    };
  }

  findAll = async (query: string, current: number, pageSize: number) => {
    const { filter, sort } = aqp(query);

    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const totalItems = (await this.userModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const skip = (current - 1) * pageSize;

    const results = await this.userModel
      .find(filter)
      .limit(pageSize)
      .skip(skip)
      .sort(sort as any)
      .select('-password');

    return {
      results,
      totalPages,
    };
  };

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }
  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne(
      { _id: updateUserDto._id },
      { ...updateUserDto },
    );
  }

  async remove(_id: string) {
    if (mongoose.isValidObjectId(_id)) {
      return await this.userModel.deleteOne({ _id });
    } else {
      throw new BadRequestException(`_id: ${_id} không đúng định dạng`);
    }
  }
}
