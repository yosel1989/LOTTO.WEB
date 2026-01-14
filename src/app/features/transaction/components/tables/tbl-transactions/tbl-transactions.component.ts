import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AlertService } from 'app/shared/services/alert.service';
import { Subject, Subscription, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { UtilService } from 'app/shared/services/util.service';
import { DatatableQueryParamsDto, TableCollectionResponse } from 'app/shared/services/models/table.model';
import { LoaderComponent } from "app/shared/components/loader/loder.component";
import { TagModule } from 'primeng/tag';
import { Popover, PopoverModule } from 'primeng/popover';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';


import { Menu, MenuModule } from 'primeng/menu';
import { Router } from '@angular/router';
import { TransactionService } from 'app/features/transaction/services/transaction.service';
import { TransactionCollectionResponseDto } from 'app/features/transaction/models/transaction.model';
import { DividerModule } from 'primeng/divider';

interface Column {
    field: string;
    header: string;
	sort?: boolean;
	sticky?: boolean;
}

@Component({
  selector: 'app-tbl-transactions',
  imports: [CommonModule, Toolbar, ButtonModule, InputTextModule, IconField, InputIcon, TooltipModule, TableModule, LoaderComponent, TagModule, PopoverModule, MenuModule, SkeletonModule, RippleModule, DividerModule ],
  templateUrl: './tbl-transactions.component.html',
  styleUrl: './tbl-transactions.component.scss',
  providers: [DialogService]
})
export class TblTransactionsComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('op') op!: Popover;
  @ViewChild('menuAcciones') menuAcciones!: Menu;

  ldData: boolean = true;
  items: MenuItem[] | undefined;

  ref: DynamicDialogRef | undefined;

  private subs = new Subscription();

  data: TransactionCollectionResponseDto[] = [];
  cols: Column[] = [];
  selected: TransactionCollectionResponseDto | undefined;

  queryParams: DatatableQueryParamsDto = {
	info: '',
	//columns: [],
	start: 0,
	order: 'desc',
	length: 10,
	draw: 1,
  }

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

  constructor(
	public dialogService: DialogService,
	private alertService: AlertService,
	private api: TransactionService,
	public utilService: UtilService,
	private cdr: ChangeDetectorRef,
	private route: Router
  ) {}

  ngOnInit(): void {
	this.cols = [
		{ field: 'select', header: '', sort: false },
		{ field: 'id', header: 'ID Jugada', sort: true},
		{ field: 'id_customer', header: 'ID Jugador', sort: true, sticky: true },
		{ field: 'currency', header: 'Moneda', sort: true  },
		{ field: 'amount', header: 'Monto', sort: true  },
		{ field: 'type', header: 'Tipo', sort: true  },
		{ field: 'first_name_customer', header: 'Nombre', sort: true  },
		{ field: 'last_name_customer', header: 'Apellido', sort: true  },
		{ field: 'user_name', header: 'Nombre de Usuario', sort: true  },
		{ field: 'created_at', header: 'Creado', sort: true  },
		{ field: 'Fuente', header: 'origin', sort: true  }
	];
	this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
	this.refrescar$
    .pipe(
      tap(() => this.ldData = true),
      switchMap(() => this.api.getAll(this.params))
    )
    .subscribe({
      next: (res: TableCollectionResponse<TransactionCollectionResponseDto[]>) => {
		this.ldData = false;
		this.data = res.data;
		this.recordsTotal = res.pagination.recordsFiltered ? res.pagination.recordsFiltered : res.pagination.recordsTotal;
		this.recordsFiltered = res.pagination.recordsFiltered;
		this.first = res.pagination.page * res.pagination.length;
		this.queryParams = {
			...this.queryParams,
			start : res.pagination.page
		};
      },
      error: () => {
        this.data = [];
        this.ldData = false;
      }
    });
	this.refrescar$.next();
  }

  ngOnDestroy(): void {
	this.subs.unsubscribe();
  }

  // Getters
  get params(): DatatableQueryParamsDto{
	return this.queryParams;
  }

  isLastPage(): boolean {
	return this.data ? this.first + this.queryParams.length >= this.recordsFiltered : true;
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
	this.handleNoSelection();
	this.route.navigate(["/admin/customers/",this.selected?.id]);
  }

  evtToggleSelection(row: TransactionCollectionResponseDto): void{
	if (this.selected === row) {
		this.selected = undefined; // deselecciona si ya estaba seleccionado
	} else {
		this.selected = row; // selecciona nuevo
	}
  }

  evtOnPageChange(evt: any){
	const currentPage = Math.floor(evt.first / evt.rows);
	console.log(evt);
	this.queryParams = {
		...this.queryParams,
		start : currentPage,
		length: evt.rows
	};
	this.evtOnReload();
  }

  evtOnFilter(value: string){
	this.queryParams = {
		...this.queryParams,
		info: value ?? ''
	}
	this.evtOnReload();
  }

  evtOnShowPopopver(event: any, item: TransactionCollectionResponseDto): void{
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
		...this.queryParams,
		start : this.first + this.queryParams.length 
	};
	this.reload();
  }

  evtPrev() {
    this.first = this.first - this.queryParams.length;
	this.reload();
  }


  // Handlers
  
  private handleNoSelection(): void{
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


  // Data
  private loadData(): void{
	this.ldData = true;
	const sub = this.api.getAll(this.params).subscribe({
		next: (res: TableCollectionResponse<TransactionCollectionResponseDto[]>) => {
			//console.log('recordsTotal', res.pagination.recordsTotal);
			this.ldData = false;
			this.data = res.data;
			this.recordsTotal = res.pagination.recordsFiltered ? res.pagination.recordsFiltered : res.pagination.recordsTotal;
			this.recordsFiltered = res.pagination.recordsFiltered;

			
		},
		error: (err) => {
			this.ldData = false;
			this.data = [];
		}
	});
	this.subs.add(sub);
  }

}
