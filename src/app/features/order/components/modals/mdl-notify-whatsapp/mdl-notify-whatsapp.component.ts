import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { ConfirmationService } from 'primeng/api';

import { OrderCollectionResponseDto, OrderNotifyRequestDto } from 'app/features/order/models/order.model';
import { InputGroupModule } from 'primeng/inputgroup';
import { PopoverModule } from 'primeng/popover';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OrderService } from 'app/features/order/services/order.service';
import { AlertService } from 'app/shared/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mdl-notify-whatsapp',
  imports: [
    FormsModule, 
    InputGroupModule,
    InputNumberModule, 
    InputTextModule, 
    ConfirmDialogModule,
    TextareaModule, 
    ButtonModule, 
    ReactiveFormsModule, 
    MessageModule, 
    MessageModule,
    PopoverModule,
    ScrollPanelModule
  ],
  templateUrl: './mdl-notify-whatsapp.component.html',
  styleUrl: './mdl-notify-whatsapp.component.scss',
  providers: [ConfirmationService]
})
export class MdlNotifyWhatsappComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data!: OrderCollectionResponseDto;
  @Output() OnSended: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  ldSubmit: boolean = false;

  countries = [
    { name: 'Afganistán', code: 'AF', dialCode: '+93' },
    { name: 'Albania', code: 'AL', dialCode: '+355' },
    { name: 'Alemania', code: 'DE', dialCode: '+49' },
    { name: 'Andorra', code: 'AD', dialCode: '+376' },
    { name: 'Angola', code: 'AO', dialCode: '+244' },
    { name: 'Anguila', code: 'AI', dialCode: '+1' },
    { name: 'Antártida', code: 'AQ', dialCode: '+672' },
    { name: 'Antigua y Barbuda', code: 'AG', dialCode: '+1' },
    { name: 'Arabia Saudita', code: 'SA', dialCode: '+966' },
    { name: 'Argelia', code: 'DZ', dialCode: '+213' },
    { name: 'Argentina', code: 'AR', dialCode: '+54' },
    { name: 'Armenia', code: 'AM', dialCode: '+374' },
    { name: 'Australia', code: 'AU', dialCode: '+61' },
    { name: 'Austria', code: 'AT', dialCode: '+43' },
    { name: 'Bangladés', code: 'BD', dialCode: '+880' },
    { name: 'Bélgica', code: 'BE', dialCode: '+32' },
    { name: 'Bolivia', code: 'BO', dialCode: '+591' },
    { name: 'Brasil', code: 'BR', dialCode: '+55' },
    { name: 'Canadá', code: 'CA', dialCode: '+1' },
    { name: 'Chile', code: 'CL', dialCode: '+56' },
    { name: 'China', code: 'CN', dialCode: '+86' },
    { name: 'Colombia', code: 'CO', dialCode: '+57' },
    { name: 'Corea del Sur', code: 'KR', dialCode: '+82' },
    { name: 'Costa Rica', code: 'CR', dialCode: '+506' },
    { name: 'Cuba', code: 'CU', dialCode: '+53' },
    { name: 'Dinamarca', code: 'DK', dialCode: '+45' },
    { name: 'Ecuador', code: 'EC', dialCode: '+593' },
    { name: 'Egipto', code: 'EG', dialCode: '+20' },
    { name: 'El Salvador', code: 'SV', dialCode: '+503' },
    { name: 'España', code: 'ES', dialCode: '+34' },
    { name: 'Estados Unidos', code: 'US', dialCode: '+1' },
    { name: 'Francia', code: 'FR', dialCode: '+33' },
    { name: 'Grecia', code: 'GR', dialCode: '+30' },
    { name: 'Guatemala', code: 'GT', dialCode: '+502' },
    { name: 'Honduras', code: 'HN', dialCode: '+504' },
    { name: 'India', code: 'IN', dialCode: '+91' },
    { name: 'Italia', code: 'IT', dialCode: '+39' },
    { name: 'Japón', code: 'JP', dialCode: '+81' },
    { name: 'México', code: 'MX', dialCode: '+52' },
    { name: 'Panamá', code: 'PA', dialCode: '+507' },
    { name: 'Paraguay', code: 'PY', dialCode: '+595' },
    { name: 'Perú', code: 'PE', dialCode: '+51' },
    { name: 'Portugal', code: 'PT', dialCode: '+351' },
    { name: 'Reino Unido', code: 'GB', dialCode: '+44' },
    { name: 'República Dominicana', code: 'DO', dialCode: '+1' },
    { name: 'Uruguay', code: 'UY', dialCode: '+598' },
    { name: 'Venezuela', code: 'VE', dialCode: '+58' },
  ];

  selectedCountry = this.countries[0];
  ctrlPhonePrefix = new FormControl('', Validators.required);
  ctrlPhoneNumber = new FormControl('', [Validators.required, Validators.maxLength(15)]);
  contrlDescription: FormControl = new FormControl(null, [Validators.required, Validators.maxLength(250)]);
  countryFilter = '';
  filteredList = [...this.countries];

  isSubmitted: boolean = false;
  private subs = new Subscription();

  constructor(
      private api: OrderService,
      private confirmationService: ConfirmationService,
      private alertService: AlertService
	) {

  }

  ngOnInit(): void {
    this.ctrlPhonePrefix.setValue(this.data.phone_prefix);
    this.ctrlPhoneNumber.setValue(this.data.phone_number);
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
      email: null,
      channel: "whatsapp",
      description: this.contrlDescription.value,
      phone_prefix: this.ctrlPhonePrefix.value,
      phone_number: this.ctrlPhoneNumber.value
    };
  }


  // Events

  evtOnSubmit(): void{
    this.isSubmitted = true;
    if(this.ctrlPhonePrefix.invalid){
      this.alertService.showToast({
        position: 'top-end',
        icon: "warning",
        title: "Debe ingresar el prefijo telefónico del cliente.",
        showCloseButton: true,
        timerProgressBar: true,
        timer: 4000,
        target: "body"
      })
      return;
    }

    if(this.ctrlPhoneNumber.invalid){
      this.alertService.showToast({
        position: 'top-end',
        icon: "warning",
        title: "Debe ingresar el número telefónico del cliente.",
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

    console.log(this.payload);

    this.confirmationService.confirm({
        header: `¿Notificar la compra al n° de whatsapp ${this.ctrlPhonePrefix.value}${this.ctrlPhoneNumber.value}?`,
        message: 'Confirmar la operación.',
        accept: () => {

            this.ctrlPhonePrefix.disable();
            this.ctrlPhoneNumber.disable();
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
                  timer: 4000,
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
                  timer: 4000,
                  target: "body"
                });
                this.ctrlPhonePrefix.enable();
                this.ctrlPhoneNumber.enable();
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

  evtOnFilterChange(value: string) {
    const filter = value.toLowerCase();
    this.filteredList = this.countries.filter(
      c =>
        c.name.toLowerCase().includes(filter) ||
        c.dialCode.includes(filter) ||
        c.code.toLowerCase().includes(filter)
    );
  }


  // Functions

  selectCountry(country: any) {
    this.selectedCountry = country;
    this.ctrlPhonePrefix.setValue(country.dialCode);
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }

}
