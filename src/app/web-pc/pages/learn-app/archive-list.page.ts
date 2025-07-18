import { Component } from '@angular/core'
import { FormsModule } from '@angular/forms'

interface ArchiveItem {
  id: number
  title: string
  date: string
}

@Component({
  selector: 'cs-archive-list',
  standalone: true,
  imports: [FormsModule],
  template: `
    <h1>Archive List</h1>
    <!-- Search input -->
    <input [(ngModel)]="search" placeholder="Search by title" />
    <button (click)="onSearch()">Search</button>
    <br /><br />
    <!-- Archive list table -->
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Date</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        @for (item of pagedList(); track item.id) {
          <tr>
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.date }}</td>
            <td><button (click)="deleteItem(item.id)">Delete</button></td>
          </tr>
        }
      </tbody>
    </table>
    <!-- Pagination -->
    <div style="margin-top:10px;">
      <button (click)="prevPage()" [disabled]="page === 1">Prev</button>
      <span>Page {{ page }} / {{ totalPages() }}</span>
      <button (click)="nextPage()" [disabled]="page === totalPages()">Next</button>
    </div>
  `
})
export class ArchiveListPage {
  // Mock data for archive list
  archiveList: ArchiveItem[] = [
    { id: 1, title: 'Angular Basics', date: '2024-01-01' },
    { id: 2, title: 'TypeScript Guide', date: '2024-01-02' },
    { id: 3, title: 'RxJS Deep Dive', date: '2024-01-03' },
    { id: 4, title: 'Component Patterns', date: '2024-01-04' },
    { id: 5, title: 'Service Injection', date: '2024-01-05' },
    { id: 6, title: 'Routing Tips', date: '2024-01-06' },
    { id: 7, title: 'State Management', date: '2024-01-07' },
    { id: 8, title: 'Testing Angular', date: '2024-01-08' },
    { id: 9, title: 'Performance Tuning', date: '2024-01-09' },
    { id: 10, title: 'Best Practices', date: '2024-01-10' }
  ]
  search = ''
  page = 1
  pageSize = 5
  filteredList: ArchiveItem[] = [...this.archiveList]

  // Search by title
  onSearch() {
    this.page = 1
    this.filteredList = this.archiveList.filter((item) =>
      item.title.toLowerCase().includes(this.search.toLowerCase())
    )
  }

  // Pagination logic
  pagedList(): ArchiveItem[] {
    const start = (this.page - 1) * this.pageSize
    return this.filteredList.slice(start, start + this.pageSize)
  }
  totalPages(): number {
    return Math.ceil(this.filteredList.length / this.pageSize) || 1
  }
  prevPage() {
    if (this.page > 1) this.page--
  }
  nextPage() {
    if (this.page < this.totalPages()) this.page++
  }

  // Delete archive item
  deleteItem(id: number) {
    this.archiveList = this.archiveList.filter((item) => item.id !== id)
    this.onSearch()
  }
}
