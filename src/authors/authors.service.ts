import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { paginateResponse } from 'src/utilities/functions/paginateResponse';

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

  /**
   * This method finds all existing author entities and returns them as paginated result response.
   * Under the scenes, this method uses paginateResponse generic method. First two optional
   * parameters are responsible for customizing pagination
   *
   * @param itemsOnPage - Desired amount of items on one page
   * @param page - Desired page
   * @returns Paginated result of found Author entities
   */
  async getAllAuthorsPaginated(itemsOnPage?: number, page?: number) {
    return await paginateResponse<Author>(
      this.authorsRepository,
      itemsOnPage,
      page,
      undefined, // No search filtering is needed
      { uploadedBy: true, books: true },
    );
  }

  /**
   * This method tries to find AutHor entity with the specified id.
   *
   * @param authorId - Id of the desired Author
   * @returns Author with specified Id or null
   */
  async findOneById(authorId: number) {
    return this.authorsRepository.findOne({
      where: { id: authorId },
      relations: { uploadedBy: true, books: true },
    });
  }
}
