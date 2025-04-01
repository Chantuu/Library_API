import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { hashPassword } from 'src/utilities/functions/hashPassword';
import { paginateResponse } from 'src/utilities/functions/paginateResponse';
import { RegisterUserBodyDTO } from 'src/auth/dtos/registerUserBody.dto';
import {
  adminAccountDeleteForbiddenErrorMessage,
  userHasSamePasswordErrorMessage,
  userIdNotFoundErrorMessage,
  userWithEmailExistsErrorMessage,
} from 'src/utilities/messages/errorMessages.file';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  /**
   * This method is responsible for generating Admin user automatically at the
   * application startup. It checks for Admin account existence and if it does
   * not exist, new Admin account is created using environment variables.
   * This method must be used once during module initialization and after TypeORM
   * module initialization.
   */
  async initializeAdmin() {
    const foundResult = await this.usersRepository.findOneBy({ role: 'admin' });

    if (!foundResult) {
      const adminAccount = this.usersRepository.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        password: await hashPassword(process.env.ADMIN_PASSWORD ?? '12345678'), // Generates hashed password
        role: 'admin',
      });
      this.usersRepository.save(adminAccount);
    }
  }

  /**
   * This method creates and saves new User in the database using the properties defined in User entity.
   * Before creating and saving a user, it's password is immidiately hashed for security reasons. If
   * that user already exists, nest ConflictException is thrown.
   *
   * @param userData - Object containing all user parameters.
   * @throws ConflictException
   */
  async createUser(userData: RegisterUserBodyDTO) {
    const exists = await this.findOneByEmail(userData.email as string);

    if (!exists) {
      const hashedPassword = await hashPassword(userData.password as string);

      userData.password = hashedPassword;

      const user = this.usersRepository.create({ ...userData });
      this.usersRepository.save(user);
    } else {
      throw new ConflictException(userWithEmailExistsErrorMessage);
    }
  }

  /**
   * This method returns a response object with paginated array of the User entities. User can
   * provide optional arguments for customizing response pages. It uses paginateResponse generic
   * function under the scenes.
   *
   * @param itemsOnPage - (optional) Desired number of items on a page
   * @param page - (optional) Desired page
   * @returns A promise containing formatted object consisting from paginated User array, total User count and current page.
   */
  async findPaginated(itemsOnPage?: number, page?: number) {
    return await paginateResponse<User>(
      this.usersRepository,
      itemsOnPage,
      page,
      undefined, // No filtering needed
      { uploadedAuthors: true, uploadedBooks: true },
    );
  }

  /**
   * This method tries to find one user by the email. It returns a promise with the corresponding user
   * or null if that specific user was not found.
   *
   * @param email - Desired user's email
   * @param includeRelations - Parameter controlling to include associated entities with this entity
   * @returns Promise containing desired User or null
   */
  findOneByEmail(
    email: string,
    includeRelations: boolean = true,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email },
      relations: {
        uploadedAuthors: includeRelations,
        uploadedBooks: includeRelations,
      },
    });
  }

  /**
   * This method tries to find one user by the id. It returns a promise with the corresponding user
   * or null if that specific user was not found.
   *
   * @param id - Desired User id
   * @param includeRelations - Parameter controlling to include associated entities with this entity
   * @returns Promise containing desired User or null
   */
  findOneById(
    id: number,
    includeRelations: boolean = true,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { id: id },
      relations: {
        uploadedAuthors: includeRelations,
        uploadedBooks: includeRelations,
      },
    });
  }

  /**
   * This method is responsible for updating user data with new information. It finds user by the
   * provided id and updates it by assinging values from userData properties to the corresponding
   * entity properties. Behind the scenes,this method uses private helper methods. It returns updated
   * user. If user is not found, this method throws nest BadRequestException.
   *
   * @param id - Id for finding desired User
   * @param userData - All data to update that User
   * @returns Updated User
   * @throws BadRequestException
   */
  async updateUser(id: number, userData: Partial<User>) {
    const user = await this.findOneById(id);

    // If user is found
    if (user) {
      // If request body has email field
      if (userData.email) {
        await this.updateUserEmail(user, userData.email);
      }
      // If request body has name field
      if (userData.name) {
        this.updateUserName(user, userData.name);
      }
      // If request body has password field
      if (userData.password) {
        await this.updateUserPassword(user, userData.password);
      }

      const updatedUser = await this.usersRepository.save(user);
      return updatedUser;
    } else {
      throw new BadRequestException(userIdNotFoundErrorMessage);
    }
  }

  /**
   * This helper method is responsible for updating specified user's email. First, it checks, that
   * no user exists with the provided email. If true, user's email is updated. Otherwise, it throws
   * nest ConflictException.
   *
   * @param user - Desired User to update
   * @param email - New email
   * @throws ConflictException
   */
  private async updateUserEmail(user: User, email: string) {
    const exists = await this.findOneByEmail(email);

    if (!exists) {
      user.email = email;
    } else {
      throw new ConflictException(userWithEmailExistsErrorMessage);
    }
  }

  /**
   * This helper method is responsible for updating desired user with the specified name.
   *
   * @param user - Desired User to update
   * @param name - New name
   */
  private updateUserName(user: User, name: string) {
    user.name = name;
  }

  /**
   * This helper method is responsible for updating desired user with the specified password. It
   * has built-in protection against updating with the same password. It compares specified password
   * with the user's current password. If different, user's password is updated. Otherwise,
   * nest BadRequestException is thrown.
   *
   * @param user - Desired User to update
   * @param password - New password
   * @throws BadRequestException
   */
  private async updateUserPassword(user: User, password: string) {
    const hashedPassword = await hashPassword(password);

    // If new password and user's current password is different
    if (!(await bcrypt.compare(password, user.password))) {
      user.password = hashedPassword;
    } else {
      throw new BadRequestException(userHasSamePasswordErrorMessage);
    }
  }

  /**
   * This method is responsible for deleting desired user. It searches an User based on the
   * specified id parameter. If found, user with that id is deleted. Otherwise, throws nest
   * BadRequestException.
   *
   * @param id - Desired User to delete
   * @returns Deleted User
   * @throws BadRequestException
   */
  async deleteUser(id: number) {
    const user = await this.findOneById(id);

    if (user && user.role !== 'admin') {
      await this.usersRepository.remove([user]);
      return user;
    } else if (user && user.role === 'admin') {
      throw new ForbiddenException(adminAccountDeleteForbiddenErrorMessage);
    } else {
      throw new BadRequestException(userIdNotFoundErrorMessage);
    }
  }
}
