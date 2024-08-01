import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateUserDto } from "src/dto/user/create-user.dto";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOneBy(email: string): Promise<any | null> {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async create(createUserDto: CreateUserDto) {
    const { id, ...data } = createUserDto;
    return this.prisma.user.create({
      data: {
        ...data,
        createdAt: new Date(),
      },
    });
  }
}