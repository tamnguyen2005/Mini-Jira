import { Auth } from 'src/auth/entities/auth.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
export enum TaskStatus {
  BACKLOG = 'BACKLOG',
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
export enum TaskPriority {
  LOW = 'LOW',
  'MEDIUM' = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('task')
@Index('idx_task_assignee_id', ['assigneeId'])
@Index('idx_task_priority', ['priority'])
@Index('idx_task_due_date', ['due_date'])
@Index('idx_task_status', ['status'])
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  @Column({ type: 'varchar', length: 200, nullable: false })
  title!: string;
  @Column({ type: 'text', nullable: true })
  description!: string | null;
  @Column({ type: 'enum', enum: TaskPriority, nullable: false })
  priority!: TaskPriority;
  @Column({
    type: 'enum',
    enum: TaskStatus,
    nullable: false,
    default: TaskStatus.BACKLOG,
  })
  status!: TaskStatus;
  @Column({ type: 'integer', nullable: false, default: 0 })
  position!: number;
  @Column({ type: 'uuid' })
  assigneeId!: string;
  @Column({ type: 'uuid' })
  created_byId!: string;
  @ManyToOne(() => Auth, (u) => u.assignedTasks, { nullable: false })
  @JoinColumn({ name: 'assigneeId' })
  assignee!: Auth;
  @ManyToOne(() => Auth, (u) => u.createdTasks, { nullable: false })
  @JoinColumn({ name: 'created_byId' })
  created_by!: Auth;
  @Column({ type: 'timestamptz', nullable: false })
  due_date!: Date;
  @CreateDateColumn({ name: 'created_at' })
  created_at!: Date;
  @UpdateDateColumn({ name: 'updated_at' })
  updated_at!: Date;
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deleted_at!: Date | null;
}
