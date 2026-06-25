import { Task } from 'src/task/entities/task.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity('users')
export class Auth {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  email!: string;
  @Column({ type: 'varchar', length: 255, nullable: false })
  password_hash!: string;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name!: string;
  @Column({ type: 'varchar', length: 500, nullable: true })
  avatar_url!: string | null;
  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;
  @OneToMany(() => Task, (t) => t.assignee)
  assignedTasks!: Task[];
  @OneToMany(() => Task, (t) => t.created_by)
  createdTasks!: Task[];
}
