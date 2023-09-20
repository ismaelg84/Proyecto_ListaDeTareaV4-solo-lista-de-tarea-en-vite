import axios from "axios";

const usuario = 'ismaelg@gmail.com';
const contraseña = '123456789';

const URL =
  process.env.NODE_ENV === "production"
    ? import.meta.env.VITE_BACKEND_URL
    : "http://localhost:8000";

console.log(URL);

const tasksApi = axios.create({
  baseURL: `${URL}/tasks/api/v1/tasks`,
  auth: {
    username: usuario,
    password: contraseña,
  },
});

export const getAllTasks = () => tasksApi.get("/");

export const getTask = (id) => tasksApi.get(`/${id}`);

export const createTask = (task) => tasksApi.post("/", task);

export const updateTask = (id, task) => tasksApi.put(`/${id}/`, task);

export const deleteTask = (id) => tasksApi.delete(`/${id}`);
