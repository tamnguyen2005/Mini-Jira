import {
  Controller,
  Req,
  UseGuards,
  Post,
  Body,
  Get,
  Put,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import type { AuthenticatedRequest } from 'src/auth/guards/auth.guard';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const create_byId = request.user.sub;
    return await this.taskService.create(create_byId, createTaskDto);
  }
  @Get()
  async get() {
    return await this.taskService.findAll();
  }
  @Patch('status')
  async updateStatus(@Body() updateStatusDto: UpdateTaskStatusDto) {
    await this.taskService.updateStatus(updateStatusDto);
  }
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDto: UpdateTaskDto) {
    return await this.taskService.updateAll(id, updateDto);
  }
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.taskService.delete(id);
  }
}
