import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

/**
 * This pipe is used for checking if one of the required fields marked as optional are
 * initialized. This pipe is mainly used in PATCH endpoints, where DTO properties are
 * marked as optional.
 */
@Injectable()
export class PatchDtoPipe<T> implements PipeTransform {
  transform(value: T, metadata: ArgumentMetadata) {
    // Tracker variable used for saving information, if at least one of the specified DTO fields are initialized
    let anyOfPropertiesInitialized = false;

    // Looping through specified DTO property names
    for (let property in value) {
      // If the specified property is initialized
      if (value[property]) {
        anyOfPropertiesInitialized = true;
      }
    }

    if (anyOfPropertiesInitialized) {
      return value;
    } else {
      throw new BadRequestException(
        'At least one of the required properties must be initialized!',
      );
    }
  }
}
