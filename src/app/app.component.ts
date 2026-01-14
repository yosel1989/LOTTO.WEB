import { Component, inject, signal, Renderer2, DOCUMENT } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';

import { filter } from 'rxjs/operators';
import { MetronicInitService } from './core/services/metronic-init.service';

import { jwtDecode } from "jwt-decode";
import { JwtPayloadDto } from './features/auth/models/auth.model';




@Component({
  selector: 'body[app-root]',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'metronic-tailwind-angular';

  private router = inject(Router);
  private document = inject(DOCUMENT);
  private renderer = inject(Renderer2);
  private metronicInitService = inject(MetronicInitService);

  private demoClassMap: Record<string, string> = {
    admin: 'antialiased flex h-full text-base text-foreground bg-background demo1 kt-sidebar-fixed kt-header-fixed',
    auth: 'antialiased flex h-full text-base text-foreground bg-background',
    demo1: 'demo1 kt-sidebar-fixed kt-header-fixed',
    demo2: '[--header-height:100px] data-[kt-sticky-header=on]:[--header-height:60px]',
    demo3: '[--header-height:58px] [--sidebar-width:58px] [--navbar-height:56px] lg:overflow-hidden bg-muted',
    demo4: '[--header-height:60px] [--sidebar-width:290px] bg-muted! lg:overflow-hidden',
    demo5: '[--header-height:54px] [--sidebar-width:200px]',
    demo6: '[--header-height:60px] [--sidebar-width:270px] lg:overflow-hidden bg-muted',
    demo7: '[--header-height-default:95px] data-kt-[sticky-header=on]:[--header-height:60px] [--header-height:var(--header-height-default)] [--header-height-mobile:70px]',
    demo8: '[--header-height:60px] [--sidebar-width:90px] bg-muted',
    demo9: '[--header-height:78px]',
    demo10: '[--header-height:60px] [--sidebar-width:270px] lg:overflow-hidden bg-mono dark:bg-background',
  };
  private currentDemo = signal('demo1');

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(() => {
      this.updateDemo();
      this.metronicInitService.init();
    });
    this.updateDemo();

    document.getElementsByTagName("html")[0].classList.remove("dark", "light");
    document.getElementsByTagName("html")[0].classList.add("dark");
  }

  private updateDemo() {
    const url = this.router.url;
    const firstSegment = url.split('/').filter(Boolean)[0] || 'demo1';
    const newDemo = firstSegment in this.demoClassMap ? firstSegment : 'demo1';
    this.currentDemo.set(newDemo);
    this.clearDemoClasses();
    this.applyDemoClass(this.demoClassMap[newDemo]);
  }

  private clearDemoClasses() {
    // Remove all possible demo classes from body
    Object.values(this.demoClassMap).forEach(classString => {
      const classes = classString.split(' ');
      classes.forEach(className => {
        if (className.trim()) {
          this.renderer.removeClass(this.document.body, className.trim());
        }
      });
    });
  }

  private applyDemoClass(classString: string) {
    const classes = classString.split(' ');
    classes.forEach(className => {
      if (className.trim()) {
        this.renderer.addClass(this.document.body, className.trim());
      }
    });
  }


  private checkTokenExpiration(): void {
    const token = localStorage.getItem('_t');
    if (!token) return;

    try {
      const { exp } = jwtDecode<JwtPayloadDto>(token);
      const now = Math.floor(Date.now() / 1000);

      if (exp < now) {
        localStorage.removeItem('_t');
        // Redirigir al login o mostrar mensaje
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Token inválido o mal formado');
      localStorage.removeItem('_t');
      this.router.navigate(['/login']);

    }
  }
}
