import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-content',
  imports: [],
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss'
})
export class ContentComponent {
  @HostBinding('class') claseHost = 'grow max-w-screen';
}
