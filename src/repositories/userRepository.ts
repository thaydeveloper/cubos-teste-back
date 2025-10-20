import { prisma } from "@/config/database";
import { RegisterInput } from "@/types/auth";
import { UserPublic } from "@/types/user";

export class UserRepository {
  static async findByEmail(email: string): Promise<any> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async findById(id: string): Promise<any> {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  static async create(
    data: RegisterInput & { password: string }
  ): Promise<any> {
    return prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
  }

  static async createRefreshToken(
    userId: string,
    token: string,
    expiresAt: Date
  ): Promise<any> {
    return prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  static async findRefreshToken(token: string): Promise<any> {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  static async deleteRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    });
  }

  static async deleteAllUserRefreshTokens(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  static toPublic(user: any): UserPublic {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
