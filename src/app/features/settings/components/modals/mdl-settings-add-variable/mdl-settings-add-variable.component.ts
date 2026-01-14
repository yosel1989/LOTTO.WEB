import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'app/shared/services/alert.service';
import { SettingsVariableDto, SettingsVariableRequestDto } from 'app/features/settings/models/settings.model';
import { SettingsVariableService } from 'app/features/settings/services/settings-variable.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-mdl-settings-add-variable',
  imports: [
    FormsModule, 
    InputNumberModule, 
    InputTextModule, 
    TextareaModule, 
    ButtonModule, 
    ReactiveFormsModule, 
    MessageModule, 
    ConfirmDialog, 
    MessageModule,
    SelectModule
  ],
  templateUrl: './mdl-settings-add-variable.component.html',
  styleUrl: './mdl-settings-add-variable.component.scss',
  providers: [ConfirmationService]
})
export class MdlSettingsAddVariableComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() status!: string;
  @Output() OnSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  formGroup: FormGroup = new FormGroup({});

  isSubmitted: boolean = false;
  ldSubmit: boolean = false;
  isMobile = false;

  private subs = new Subscription();

  types: any[] = [
      { name: 'JSON', value: 'json' },
      { name: 'Decimal', value: 'decimal' },
      { name: 'Entero', value: 'int' },
      { name: 'Booleano', value: 'bool' },
      { name: 'Texto', value: 'string' },
  ];
  
  constructor(
    private api: SettingsVariableService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
	) {
    this.formGroup = this.formBuilder.group({
        name: new FormControl(null  , Validators.required),
        type: new FormControl(null  , Validators.required),
        code: new FormControl(null  , Validators.required),
        value: new FormControl(null  , Validators.required),
    });
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;
  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Getters

  get f(): any {
    return this.formGroup.controls;
  }

  get payload(): SettingsVariableRequestDto{
    return {
      name: this.f.name.value,
      type: this.f.type.value,
      code: this.f.code.value,
      value: this.f.value.value,
    }
  }

  // Events
  evtOnSubmit(): void{
    this.isSubmitted = true;
    if(this.formGroup.invalid){
      return;
    }

    this.confirmationService.confirm({
        header: '¿Agregar variable?',
        message: 'Confirmar la operación.',
        accept: () => {

            this.formGroup.disable();
            this.ldSubmit = true;

            const subs = this.api.create(this.payload).subscribe({
              next: (res: SettingsVariableDto) => {
                this.formGroup.enable();
                this.ldSubmit = false;
                this.OnSuccess.emit(true);
              },
              error: (err) => {
                this.alertService.showToast({
                  position: 'top-right',
                  icon: "error",
                  title: err.error.message,
                  showCloseButton: true,
                  timerProgressBar: true,
                  timer: 2000,
                  target: "body"
                });
                this.formGroup.enable();
                this.ldSubmit = false;
              }
            });
            this.subs.add(subs);

        },
        reject: () => {

        },
    });

  }

  evtOnClose(): void{
    this.OnCanceled.emit(true);
  }

}
