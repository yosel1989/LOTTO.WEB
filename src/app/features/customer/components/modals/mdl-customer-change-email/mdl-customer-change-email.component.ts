import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Subscription } from 'rxjs';
import { AlertService } from 'app/shared/services/alert.service';
import { CustomerChangeEmailRequestDto, CustomerCollectionResponseDto } from 'app/features/customer/models/customer.model';
import { CustomerService } from 'app/features/customer/services/customer.service';

@Component({
  selector: 'app-mdl-customer-change-email',
  imports: [FormsModule, InputNumberModule, InputTextModule, TextareaModule, ButtonModule, ReactiveFormsModule, MessageModule, ConfirmDialog, MessageModule],
  templateUrl: './mdl-customer-change-email.component.html',
  styleUrl: './mdl-customer-change-email.component.scss',
  providers: [ConfirmationService]
})
export class MdlCustomerChangeEmailComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data!: CustomerCollectionResponseDto;
  @Output() OnSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  ctrlEmail: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  contrlDescription: FormControl = new FormControl(null, [Validators.required, Validators.maxLength(250)]);

  isSubmitted: boolean = false;
  ldSubmit: boolean = false;

  private subs = new Subscription();
  

  constructor(
    private api: CustomerService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService
	) {

  }

  ngOnInit(): void {
    this.ctrlEmail.setValue(this.data.correo);
  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Getters

  get payload(): CustomerChangeEmailRequestDto {
    return {
      id: this.data.id,
      email: this.ctrlEmail.value,
      description: this.contrlDescription.value
    };
  }

  // Events
  evtOnSubmit(): void{
    this.isSubmitted = true;
    if(this.ctrlEmail.invalid){
      this.alertService.showToast({
        position: 'top-end',
        icon: "warning",
        title: "Debe ingresar el correo electrónico",
        showCloseButton: true,
        timerProgressBar: true,
        timer: 4000,
        target: "body"
      })
      return;
    }

    if(this.contrlDescription.invalid){
      this.alertService.showToast({
        position: 'top-end',
        icon: "warning",
        title: "Debe ingresar una descripción o motivo por el cambio de correo",
        showCloseButton: true,
        timerProgressBar: true,
        timer: 4000,
        target: "body"
      })
      return;
    }

    if(this.ctrlEmail.value === this.data.correo){
      this.alertService.showToast({
        position: 'top-end',
        icon: "warning",
        title: "El correo debe ser diferente al actual",
        showCloseButton: true,
        timerProgressBar: true,
        timer: 4000,
        target: "body"
      })
      return;
    }


    this.confirmationService.confirm({
        header: `¿Modificar el correo ${this.ctrlEmail.value}?`,
        message: 'Confirmar la operación.',
        accept: () => {

            this.ctrlEmail.disable();
            this.contrlDescription.disable();
            this.ldSubmit = true;
            
            const subs = this.api.changeEmail(this.payload).subscribe({
              next: (res: boolean) => {
                this.alertService.showToast({
                  position: 'top-right',
                  icon: "success",
                  title: "Se modifico con exito el correo del cliente.",
                  showCloseButton: true,
                  timerProgressBar: true,
                  timer: 3000,
                  target: "body"
                });
                this.OnSuccess.emit(res);
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
                this.ctrlEmail.enable();
                this.contrlDescription.enable();
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
