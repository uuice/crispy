import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-recruitment',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">招聘信息管理</h1>
      <!-- TODO: Add recruitment management interface -->
    </div>
  `
})
export class RecruitmentPage {
  // TODO: Implement recruitment management logic
}
