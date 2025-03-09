import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { RegisterUserBodyInterface } from 'src/utilities/interfaces/registerUserBody.interface';
import { hashPassword } from 'src/utilities/functions/hashPassword';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  /**
   * This method creates and saves new User in the database using the properties defined in RegisterUseBodyInterface.
   * Before creating and saving a user, it's password is immidiately hashed for security reasons.
   *
   * @param {RegisterUserBodyInterface} userData - Object containing all user parameters in that interface.
   */
  async createUser(userData: RegisterUserBodyInterface) {
    const hashedPassword = await hashPassword(userData.password);

    userData.password = hashedPassword;

    const user = this.usersRepository.create({ ...userData });
    this.usersRepository.save(user);
  }

  /**
   * This method returns a promise containing the array of all registered users in the database.
   *
   * @returns {Promise<User>[]}
   */
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  /**
   * This method tries to find one user by the email. It returns a promise with the corresponding user
   * or null if that specific user was not found.
   *
   * @param {string} email - Desired user's email
   * @returns {Promise<User | null>}
   */
  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email: email });
  }
}
