import { AfterViewInit, Component, Input, OnInit } from '@angular/core';

import { TabsModule } from 'primeng/tabs';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { CustomerInfoByUuidToAdminResponseDto } from 'app/features/customer/models/customer.model';
import { CustomerService } from 'app/features/customer/services/customer.service';
import { SkeletonModule } from 'primeng/skeleton';
import { TooltipModule } from 'primeng/tooltip';
import { UtilService } from 'app/shared/services/util.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tabpanel-customer-info',
  imports: [TabsModule, CardModule, ButtonModule, DividerModule, SkeletonModule, TooltipModule, DatePipe],
  templateUrl: './tabpanel-customer-info.component.html',
  styleUrl: './tabpanel-customer-info.component.scss',
  providers: []
})
export class TabpanelCustomerInfoComponent implements OnInit, AfterViewInit{

    @Input() uuid: string = '';
    customer: CustomerInfoByUuidToAdminResponseDto | undefined;
    loading: boolean = false;

    status: boolean = true;
    
    constructor(
      private api: CustomerService,
      public util: UtilService
    ) {}

    ngOnInit(): void{
      console.log('hola');
      console.log('UUID:', this.uuid);
      this.loadData();

      setInterval(() => {
        this.status = !this.status;
      }, 3000);
    }

    ngAfterViewInit(): void{
      
    }

    // Data

    loadData(): void{
      this.loading = true;
      this.api.getInfo(this.uuid).subscribe({
        next: (data) => {
          console.log('Customer Info.d:', data);
          this.customer = data;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching customer info:', error);
          this.loading = false;
        }
      });
    }

}
