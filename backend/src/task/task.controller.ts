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
  HttpCode,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import type { AuthenticatedRequest } from 'src/auth/guards/auth.guard';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';

@Controller('api/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(AuthGuard)
  @HttpCode(201)
  async create(
    @Body() createTaskDto: CreateTaskDto,
    @Req() request: AuthenticatedRequest,
  ) {
    const create_byId = request.user.sub;
    return await this.taskService.create(create_byId, createTaskDto);
  }
  @Get()
  @HttpCode(200)
  async get(@Query() queryTaskDto: QueryTaskDto) {
    return await this.taskService.findAll(queryTaskDto);
  }
  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: string) {
    return await this.taskService.findById(id);
  }
  @Patch('status')
  @HttpCode(200)
  async updateStatus(@Body() updateStatusDto: UpdateTaskStatusDto) {
    await this.taskService.updateStatus(updateStatusDto);
  }
  @Put(':id')
  @HttpCode(200)
  async update(@Param('id') id: string, @Body() updateDto: UpdateTaskDto) {
    return await this.taskService.updateAll(id, updateDto);
  }
  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.taskService.delete(id);
  }
}
