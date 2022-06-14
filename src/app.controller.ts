import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { Todo as TodoModel } from '@prisma/client';

@Controller()
export class AppController {
  constructor(private readonly todoService: TodoService) {}
  //データ１件取得
  @Get('post/:id')
  async getPostById(@Param('id') id: string): Promise<TodoModel> {
    return this.todoService.todo({ id: Number(id) });
  }
  //データベース全件取得
  @Get('todos')
  async getPublishedTodos(): Promise<TodoModel[]> {
    return this.todoService.todos({});
  }

  @Get('filtered-posts/:searchString')
  async getFilteredPosts(
    @Param('searchString') searchString: string,
  ): Promise<TodoModel[]> {
    return this.todoService.todos({
      where: {
        OR: [
          {
            title: { contains: searchString },
          },
          {
            body: { contains: searchString },
          },
        ],
      },
    });
  }
  //データ追加処理
  @Post('post')
  async createDraft(
    @Body() postData: { title: string; body: string },
  ): Promise<TodoModel> {
    const { title, body } = postData;
    return this.todoService.createTodo({
      title,
      body,
    });
  }
  //1件データ更新
  @Put('publish/:id')
  async publishPost(
    @Param('id') id: string,
    @Body() postData: { title: string; body: string },
  ): Promise<TodoModel> {
    const { title, body } = postData;
    return this.todoService.updateTodo({
      where: { id: Number(id) },
      data: {
        title,
        body,
      },
    });
  }
  //データベース１件削除
  @Delete('post/:id')
  async deletePost(@Param('id') id: string): Promise<TodoModel> {
    return this.todoService.deleteTodo({ id: Number(id) });
  }
}
