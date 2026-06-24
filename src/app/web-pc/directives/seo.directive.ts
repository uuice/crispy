import { Directive, inject, Input, OnInit } from '@angular/core'
import { SeoData, SeoService } from '../services/seo.service'

@Directive({
  selector: '[csSeo]',
  standalone: true
})
export class SeoDirective implements OnInit {
  private seoService = inject(SeoService)

  @Input() csSeo: SeoData | string = ''

  ngOnInit(): void {
    if (typeof this.csSeo === 'string') {
      // If string is provided, use predefined SEO methods
      this.setPredefinedSeo(this.csSeo)
    } else {
      // If SeoData object is provided, use it directly
      this.seoService.setSeoData(this.csSeo)
    }
  }

  private setPredefinedSeo(pageType: string): void {
    switch (pageType) {
      case 'home':
        this.seoService.setHomeSeo()
        break
      case 'about':
        this.seoService.setAboutSeo()
        break
      case 'archives':
        this.seoService.setArchivesSeo()
        break
      case 'links':
        this.seoService.setLinksSeo()
        break
      case 'disclaimer':
        this.seoService.setDisclaimerSeo()
        break
      case '404':
        this.seoService.set404Seo()
        break
      default:
        this.seoService.setDefaultSeo()
    }
  }
}
