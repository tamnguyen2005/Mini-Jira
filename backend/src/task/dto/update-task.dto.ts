import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { TaskStatus } from '../entities/task.entity';
import { IsArray, IsEnum, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {}
export class UpdateTaskStatusDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Columns)
  columns!: Columns[];
}
export class Columns {
  @IsEnum(TaskStatus)
  status!: TaskStatus;
  @IsArray()
  @IsUUID('4', { each: true })
  taskIds!: string[];
}
