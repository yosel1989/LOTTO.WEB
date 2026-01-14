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
import { FltOrderCreatedAtTblComponent } from './flt-order-created-at-tbl/flt-order-created-at-tbl.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { FltOrderStatusTblComponent } from './flt-order-customer-tbl/flt-order-customer-tbl.component';
import { FltOrderEmployeesCratedTblComponent } from './flt-order-employees-created-tbl/flt-order-employees-created-tbl.component';
import { OrderService } from 'app/features/order/services/order.service';
import { Observable } from 'rxjs';
import { FltOrderLocalesCratedTblComponent } from './flt-order-locales-created-tbl/flt-order-locales-created-tbl.component';
import { FltOrderUsersCratedTblComponent } from './flt-order-users-created-tbl/flt-order-users-created-tbl.component';
import { FltOrderOriginTblComponent } from './flt-order-origin-tbl/flt-order-origin-tbl.component';
import { OrderOriginService } from 'app/features/order/services/order-origin.service';
import { TransactionPaymentTypeService } from 'app/features/transaction/services/transaction-payment-type.service';
import { FltOrderPaymentTypeTblComponent } from './flt-order-payment-type-tbl/flt-order-payment-type-tbl.component';

@Component({
  selector: 'app-flt-order-tbl',
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
    FltOrderCreatedAtTblComponent,
    FltOrderStatusTblComponent,
    FltOrderEmployeesCratedTblComponent,
    FltOrderLocalesCratedTblComponent,
    FltOrderUsersCratedTblComponent,
    FltOrderOriginTblComponent,
    FltOrderPaymentTypeTblComponent
  ],
  templateUrl: './flt-order-tbl.component.html',
  styleUrl: './flt-order-tbl.component.scss',
  providers: [OrderService]
})
export class FltOrderTblComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('createdAtFilter') createdAtFilter: any;
  @ViewChild('customerFilter') customerFilter: any;
  @ViewChild('employeeCreatedAtFilter') employeeCreatedAtFilter: any;
  @ViewChild('userCreatedAtFilter') userCreatedAtFilter: any;
  @ViewChild('localCreatedAtFilter') localCreatedAtFilter: any;
  @ViewChild('orderOriginFilter') orderOriginFilter: any;
  @ViewChild('orderPaymentTypeFilter') orderPaymentTypeFilter: any;

  @Output() OnValueChanges: EventEmitter<ColumnsFilterDto[]> = new EventEmitter<ColumnsFilterDto[]>();

  frmFilter: FormGroup = new FormGroup({});

  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  isMobile = false;

  statuses: any[] | undefined;

  constructor(
    private fb: FormBuilder,
    private api: OrderService,
    private orderOriginService: OrderOriginService,
    private transactionPaymentTypeService: TransactionPaymentTypeService
  ) {
    this.frmFilter = this.fb.group({
        number: new FormControl(null),
        status: new FormControl(null)
    });

    this.frmFilter.valueChanges.subscribe(formValue => {
      this.OnValueChanges.emit(this.columnsFilter);
    });
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

    this.statuses = [
      {
        enum: 'pagada',
        label: 'Pagada'
      },
      {
        enum: 'aperturada',
        label: 'Aperturada'
      },
      {
        enum: 'vencida',
        label: 'Vencida'
      },
      {
        enum: 'pendiente',
        label: 'Pendiente'
      },
      {
        enum: 'procesada',
        label: 'Procesada'
      },
      {
        enum: 'fallo_pago',
        label: 'Fallo pago'
      },
      {
        enum: 'cancelada',
        label: 'Cancelada'
      },
      {
        enum: 'vencio_tiempo_pago',
        label: 'Venció Tiempo Pago'
      },
      {
        enum: 'devolucion_pago',
        label: 'Devolución Pago'
      },
    ];

  }

  ngAfterViewInit(): void {
	
  }

  ngOnDestroy(): void {
	
  }

  // Getters

  get f(): any{
    return this.frmFilter.controls;
  }

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

    if (this.customerFilter.filter !== null) {
      filters.push(this.customerFilter.filter);
    }

    if (this.employeeCreatedAtFilter.filter !== null) {
      filters.push(this.employeeCreatedAtFilter.filter);
    }

    if (this.userCreatedAtFilter.filter !== null) {
      filters.push(this.userCreatedAtFilter.filter);
    }

    if (this.localCreatedAtFilter.filter !== null) {
      filters.push(this.localCreatedAtFilter.filter);
    }

    if (this.orderOriginFilter.filter !== null) {
      filters.push(this.orderOriginFilter.filter);
    }

    if (this.orderPaymentTypeFilter.filter !== null) {
      filters.push(this.orderPaymentTypeFilter.filter);
    }

    if(this.f.number.value){
      filters.push(
        {
          data: 'number',
          search: {
            value: this.f.number.value,
            regex: false
          }
        }
      );
    }

    if(this.f.status.value){
      filters.push(
        {
          data: 'status',
          search: {
            value: this.f.status.value,
            regex: false
          }
        }
      );
    }

    return filters;
  }

  // Events

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }

  evtChangeValuesFilters(evt: any): void{
    console.log('ddd');
    this.OnValueChanges.emit(this.columnsFilter);
  }

  evtClearAll(): void{
    this.createdAtFilter.evtClear();
    this.customerFilter.evtClear();
    this.employeeCreatedAtFilter.evtClear();
    this.userCreatedAtFilter.evtClear();
    this.localCreatedAtFilter.evtClear();
    this.orderOriginFilter.evtClear();
    this.orderPaymentTypeFilter.evtClear();

    this.frmFilter.patchValue({
      number: null
    });
    this.OnValueChanges.emit(this.columnsFilter);
  }

  // Data

  getEmployessCreated(): Observable<any>{
    return this.api.getAllEmployeeCreated();
  }

  getUsersCreated(): Observable<any>{
    return this.api.getAllUserCreated();
  }

  getLocalesCreated(): Observable<any>{
    return this.api.getAllLocalCreated();
  }

  getOriginsCreated(): Observable<any>{
    return this.orderOriginService.getAll();
  }

  getPaymentTypes(): Observable<any>{
    return this.transactionPaymentTypeService.getAll();
  }

}
