import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';
import { AdminModule } from './admin/admin.module';
import { BooksModule } from './books/books.module';
import { AuthorModule } from './author/author.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_NAME_PATH,
      autoLoadEntities: true,
      synchronize: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_MODULE_SECRET,
      signOptions: { expiresIn: '240s' },
    }),
    AuthModule,
    UsersModule,
    AdminModule,
    BooksModule,
    AuthorModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private usersService: UsersService) {}

  async onModuleInit() {
    await this.usersService.initializeAdmin();
  }
}
