import { Module } from '@nestjs/common';
import { TodoController } from './todo_controller';
import { TodoService } from './todo.service';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        AuthModule,
        JwtModule.register({ secret: 'JWT_SECRET' }),
    ],
    providers: [TodoService],
    controllers: [TodoController]
})
export class TodoModule { }
