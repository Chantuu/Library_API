import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { AuthorsService } from './authors.service';

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
}
