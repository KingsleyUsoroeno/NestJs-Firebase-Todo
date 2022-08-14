import { TodoDto } from "./dto/todo.dto";
import { Todo } from "./model/todo";
import { v4 as uuidv4 } from 'uuid';
import { Injectable, InternalServerErrorException, NotFoundException, HttpStatus } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { UpdateTodoDto } from "./dto/update.todo.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class TodoService {
    constructor(private readonly jwtService: JwtService) { }

    async saveTodo({ name, isCompleted }: TodoDto, token: string): Promise<any> {
        const id: string = uuidv4();
        const email: string = this.getEmailFromToken(token);
        console.log('decoded email is ', email);

        const todo = new Todo(id, name, isCompleted, email);
        try {
            await admin.firestore()
                .collection("todo")
                .doc(id.toString())
                .set(JSON.parse(JSON.stringify(todo)));
            return { statusCode: HttpStatus.CREATED, message: 'Ok' };

        } catch (e) {
            console.error("Error adding document: ", e);
            throw new InternalServerErrorException();
        }
    }

    async getAllTodos(token: string): Promise<Todo[]> {
        let email: string = this.getEmailFromToken(token);
        let todos: Todo[] = [];
        const querySnapshot = await admin.firestore().collection('todo').where('email', '==', email).get();
        querySnapshot.forEach((doc) => {
            todos.push(this.createTodoFromSnapshot(doc.data()));
        });
        return todos;
    }

    async getTodoById(id: string): Promise<Todo> {
        const snapshot = await admin.firestore().collection('todo').doc(id).get();
        if (!snapshot.exists) {
            throw new NotFoundException({
                statusCode: HttpStatus.NOT_FOUND,
                message: "Todo with that id does not exist"
            });
        }
        return this.createTodoFromSnapshot(snapshot.data());
    }

    async updateTodo(id: string, { name, isCompleted }: UpdateTodoDto): Promise<Todo> {
        let todo = await this.getTodoById(id);
        const snapshot = await admin.firestore().collection('todo').doc(id);
        await snapshot.update({ isCompleted, name });
        todo.name = name;
        todo.isCompleted = isCompleted;
        return todo;
    }

    async deleteTodo(id: string): Promise<any> {
        await this.getTodoById(id);
        await admin.firestore().collection('todo').doc(id).delete();
        return {
            statusCode: HttpStatus.OK,
            message: "Todo deleted successfully"
        }
    }

    private createTodoFromSnapshot(snapshot: any): Todo {
        return new Todo(snapshot['id'], snapshot['name'], snapshot['isCompleted'], snapshot['email']);
    }

    private getEmailFromToken(token: string): string {
        let bearerToken = token.replace(/ /g, "").substring(6, token.length);

        const decodedJwtAccessToken = this.jwtService.decode(bearerToken);
        console.log("bearer token is", decodedJwtAccessToken);

        if (decodedJwtAccessToken == null) {
            return null;
        }

        if (typeof decodedJwtAccessToken === "string") {
            return null;
        }
        if (decodedJwtAccessToken['claims'] != null
            && decodedJwtAccessToken['claims']['email'] != null) {
            return decodedJwtAccessToken['claims']['email'];
        }
        return null;
    }
}