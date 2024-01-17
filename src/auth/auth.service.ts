import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(authDto: AuthDto): Promise<string> {
    const { username, password } = authDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    try {
      await this.userRepository.save({ username, password: hashedPassword });
    } catch (error) {
      return 'Failed!';
    }
    return 'Successfully!';
  }

  async signIn(authDto: AuthDto): Promise<string> {
    const { username, password } = authDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      return 'User not found!';
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return 'Wrong password!';
    }
    const loginResponse = await this.loginUser(authDto);
    return `Successfully! ${loginResponse.accessToken}`;
  }

  async loginUser(authDto: AuthDto): Promise<{ accessToken }> {
    const { username, password } = authDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { username };
      const accessToken = await this.jwtService.sign(payload);

      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
