import { BadRequestException } from '@nestjs/common';
import { ObjectLiteral, Repository } from 'typeorm';

/**
 * This generic function is used for paginating all results from the specified entity repository.
 * It requires desired typeORM entity as type argument and that entity's repository
 * instance for proper functionality. It has all paging parameter safety built in and returns fully formatted object ready
 * to be sent to the user as a response.
 *
 * @param entityRepository - TypeORM repository for specified entity
 * @param itemsOnPage - (optional) Desired number of items on a page
 * @param page - (optional) Desired page
 * @returns - A promise containing formatted object consisting from paginated entity array, total entity count and current page.
 * @throws - BadRequestException
 */
export async function paginateResponse<EntityT extends ObjectLiteral>(
  entityRepository: Repository<EntityT>,
  itemsOnPage: number = 10,
  page: number = 1,
) {
  const entityCount = await entityRepository.count();
  const maxPages = Math.ceil(entityCount / itemsOnPage); // Calculate maximum  available pages

  // Checking, that paging parameters are correctly provided
  if (itemsOnPage > 0 && page > 0) {
    if (page <= maxPages) {
      const pagesToSkip = page - 1;
      const entityArray = await entityRepository.find({
        take: itemsOnPage,
        skip: itemsOnPage * pagesToSkip, // Calculating how many items to skip
      });

      return {
        result: entityArray,
        totalItems: entityCount,
        currentPage: `${page}/${maxPages}`,
      };
    } else {
      throw new BadRequestException(
        'A requested page does not exist. Please provide correct page number!',
      );
    }
  } else {
    throw new BadRequestException(
      'Incorrect query parameters. Please provide correct paging parameters!',
    );
  }
}
