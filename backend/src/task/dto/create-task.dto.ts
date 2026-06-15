import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskPriority, TaskStatus } from '../entities/task.entity';
export class CreateTaskDto {
  @IsNotEmpty({ message: 'Tiêu đề không thể để trống' })
  @IsString({ message: 'Tiêu đề phải là chuỗi kí tự' })
  title!: string;
  @IsOptional()
  description?: string;
  @IsIn(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
  priority!: TaskPriority;
  @IsIn(['BACKLOG', 'TODO', 'IN_PROGRESS', 'DONE'])
  status!: TaskStatus;
  @IsInt({ message: 'Vị trí phải là số' })
  @IsNotEmpty({ message: 'Vị trí không thể để trống' })
  position!: number;
  @IsString({ message: 'Người được giao phải là chuỗi kí tự' })
  @IsNotEmpty({ message: 'Người được giao không thể để trống' })
  assigneeId!: string;
  @IsNotEmpty({ message: 'Ngày tới hạn không thể để trống ' })
  dueDate!: Date;
}
