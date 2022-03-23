import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prismaService: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const categoryExist = await this.findByName(createCategoryDto.name);
    if (categoryExist) throw new BadRequestException();
    return this.prismaService.category.create({ data: createCategoryDto });
  }

  findAll(query: Prisma.CategoryInclude) {
    return this.prismaService.category.findMany({ include: query });
  }

  async findOne(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { id },
    });
    if (!category) throw new NotFoundException();
    return category;
  }

  async findByName(name: string) {
    return await this.prismaService.category.findUnique({
      where: {
        name,
      },
    });
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findOne(id);
    return this.prismaService.category.update({
      data: updateCategoryDto,
      where: { id },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prismaService.category.delete({ where: { id } });
    return 'Category deleted successfully';
  }
}
