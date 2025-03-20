import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorsRepository: Repository<Author>,
  ) {}

  /**
   * This method creates new Author, where only it's name is saved. Other properties are
   * uninitialized or use default values. This method checks, if an author with that exact
   * name exists (No regxp used). If it does not exist, new author is created with only name
   * property initialized. Otherwise, ConflictException is thrown.
   *
   * @param name - Name of the desired author
   * @param currentUser - User who creates this resource
   * @returns Newly created Author entity
   * @throws ConflictException
   */
  async createAuthorByName(name: string, currentUser: User) {
    const exists = await this.findOneByName(name);

    if (!exists) {
      const createdAuthor = this.authorsRepository.create({ name: name });
      createdAuthor.uploadedBy = currentUser; // Adding relationship that newly created author was uploaded by current user
      return this.authorsRepository.save(createdAuthor);
    } else {
      throw new ConflictException(
        'This author has already been added. Please add new author!',
      );
    }
  }

  /**
   * This method attempts to find an author with that name argument. It returns a promise
   * containing found Author entity or null, if no author was found. includeRelatedEntities
   * argument specifies, if related entities should be included with Author entity.
   *
   * @param name - Name of the desired author
   * @param includeRelatedEntities - Include related entities in Author entity properties
   * @returns A promise containing found Author entity or null
   */
  findOneByName(name: string, includeRelatedEntities: boolean = false) {
    return this.authorsRepository.findOne({
      where: { name: name },
      relations: {
        uploadedBy: includeRelatedEntities,
        books: includeRelatedEntities,
      },
    });
  }
}
