import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostBookBodyDTO } from './dtos/postBookBody.dto';
import { BooksService } from './books.service';
import { GetUser } from 'src/utilities/decorators/user.decorator';
import { User } from 'src/users/user.entity';
import { formatResponse } from 'src/utilities/functions/formatRepsonse';
import { IntIdParam } from 'src/utilities/decorators/intIdParam.decorator';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  /**
   * This is a handler for GET /books endpoint. This handler can recieve optional query parameters,
   * number type query parameters are properly validated. It returns customized and paginated result
   * of the found Book entities as a response based on those query parameters.
   */
  @Get()
  async findAllBooks(
    @Query('itemsOnPage', new ParseIntPipe({ optional: true }))
    itemsOnPage?: number,
    @Query('page', new ParseIntPipe({ optional: true }))
    page?: number,
    @Query('author') author?: string,
    @Query('genre') genre?: string,
    @Query('publishYear', new ParseIntPipe({ optional: true }))
    publishYear?: number,
  ) {
    return await this.booksService.getPaginatedBooks(
      itemsOnPage,
      page,
      author,
      genre,
      publishYear,
    );
  }

  /**
   * This is a handler for GET /books/:id endpoint. It requires id as a url parameter
   * to find specific Book. If that Book entity is found, it is returned. Otherwise,
   * a proper error response is returned to the user.
   */
  @Get(':id')
  async findBookById(@IntIdParam('id') id: number) {
    const result = await this.booksService.findOneById(id);

    if (result) {
      return formatResponse(result);
    } else {
      throw new BadRequestException(
        'User with the provided id could not be found. Please, provide correct id!',
      );
    }
  }

  /**
   * This is a handler for the POST /books endpoint. It validates and creates new Book
   * resource based on the details provided by the request body. It newly created Book
   * resource or correct error response.
   */
  @Post()
  @UseGuards(AuthGuard)
  async addBook(@Body() postBookBody: PostBookBodyDTO, @GetUser() user: User) {
    return formatResponse(
      await this.booksService.createBook(postBookBody, user),
      'A new book has successfully been added',
    );
  }
}
