import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { ResponseTaskDto } from './dto/response-task.dto';
import { AuthService } from 'src/auth/auth.service';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { PaginatedResult } from 'src/common/interfaces/paginated-result.interface';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly authService: AuthService,
  ) {}
  async create(
    created_byId: string,
    createTaskDto: CreateTaskDto,
  ): Promise<ResponseTaskDto> {
    const assignedUser = await this.authService.findById(
      createTaskDto.assigneeId,
    );
    if (!assignedUser)
      throw new BadRequestException(
        `Người dùng với mã ${createTaskDto.assigneeId} không tồn tại !`,
      );
    const newTask = this.taskRepository.create({
      assignee: {
        id: assignedUser.id,
        name: assignedUser.name,
      },
      created_byId: created_byId,
      description: createTaskDto.description,
      due_date: createTaskDto.dueDate,
      position: createTaskDto.position,
      priority: createTaskDto.priority,
      status: createTaskDto.status,
      title: createTaskDto.title,
    });
    const response = this.responseConverter(
      await this.taskRepository.save(newTask),
    );
    return response;
  }
  async findAll(
    queryTaskDto: QueryTaskDto,
  ): Promise<PaginatedResult<ResponseTaskDto>> {
    const queryBuilder = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .select(['task', 'assignee.id', 'assignee.name']);

    if (queryTaskDto.title) {
      queryBuilder.andWhere('task.title ILIKE :title', {
        title: `%${queryTaskDto.title}%`,
      });
    }

    if (queryTaskDto.assigneeId) {
      queryBuilder.andWhere('assignee.id = :assigneeId', {
        assigneeId: queryTaskDto.assigneeId,
      });
    }

    if (queryTaskDto.priority?.length) {
      queryBuilder.andWhere('task.priority IN (:...priorities)', {
        priorities: queryTaskDto.priority,
      });
    }

    if (queryTaskDto.dueFrom) {
      const startOfDay = new Date(`${queryTaskDto.dueFrom}T00:00:00+07:00`);

      queryBuilder.andWhere('task.due_date >= :dueFrom', {
        dueFrom: startOfDay,
      });
    }
    if (queryTaskDto.dueTo) {
      const endOfDay = new Date(`${queryTaskDto.dueTo}T00:00:00+07:00`);
      endOfDay.setDate(endOfDay.getDate() + 1);

      queryBuilder.andWhere('task.due_date < :dueTo', {
        dueTo: endOfDay,
      });
    }

    const page = queryTaskDto.page;
    const limit = queryTaskDto.limit;
    queryBuilder
      .orderBy('task.status', 'ASC')
      .addOrderBy('task.position', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [tasks, total] = await queryBuilder.getManyAndCount();
    const data = tasks.map((t) => this.responseConverter(t));
    return {
      data: data,
      pagination: {
        limit: limit,
        page: page,
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
  async findById(id: string): Promise<ResponseTaskDto> {
    return this.responseConverter(await this.findOne(id));
  }
  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.assignee', 'assignee')
      .select(['task', 'assignee.id', 'assignee.name'])
      .where('task.id = :id', { id })
      .getOne();

    if (!task) throw new NotFoundException(`Task với mã ${id} không tồn tại !`);
    return task;
  }
  async updateAll(
    id: string,
    updateTaskDto: UpdateTaskDto,
  ): Promise<ResponseTaskDto> {
    const task = await this.findOne(id);

    if (updateTaskDto.assigneeId) {
      const assignedUser = await this.authService.findById(
        updateTaskDto.assigneeId,
      );
      if (!assignedUser) {
        throw new BadRequestException(
          `Người dùng với mã ${updateTaskDto.assigneeId} không tồn tại !`,
        );
      }
      task.assignee = assignedUser;
      task.assigneeId = assignedUser.id;
    }

    if (updateTaskDto.title !== undefined) task.title = updateTaskDto.title;
    if (updateTaskDto.description !== undefined)
      task.description = updateTaskDto.description;
    if (updateTaskDto.priority !== undefined)
      task.priority = updateTaskDto.priority;
    if (updateTaskDto.status !== undefined) task.status = updateTaskDto.status;
    if (updateTaskDto.position !== undefined)
      task.position = updateTaskDto.position;
    if (updateTaskDto.dueDate !== undefined)
      task.due_date = updateTaskDto.dueDate;

    const updatedTask = await this.taskRepository.save(task);
    return this.responseConverter(updatedTask);
  }
  async updateStatus(updateDto: UpdateTaskStatusDto): Promise<void> {
    await this.taskRepository.manager.transaction(async (manager) => {
      for (const column of updateDto.columns) {
        for (const [position, taskId] of column.taskIds.entries()) {
          const result = await manager.update(
            Task,
            { id: taskId },
            {
              status: column.status,
              position: position,
            },
          );
          if (result.affected !== 1) {
            throw new NotFoundException(
              `Task với mã ${taskId} không tồn tại !`,
            );
          }
        }
      }
    });
  }
  async delete(id: string, delete_byId: string): Promise<void> {
    const task = await this.findById(id);
    if (task.created_byId !== delete_byId) {
      throw new ForbiddenException('Bạn không thể xóa task tạo bởi người khác');
    }
    await this.taskRepository.manager.transaction(async (manager) => {
      const task = await manager.findOne(Task, { where: { id } });
      if (!task)
        throw new NotFoundException(`Không tìm thấy task với mã ${id}`);
      await manager.softDelete(Task, id);
      await manager
        .createQueryBuilder()
        .update(Task)
        .set({ position: () => '"position"-1' })
        .where('"status"=:status', { status: task.status })
        .andWhere('"position">:position', { position: task.position })
        .execute();
    });
  }
  responseConverter(task: Task): ResponseTaskDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description ?? '',
      priority: task.priority,
      status: task.status,
      position: task.position,
      assignee: {
        id: task.assignee.id,
        name: task.assignee.name,
      },
      created_byId: task.created_byId,
      dueDate: task.due_date,
      createdAt: task.created_at,
    };
  }
}
