import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from "@nestjs/common";
import { TodoService } from "./todo.service";
import { TodoDto } from "./dto/todo.dto";
import { Todo } from "./model/todo";
import { UpdateTodoDto } from "./dto/update.todo.dto";
import { FirebaseAuthGuard } from "src/auth/firebase-auth.guard";
import { GetUserToken } from "src/auth/get_user_token.decorator";
import { User } from "src/auth/model/user";

@Controller("todo")
@UseGuards(FirebaseAuthGuard)
export class TodoController {
    constructor(private readonly todoService: TodoService) { }

    @Post("/")
    async saveTodo(@Body() todoDto: TodoDto, @GetUserToken() token: string): Promise<any> {
        return await this.todoService.saveTodo(todoDto, token);
    }

    @Get("/")
    async getAllTodos(@GetUserToken() token: string): Promise<Todo[]> {
        return this.todoService.getAllTodos(token);
    }

    @Get("/:id")
    async getTodoById(@Param('id') id: string): Promise<Todo> {
        return this.todoService.getTodoById(id);
    }

    @Put("/:id")
    async updateTodo(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto): Promise<Todo> {
        return this.todoService.updateTodo(id, updateTodoDto);
    }

    @Delete("/:id")
    async deleteTodo(@Param('id') id: string): Promise<any> {
        return this.todoService.deleteTodo(id);
    }
}