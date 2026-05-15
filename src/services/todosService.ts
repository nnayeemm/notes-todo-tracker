import { request } from './http'
import type { Todo, TodoCreatePayload, TodoUpdatePayload } from '../types/api'

export const todosService = {
  getTodos() {
    return request<Todo[]>('/api/todos')
  },
  getTodo(todoId: number) {
    return request<Todo>(`/api/todos/${todoId}`)
  },
  createTodo(payload: TodoCreatePayload) {
    return request<Todo>('/api/todos', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },
  updateTodo(todoId: number, payload: TodoUpdatePayload) {
    return request<Todo>(`/api/todos/${todoId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },
  completeTodo(todoId: number) {
    return request<Todo>(`/api/todos/${todoId}/complete`, {
      method: 'PATCH',
    })
  },
  toggleTodoCompletion(todoId: number, isCompleted: boolean) {
    return request<Todo>(`/api/todos/${todoId}/complete`, {
      method: 'PATCH',
      body: JSON.stringify({ is_completed: isCompleted }),
    })
  },
  deleteTodo(todoId: number) {
    return request<{ message: string }>(`/api/todos/${todoId}`, {
      method: 'DELETE',
    })
  },
}
