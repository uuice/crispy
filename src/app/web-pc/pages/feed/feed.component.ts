import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { FeedService } from '../../services/feed.service'

@Component({
  selector: 'cs-feed',
  standalone: true,
  template: ''
})
export class FeedComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private feedService: FeedService
  ) {}

  ngOnInit() {
    // Get the feed type from the route
    const feedType = this.route.snapshot.url[0].path

    // Generate the appropriate XML content
    const xmlContent =
      feedType === 'rss' ? this.feedService.generateRssFeed() : this.feedService.generateSitemap()

    // Set the content type and return the XML
    const blob = new Blob([xmlContent], { type: 'application/xml' })
    const url = window.URL.createObjectURL(blob)
    window.location.href = url
  }
}
