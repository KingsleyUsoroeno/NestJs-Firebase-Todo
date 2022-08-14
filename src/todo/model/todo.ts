export class Todo {
    constructor(public readonly id: string, public name: string, public isCompleted: boolean,
        private readonly email: string) { }


}