import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'app/shared/services/alert.service';
import { SettingsVariableService } from 'app/features/settings/services/settings-variable.service';
import { SelectModule } from 'primeng/select';
import { SettingsVariableDto } from 'app/features/settings/models/settings.model';
import { DividerModule } from 'primeng/divider';
import { LoaderComponent } from 'app/shared/components/loader/loder.component';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from "primeng/table";
import { DatePipe } from '@angular/common';
import { DialogService } from 'primeng/dynamicdialog';
import { MdlSettingsVariableInfoComponent } from '../../modals/mdl-settings-variable-info/mdl-settings-variable-info.component';
import { IconFieldModule } from 'primeng/iconfield';
import { ToolbarModule } from 'primeng/toolbar';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { MdlSettingsAddVariableComponent } from '../../modals/mdl-settings-add-variable/mdl-settings-add-variable.component';

@Component({
  selector: 'app-list-settings-variable',
  imports: [
    FormsModule,
    InputNumberModule,
    InputTextModule,
    TextareaModule,
    ButtonModule,
    ReactiveFormsModule,
    MessageModule,
    MessageModule,
    SelectModule,
    DividerModule,
    LoaderComponent,
    TooltipModule,
    TableModule,
    DatePipe,
    ConfirmDialogModule,
    IconFieldModule,
    ToolbarModule,
    InputIconModule,
    PaginatorModule
],
  templateUrl: './list-settings-variable.component.html',
  styleUrl: './list-settings-variable.component.scss',
  providers: [ConfirmationService]
})
export class ListSettingsVariableComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() OnSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();

  private subs = new Subscription();

  collection: SettingsVariableDto[] = [];
  loading: boolean = false;
  ref: any | undefined;


  first1: number = 0;
  first2: number = 0;
  rows2: number = 0;
  
  constructor(
    private api: SettingsVariableService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
	) {
  }

  ngOnInit(): void {
    this.getAll();
  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Data|

  private getAll(): void{
    this.loading = true;
    this.api.getAll().subscribe({
      next: (data) => {
        this.collection = data;
        this.loading = false;
      },
      error: (error) => {
        this.alertService.showToast({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un error al cargar las variables de configuración.'
        });
        this.loading = false;
      }
    });
  }

  // Events

  evtOnDelete(variable: SettingsVariableDto): void{
    this.confirmationService.confirm({
        header: `¿Esta seguro de eliminar la variable de configuración?`,
        message: 'Confirmar la operación.',
        accept: () => {

            this.delete(variable);
           
        },
        reject: () => {
            
        },
    });
  }


  evtShowAdd(): void{

    this.ref = this.dialogService.open(MdlSettingsAddVariableComponent,  {
      width: '700px',
      keepInViewport: false,
      closable: true,
      modal: true,
      draggable: false,
      position: 'top',
      header: `Agregar variable`,
      styleClass: 'max-h-none!',
      maskStyleClass: 'overflow-y-auto py-4',
      appendTo: 'body'
    });

    const sub = this.ref.onChildComponentLoaded.subscribe((cmp: MdlSettingsAddVariableComponent) => {
    const sub2 = cmp?.OnSuccess.subscribe(( s: boolean) => {
        this.onReload();
        this.ref?.close();
        this.alertService.showToast({
          position: 'top-end',
          icon: "success",
          title: "Se registró la variable correctamente.",
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


  evtShowInfo(variable: SettingsVariableDto): void{
    this.ref = this.dialogService.open(MdlSettingsVariableInfoComponent,  {
      width: '600px',
      closable: true,
      modal: true,
      position: 'top',
      header: 'Información de la variable',
      styleClass: 'max-h-none! slide-down-dialog',
      maskStyleClass: 'overflow-y-auto',
      appendTo: 'body',
      inputValues: {
        id: variable.id
      }
    });

    const sub = this.ref.onChildComponentLoaded.subscribe((cmp: MdlSettingsVariableInfoComponent) => {
      const sub3 = cmp?.OnCanceled.subscribe(_ => {
        this.ref?.close();
      });
      this.subs.add(sub3);
    });

    this.subs.add(sub);
  }


  private delete(variable: SettingsVariableDto): void{

    this.api.delete(variable.id).subscribe({
      next: (data) => {
        this.alertService.showToast({
          icon: 'success',
          title: 'Eliminado',
          text: 'Variable de configuración eliminada correctamente.'
        });
        this.onReload();
      },
      error: (error) => {
        this.alertService.showToast({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrio un error al eliminar la variable de configuración.'
        });
      }
    });
  }

  onReload(): void{
    this.getAll();
  }




  isFirstPage(): boolean {
    return true;
  }

  evtPrev(): void{

  }

  evtOnReload(): void{
    this.getAll();
  }

  isLastPage(): void{

  }

  evtNext(): void{
    
  }

  evtOnFilter(value: string): void{

  }

  onPageChange2(event: PaginatorState) {
      this.first2 = event.first ?? 0;
      this.rows2 = event.rows ?? 10;
  }
}
