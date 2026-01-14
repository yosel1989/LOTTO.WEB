import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { StorageService } from 'app/core/services/storage.service';
import { User } from 'app/features/auth/services/auth.interface';
import { FltOrderTblComponent } from 'app/features/order/components/filters/flt-order-tbl/flt-order-tbl.component';
import { FltOrderToCharityTblComponent } from 'app/features/order/components/filters/flt-order-to-charity-tbl/flt-order-to-charity-tbl.component';
import { TblOrdersToCharityComponent } from 'app/features/order/components/tables/tbl-orders-to-charity/tbl-orders-to-charity.component';
import { TblOrdersComponent } from 'app/features/order/components/tables/tbl-orders/tbl-orders.component';
import { ColumnsFilterDto } from 'app/shared/services/models/table.model';

@Component({
  selector: 'app-orders',
  imports: [
    TblOrdersComponent,
    TblOrdersToCharityComponent, 
    FltOrderTblComponent,
    FltOrderToCharityTblComponent
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: []
})
export class OrdersComponent implements OnInit, AfterViewInit{
    @ViewChild('table') tblOrders: any;
    filterColumn: ColumnsFilterDto[] = [];

    currentUser: User | null = null;

    constructor(
      private storageService: StorageService
    ) {
      this.currentUser = this.storageService.getUser();
    }

    ngOnInit(): void{

    }

    ngAfterViewInit(): void{
    }

    // Events

    evtOnChangeValuesFilters(event: ColumnsFilterDto[]): void{
      this.filterColumn = event;
    }

    hasProfile(profile: number): boolean{
      const profileIds = this.currentUser?.profiles.map((x: any) => x.id);
      return profileIds?.includes(profile) ?? false;
    }
    
}
