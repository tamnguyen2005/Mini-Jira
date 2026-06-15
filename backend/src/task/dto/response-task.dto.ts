export class ResponseTaskDto {
  id!: string;
  title!: string;
  description?: string;
  priority!: string;
  status!: string;
  position!: number;
  assignee!: UserInfo;
  created_byId!: string;
  dueDate!: Date;
  createdAt!: Date;
}
class UserInfo {
  id!: string;
  name!: string;
}
