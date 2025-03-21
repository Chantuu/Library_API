import {
  ConflictException,
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

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book) private booksRepository: Repository<Book>,
    private authorsService: AuthorsService,
  ) {}

  /**
   * This method is responsible for creating new Book. It first checks for the existence  of
   * the specified book and author. If book with that properties exists, operation is immidiately
   * aborted and error response is sent out. Otherwise, new book is created and associated with
   * current user. After that, author association logic is handled by addBookToAuthor method.
   *
   * @param bookData - Object containing all properties necessary for new Book creation
   * @param currentUser - Current user performing this operation
   * @returns Newly created Book
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
   * author.
   *
   * @param authorName - Name for new author. (Used, if author with current name does not exist)
   * @param authorExists - Result of the findOne operation for Author entity.
   * @param book - Desired Book to be added to the desired author
   * @param currentUser - Current user performing this operation.
   */
  private async addBookToAuthor(
    authorName: string,
    authorExists: Author | null,
    book: Book,
    currentUser: User,
  ) {
    // If author exists and author was uploaded by current user
    if (authorExists && authorExists.uploadedBy?.id === currentUser.id) {
      book.author = authorExists;
    }
    // If author does not exist
    else if (!authorExists) {
      const newAuthor = await this.authorsService.createAuthorByName(
        authorName,
        currentUser,
      );
      book.author = newAuthor;
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
}
