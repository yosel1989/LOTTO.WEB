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
import { OrderChangeStatusRequestDto, OrderCollectionResponseDto } from 'app/features/order/models/order.model';

@Component({
  selector: 'app-mdl-order-change-status',
  imports: [FormsModule, InputNumberModule, InputTextModule, TextareaModule, ButtonModule, ReactiveFormsModule, MessageModule, ConfirmDialog, MessageModule],
  templateUrl: './mdl-order-change-status.component.html',
  styleUrl: './mdl-order-change-status.component.scss',
  providers: [ConfirmationService]
})
export class MdlOrderChangeStatusComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data!: OrderCollectionResponseDto;
  @Input() status!: string;
  @Output() OnChanged: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

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

  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Getters

  get payload(): OrderChangeStatusRequestDto {
    return {
      uuid: this.data.uuid,
      status: this.status,
      description: this.contrlDescription.value
    };
  }

  // Events
  evtOnSubmit(): void{
    this.isSubmitted = true;
    if(this.contrlDescription.invalid){
      this.alertService.showToast({
        position: 'bottom-end',
        icon: "warning",
        title: "Debe ingresar una descripción o motivo para el cambio de estado.",
        showCloseButton: true,
        timerProgressBar: true,
        timer: 2000,
        target: "body"
      })
      return;
    }


    this.confirmationService.confirm({
        header: '¿Cambiar estado?',
        message: 'Confirmar la operación.',
        accept: () => {

            this.contrlDescription.disable()
            this.ldSubmit = true;
            
            const subs = this.api.changeStatus(this.payload).subscribe({
              next: (res: boolean) => {
                this.contrlDescription.enable();
                this.ldSubmit = false;
                this.OnChanged.emit(res);
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
