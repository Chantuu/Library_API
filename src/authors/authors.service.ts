import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { paginateResponse } from 'src/utilities/functions/paginateResponse';
import { PostAuthorBodyDTO } from './dtos/postAuthorBody.dto';
import { PatchAuthorBodyDTO } from './dtos/patchAuthorBody.dto';
import {
  adminAccountDeleteForbiddenErrorMessage,
  authorAlreadyAddedErrorMessage,
  authorIdNotFoundErrorMessage,
  authorWithThatNameExistsErrorMessage,
  otherResourceModificationForbiddenErrorMessage,
} from 'src/utilities/messages/errorMessages.file';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author) private authorsRepository: Repository<Author>,
  ) {}

  /**
   * This method creates new Author, where only it's name is saved. Other properties are
   * uninitialized or use default values. This method checks, if an author with that exact
   * name exists (No regxp used). If it does not exist, new author is created with only name
   * property initialized. Otherwise, nest ConflictException is thrown.
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
      throw new ConflictException(authorAlreadyAddedErrorMessage);
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

  /**
   * This method is responsible for creating new Author entity. This function first validates,
   * that no author with that exact name exists. If that condition is satisfied, new Author
   * entity is successfully created and returned. Otherwise it throws nest ConflictException.
   *
   * @param authorData - Object containing all necessary data to create new Author entity
   * @param currentUser - User performing current operation
   * @returns Newly created Author entity
   * @throws ConflictException
   */
  async createAuthor(authorData: PostAuthorBodyDTO, currentUser: User) {
    const authorExists = await this.authorsRepository.findOne({
      where: {
        name: authorData.name,
      },
      relations: {
        books: true,
        uploadedBy: true,
      },
    });

    // If that author does not exist
    if (!authorExists) {
      const newAuthor = this.authorsRepository.create({
        ...authorData,
      });
      newAuthor.uploadedBy = currentUser; // Associating newly created author with current user
      await this.authorsRepository.save(newAuthor);

      return newAuthor;
    } else {
      throw new ConflictException(authorAlreadyAddedErrorMessage);
    }
  }

  /**
   * This method is responsible for updating desired Author entity with the data
   * provided in authorData object. This method first validates, that Author entity
   * with given id exists and if exists, current user is uploader of that resource.
   * If that condition is true, that Author entity is updated with specified data.
   * Otherwise, this method throws corresponding nest exception.
   *
   * @param authorId - Id of the desired author
   * @param authorData - Object containing all data for updating author
   * @param currentUser - User performing current operation
   * @returns Updated Author Entity
   * @throws ForbiddenException
   * @throws BadRequestException
   */
  async updateAuthor(
    authorId: number,
    authorData: PatchAuthorBodyDTO,
    currentUser: User,
  ) {
    const authorExists = await this.authorsRepository.findOne({
      where: { id: authorId },
      relations: { uploadedBy: true },
    });

    // If author with specified id exists and current user is uploader of that resource
    if (authorExists && authorExists.uploadedBy?.id === currentUser.id) {
      if (authorData.name) {
        await this.updateAuthorName(authorExists, authorData.name);
      }
      if (authorData.biography) {
        this.updateAuthorBiography(authorExists, authorData.biography);
      }
      if (authorData.birthDate) {
        this.updateAuthorBirthDate(authorExists, authorData.birthDate);
      }

      const updatedAuthor = this.authorsRepository.save(authorExists);
      return updatedAuthor;
    }
    // If author with specified id exists, but current user is not uploader of that resource
    else if (authorExists && authorExists.uploadedBy?.id !== currentUser.id) {
      throw new ForbiddenException(
        otherResourceModificationForbiddenErrorMessage,
      );
    } else {
      throw new BadRequestException(authorIdNotFoundErrorMessage);
    }
  }

  /**
   * This is a helper method for updateAuthor method, which updates name of the given
   * Author entity with provided name string argument. First it validates, that no author
   * with that name exists. If that condition is satisfied, Author name is successfully
   * updated. Otherwise, it throws BadRequestException.
   *
   * @param authorToUpdate - Desired Author entity to be updated
   * @param name - Name of the author
   * @throws BadRequestException
   */
  private async updateAuthorName(authorToUpdate: Author, name: string) {
    const anotherAuthorExists = await this.findOneByName(name, false);

    if (!anotherAuthorExists) {
      authorToUpdate.name = name;
    } else {
      throw new BadRequestException(authorWithThatNameExistsErrorMessage);
    }
  }

  /**
   * This is a helper method for updateAuthor method, which updates biography of the
   * given Author entity with supplied biography string argument.
   *
   * @param authorToUpdate - Desired Author entity to be updated
   * @param biography - Biography of the author
   */
  private updateAuthorBiography(authorToUpdate: Author, biography: string) {
    authorToUpdate.biography = biography;
  }

  /**
   * This is a helper method for updateAuthor method, which updates birth date of the
   * given Author entity with supplied birthDate string argument.
   *
   * @param authorToUpdate - Desired Author entity to be updated
   * @param birthDate - Birth date of the author
   */
  private updateAuthorBirthDate(authorToUpdate: Author, birthDate: string) {
    authorToUpdate.birthDate = new Date(birthDate);
  }

  /**
   * This method is responsible for Author entity based on the supplied authorId argument.
   * It validates that author with this id exists and current user is uploader of that resource.
   * If true, this author entity is succcessfully deleted. Otherwise, nest BadRequestException
   * is thrown.
   *
   * @param authorId - Id of the specified author
   * @param currentUser - User performing current operation
   * @returns Deleted Author
   * @throws BadRequestException
   * @throws UnauthorizedException
   */
  async deleteAuthor(authorId: number, currentUser: User) {
    const authorExists = await this.findOneById(authorId);

    // If specified author exists and current user is uploader of that author
    if (authorExists && authorExists.uploadedBy?.id === currentUser.id) {
      const deletedAuthor = await this.authorsRepository.remove(authorExists);
      return deletedAuthor;
    }
    // If specified author exists but current user is not uploader of that author
    else if (authorExists && authorExists.uploadedBy.id !== currentUser.id) {
      throw new UnauthorizedException(adminAccountDeleteForbiddenErrorMessage);
    } else {
      throw new BadRequestException(authorIdNotFoundErrorMessage);
    }
  }
}
