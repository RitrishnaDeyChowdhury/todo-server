import { Todo } from "../models/todo.model.js";
import { messages } from "../utils/messages.js";

export const getAllTodos = async(req,res)=>{
    try {
        const todos = await Todo.find({}).sort({ _id: -1 });
        if(todos.length === 0){
            return res.status(404).json({status: false, message: messages.TODO_NOT_FOUND});
        }else{
            return res.status(200).json({status: true, message: messages.TODO_FOUND, data: todos});
        }
    } catch (error) {
        console.log("todo fetched failed", error);
        return res.status(500).json({status: false, message: messages.INTERNAL_ERROR});
    }
}
export const createTodo = async (req, res) => {
    try {
        // validation
        const {title,description} = req.body;
        if(!title || !description){
            return res.status(400).json({status: false, message: messages.FIELDS_REQUIRED});
        }

        const todo = await Todo.create({title,description});
        return res.status(201).json({status: true, message: messages.TODO_CREATED, data: todo});
    } catch (error) {
        console.log("todo creation failed", error);
        return res.status(500).json({status: false, message: messages.INTERNAL_ERROR});
    }
}

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ status: false, message: messages.TODO_NOT_FOUND });
        }
        if(typeof req.body.status === 'boolean'){
            todo.status = req.body.status;
        }
        if(req.body.description){
            todo.description = req.body.description;
        }
        if(req.body.title){
            todo.title = req.body.title;
        }
        
        await todo.save();
        return res.status(200).json({ status: true, message: messages.TODO_STATUS_CHANGED, data: todo });
    } catch (error) {
        console.log("todo status update failed", error);
        return res.status(500).json({ status: false, message: messages.INTERNAL_ERROR });
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ status: false, message: messages.TODO_NOT_FOUND });
        }
        await todo.deleteOne();
        return res.status(200).json({ status: true, message: messages.TODO_DELETED });
    } catch (error) {
        console.log("todo deletion failed", error);
        return res.status(500).json({ status: false, message: messages.INTERNAL_ERROR });
    }  
}     