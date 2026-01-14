import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Popover, PopoverModule } from 'primeng/popover';
import { FormControl,ReactiveFormsModule,Validators } from '@angular/forms';
import { AlertService } from 'app/shared/services/alert.service';
import { ColumnsFilterDto } from 'app/shared/services/models/table.model';
import { Observable } from 'rxjs';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { Listbox, ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-flt-order-users-created-tbl',
  imports: [
    MultiSelectModule,
    ButtonModule,
    MessageModule,
    ReactiveFormsModule,
    InputIconModule,
    IconFieldModule,
    PopoverModule,
    SelectModule,
    InputTextModule,
    ListboxModule
  ],
  templateUrl: './flt-order-users-created-tbl.component.html',
  styleUrl: './flt-order-users-created-tbl.component.scss',
  providers: []
})
export class FltOrderUsersCratedTblComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() title: string = 'Filtrar';
  @Input() column: string = 'info';
  @Input() optionLabel: string = 'label';
  @Input() optionValue: string = 'value';
  @Input() placeholder: string = 'Seleccionar';
  @Input() datafnc!: Observable<any>;
  @Output() OnValueChange: EventEmitter<ColumnsFilterDto | null> = new EventEmitter<ColumnsFilterDto | null>();
  
  @ViewChild('popover') op!: Popover;
  @ViewChild('listBox') listBox?: Listbox;

  filterModes = [
    { label: 'Selección única', value: 'single'},
    { label: 'Selección múltiple', value: 'multiple'}
  ];

  data: any[] = [];

  submitted = false;
  ctrlText: FormControl = new FormControl(null);
  ctrlMode: FormControl = new FormControl(null, Validators.required);
  ctrlSingle: FormControl = new FormControl(null);
  ctrlMultiple: FormControl = new FormControl(null);

  constructor(
    private alertService: AlertService
  ) {

  }

  ngOnInit(): void {
    if (this.datafnc) {
      this.datafnc.subscribe(data => {
        this.data = data;
      });
    }

    this.ctrlMode.valueChanges.subscribe(val => {
      this.ctrlSingle.setValue(null);
      this.ctrlMultiple.setValue(null);
      this.ctrlSingle.clearValidators();
      this.ctrlMultiple.clearValidators();

      switch(val){
        case 'single': this.ctrlSingle.addValidators(Validators.required); break;
        case 'multiple': this.ctrlMultiple.addValidators(Validators.required); break;
        default: break;
      }

      this.ctrlSingle.updateValueAndValidity();
      this.ctrlMultiple.updateValueAndValidity();
    });

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
    if(this.ctrlMode.value === null){
      return null;
    }

    const value = this.ctrlMode.value === 'single' ? this.ctrlSingle.value.toString() : this.ctrlMultiple.value.join(",");

    return {
      data: this.column,
      search:{
        value: value,
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

        const mode = this.ctrlMode.value ?? '';

        switch(mode){
          case 'single': 
            const item = this.data.find(d => d[this.optionValue] === this.ctrlSingle.value);
            //this.values = this.ctrlSingle.value;
            this.ctrlText.setValue(item[this.optionLabel]); 
            break;
          case 'multiple': 
            //this.values = this.ctrlMultiple.value.join(",");
            const text = this.ctrlMultiple.value.length >  1 
              ? `${this.ctrlMultiple.value.length} elementos seleccionados` 
              : this.data.find(d => d[this.optionValue] === this.ctrlMultiple.value[0])[this.optionLabel];
            this.ctrlText.setValue(text);
            break;
          case '': this.evtClear(); break;
          default: break;
        }

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
    this.ctrlSingle.setValue(null);
    this.ctrlMultiple.setValue(null);
    this.ctrlText.setValue(null);
    //this.values = null;
    this.OnValueChange.emit(this.filter);
    this.op.hide();
  }

  evtT(evt: any) {
    console.log(evt);
    console.log(this.listBox);
    if (this.listBox?.filterOptions?.filter) {
      this.listBox.filterOptions.filter('juan');
    }
  }

  // Handlers

  handlerValidateError(): void{
    if(this.ctrlSingle.invalid){
      throw new Error('Debe seleccionar una opción.');
    }

    if(this.ctrlMultiple.invalid){
      throw new Error('Debe seleccionar minimo una opción.');
    }
  }

}
