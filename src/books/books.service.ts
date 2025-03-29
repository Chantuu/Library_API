import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { AuthorsService } from 'src/authors/authors.service';
import { PostBookBodyDTO } from './dtos/postBookBody.dto';
import { User } from 'src/users/user.entity';
import { Author } from 'src/authors/author.entity';
import { paginateResponse } from 'src/utilities/functions/paginateResponse';
import { PatchBookBodyDTO } from './dtos/patchBookBody.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    private authorsService: AuthorsService,
  ) {}

  /**
   * This method is responsible for creating new Book. It first checks for the existence  of
   * the specified book and author. If book with that properties exists, operation is immidiately
   * aborted and nest ConflictException is thrown. Otherwise, new book is created and associated with
   * current user. After that, author association logic is handled by addBookToAuthor method.
   *
   * @param bookData - Object containing all properties necessary for new Book creation
   * @param currentUser - Current user performing this operation
   * @returns Newly created Book
   * @throws ConflictException
   */
  async createBook(bookData: PostBookBodyDTO, currentUser: User) {
    const authorExists = await this.authorsService.findOneByName(
      bookData.author,
      true,
    );
    const bookExists = await this.booksRepository.findOne({
      where: {
        title: bookData.title,
        genre: bookData.genre,
        publishedYear: bookData.publishedYear,
      },
    });

    // If that book does not exist
    if (!bookExists) {
      const newBook = this.booksRepository.create({
        ...(bookData.description && { description: bookData.description }), // Add book description if it was provided in the request body
        title: bookData.title,
        genre: bookData.genre,
        publishedYear: bookData.publishedYear,
      });
      newBook.uploadedBy = currentUser; // Adding relationship that newly created book was uploaded by current user

      await this.addBookToAuthor(
        bookData.author,
        authorExists,
        newBook,
        currentUser,
        true,
      );

      await this.booksRepository.save(newBook);
      return newBook;
    } else {
      throw new ConflictException(
        'This book already exists. Please add new book!',
      );
    }
  }

  /**
   * This is a helper method for createBook method. This method adds newly created book to the desired
   * author if it exists. If this author does not exist, it is created using authorsService and new book
   * is added. If author exists, but it is uploaded by another user, current user can not add book to that
   * author. New author creation can be specified by providing createNewAuthor argument, which will create
   * new author if desired.
   *
   * @param authorName - Name for new author. (Used, if author with current name does not exist)
   * @param authorExists - Result of the findOne operation for Author entity.
   * @param book - Desired Book to be added to the desired author
   * @param currentUser - Current user performing this operation.
   * @param createNewAuthor - Boolean value, if creating new author is desired behavior
   * @throws BadRequestException
   * @throws UnauthorizedException
   */
  private async addBookToAuthor(
    authorName: string,
    authorExists: Author | null,
    book: Book,
    currentUser: User,
    createNewAuthor: boolean = false,
  ) {
    // If author exists and author was uploaded by current user
    if (authorExists && authorExists.uploadedBy?.id === currentUser.id) {
      book.author = authorExists;
    }
    // If author does not exist and user wants to create new author
    else if (!authorExists && createNewAuthor) {
      const newAuthor = await this.authorsService.createAuthorByName(
        authorName,
        currentUser,
      );
      book.author = newAuthor;
      // If author does not exist and user does not want to create new author
    } else if (!authorExists && !createNewAuthor) {
      throw new BadRequestException(
        'Specified author does not exist. Please choose existing author!',
      );
    }
    // If author exists, but was not uploaded by the current user
    else {
      throw new UnauthorizedException(
        'You can not modify resources uploaded by other users!',
      );
    }
  }

  /**
   * This method is responsible for returing paginated results of the Book entities based on the provided optional
   * parameters. First two optional parameters are responsible for customizing pagination. Last three optional
   * parameters are used to filter Book entities and return filtered result
   *
   * @param itemsOnPage - (optional) Desired number of items on a page
   * @param page - (optional) Desired page
   * @param author - (optional) Filter items based on a desired author
   * @param genre - (optional) Filter items based on a desired genre
   * @param publishedYear - (optional) Filter items based on a desired publish year
   * @returns Paginated result of the found Books
   */
  async getPaginatedBooks(
    itemsOnPage?: number,
    page?: number,
    author?: string,
    genre?: string,
    publishedYear?: number,
  ) {
    // TypeORM where clause object
    const searchCriterium = {
      ...(genre && { genre }),
      ...(publishedYear && { publishedYear }),
      ...(author && { author: { name: author } }),
    };

    // TypeORM relations clause object
    const relationCriterium = {
      author: true,
      uploadedBy: true,
    };

    return await paginateResponse<Book>(
      this.booksRepository,
      itemsOnPage,
      page,
      searchCriterium,
      relationCriterium,
    );
  }

  /**
   * This method tries to find a Book entity based on the supplied id parameter.
   * If Book entity with that Id is found, it is returned. Otherwise, this method
   * returns null.
   *
   * @param id - Id of the desired Book entity
   * @returns Found Book entity or null
   */
  findOneById(id: number) {
    return this.booksRepository.findOne({
      where: { id },
      relations: { author: true, uploadedBy: true },
    });
  }

  /**
   * This method is responsible for updating existing desired book. It updates this method based
   * on the provided object containing all properties with new data. It also will check for the uploader
   * of the specified book and existence of the specified author. This method will update book
   * with initialized propeties from this object and return updated book. If this book was uploaded by
   * another user or specified author does not exist, it will throw corresponding nest exception.
   *
   * @param id - Id of the desired Book
   * @param bookData - Object containing all properties for updating desired Book
   * @param currentUser - Current User performing this operation
   * @returns Updated Book
   * @throws ForbiddenException
   * @throws BadRequestException
   */
  async updateBook(id: number, bookData: PatchBookBodyDTO, currentUser: User) {
    const bookExists = await this.findOneById(id);

    // If a book with specified id exists and current user is uploader of that book
    if (bookExists && bookExists.uploadedBy?.id === currentUser.id) {
      if (bookData.title) {
        bookExists.title = bookData.title;
      }
      if (bookData.genre) {
        bookExists.genre = bookData.genre;
      }
      if (bookData.publishedYear) {
        bookExists.publishedYear = bookData.publishedYear;
      }
      if (bookData.author) {
        await this.updateBookAuthor(bookData.author, bookExists, currentUser);
      }
      if (bookData.description) {
        bookExists.description = bookData.description;
      }

      const updatedBook = this.booksRepository.save(bookExists);
      return updatedBook;
    }
    // If that book was uploaded by another user
    else if (bookExists && bookExists.uploadedBy?.id !== currentUser.id) {
      throw new ForbiddenException(
        'You can not modify resources uploaded by other users!',
      );
    } else {
      throw new BadRequestException(
        'The book with specified id does not exist. Please, type correct id!',
      );
    }
  }

  /**
   * This is a helper method for updateBook() method, which contains logic to properly
   * update author of the desired Book. It uses addBookToAuthor() method to update author
   * properly.
   *
   * @param authorName - Name of the author for updating Book
   * @param currentBook - Desired Book to be updated
   * @param currentUser - Current User performing this operation
   */
  private async updateBookAuthor(
    authorName: string,
    currentBook: Book,
    currentUser: User,
  ) {
    const authorExists = await this.authorsService.findOneByName(
      authorName,
      true,
    );

    await this.addBookToAuthor(
      authorName,
      authorExists,
      currentBook,
      currentUser,
    );
  }

  /**
   * This method is responsible for deleting a Book entity based on given id and
   * user entity. It checks for existence of that book and if it's uploader's id
   * matches current user's id. In case this condition is satisfied, specified
   * Book entity is deleted. Otherwise, corresponding nest exception is thrown.
   *
   * @param bookId - Id of the desired book
   * @param currentUser - User performing current operation
   * @returns Deleted Book entity
   * @throws ForbiddenException
   * @throws BadRequestException
   */
  async deleteBook(bookId: number, currentUser: User) {
    const bookExists = await this.findOneById(bookId);

    // If specified book exists and that book was uploaded by current user
    if (bookExists && bookExists.uploadedBy?.id === currentUser.id) {
      const deletedBook = this.booksRepository.remove(bookExists);
      return deletedBook;
    }
    // If Specified book exists, but was not uploaded by current user
    else if (bookExists && bookExists.uploadedBy?.id !== currentUser.id) {
      throw new ForbiddenException(
        'You can not modify resources uploaded by other users!',
      );
    } else {
      throw new BadRequestException(
        'The book with specified id does not exist. Please, type correct id!',
      );
    }
  }
}
