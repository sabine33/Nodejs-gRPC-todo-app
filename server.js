/* eslint-disable no-console */
const grpc = require('grpc');
const loader = require('@grpc/proto-loader');
const todos = require('./todos_db.json');

class TodoAppController {
    getAll(_, callback) {
        return callback(null, todos);
    }
    getTodo(call, callback) {
        const todo = todos.todos.filter(x => x.id == call.request.id);
        return callback(null, todo[0] ?? null)
    }
}
const PATH = "0.0.0.0:8080"

const createServer = function (bindPath, handler) {
    loader.load('todo.proto', { includeDirs: ['./'] }).then((packageDefinition) => {
        const package = grpc.loadPackageDefinition(packageDefinition);
        const service = package.grpc_todo_app.TodoApp.service;
        const server = new grpc.Server();
        server.addService(service, handler);
        server.bind(bindPath, grpc.ServerCredentials.createInsecure());
        server.start();
        console.log('Server running on 8080');
    })
}

createServer(PATH, TodoAppController);