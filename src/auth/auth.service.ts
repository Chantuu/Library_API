import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * This function performs user sign in by generating JWT Token. If the user with the specified mail
   * is found and user's password and request body password match, specific JWT Token will be generated
   * for authorization. If user is not found or password don't match, UnauthorizedException will be thrown.
   *
   * @param {string} email - Email of the desired user
   * @param {string} password - Password of the desired user
   * @returns {string} JWT Token for the specified user if exists
   * @throws {UnauthorizedException} If the specified user was not found
   */
  async authenticateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { userEmail: email };
      const jwtToken = await this.jwtService.signAsync(payload);
      return jwtToken;
    } else {
      throw new UnauthorizedException(
        'Entered credentials are invalid. Please, try again!',
      );
    }
  }
}
