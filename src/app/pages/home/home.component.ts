
import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FooterService } from './../../shared/footer/footer.service';
import { HeaderService } from './../../shared/header/header.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => {
        this.footerService.footerClass.next(result.matches ? null : 'transparent');
        this.headerService.headerClass.next(result.matches ? null : 'transparent');

        return result.matches;
      })
    );
  videoUrl: SafeResourceUrl;

  constructor(
      private breakpointObserver: BreakpointObserver,
      private footerService: FooterService,
      private headerService: HeaderService,
      private sanitizer: DomSanitizer
  ) {
    // https://developers.google.com/youtube/player_parameters
    // controls=0 Hide controls
    // disablekb=1 Disable keyboard controls
    // loop=1 + paylist=${VIDEO_ID} Use together to loop the video
    // rel=0 Disable related videos
    // showinfo=0 Hide video title and uploader before the video starts
    const VIDEO_ID = 'Q8TXgCzxEnw';
    this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube-nocookie.com/embed/${VIDEO_ID}`
      + `?autoplay=1&controls=0&disablekb=1&loop=1&modestbranding=1&mute=1&playlist=${VIDEO_ID}&rel=0&showinfo=0`);

    this.headerService.headerTitle.next('HOME');
  }
}
