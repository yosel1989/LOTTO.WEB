import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertService } from 'app/shared/services/alert.service';
import { Subject, Subscription, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { UtilService } from 'app/shared/services/util.service';
import { ColumnsFilterDto, DatatableQueryParamsDto, PaginationResponse } from 'app/shared/services/models/table.model';
import { LoaderComponent } from "app/shared/components/loader/loder.component";
import { TagModule } from 'primeng/tag';
import { PopoverModule } from 'primeng/popover';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';


import { MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { DividerModule } from 'primeng/divider';
import { OrderCollectionResponseDto, OrderCollectionToCharityResponseDto } from 'app/features/order/models/order.model';
import { OrderService } from 'app/features/order/services/order.service';
import { CardModule } from 'primeng/card';
import { ResolvePathPipe } from 'app/core/pipes/resolve-path.pipe';
import { SignalRService } from 'app/core/services/signalr.service';
import { saveAs } from 'file-saver';

import { StorageService } from 'app/core/services/storage.service';

import { User } from 'app/features/auth/services/auth.interface';

interface Column {
    field: string;
    header: string;
	sort?: boolean;
	sticky?: boolean;
}

@Component({
  selector: 'app-tbl-orders-to-charity',
  imports: [
	CommonModule, 
	Toolbar, 
	ButtonModule, 
	InputTextModule, 
	TooltipModule, 
	TableModule, 
	LoaderComponent, 
	TagModule, 
	PopoverModule, 
	MenuModule, 
	SkeletonModule, 
	RippleModule, 
	DividerModule, 
	CardModule,
	ResolvePathPipe
	//MdlOrderDetailComponent
  ],
  templateUrl: './tbl-orders-to-charity.component.html',
  styleUrl: './tbl-orders-to-charity.component.scss',
  providers: [DialogService]
})
export class TblOrdersToCharityComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {


  @Input() filterColumn: ColumnsFilterDto[] = []; 

  ldData: boolean = true;
  items: MenuItem[] | undefined;

  ref: any | undefined;

  private subs = new Subscription();

  data: OrderCollectionToCharityResponseDto[] = [];
  total: number = 0; 
  total_ticket: number = 0; 
  cols: Column[] = [];
  selected: OrderCollectionToCharityResponseDto | undefined;

  queryParams?: DatatableQueryParamsDto;

  recordsTotalTable: number = 0;
  recordsTotal: number = 0;
  recordsFiltered: number = 0;
  first: number = 0;

  private refrescar$ = new Subject<void>();

  estados = [
	{value: 'pendiente', class: 'bg-amber-400 text-gray-600'},
	{value: 'aperturado', class: 'bg-cyan-400 text-gray-600'},
	{value: 'cerrado', class: 'bg-gray-400 text-gray-100'},
	{value: 'sorteado', class: 'bg-green-400 text-gray-600'},
	{value: 'cancelado', class: 'bg-red-400 text-gray-100'}
  ];

  user: User | null = null;

  constructor(
	public dialogService: DialogService,
	private alertService: AlertService,
	private api: OrderService,
	public utilService: UtilService,
	private cdr: ChangeDetectorRef,
	private route: Router,
	private signalRService: SignalRService,
	private storageService: StorageService
  ) {
	this.queryParams = {
		info: '',
		//columns: this.filterColumn,
		start: 0,
		order: 'desc',
		length: 10,
		draw: 1,
	}
  }

  ngOnInit(): void {

	this.user = this.storageService.getUser();
	
	this.cols = [
		{ field: 'select', header: '', sort: false },
		{ field: 'id', header: '#', sort: false, sticky: true },
		//{ field: 'numero', header: 'N° Orden', sort: true, sticky: true },
		//{ field: 'customer', header: 'Cliente', sort: true, sticky: false },
		//{ field: 'identity_document_number', header: 'N° Documento', sort: true, sticky: false },
		//{ field: 'lottery', header: 'Sorteo', sort: true, sticky: false },
		{ field: 'total_tickets', header: 'N° Tickets', sort: true, sticky: false },
		{ field: 'total', header: 'Total', sort: true, sticky: false },
		{ field: 'status', header: 'Estado', sort: true, sticky: false },
		//{ field: 'origen', header: 'Origen', sort: true, sticky: false },
		//{ field: 'transaction.type', header: 'Tipo Pago', sort: true, sticky: false },
		//{ field: 'transaction.reference', header: 'N° Operación', sort: true, sticky: false },
		{ field: 'created_at', header: 'Registrado | Fecha', sort: false  },
		//{ field: 'created_by', header: 'Registrado | Por', sort: true  },
		//{ field: 'created_by_user', header: 'Registrado | Por Usuario', sort: true  },
		//{ field: 'created_local', header: 'Registrado | Local', sort: true  },
		//{ field: 'updated_at', header: 'Modificado | Fecha', sort: true  },
		//{ field: 'updated_by', header: 'Modificado | Por', sort: true  },
		//{ field: 'updated_by_user', header: 'Modificado | Por Usuario', sort: true  },
		//{ field: 'updated_local', header: 'Modificado | Local', sort: true  },
	];
	this.cdr.markForCheck();

	this.signalRService.iniciarConexion();

	this.signalRService.escucharMensajes((mensaje: string) => {
      console.log('📨 Mensaje recibido:', mensaje);
    });

    this.signalRService.listenOrders((mensaje: any) => {
      console.log('Order:', mensaje);
	  this.evtOnReload();
    });

	//this.signalRService.cambiarOrden("admin");
  }

  ngAfterViewInit(): void {
	this.refrescar$
    .pipe(
      tap(() => this.ldData = true),
      switchMap(() => this.api.getAllToCharity(this.filterColumn ?? [], this.params))
    )
    .subscribe({
      next: (res: PaginationResponse<OrderCollectionToCharityResponseDto>) => { 
		//console.log('collection', res);
		
		this.ldData = false;
		this.data = res.data;
		this.total = res.total;
		this.total_ticket = res.total_ticket;
		this.recordsTotal = res.records_total;
		this.recordsFiltered = res.records_filtered;
		this.recordsTotalTable = (this.filterColumn.length || this.queryParams?.info) ? this.recordsFiltered : this.recordsTotal;
		this.first = res.page * res.length;
		this.queryParams = {
			...this.queryParams!,
			start : res.page,
		};
      	
	  },
      error: (e: any) => {
		//console.log(e.error);
		this.alertService.showToast({
			icon: "error",
			title: e.status === 0 ? 'El servidor no responde' : e.error.message
		});
        this.data = [];
        this.ldData = false;
      }
    });
	this.refrescar$.next();


	//console.log('opstatus', this.opStatus);
  }

  ngOnDestroy(): void {
	this.subs.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
	const current = changes['filterColumn'].currentValue;
	this.filterColumn = current;
	console.log(this.filterColumn);
	this.evtOnReload();
  }

  // Getters
  get params(): DatatableQueryParamsDto{
	return this.queryParams!;
  }

  isLastPage(): boolean {
	return this.data ? this.first + this.queryParams!.length >= this.recordsTotalTable : true;
  }

  isFirstPage(): boolean {
	return this.data ? this.first === 0 : true;
  }

  // Events

  private evtOnReload(): void{
	this.selected = undefined;
	this.refrescar$.next();
  }


  reload(): void{
	this.evtOnReload();
  }

  evtToggleSelection(row: OrderCollectionResponseDto): void{
	if (this.selected === row) {
		this.selected = undefined; // deselecciona si ya estaba seleccionado
	} else {
		this.selected = row; // selecciona nuevo
	}
  }

  evtOnPageChange(evt: any){
	const currentPage = Math.floor(evt.first / evt.rows);
	//console.log(evt);
	this.queryParams = {
		...this.queryParams!,
		start : currentPage,
		length: evt.rows
	};
	this.evtOnReload();
  }

  evtOnFilter(value: string){
	this.queryParams = {
		...this.queryParams!,
		info: value ?? ''
	}
	this.evtOnReload();
  }


  evtNext() {
    this.queryParams = {
		...this.queryParams!,
		start : this.first + this.queryParams!.length 
	};
	this.reload();
  }

  evtPrev() {
    this.first = this.first - this.queryParams!.length;
	this.reload();
  }

  evtExport(): void{
	this.api.exportAllToCharity(this.filterColumn ?? [], this.params).subscribe( blob => {
      saveAs(blob, 'reporte-beneficencia.xlsx'); // 👈 descarga el archivo
    }, (err: any) => {
	
		this.alertService.showToast({
			position: 'top-right',
			icon: "error",
			title: "No se puedo exportar el reporte o no tien permisos suficientes.",
			showCloseButton: true,
			timerProgressBar: true,
			timer: 2000,
			target: "body"
		});
	});
  }

  // Handlers
  
  private handlerNoSelection(): void{
	if(!this.selected){
		this.alertService.showToast({
			position: 'bottom-end',
			icon: "warning",
			title: "Debe seleccionar un registro.",
			showCloseButton: true,
			timerProgressBar: true,
			timer: 4000
		});
		return;
	}
  }



  hasProfile(profile: number): boolean{
	const profileIds = this.user?.profiles.map((x: any) => x.id);
	return profileIds?.includes(profile) ?? false;
  }

}
