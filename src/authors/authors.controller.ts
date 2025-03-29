import {
  BadRequestException,
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import { IntIdParam } from 'src/utilities/decorators/intIdParam.decorator';
import { formatResponse } from 'src/utilities/functions/formatRepsonse';
import { PostAuthorBodyDTO } from './dtos/postAuthorBody.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetUser } from 'src/utilities/decorators/user.decorator';
import { User } from 'src/users/user.entity';
import { PatchAuthorBodyDTO } from './dtos/patchAuthorBody.dto';
import { PatchDtoPipe } from 'src/utilities/pipes/patchDto.pipe';
import { Author } from './author.entity';

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

  /**
   * This is a handler for POST /authors endpoint. It creates new Author entity based on
   * the provided request body data. This body is properly validated and in case of
   * successfull validations, new Author is successfully registered and returned as a
   * response. If any of these validations fail, proper error response is sent.
   */
  @UseGuards(AuthGuard)
  @Post()
  async createNewAuthor(
    @Body() postAuthorBodyDTO: PostAuthorBodyDTO,
    @GetUser() currentUser: User,
  ) {
    return formatResponse(
      await this.authorsService.createAuthor(postAuthorBodyDTO, currentUser),
      'New author has been successfully uploaded!',
    );
  }

  /**
   * This is a handler for PATCH /authors/:id endpoint. It updates Author entity based
   * on specified id url parameter and provided request body data. Url param and request
   * body is properly validated. Further validations are carried out in AuthorsService
   * when updating that Entity. In case of successfull validations, that Author entity
   * is successfully updated and returned as a response. Otherwise, corresponding error
   * response are sent out.
   */
  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateAuthor(
    @IntIdParam('id') authorId: number,
    @Body(PatchDtoPipe<Author>)
    patchAuthorBodyDTO: PatchAuthorBodyDTO,
    @GetUser() currentUser: User,
  ) {
    return formatResponse(
      await this.authorsService.updateAuthor(
        authorId,
        patchAuthorBodyDTO,
        currentUser,
      ),
      'Requested Author has been successfully updated!',
    );
  }
}
