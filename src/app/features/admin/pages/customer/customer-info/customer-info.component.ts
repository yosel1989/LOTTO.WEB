import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { CustomerInfoByUuidToAdminResponseDto } from 'app/features/customer/models/customer.model';
import { CustomerService } from 'app/features/customer/services/customer.service';
import { MenuItem } from 'primeng/api';

import { BreadcrumbModule } from 'primeng/breadcrumb';
import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-customer-info',
  imports: [BreadcrumbModule, RouterModule, RouterOutlet, TabsModule, CardModule],
  templateUrl: './customer-info.component.html',
  styleUrl: './customer-info.component.scss',
  providers: []
})
export class CustomerInfoComponent implements OnInit, AfterViewInit{
    uuid: string = '';
    data: CustomerInfoByUuidToAdminResponseDto | undefined;
    items: MenuItem[] | undefined;
    home: MenuItem | undefined;

    tabs = [
        { route: 'general', label: 'General', icon: 'pi pi-home', disable: false },
        { route: 'financial-bets', label: 'Apuestas Financieras', icon: 'pi pi-chart-line', disable: true },
        { route: 'reports', label: 'Reportes', icon: 'pi pi-list', disable: true },
        { route: 'configuration', label: 'Configuración', icon: 'pi pi-inbox', disable: true }
    ];

    constructor(
      private route: ActivatedRoute,
      private api: CustomerService
    ) {}

    ngOnInit(): void{
      this.items = [
          { label: this.data?.email, styleClass: 'font-medium!' },
      ];
      this.home = { routerLink: '/admin/customers', label: 'Jugadores' };

      this.uuid = this.route.snapshot.paramMap.get('uuid') || '';
      console.log('UUID:', this.uuid);
      this.loadData();
    }

    ngAfterViewInit(): void{
      // Additional initialization if needed after the view is initialized
    }

    // Data

    loadData(): void{
      this.api.getInfo(this.uuid).subscribe({
        next: (data) => {
          this.data = data;
          console.log('Customer Info:', data);
          this.items![0].label = data.email;
        },
        error: (error) => {
          console.error('Error fetching customer info:', error);
        }
      }); 
    }

}
