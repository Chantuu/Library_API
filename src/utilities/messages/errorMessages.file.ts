// Authentication messages
export const invalidCredentialsErrorMessage =
  'Entered credentials are invalid. Please, try again!';

export const jwtTokenExpiredInvalidErrorMessage =
  'JWT Token has been expired or is invalid. Please log in again!';

// User operation messages
export const userIdNotFoundErrorMessage =
  'User with the provided id could not be found. Please, provide correct id!';

export const userWithEmailExistsErrorMessage =
  'User with that email already exists. Please, choose new email!';

export const userHasSamePasswordErrorMessage =
  'User already has that password. Please, input new password!';

export const adminAccountDeleteForbiddenErrorMessage =
  'You can not delete your (Admin) account. Please, choose user accounts!';

// Book operation messages
export const bookIdNotFoundErrorMessage =
  'Book with the provided id could not be found. Please, provide correct id!';

export const bookAlreadyExistsErrorMessage =
  'This book already exists. Please, add new book!';

// Author operation messages
export const authorIdNotFoundErrorMessage =
  'The author with provided id does not exist. Please, provide correct id!';

export const specifiedAuthorNotExistsErrorMessage =
  'Specified author does not exist. Please, choose existing author!';

export const authorAlreadyAddedErrorMessage =
  'This author has already been added. Please add new author!';

export const authorWithThatNameExistsErrorMessage =
  'Author with that name already exists. Please, provide author with different name!';

// Other operation messages
export const otherResourceModificationForbiddenErrorMessage =
  'You can not modify resources uploaded by other users!';
