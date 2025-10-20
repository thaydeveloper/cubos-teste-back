import { UserRepository } from "@/repositories/userRepository";
import { hashPassword, comparePassword } from "@/utils/password";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from "@/utils/jwt";
import { RegisterInput, LoginInput, RefreshTokenInput } from "@/types/auth";
import { AuthResponse, UserPublic } from "@/types/user";
import { AppError } from "@/middlewares/errorHandler";

export class AuthService {
  static async register(data: RegisterInput): Promise<AuthResponse> {
    const existingUser = await UserRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError("Email já está em uso", 400);
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await UserRepository.create({
      ...data,
      password: hashedPassword,
    });

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await UserRepository.createRefreshToken(
      user.id,
      refreshToken,
      getRefreshTokenExpiry()
    );

    return {
      user: UserRepository.toPublic(user),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async login(data: LoginInput): Promise<AuthResponse> {
    const user = await UserRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const isPasswordValid = await comparePassword(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Credenciais inválidas", 401);
    }

    const payload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    await UserRepository.deleteAllUserRefreshTokens(user.id);
    await UserRepository.createRefreshToken(
      user.id,
      refreshToken,
      getRefreshTokenExpiry()
    );

    return {
      user: UserRepository.toPublic(user),
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  static async refreshToken(data: RefreshTokenInput): Promise<AuthResponse> {
    try {
      const payload = verifyRefreshToken(data.refreshToken);

      const storedToken = await UserRepository.findRefreshToken(
        data.refreshToken
      );
      if (!storedToken || storedToken.expiresAt < new Date()) {
        throw new AppError("Refresh token inválido ou expirado", 401);
      }

      const user = await UserRepository.findById(payload.userId);
      if (!user) {
        throw new AppError("Usuário não encontrado", 404);
      }

      const newPayload = { userId: user.id, email: user.email };
      const accessToken = generateAccessToken(newPayload);
      const refreshToken = generateRefreshToken(newPayload);

      await UserRepository.deleteRefreshToken(data.refreshToken);
      await UserRepository.createRefreshToken(
        user.id,
        refreshToken,
        getRefreshTokenExpiry()
      );

      return {
        user: UserRepository.toPublic(user),
        tokens: {
          accessToken,
          refreshToken,
        },
      };
    } catch (error) {
      throw new AppError("Refresh token inválido", 401);
    }
  }

  static async getMe(userId: string): Promise<UserPublic> {
    const user = await UserRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    return UserRepository.toPublic(user);
  }

  static async logout(refreshToken: string): Promise<void> {
    try {
      await UserRepository.deleteRefreshToken(refreshToken);
    } catch (error) {
      // Ignore error if token doesn't exist
    }
  }
}
