import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TblCustomersComponent } from 'app/features/customer/components/tables/tbl-customers/tbl-customers.component';
import { FltCustomersComponent } from 'app/features/customer/components/filters/flt-customers-tbl/flt-customers.component';

@Component({
  selector: 'app-customer',
  imports: [TblCustomersComponent, ConfirmPopupModule, ToastModule, ButtonModule, TooltipModule, FltCustomersComponent],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class CustomerComponent implements OnInit, AfterViewInit{

    @ViewChild('tblCustomers') tblCustomers: any;

    constructor(
    ) {}

    ngOnInit(): void{

    }

    ngAfterViewInit(): void{
        
    }

    // Events
    evtOnChangeValuesFilters(event: any): void{
      console.log('value filters', event);
      this.tblCustomers?.reload();
    }

}
