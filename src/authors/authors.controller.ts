import {
  BadRequestException,
  Controller,
  Get,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { IntIdParam } from 'src/utilities/decorators/intIdParam.decorator';
import { formatResponse } from 'src/utilities/functions/formatRepsonse';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  /**
   * This is a handler for GET /authors endpoint. It retrieves all existing Author entities
   * from database and returns them paginated. itemsOnPage and page are optional query parameters
   * used to customize pagination output. It also has query parameter validation built-in.
   */
  @Get()
  async getAllAuthors(
    @Query('itemsOnPage', new ParseIntPipe({ optional: true }))
    itemsOnPage?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    return await this.authorsService.getAllAuthorsPaginated(itemsOnPage, page);
  }

  /**
   * This is a handler for GET /authors/:id endpoint. It retrieves specific Author entity
   * based on id url paramter. It has id type validation built-in. If url param is correctly
   * validated and Author with that id exists, that AUthor entity is returned as a response.
   * Otherwise, correct error response is sent.
   */
  @Get(':id')
  async getOneAuthor(@IntIdParam('id') authorId: number) {
    const authorExists = await this.authorsService.findOneById(authorId);
    if (authorExists) {
      return formatResponse(authorExists);
    } else {
      throw new BadRequestException(
        'The author with provided id does not exist. Please, provide correct id!',
      );
    }
  }
}
