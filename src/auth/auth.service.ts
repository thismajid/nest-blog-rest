import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from 'src/categories/dto/create-category.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(email: string, password: String) {
    const user = await this.usersService.findOneByEmail(email);
    if (user.password !== password) return false;
    return user;
  }

  registerUser(createUserDto: CreateCategoryDto) {}
}
