import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostBookBodyDTO } from './dtos/postBookBody.dto';
import { BooksService } from './books.service';
import { GetUser } from 'src/utilities/decorators/user.decorator';
import { User } from 'src/users/user.entity';
import { formatResponse } from 'src/utilities/functions/formatRepsonse';

@Controller('books')
@UseGuards(AuthGuard)
export class BooksController {
  constructor(private booksService: BooksService) {}

  /**
   * This is a handler for the POST /books endpoint. It validates and creates new Book
   * resource based on the details provided by the request body. It newly created Book
   * resource or correct error response.
   */
  @Post()
  async addBook(@Body() postBookBody: PostBookBodyDTO, @GetUser() user: User) {
    return formatResponse(
      await this.booksService.createBook(postBookBody, user),
      'A new book has successfully been added',
    );
  }
}
