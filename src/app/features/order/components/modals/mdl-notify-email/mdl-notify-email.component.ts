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
import { OrderService } from 'app/features/order/services/order.service';
import { OrderCollectionResponseDto, OrderNotifyRequestDto } from 'app/features/order/models/order.model';

@Component({
  selector: 'app-mdl-notify-email',
  imports: [FormsModule, InputNumberModule, InputTextModule, TextareaModule, ButtonModule, ReactiveFormsModule, MessageModule, ConfirmDialog, MessageModule],
  templateUrl: './mdl-notify-email.component.html',
  styleUrl: './mdl-notify-email.component.scss',
  providers: [ConfirmationService]
})
export class MdlNotifyEmailComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data!: OrderCollectionResponseDto;
  @Output() OnSended: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  ctrlEmail: FormControl = new FormControl(null, [Validators.required, Validators.email]);
  contrlDescription: FormControl = new FormControl(null, [Validators.required, Validators.maxLength(250)]);

  isSubmitted: boolean = false;
  ldSubmit: boolean = false;

  private subs = new Subscription();
  

  constructor(
    private api: OrderService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService
	) {

  }

  ngOnInit(): void {
    this.ctrlEmail.setValue(this.data.email);
  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Getters

  get payload(): OrderNotifyRequestDto {
    return {
      id: this.data.id,
      email: this.ctrlEmail.value,
      channel: "email",
      description: this.contrlDescription.value,
      phone_prefix: null,
      phone_number: null
    };
  }

  // Events
  evtOnSubmit(): void{
    this.isSubmitted = true;
    if(this.ctrlEmail.invalid){
      this.alertService.showToast({
        position: 'top-end',
        icon: "warning",
        title: "Debe ingresar el correo electrónico del cliente.",
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
        title: "Debe ingresar una descripción o motivo por el envió manual de la notificación",
        showCloseButton: true,
        timerProgressBar: true,
        timer: 4000,
        target: "body"
      })
      return;
    }


    this.confirmationService.confirm({
        header: `¿Notificar la compra al correo ${this.ctrlEmail.value}?`,
        message: 'Confirmar la operación.',
        accept: () => {

            this.ctrlEmail.disable();
            this.contrlDescription.disable();
            this.ldSubmit = true;
            
            const subs = this.api.notify(this.payload).subscribe({
              next: (res: boolean) => {
                this.alertService.showToast({
                  position: 'top-right',
                  icon: "success",
                  title: "Se envio con exito la notificación al cliente.",
                  showCloseButton: true,
                  timerProgressBar: true,
                  timer: 3000,
                  target: "body"
                });
                this.OnSended.emit(res);
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
