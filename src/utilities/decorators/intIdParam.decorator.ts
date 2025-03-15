import { Param, ParseIntPipe } from '@nestjs/common';

/**
 * his param is used to extract resource id as an integer from the
 * specified url parameter. This is a shorthand for Param decorator.
 *
 * @param idParamName - Desired url param name to extract id
 */
export function IntIdParam(idParamName: string) {
  return Param(idParamName, ParseIntPipe);
}
