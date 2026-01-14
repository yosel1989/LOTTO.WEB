import { Component, HostBinding } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { ContentComponent } from './content/content.component';
import { FooterComponent } from './footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout',
  imports: [
    SidebarComponent,
    HeaderComponent,
    ContentComponent,
    FooterComponent,
    RouterOutlet
  ],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'] // ← corregido aquí
})
export class LayoutComponent {
  @HostBinding('class') claseHost = 'flex grow';
}
