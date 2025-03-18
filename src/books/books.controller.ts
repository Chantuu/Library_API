import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('books')
@UseGuards(AuthGuard)
export class BooksController {}
