import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}
  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) throw new BadRequestException();
    const user = await this.prismaService.user.create({ data: createUserDto });
    return this.removePassword(user);
  }

  async findAll(query: Prisma.UserInclude) {
    const users = await this.prismaService.user.findMany({ include: query });
    return this.removePassword(users);
  }

  async findOneByEmail(email: string) {
    return await this.prismaService.user.findUnique({ where: { email } });
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException();
    return this.removePassword(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const user = await this.prismaService.user.update({
      data: updateUserDto,
      where: { id },
    });

    return this.removePassword(user);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.user.delete({ where: { id } });
    return 'User deleted successfully';
  }

  removePassword(users) {
    if (Array.isArray(users)) {
      users.forEach((user) => {
        delete user.password;
      });
    } else {
      delete users.password;
    }

    return users;
  }
}
