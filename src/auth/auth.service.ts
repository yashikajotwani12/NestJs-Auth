import { Injectable, UnauthorizedException, ConflictException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from "src/dto/user/create-user.dto";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async signIn(email: string, pass: string) {
    const user = await this.usersService.findOneBy(email);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(payload: CreateUserDto) {
    try {
      // Hash the password before saving the user
      const hashedPassword = await bcrypt.hash(payload.password, 10);
      const user = await this.usersService.create({
        ...payload,
        password: hashedPassword,
      });
      return user;
    } catch (error) {
      if (error.code === 'P2002' && error.meta?.target.includes('email')) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }
}