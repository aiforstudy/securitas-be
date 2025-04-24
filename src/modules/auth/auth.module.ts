import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from './services/users.service';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { PermissionsGuard } from '../../common/guards/permissions.guard';
import { PermissionsService } from './services/permissions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController, RolesController],
  providers: [
    AuthService,
    JwtStrategy,
    PermissionsService,
    UsersService,
    RolesService,
    PermissionsGuard,
  ],
  exports: [
    AuthService,
    UsersService,
    RolesService,
    PermissionsGuard,
    PermissionsService,
  ],
})
export class AuthModule {}
