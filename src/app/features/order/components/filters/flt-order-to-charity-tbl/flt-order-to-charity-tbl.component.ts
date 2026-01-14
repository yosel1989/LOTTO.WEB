import { AfterViewInit, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { OverlayOptions } from 'primeng/api';
import { InputGroupModule } from 'primeng/inputgroup';
import { ColumnsFilterDto } from 'app/shared/services/models/table.model';
import { Tooltip } from "primeng/tooltip";

import { InputNumberModule } from 'primeng/inputnumber';
import { OrderService } from 'app/features/order/services/order.service';
import { Observable } from 'rxjs';
import { OrderOriginService } from 'app/features/order/services/order-origin.service';
import { TransactionPaymentTypeService } from 'app/features/transaction/services/transaction-payment-type.service';
import { FltOrderToCharityCreatedAtTblComponent } from './flt-order-to-charity-created-at-tbl/flt-order-to-charity-created-at-tbl.component';

@Component({
  selector: 'app-flt-order-to-charity-tbl',
  imports: [
    PanelModule, 
    AvatarModule, 
    ButtonModule, 
    MenuModule, 
    CardModule, 
    InputTextModule, 
    DatePickerModule, 
    SelectModule, 
    ReactiveFormsModule, 
    FormsModule, 
    IconFieldModule, 
    InputIconModule, 
    InputGroupModule, 
    InputNumberModule,
    Tooltip,
    FltOrderToCharityCreatedAtTblComponent
  ],
  templateUrl: './flt-order-to-charity-tbl.component.html',
  styleUrl: './flt-order-to-charity-tbl.component.scss',
  providers: [OrderService]
})
export class FltOrderToCharityTblComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('createdAtFilter') createdAtFilter: any;

  @Output() OnValueChanges: EventEmitter<ColumnsFilterDto[]> = new EventEmitter<ColumnsFilterDto[]>();


  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  isMobile = false;

  statuses: any[] | undefined;

  constructor(
    private fb: FormBuilder,
    private api: OrderService,
    private orderOriginService: OrderOriginService,
    private transactionPaymentTypeService: TransactionPaymentTypeService
  ) {
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;

		this.items = [
            {
                label: 'Refresh',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Search',
                icon: 'pi pi-search'
            },
            {
                separator: true
            },
            {
                label: 'Delete',
                icon: 'pi pi-times'
            }
    ];


  }

  ngAfterViewInit(): void {
	
  }

  ngOnDestroy(): void {
	
  }

  // Getters


  get getOverlayOptions(): OverlayOptions {
    return this.isMobile
      ? {
          mode: 'modal',
          styleClass: 'text-xs!',
          contentStyleClass: 'text-xs!'
        }
      : {
          styleClass: 'text-xs!',
          contentStyleClass: 'text-xs!'
        };
  }

  get columnsFilter(): ColumnsFilterDto[]{

    var filters = [];

    if (this.createdAtFilter.filter !== null) {
      filters.push(this.createdAtFilter.filter);
    }

    return filters;
  }

  // Events

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  evtChangeValuesFilters(evt: any): void{
    this.OnValueChanges.emit(this.columnsFilter);
  }

  evtClearAll(): void{
    this.createdAtFilter.evtClear();

    this.OnValueChanges.emit(this.columnsFilter);
  }

}
