import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'

interface TodoItem {
  id: number
  title: string
  subject: string
  done: boolean
}

@Component({
  selector: 'cs-learn-daily-todo',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Daily Todo</h1>
    <!-- Add new todo -->
    <form (ngSubmit)="addTodo()" #todoForm="ngForm">
      <input [(ngModel)]="newTitle" name="title" placeholder="Task title" required />
      <select [(ngModel)]="newSubject" name="subject" required>
        <option value="">Select subject</option>
        @for (s of subjects; track s) {
          <option [value]="s">{{ s }}</option>
        }
      </select>
      <button type="submit" [disabled]="!newTitle || !newSubject">Add</button>
    </form>
    <br />
    <!-- Todo list table -->
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>Title</th>
          <th>Subject</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        @for (item of todoList; track item) {
          <tr>
            <td>
              @if (editId !== item.id) {
                <span>{{ item.title }}</span>
              }
              @if (editId === item.id) {
                <input [(ngModel)]="editTitle" name="editTitle{{ item.id }}" />
              }
            </td>
            <td>
              @if (editId !== item.id) {
                <span>{{ item.subject }}</span>
              }
              @if (editId === item.id) {
                <select [(ngModel)]="editSubject" name="editSubject{{ item.id }}">
                  @for (s of subjects; track s) {
                    <option [value]="s">{{ s }}</option>
                  }
                </select>
              }
            </td>
            <td>
              <input
                type="checkbox"
                [(ngModel)]="item.done"
                name="done{{ item.id }}"
                (change)="toggleDone(item)"
              />
              <span>{{ item.done ? 'Done' : 'Pending' }}</span>
            </td>
            <td>
              @if (editId !== item.id) {
                <button (click)="startEdit(item)">Edit</button>
              }
              @if (editId === item.id) {
                <button (click)="saveEdit(item)">Save</button>
              }
              <button (click)="deleteTodo(item.id)">Delete</button>
            </td>
          </tr>
        }
      </tbody>
    </table>
    <br />
    <!-- Print/Download button -->
    <button (click)="printTodos()">Print/Download</button>
  `
})
export class LearnDailyTodoPage {
  // Mock data for todo list
  todoList: TodoItem[] = [
    { id: 1, title: 'Math homework', subject: 'Math', done: false },
    { id: 2, title: 'Read English article', subject: 'English', done: true },
    { id: 3, title: 'Science experiment', subject: 'Science', done: false }
  ]
  subjects = ['Math', 'Chinese', 'English', 'PE', 'Art', 'Science', 'Society', 'Other']
  newTitle = ''
  newSubject = ''
  editId: number | null = null
  editTitle = ''
  editSubject = ''

  // Add new todo
  addTodo() {
    if (!this.newTitle || !this.newSubject) return
    const newId = this.todoList.length ? Math.max(...this.todoList.map((t) => t.id)) + 1 : 1
    this.todoList.push({ id: newId, title: this.newTitle, subject: this.newSubject, done: false })
    this.newTitle = ''
    this.newSubject = ''
  }

  // Start editing a todo
  startEdit(item: TodoItem) {
    this.editId = item.id
    this.editTitle = item.title
    this.editSubject = item.subject
  }

  // Save edited todo
  saveEdit(item: TodoItem) {
    if (!this.editTitle || !this.editSubject) return
    item.title = this.editTitle
    item.subject = this.editSubject
    this.editId = null
    this.editTitle = ''
    this.editSubject = ''
  }

  // Delete a todo
  deleteTodo(id: number) {
    this.todoList = this.todoList.filter((t) => t.id !== id)
  }

  // Toggle done status
  toggleDone(item: TodoItem) {
    item.done = !item.done
  }

  // Print/Download todos
  printTodos() {
    window.print()
  }
}
