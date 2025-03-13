import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  /**
   * This method is responsible for handling user registration. First it checks, If an user with the specified email exists.
   * If not, user is registered. Otherwise, ConflictException is thrown.
   *
   * @param registerUserDetails - An object containing all required user dataproperties for registration
   * @throws ConflictException
   */
  async registerUser(registerUserDetails: Partial<User>) {
    const user = await this.usersService.findOneByEmail(
      registerUserDetails.email as string,
    );

    if (!user) {
      await this.usersService.createUser(registerUserDetails);
    } else {
      throw new ConflictException(
        'User with that email already exists. Please choose new email!',
      );
    }
  }

  /**
   * This function performs user sign in by generating JWT Token. If the user with the specified mail
   * is found and user's password and request body password match, specific JWT Token will be generated
   * for authorization. If user is not found or password don't match, UnauthorizedException will be thrown.
   *
   * @param email - Email of the desired user
   * @param password - Password of the desired user
   * @returns JWT Token for the specified user if exists
   * @throws If the specified user was not found
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
