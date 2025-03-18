import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'No Biography Provided' })
  biography: string;

  @Column({ nullable: true })
  birthDate?: Date;

  @ManyToOne(() => User, (user) => user.uploadedAuthors, {
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  uploadedBy?: User;

  @CreateDateColumn()
  uploadedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
