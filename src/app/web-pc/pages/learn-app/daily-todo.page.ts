import { CommonModule } from '@angular/common'
import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'

interface TodoItem {
  id: number
  title: string
  subject: string
  done: boolean
}

@Component({
  selector: 'cs-daily-todo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <h1>Daily Todo</h1>
    <!-- Add new todo -->
    <form (ngSubmit)="addTodo()" #todoForm="ngForm">
      <input [(ngModel)]="newTitle" name="title" placeholder="Task title" required />
      <select [(ngModel)]="newSubject" name="subject" required>
        <option value="">Select subject</option>
        <option *ngFor="let s of subjects" [value]="s">{{ s }}</option>
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
        <tr *ngFor="let item of todoList">
          <td>
            <span *ngIf="editId !== item.id">{{ item.title }}</span>
            <input
              *ngIf="editId === item.id"
              [(ngModel)]="editTitle"
              name="editTitle{{ item.id }}"
            />
          </td>
          <td>
            <span *ngIf="editId !== item.id">{{ item.subject }}</span>
            <select
              *ngIf="editId === item.id"
              [(ngModel)]="editSubject"
              name="editSubject{{ item.id }}"
            >
              <option *ngFor="let s of subjects" [value]="s">{{ s }}</option>
            </select>
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
            <button *ngIf="editId !== item.id" (click)="startEdit(item)">Edit</button>
            <button *ngIf="editId === item.id" (click)="saveEdit(item)">Save</button>
            <button (click)="deleteTodo(item.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    <br />
    <!-- Print/Download button -->
    <button (click)="printTodos()">Print/Download</button>
  `
})
export class DailyTodoPage {
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
