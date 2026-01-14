import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuItem } from 'primeng/api';
import { Toolbar } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { DialogService } from 'primeng/dynamicdialog';
import { MdlCreateSorteoComponent } from '../../modals/mdl-create-sorteo/mdl-create-sorteo.component';
import { MdlEditSorteoComponent } from '../../modals/mdl-edit-sorteo/mdl-edit-sorteo.component';
import { SorteoCollectionQueryParamsDto, SorteoCollectionResponseDto, SorteoCreateResponseDto } from 'app/features/lottery/models/sorteo.model';
import { AlertService } from 'app/shared/services/alert.service';
import { Subject, Subscription, switchMap, tap } from 'rxjs';
import { TableModule } from 'primeng/table';
import { SorteoService } from 'app/features/lottery/services/sorteo.service';
import { UtilService } from 'app/shared/services/util.service';
import { TableCollectionResponse } from 'app/shared/services/models/table.model';
import { LoaderComponent } from "app/shared/components/loader/loder.component";
import { TagModule } from 'primeng/tag';
import { Popover, PopoverModule } from 'primeng/popover';
import { MdlCambiarEstadoSorteoComponent } from '../../modals/mdl-cambiar-estado-sorteo/mdl-cambiar-estado-sorteo.component';
import { SkeletonModule } from 'primeng/skeleton';
import { RippleModule } from 'primeng/ripple';


import { Menu, MenuModule } from 'primeng/menu';
import { DividerModule } from 'primeng/divider';

interface Column {
    field: string;
    header: string;
	sort?: boolean;
	sticky?: boolean;
}

@Component({
  selector: 'app-tbl-sorteos',
  imports: [CommonModule, Toolbar, ButtonModule, InputTextModule, IconField, InputIcon, TooltipModule, TableModule, LoaderComponent, TagModule, PopoverModule, MenuModule, SkeletonModule, RippleModule, DividerModule ],
  templateUrl: './tbl-sorteos.component.html',
  styleUrl: './tbl-sorteos.component.scss',
  providers: [DialogService]
})
export class TblSorteosComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('op') op!: Popover;
  @ViewChild('menuAcciones') menuAcciones!: Menu;

  ldData: boolean = true;
  items: MenuItem[] | undefined;

  ref: any | undefined;

  private subs = new Subscription();

  data: SorteoCollectionResponseDto[] = [];
  cols: Column[] = [];
  selected: SorteoCollectionResponseDto | undefined;

  queryParams: SorteoCollectionQueryParamsDto = {
	info: '',
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
	private sorteoService: SorteoService,
	public utilService: UtilService,
	private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
	this.cols = [
		{ field: 'select', header: '', sort: false, sticky: true },
		{ field: 'nombre', header: 'Nombre', sort: true, sticky: true },
		{ field: 'slug', header: 'Slug', sort: true  },
		{ field: 'f_inicio_venta', header: 'Inicio de Venta', sort: true  },
		{ field: 'f_fin_venta', header: 'Fin de Venta', sort: true  },
		{ field: 'f_sorteo', header: 'Fecha de Sorteo', sort: true  },
		{ field: 'f_ext_sorteo', header: 'Fecha Ext. Sorteo', sort: true  },
		{ field: 'precio_rifa', header: 'Precio de Rifa', sort: true  },
		{ field: 'numero_min', header: 'Número Mínimo', sort: true  },
		{ field: 'numero_max', header: 'Número Máximo', sort: true  },
		{ field: 'flag_rifas', header: 'Mostrar Rifas?', sort: true  },
		{ field: 'estado', header: 'Estado', sort: true  },
		{ field: 'emp_registro', header: 'Registrado Por', sort: true  },
		{ field: 'f_registro', header: 'Fecha de Registro', sort: true  },
		{ field: 'emp_modifico', header: 'Modificado Por', sort: true  },
		{ field: 'f_modifico', header: 'Fecha de Modificación', sort: true  },
		{ field: 'acciones', header: 'Acciones', sort: false, sticky: true }
	];
	this.cdr.markForCheck();
  }

  ngAfterViewInit(): void {
	this.refrescar$
    .pipe(
      tap(() => this.ldData = true),
      switchMap(() => this.sorteoService.collectionSorteo(this.params))
    )
    .subscribe({
      next: (res: TableCollectionResponse<SorteoCollectionResponseDto[]>) => {
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
  get params(): SorteoCollectionQueryParamsDto{
	return this.queryParams;
  }

  isLastPage(): boolean {
	return this.data ? this.first + this.queryParams.length >= this.recordsFiltered : true;
  }

  isFirstPage(): boolean {
	return this.data ? this.first === 0 : true;
  }

  // Events
  evtOnReload(): void{
	this.selected = undefined;
	this.refrescar$.next();
  }

  evtOnCreate(): void{
	this.ref = this.dialogService.open(MdlCreateSorteoComponent,  {
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

	this.subs.add(sub);

  }

  evtOnEdit(): void{
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
	});
  }

  evtToggleSelection(row: SorteoCollectionResponseDto): void{
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

  evtOnShowPopopver(event: any, item: SorteoCollectionResponseDto): void{
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
	this.op.hide();

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

	this.subs.add(sub);
  }


  evtOnShowPopopverAcciones(event: Event, item: SorteoCollectionResponseDto): void {
	const target = event.currentTarget as HTMLElement;
	if(this.menuAcciones?.visible){
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
	}
  }

  reload(): void{
	this.evtOnReload();
  }


  // Data
  private loadData(): void{
	this.ldData = true;
	const sub = this.sorteoService.collectionSorteo(this.params).subscribe({
		next: (res: TableCollectionResponse<SorteoCollectionResponseDto[]>) => {
			//console.log('recordsTotal', res.pagination.recordsTotal);
			this.ldData = false;
			this.data = res.data;
			this.recordsTotal = res.pagination.recordsFiltered ? res.pagination.recordsFiltered : res.pagination.recordsTotal;
			this.recordsFiltered = res.pagination.recordsFiltered;

			
		},
		error: (err: any) => {
			this.ldData = false;
			this.data = [];
		}
	});
	this.subs.add(sub);
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

}
