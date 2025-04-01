import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AdminGuard } from './admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { PatchUserBodyDTO } from './dtos/patchUserBody.dto';
import { User } from 'src/users/user.entity';
import { PatchDtoPipe } from 'src/utilities/pipes/patchDto.pipe';
import { IntIdParam } from 'src/utilities/decorators/intIdParam.decorator';
import { formatResponse } from 'src/utilities/functions/formatRepsonse';
import { userIdNotFoundErrorMessage } from 'src/utilities/messages/errorMessages.file';
import {
  userDeletedSuccessMessage,
  userUpdatedSuccessMessage,
} from 'src/utilities/messages/successMessages.file';
import { ContentTypeGuard } from 'src/utilities/guards/content-type.guard';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(private usersService: UsersService) {}

  /**
   * This is handler for the GET /admin/users endpoint. It returns paginated result
   * of all registered users in the API system. Users can optionally provide two
   * query parameters to customize paging result. By default, first page is returned
   * with 10 users.
   */
  @Get('users')
  async findAllUsers(
    @Query('itemsOnPage', new ParseIntPipe({ optional: true }))
    itemsOnPage?: number,
    @Query('page', new ParseIntPipe({ optional: true })) page?: number,
  ) {
    return this.usersService.findPaginated(itemsOnPage, page);
  }

  /**
   * This is a handler for the GET /admin/users/:id endpoint. It returns desired user
   * information as a response. This handler requires id as an url parameter to
   * perform search and checks, that user with this id exists. If id is incorrect,
   * corresponding error response is sent out.
   */
  @Get('users/:id')
  async findOneUser(@IntIdParam('id') id: number) {
    const user = await this.usersService.findOneById(id);
    if (user) {
      return formatResponse(user);
    } else {
      throw new BadRequestException(userIdNotFoundErrorMessage);
    }
  }

  /**
   * This is a handler for the PATCH /admin/users/:id endpoint. It updates specified
   * user with the information specified in the request body. Both id and request bodies
   * are validated. Further validations are carried out in updateUser method. If id or
   * request body is invalid, corresponding error response is sent out.
   */
  @UseGuards(ContentTypeGuard)
  @Patch('users/:id')
  async updateUser(
    @IntIdParam('id') id: number,
    @Body(PatchDtoPipe<User>) patchUserBody: PatchUserBodyDTO,
  ) {
    const updatedUser = await this.usersService.updateUser(id, patchUserBody);
    return formatResponse(updatedUser, userUpdatedSuccessMessage);
  }

  /**
   * This is a handler for the DELETE /admin/users/:id endpoint. It deletes desired
   * user based on the provided id url parameter. If found, an user with that id is
   * deleted. If id is invalid, an appropriate error response is sent out.
   */
  @Delete('users/:id')
  async deleteUser(@IntIdParam('id') id: number) {
    const deletedUser = await this.usersService.deleteUser(id);

    return formatResponse(deletedUser, userDeletedSuccessMessage);
    // {
    //   message: 'Successfully deleted requested user',
    //   deletedUser: await this.usersService.deleteUser(id),
    // };
  }
}
