import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, type: 'varchar', length: 100, nullable: false })
  email: string;

  @Column({ default: '' })
  username: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  password: string;

  @Column({ nullable: true })
  @Exclude()
  public token?: string;

  @Column({ nullable: true })
  @Exclude()
  public refreshToken?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @DeleteDateColumn()
  deleted_at: Date;

  @Column({ default: true })
  is_activated: boolean;
}
