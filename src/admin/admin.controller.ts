import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AdminGuard } from './admin.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(private usersService: UsersService) {}

  /**
   * This is handler for the /admin/users endpoint. It returns paginated result
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
}
