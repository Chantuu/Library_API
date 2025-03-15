import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
   * perform search. If id is incorrect, appropriate error response will be sent.
   */
  @Get('users/:id')
  async findOneUser(@IntIdParam('id') id: number) {
    const user = await this.usersService.findOneById(id);
    if (user) {
      return formatResponse(user);
    } else {
      throw new BadRequestException(
        'User with the provided id could not be found. Please, provide correct id!',
      );
    }
  }

  /**
   * This is a handler for the PATCH /admin/users/:id endpoint. It updates specified
   * user with the information specified in the request body. Both id and request bodies
   * are validated. If id or request body is invalid, an appropriate error response
   * will be sent.
   */
  @Patch('users/:id')
  async updateUser(
    @IntIdParam('id') id: number,
    @Body(PatchDtoPipe<User>) patchUserBody: PatchUserBodyDTO,
  ) {
    const updatedUser = await this.usersService.updateUser(id, patchUserBody);
    return formatResponse(updatedUser, 'Successfuly updated requested user');
  }

  /**
   * This is a handler for the DELETE /admin/users/:id endpoint. It deletes desired
   * user based on the provided id url parameter. If found, an user with that id is
   * deleted. If id is invalid, an appropriate error response will be sent.
   */
  @Delete('users/:id')
  async deleteUser(@IntIdParam('id') id: number) {
    const deletedUser = await this.usersService.deleteUser(id);

    return formatResponse(deletedUser, 'Successfuly deleted requested user');
    // {
    //   message: 'Successfully deleted requested user',
    //   deletedUser: await this.usersService.deleteUser(id),
    // };
  }
}
