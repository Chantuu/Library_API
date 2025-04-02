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
import { authorIdNotFoundErrorMessage } from 'src/utilities/messages/errorMessages.file';
import {
  authorCreatedSuccessMessage,
  authorDeletedSuccessMessage,
  authorUpdatedSuccessMessage,
} from 'src/utilities/messages/successMessages.file';
import { ContentTypeGuard } from 'src/utilities/guards/content-type.guard';
import {
  ApiBadRequestResponse,
  ApiBasicAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@Controller('authors')
export class AuthorsController {
  constructor(private authorsService: AuthorsService) {}

  /**
   * This is a handler for GET /authors endpoint. It retrieves all existing Author entities
   * from database and returns them as a paginated result. itemsOnPage and page are optional
   * query parameters used to customize pagination output. It also has query parameter validation
   * built-in.
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
  @ApiOperation({
    description:
      'This endpoint return paginated results of the available authors in the api.',
  })
  @ApiOkResponse({
    description:
      'Successfully returned paginated results of the registered authors',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect query parameters were provided',
  })
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
   * validated and Author with that id exists, that Author entity is returned as a response.
   * Otherwise, correct error response is sent.
   */
  @ApiParam({
    name: 'id',
    description: 'Id of the desired author',
  })
  @ApiOperation({
    description: 'This endpoint returns a author based on the provided id.',
  })
  @ApiOkResponse({
    description: 'Author was successfully returned',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect user id was provided',
  })
  @Get(':id')
  async getOneAuthor(@IntIdParam('id') authorId: number) {
    const authorExists = await this.authorsService.findOneById(authorId);
    if (authorExists) {
      return formatResponse(authorExists);
    } else {
      throw new BadRequestException(authorIdNotFoundErrorMessage);
    }
  }

  /**
   * This is a handler for POST /authors endpoint. It creates new Author entity based on
   * the provided request body data. This body is properly validated and Further validations
   * are carried out in createAuthor method. In case of successfull validations, new Author
   * is successfully registered and returned as a response. If any of these validations fail,
   * corresponding error response is sent out.
   */
  @ApiBasicAuth('jwtAuth')
  @ApiOperation({
    description:
      'This endpoint creates new author based on data provided in request body.',
  })
  @ApiCreatedResponse({
    description: 'New author was successfully created',
  })
  @ApiBadRequestResponse({
    description: 'Bad request body was provided',
  })
  @ApiConflictResponse({
    description: 'Author with that name already exists',
  })
  @UseGuards(ContentTypeGuard, AuthGuard)
  @Post()
  async createNewAuthor(
    @Body() postAuthorBodyDTO: PostAuthorBodyDTO,
    @GetUser() currentUser: User,
  ) {
    return formatResponse(
      await this.authorsService.createAuthor(postAuthorBodyDTO, currentUser),
      authorCreatedSuccessMessage,
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
  @ApiBasicAuth('jwtAuth')
  @ApiParam({
    name: 'id',
    description: 'Id of the desired author',
  })
  @ApiOperation({
    description:
      'This endpoint updates an author based on a specified id and data in request body.',
  })
  @ApiOkResponse({
    description: 'Author was successfully updated',
  })
  @ApiBadRequestResponse({
    description: 'Incorrect id or bad request body was provided',
  })
  @ApiForbiddenResponse({
    description: "Operation on other user's resource is unauthorized",
  })
  @UseGuards(ContentTypeGuard, AuthGuard)
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
      authorUpdatedSuccessMessage,
    );
  }

  /**
   * This is a handler for DELETE /authors/:id endpoint. This endpoint tries to delete
   * Author based on the supplied id url parameter. This url param is validated. Further
   * validations are carried out in deleteAuthor method. If all validations are successfull,
   * that Author is deleted. Otherwise, corresponding error response is sent.
   */
  @ApiBasicAuth('jwtAuth')
  @ApiParam({
    name: 'id',
    description: 'Id of the desired author',
  })
  @ApiOperation({
    description: 'This method deletes an author based on specified id.',
  })
  @ApiOkResponse({
    description: 'Author was successfully deleted',
  })
  @ApiBadRequestResponse({
    description: 'Incorect id was provided',
  })
  @ApiForbiddenResponse({
    description: "Operation on other user's resource is unauthorized",
  })
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(
    @IntIdParam('id') authorId: number,
    @GetUser() currentUser: User,
  ) {
    return formatResponse(
      await this.authorsService.deleteAuthor(authorId, currentUser),
      authorDeletedSuccessMessage,
    );
  }
}
