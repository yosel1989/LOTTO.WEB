import { AfterViewInit, ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService } from 'primeng/dynamicdialog';
import { AlertService } from 'app/shared/services/alert.service';
import { Subject, Subscription, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { UtilService } from 'app/shared/services/util.service';
import { ColumnsFilterDto, DatatableQueryParamsDto, PaginationResponse } from 'app/shared/services/models/table.model';
import { LoaderComponent } from "app/shared/components/loader/loder.component";
import { TagModule } from 'primeng/tag';
import { Popover, PopoverModule } from 'primeng/popover';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';


import { Menu, MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { TransactionCollectionResponseDto } from 'app/features/transaction/models/transaction.model';
import { DividerModule } from 'primeng/divider';
import { OrderCollectionResponseDto } from 'app/features/order/models/order.model';
import { OrderService } from 'app/features/order/services/order.service';
import { CardModule } from 'primeng/card';
import { MdlOrderChangeStatusComponent } from '../../modals/mdl-change-status/mdl-order-change-status.component';
import { ResolvePathPipe } from 'app/core/pipes/resolve-path.pipe';
import { MdlOrderDetailComponent } from '../../modals/mdl-order-detail/mdl-order-detail.component';
import { SignalRService } from 'app/core/services/signalr.service';
import { saveAs } from 'file-saver';
import { MdlOrderHistoryComponent } from '../../modals/mdl-order-history/mdl-order-history.component';
import { MdlNotifyEmailComponent } from '../../modals/mdl-notify-email/mdl-notify-email.component';

import { StorageService } from 'app/core/services/storage.service';

import { User } from 'app/features/auth/services/auth.interface';
import { ProfileEnum } from 'app/core/enums/profile.enum';
import { MdlNotifyWhatsappComponent } from '../../modals/mdl-notify-whatsapp/mdl-notify-whatsapp.component';

interface Column {
    field: string;
    header: string;
	sort?: boolean;
	sticky?: boolean;
}

@Component({
  selector: 'app-tbl-orders',
  imports: [
	CommonModule, 
	Toolbar, 
	ButtonModule, 
	InputTextModule, 
	IconField, 
	InputIcon, 
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
  templateUrl: './tbl-orders.component.html',
  styleUrl: './tbl-orders.component.scss',
  providers: [DialogService]
})
export class TblOrdersComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @ViewChild('op') op!: Popover;
  @ViewChild('opStatus') opStatus!: Popover;
  @ViewChild('opNotify') opNotify!: Popover;
  @ViewChild('menuAcciones') menuAcciones!: Menu;

  @Input() filterColumn: ColumnsFilterDto[] = []; 

  ldData: boolean = true;
  items: MenuItem[] | undefined;

  ref: any | undefined;

  private subs = new Subscription();

  data: OrderCollectionResponseDto[] = [];
  total: number = 0; 
  total_ticket: number = 0; 
  cols: Column[] = [];
  selected: OrderCollectionResponseDto | undefined;

  queryParams?: DatatableQueryParamsDto;

  recordsTotalTable: number = 0;
  recordsTotal: number = 0;
  recordsFiltered: number = 0;
  first: number = 0;

  private refrescar$ = new Subject<void>();

  itemsMenu: MenuItem[] = [
	{
		label: 'Acciones',
		items: [
			{ label: 'Editar', icon: 'pi pi-pencil', command: () => this.evtOnEdit() }
		]
	}
  ];



  estados = [
	{value: 'pendiente', class: 'bg-amber-400 text-gray-600'},
	{value: 'aperturado', class: 'bg-cyan-400 text-gray-600'},
	{value: 'cerrado', class: 'bg-gray-400 text-gray-100'},
	{value: 'sorteado', class: 'bg-green-400 text-gray-600'},
	{value: 'cancelado', class: 'bg-red-400 text-gray-100'}
  ];

  user: User | null = null;
  profileEnum = ProfileEnum;

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
		{ field: 'numero', header: 'N° Orden', sort: true, sticky: true },
		{ field: 'customer', header: 'Cliente', sort: true, sticky: false },
		{ field: 'identity_document_number', header: 'N° Documento', sort: true, sticky: false },
		{ field: 'lottery', header: 'Sorteo', sort: true, sticky: false },
		{ field: 'total_tickets', header: 'N° Tickets', sort: true, sticky: false },
		{ field: 'total', header: 'Total', sort: true, sticky: false },
		{ field: 'status', header: 'Estado', sort: true, sticky: false },
		{ field: 'origen', header: 'Origen', sort: true, sticky: false },
		{ field: 'transaction.type', header: 'Tipo Pago', sort: true, sticky: false },
		{ field: 'transaction.reference', header: 'N° Operación', sort: true, sticky: false },
		{ field: 'created_at', header: 'Registrado | Fecha', sort: false  },
		{ field: 'created_by', header: 'Registrado | Por', sort: true  },
		{ field: 'created_by_user', header: 'Registrado | Por Usuario', sort: true  },
		{ field: 'created_local', header: 'Registrado | Local', sort: true  },
		{ field: 'updated_at', header: 'Modificado | Fecha', sort: true  },
		{ field: 'updated_by', header: 'Modificado | Por', sort: true  },
		{ field: 'updated_by_user', header: 'Modificado | Por Usuario', sort: true  },
		{ field: 'updated_local', header: 'Modificado | Local', sort: true  },
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
      switchMap(() => this.api.getAll(this.filterColumn ?? [], this.params))
    )
    .subscribe({
      next: (res: PaginationResponse<OrderCollectionResponseDto>) => { 
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

  evtToggleStatus(row: OrderCollectionResponseDto, event: any): void{
	if(this.hasProfile(ProfileEnum.SECTORISTA)){
		return;
	}
	
	this.selected = row;
	this.opStatus.show(event);

	if (this.opStatus.container) {
		this.opStatus.align();
	}
  }

  evtChangeStatus(status: string): void{
	this.handlerNoSelection();
	if(status !== this.selected!.status){
		//this.selected!.status = status;
		this.opStatus.hide();

		this.ref = this.dialogService.open(MdlOrderChangeStatusComponent,  {
			width: '600px',
			closable: true,
			modal: true,
			//draggable: true,
			position: 'top',
			header: 'Cambiar estado',
			//footer: 'ddd',
			//maximizable: true,
			styleClass: 'max-h-none! slide-down-dialog',
			maskStyleClass: 'overflow-y-auto',
			appendTo: 'body',
			inputValues: {
				data: this.selected,
				status: status
			}
		});

		const sub = this.ref.onChildComponentLoaded.subscribe((cmp: MdlOrderChangeStatusComponent) => {
			const sub2 = cmp?.OnChanged.subscribe(( s: boolean) => {
				console.log('selected', this.selected);
				this.alertService.showToast({
					position: 'bottom-end',
					icon: "success",
					title: `Se cambio el estado de la orden n° ${this.selected?.numero.toString().padStart(8, '0')} con éxito`,
					showCloseButton: true,
					timerProgressBar: true,
					timer: 4000
				});
				this.evtOnReload();
				this.ref?.close();
			});
			const sub3 = cmp?.OnCanceled.subscribe(_ => {
				this.ref?.close();
			});
			this.subs.add(sub2);
			this.subs.add(sub3);
		});

		this.subs.add(sub);
	}
	
  }

  reload(): void{
	this.evtOnReload();
  }

  evtOnCreate(): void{
	/*this.ref = this.dialogService.open(MdlCreateSorteoComponent,  {
		width: '1200px',
		closable: true,
		modal: true,
		draggable: true,
		position: 'top',
		header: 'Registrar Sorteo',
		styleClass: 'max-h-none! slide-down-dialog',
		maskStyleClass: 'overflow-y-auto py-4',
		appendTo: 'body'
	});

	const sub = this.ref.onChildComponentLoaded.subscribe((cmp: MdlCreateSorteoComponent) => {
		const sub2 = cmp?.OnCreated.subscribe(( s: SorteoCreateResponseDto) => {
			this.evtOnReload();
			this.ref?.close();
			this.alertService.showToast({
				position: 'bottom-end',
				icon: "success",
				title: "Se registro el sorteo con éxito",
				showCloseButton: true,
				timerProgressBar: true,
				timer: 4000
			});
		});
		const sub3 = cmp?.OnCanceled.subscribe(_ => {
			this.ref?.close();
		});
		this.subs.add(sub2);
		this.subs.add(sub3);
	});

	this.subs.add(sub);*/

  }

  evtOnEdit(): void{
	/*if(!this.selected){
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

	this.ref = this.dialogService.open(MdlEditSorteoComponent,  {
		width: '1200px',
		closable: true,
		modal: true,
		draggable: true,
		position: 'top',
		header: 'Editar Sorteo',
		styleClass: 'max-h-none! slide-down-dialog',
		maskStyleClass: 'overflow-y-auto py-4',
		appendTo: 'body',
		inputValues: {
			Id: this.selected.id
		}
	});

	this.ref.onChildComponentLoaded.subscribe((cmp: MdlEditSorteoComponent) => {
		const sub = cmp?.OnCanceled.subscribe(_ => {
			this.ref?.close();
		});
		this.subs.add(sub);
	});*/
  }

  evtOnShowInfo(): void{
	this.handlerNoSelection();
	this.ref = this.dialogService.open(MdlOrderDetailComponent,  {
		width: '600px',
		closable: true,
		modal: true,
		draggable: true,
		position: 'top',
		header: 'Detalle Orden',
		styleClass: 'max-h-none! slide-down-dialog',
		maskStyleClass: 'overflow-y-auto py-4',
		appendTo: 'body',
		inputValues: {
			data: this.selected
		}
	});
	this.ref.onChildComponentLoaded.subscribe((cmp: MdlOrderDetailComponent) => {
		const sub = cmp?.OnClose.subscribe(_ => {
			this.ref?.close();
		});
		this.subs.add(sub);
	});
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

  evtOnShowPopopver(event: any, item: OrderCollectionResponseDto): void{
	this.selected = item;
	this.op.show(event);

	if (this.op.container) {
		this.op.align();
	}
  }

  evtOnHidePopover(): void{
	this.op.hide();
  }

  evtOnSelectStatus(status: string): void{
	/*this.op.hide();

	this.ref = this.dialogService.open(MdlCambiarEstadoSorteoComponent,  {
		width: '700px',
		closable: true,
		modal: true,
		draggable: true,
		position: 'top',
		header: 'Cambiar estado',
		styleClass: 'max-h-none! slide-down-dialog',
		maskStyleClass: 'overflow-y-auto py-4',
		appendTo: 'body',
		inputValues:{
			Data: this.selected,
			Estado: status
		}
	});

	const sub = this.ref.onChildComponentLoaded.subscribe((cmp: MdlCambiarEstadoSorteoComponent) => {
		const sub2 = cmp?.OnCreated.subscribe(( s: boolean) => {
			this.evtOnReload();
			this.ref?.close();
			this.alertService.showToast({
				position: 'bottom-end',
				icon: "success",
				title: "Se cambio el estado con éxito",
				showCloseButton: true,
				timerProgressBar: true,
				timer: 4000
			});
		});
		const sub3 = cmp?.OnCanceled.subscribe(_ => {
			this.ref?.close();
		});
		this.subs.add(sub2);
		this.subs.add(sub3);
	});

	this.subs.add(sub);*/
  }


  evtOnShowPopopverAcciones(event: Event, item: TransactionCollectionResponseDto): void {
	const target = event.currentTarget as HTMLElement;
	/*if(this.menuAcciones?.visible){
		console.log(this.selected);
		if(this.selected && this.selected !== item){
			console.log('diferente');
			this.selected = item;
			this.menuAcciones?.hide();
			setTimeout(() => {
				this.menuAcciones?.show({ currentTarget: target });
			}, 50);
		}else{
			this.selected = item;
			this.menuAcciones?.toggle(event);
		}
	}else{
		this.selected = item;
		this.menuAcciones?.toggle(event);
	}*/
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
	console.log('exportar');
	this.api.exportAll(this.filterColumn ?? [], this.params).subscribe( blob => {
		console.log(blob);
      saveAs(blob, 'reporte.xlsx'); // 👈 descarga el archivo
    });
  }

  evtShowHistory(): void{
	this.handlerNoSelection();
	this.ref = this.dialogService.open(MdlOrderHistoryComponent,  {
		width: '350px',
		height: '95%',
		keepInViewport: false,
		closable: true,
		modal: true,
		draggable: false,
		position: 'right',
		header: `Historia de la orden N° ${this.selected?.numero.toString().padStart(8, '0')}`,
		styleClass: 'max-h-none!',
		maskStyleClass: 'overflow-y-auto py-4',
		appendTo: 'body',
		inputValues: {
			data: this.selected
		}
	});
	this.ref.onChildComponentLoaded.subscribe((cmp: MdlOrderHistoryComponent) => {
		const sub = cmp?.OnClose.subscribe(_ => {
			this.ref?.close();
		});
		this.subs.add(sub);
	});
  }

  evtPrint(): void{

  }

  evtShowOpNotify(event: any): void{
	this.handlerNoSelection();
	this.opNotify.show(event);

	if (this.opNotify.container) {
		this.opNotify.align();
	}
  }

  evtNotify(channel: string): void{
	if (this.opNotify){
		this.opNotify.hide();
	}

	if(channel === 'whatsapp'){
		this.ref = this.dialogService.open(MdlNotifyWhatsappComponent,  {
			width: '380px',
			keepInViewport: false,
			closable: true,
			modal: true,
			draggable: false,
			position: 'top',
			header: `Notificar compra por whatsapp`,
			styleClass: 'max-h-none!',
			maskStyleClass: 'overflow-y-auto py-4',
			appendTo: 'body',
			inputValues: {
				data: this.selected
			}
		});

		this.ref.onChildComponentLoaded.subscribe((cmp: MdlNotifyWhatsappComponent) => {
			const sub = cmp?.OnCanceled.subscribe(_ => {
				this.ref?.close();
			});

			const sub2 = cmp?.OnSended.subscribe(_ => {
				this.ref?.close();
			});

			this.subs.add(sub);
			this.subs.add(sub2);
		});
	}else{
		this.ref = this.dialogService.open(MdlNotifyEmailComponent,  {
			width: '380px',
			keepInViewport: false,
			closable: true,
			modal: true,
			draggable: false,
			position: 'top',
			header: `Notificar compra por correo`,
			styleClass: 'max-h-none!',
			maskStyleClass: 'overflow-y-auto py-4',
			appendTo: 'body',
			inputValues: {
				data: this.selected
			}
		});

		this.ref.onChildComponentLoaded.subscribe((cmp: MdlNotifyEmailComponent) => {
			const sub = cmp?.OnCanceled.subscribe(_ => {
				this.ref?.close();
			});

			const sub2 = cmp?.OnSended.subscribe(_ => {
				this.ref?.close();
			});

			this.subs.add(sub);
			this.subs.add(sub2);
		});
	}



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
