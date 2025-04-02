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
import { bookIdNotFoundErrorMessage } from 'src/utilities/messages/errorMessages.file';
import {
  bookAddedSuccessMessage,
  bookDeletedSuccessMessage,
  bookUpdatedSuccessMessage,
} from 'src/utilities/messages/successMessages.file';
import { ContentTypeGuard } from 'src/utilities/guards/content-type.guard';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  /**
   * This is a handler for GET /books endpoint. This handler can recieve optional query parameters,
   * number type query parameters are properly validated. It returns customized and paginated result
   * of the found Book entities as a response based on those query parameters.
   */
  @ApiQuery({
    name: 'itemsOnPage',
    description: 'This query specifies amount of items on one page',
    required: false,
  })
  @ApiQuery({
    name: 'page',
    description: 'This query specifies desired page',
    required: false,
  })
  @ApiQuery({
    name: 'author',
    description: 'This query filters result based on provided author',
    required: false,
  })
  @ApiQuery({
    name: 'genre',
    description: 'This query filters result based on provided genre',
    required: false,
  })
  @ApiQuery({
    name: 'publishYear',
    description: 'This query filters result based on provided publish year',
    required: false,
  })
  @ApiOperation({
    description:
      'This endpoint return paginated results of the available books in the api.',
  })
  @ApiOkResponse({
    description:
      'Successfully returned paginated results of the registered books',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect query parameters were provided',
  })
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
  @ApiParam({
    name: 'id',
    description: 'Id of the desired book',
  })
  @ApiOperation({
    description: 'This endpoint returns a book based on the provided id.',
  })
  @ApiOkResponse({
    description: 'Book was successfully returned',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect user id was provided',
  })
  @Get(':id')
  async findBookById(@IntIdParam('id') id: number) {
    const result = await this.booksService.findOneById(id);

    if (result) {
      return formatResponse(result);
    } else {
      throw new BadRequestException(bookIdNotFoundErrorMessage);
    }
  }

  /**
   * This is a handler for the POST /books endpoint. It validates incoming request body.
   * Further validations are carried out in createBook method. If all validations are
   * successfull, new book is created. Otherwise, corresponding error response is sent
   * out.
   */
  @ApiBasicAuth('jwtAuth')
  @ApiOperation({
    description:
      'This endpoint creates new book based on data provided in request body.',
  })
  @ApiCreatedResponse({
    description: 'New book was successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Bad request body was provided',
  })
  @ApiUnauthorizedResponse({
    description: "Operation on other user's resource is unauthorized",
  })
  @Post()
  @UseGuards(ContentTypeGuard, AuthGuard)
  async addBook(@Body() postBookBody: PostBookBodyDTO, @GetUser() user: User) {
    return formatResponse(
      await this.booksService.createBook(postBookBody, user),
      bookAddedSuccessMessage,
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
  @ApiBasicAuth('jwtAuth')
  @ApiParam({
    name: 'id',
    description: 'Id of the desired book',
  })
  @ApiOperation({
    description:
      'This endpoint updates a book based on a specified id and data in request body.',
  })
  @ApiOkResponse({
    description: 'Book was successfully updated',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect id or bad request body was provided',
  })
  @ApiForbiddenResponse({
    description: "Operation on other user's resource is unauthorized",
  })
  @Patch(':id')
  @UseGuards(ContentTypeGuard, AuthGuard)
  async updateBook(
    @IntIdParam('id') id: number,
    @GetUser() user: User,
    @Body(PatchDtoPipe<Book>) patchBookBody: PatchBookBodyDTO,
  ) {
    return formatResponse(
      await this.booksService.updateBook(id, patchBookBody, user),
      bookUpdatedSuccessMessage,
    );
  }

  /**
   * This is a handler for DELETE /books/:id endpoint. It deletes a Book based on a provided
   * id url parameter and user performing this operation. If a Book with that id exists and current
   * User is uploader of that book, it is successfully deleted. Otherwise, corresponding error response
   *  is sent.
   */
  @ApiBasicAuth('jwtAuth')
  @ApiParam({
    name: 'id',
    description: 'Id of the desired book',
  })
  @ApiOperation({
    description: 'This method deletes a book based on specified id.',
  })
  @ApiOkResponse({
    description: 'Book was successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'Incorect id was provided',
  })
  @ApiForbiddenResponse({
    description: "Operation on other user's resource is unauthorized",
  })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteBook(@IntIdParam('id') id: number, @GetUser() user: User) {
    return formatResponse(
      await this.booksService.deleteBook(id, user),
      bookDeletedSuccessMessage,
    );
  }
}
