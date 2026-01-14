import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputIconModule } from 'primeng/inputicon';
import { Popover, PopoverModule } from 'primeng/popover';
import { InputText } from "primeng/inputtext";
import { SelectModule } from 'primeng/select';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { DividerModule } from 'primeng/divider';
import { AlertService } from 'app/shared/services/alert.service';
import { MessageModule } from 'primeng/message';
import { ColumnsFilterDto } from 'app/shared/services/models/table.model';
import { Tooltip } from "primeng/tooltip";

@Component({
  selector: 'app-flt-order-customer-tbl',
  imports: [
    ButtonModule,
    PopoverModule,
    CommonModule,
    InputGroupModule,
    InputGroupAddonModule,
    IconFieldModule,
    InputIconModule,
    InputText,
    SelectModule,
    ReactiveFormsModule,
    FormsModule,
    DividerModule,
    MessageModule,
    Tooltip
],
  templateUrl: './flt-order-customer-tbl.component.html',
  styleUrl: './flt-order-customer-tbl.component.scss',
  providers: []
})
export class FltOrderStatusTblComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() title: string = 'Filtrar';
  @Input() column: string = 'info';
  @Output() OnValueChange: EventEmitter<ColumnsFilterDto | null> = new EventEmitter<ColumnsFilterDto | null>();
  
  @ViewChild('popover') op!: Popover;

  filterModes = [
    { label: 'Contiene', value: 'contains', symbol: '[T]' },
    { label: 'Empieza con', value: 'startsWith', symbol: 'T]' },
    { label: 'Termina con', value: 'endsWith', symbol: '[T' },
    { label: 'Igual a', value: 'equals', symbol: 'T' },
    //{ label: 'Incluir', value: 'in', icon: 'pi pi-plus', symbol: '+T' },
    //{ label: 'Excluir', value: 'notIn', icon: 'pi pi-minus', symbol: '–T' }
  ];

  submitted = false;
  ctrlText: FormControl = new FormControl(null);
  ctrlMode: FormControl = new FormControl(null, Validators.required);
  ctrlTextValue: FormControl = new FormControl(null, Validators.required);

  constructor(
    private alertService: AlertService
  ) {

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  ngOnDestroy(): void {
	
  }

  toggle(event: any) {
      this.op.toggle(event);
  }

  // Getters

  get filter(): ColumnsFilterDto | null{
    if(this.ctrlTextValue.value === null){
      return null;
    }

    return {
      data: this.column,
      search:{
        value: this.ctrlTextValue.value,
        regex: false,
        match: this.ctrlMode.value
      }
    }
  }

  // Events

  evtApply(): void{

    this.submitted = true;
    try {
        this.handlerValidateError();
        this.ctrlText.setValue(this.ctrlTextValue.value);



        this.OnValueChange.emit(this.filter);
        this.submitted = false;
        this.op.hide();
    } catch (error: any) {
      this.alertService.showToast({
        icon: 'warning',
        title: error.message,
        showCloseButton: true
      });
    }
  }

  evtClear(): void{
    this.submitted = false;
    this.ctrlMode.setValue(null);
    this.ctrlTextValue.setValue(null);
    this.ctrlText.setValue(null);
    this.OnValueChange.emit(this.filter);
  }

  // Handlers

  handlerValidateError(): void{
    if(this.ctrlTextValue.invalid){
      throw new Error('Tiene que ingresar un texto.');
    }
  }

}
