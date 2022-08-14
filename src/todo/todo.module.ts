import { Module } from '@nestjs/common';
import { TodoController } from './todo_controller';
import { TodoService } from './todo.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        AuthModule
    ],
    providers: [TodoService],
    controllers: [TodoController]
})
export class TodoModule { }
