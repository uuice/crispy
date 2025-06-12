import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'

@Component({
  selector: 'cs-friend-links',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">友情链接管理</h1>
      <!-- TODO: Add friend links management interface -->
    </div>
  `
})
export class FriendLinksPage {
  // TODO: Implement friend links management logic
}
