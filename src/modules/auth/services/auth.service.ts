import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { UserPermissionsDto } from '../dto/user-permissions.dto';
import * as bcrypt from 'bcrypt';
import { PermissionsService } from './permissions.service';
import { Role } from '../entities/role.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    private readonly jwtService: JwtService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const permissions = await this.permissionsService.getUserPermissions(user);

    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
      permissions,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: await this.getUserPermissions(user),
    };
  }

  async register(registerDto: RegisterDto) {
    const [existingUser, role] = await Promise.all([
      this.userRepository.findOne({
        where: { email: registerDto.email },
      }),
      this.roleRepository.findOne({
        where: { id: registerDto.role_id },
      }),
    ]);

    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    if (!role) {
      throw new UnauthorizedException('Role not found');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const user = this.userRepository.create({
      ...registerDto,
      password: hashedPassword,
    });

    await this.userRepository.save(user);

    const permissions = await this.permissionsService.getUserPermissions(user);
    const formattedPermissions = permissions.flatMap((p) =>
      p.actions.map((action) => `${p.resource}.${action}`),
    );

    const payload = {
      email: user.email,
      sub: user.id,
      permissions: formattedPermissions,
    };

    user.role = role;

    return {
      access_token: this.jwtService.sign(payload),
      user: await this.getUserPermissions(user),
    };
  }

  async getUserPermissionsById(userId: string): Promise<UserPermissionsDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.getUserPermissions(user);
  }

  private async getUserPermissions(user: User): Promise<UserPermissionsDto> {
    const permissions = await this.permissionsService.getUserPermissions(user);

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      company_code: user.company_code,
      permissions,
    };
  }
}
