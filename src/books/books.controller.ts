import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
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
import { PatchBookBodyDTO } from './dtos/patchBookBody.dto';
import { PatchDtoPipe } from 'src/utilities/pipes/patchDto.pipe';
import { Book } from './book.entity';

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
   * to find specific Book. This url parameter is validated. If that Book entity is found, \
   * it is returned. Otherwise, a proper error response is returned to the user.
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
   * This is a handler for the POST /books endpoint. It validates incoming request body.
   * Further validations are carried out in createBook method. If all validations are
   * successfull, new book is created. Otherwise, corresponding error response is sent
   * out.
   */
  @Post()
  @UseGuards(AuthGuard)
  async addBook(@Body() postBookBody: PostBookBodyDTO, @GetUser() user: User) {
    return formatResponse(
      await this.booksService.createBook(postBookBody, user),
      'A new book has successfully been added',
    );
  }

  /**
   * This is a handler for the PATCH /books/:id endpoint. It validates id url parameter and
   * incoming request body. Further validations are carried out in updateBook method.
   * If validation successfull, this method will try to update book with the provided data.
   * It also checks for book and author uploader to prevent accessing other user's resources.
   * If all of these conditions are met, desired Book is updated and returned to the user.
   * Otherwise, corresponding error response is sent out.
   */
  @Patch(':id')
  @UseGuards(AuthGuard)
  async updateBook(
    @IntIdParam('id') id: number,
    @GetUser() user: User,
    @Body(PatchDtoPipe<Book>) patchBookBody: PatchBookBodyDTO,
  ) {
    return formatResponse(
      await this.booksService.updateBook(id, patchBookBody, user),
      'Requested book has been successfully updated!',
    );
  }

  /**
   * This is a handler for DELETE /books/:id endpoint. It deletes a Book based on a provided
   * id url parameter and user performing this operation. If a Book with that id exists and current
   * User is uploader of that book, it is successfully deleted. Otherwise, corresponding error response
   *  is sent.
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBook(@IntIdParam('id') id: number, @GetUser() user: User) {
    return formatResponse(
      await this.booksService.deleteBook(id, user),
      'Requested book has been successfully deleted!',
    );
  }
}
