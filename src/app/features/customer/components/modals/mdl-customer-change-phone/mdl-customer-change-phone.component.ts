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
import { CustomerChangeEmailRequestDto, CustomerChangePhoneRequestDto, CustomerCollectionResponseDto } from 'app/features/customer/models/customer.model';
import { CustomerService } from 'app/features/customer/services/customer.service';
import { InputGroupModule } from 'primeng/inputgroup';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-mdl-customer-change-phone',
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
    InputGroupModule,
    SelectModule
  ],
  templateUrl: './mdl-customer-change-phone.component.html',
  styleUrl: './mdl-customer-change-phone.component.scss',
  providers: [ConfirmationService]
})
export class MdlCustomerChangePhoneComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data!: CustomerCollectionResponseDto;
  @Output() OnSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  ctlPhonePrefix: FormControl = new FormControl('+51', [Validators.required]);
  ctlPhoneNumber: FormControl = new FormControl(null, [Validators.required, Validators.min(1), Validators.maxLength(15)]);
  contrlDescription: FormControl = new FormControl(null, [Validators.required, Validators.maxLength(250)]);

  isSubmitted: boolean = false;
  ldSubmit: boolean = false;

  private subs = new Subscription();
  
  countries: any[] | undefined;
  selectedCountry: any | undefined;

  constructor(
    private api: CustomerService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService
	) {

  }

  ngOnInit(): void {
    this.ctlPhonePrefix.setValue(this.data.pref_telefono);
    this.ctlPhoneNumber.setValue(this.data.telefono);

    this.countries = [
      { name: 'Afghanistan', code: 'AF', prefix: '+93' },
      { name: 'Albania', code: 'AL', prefix: '+355' },
      { name: 'Algeria', code: 'DZ', prefix: '+213' },
      { name: 'Andorra', code: 'AD', prefix: '+376' },
      { name: 'Angola', code: 'AO', prefix: '+244' },
      { name: 'Argentina', code: 'AR', prefix: '+54' },
      { name: 'Armenia', code: 'AM', prefix: '+374' },
      { name: 'Australia', code: 'AU', prefix: '+61' },
      { name: 'Austria', code: 'AT', prefix: '+43' },
      { name: 'Bahamas', code: 'BS', prefix: '+1-242' },
      { name: 'Bahrain', code: 'BH', prefix: '+973' },
      { name: 'Bangladesh', code: 'BD', prefix: '+880' },
      { name: 'Belgium', code: 'BE', prefix: '+32' },
      { name: 'Bolivia', code: 'BO', prefix: '+591' },
      { name: 'Brazil', code: 'BR', prefix: '+55' },
      { name: 'Canada', code: 'CA', prefix: '+1' },
      { name: 'Chile', code: 'CL', prefix: '+56' },
      { name: 'China', code: 'CN', prefix: '+86' },
      { name: 'Colombia', code: 'CO', prefix: '+57' },
      { name: 'Costa Rica', code: 'CR', prefix: '+506' },
      { name: 'Croatia', code: 'HR', prefix: '+385' },
      { name: 'Cuba', code: 'CU', prefix: '+53' },
      { name: 'Czech Republic', code: 'CZ', prefix: '+420' },
      { name: 'Denmark', code: 'DK', prefix: '+45' },
      { name: 'Dominican Republic', code: 'DO', prefix: '+1-809' },
      { name: 'Ecuador', code: 'EC', prefix: '+593' },
      { name: 'Egypt', code: 'EG', prefix: '+20' },
      { name: 'El Salvador', code: 'SV', prefix: '+503' },
      { name: 'Estonia', code: 'EE', prefix: '+372' },
      { name: 'Finland', code: 'FI', prefix: '+358' },
      { name: 'France', code: 'FR', prefix: '+33' },
      { name: 'Germany', code: 'DE', prefix: '+49' },
      { name: 'Greece', code: 'GR', prefix: '+30' },
      { name: 'Guatemala', code: 'GT', prefix: '+502' },
      { name: 'Honduras', code: 'HN', prefix: '+504' },
      { name: 'Hungary', code: 'HU', prefix: '+36' },
      { name: 'Iceland', code: 'IS', prefix: '+354' },
      { name: 'India', code: 'IN', prefix: '+91' },
      { name: 'Indonesia', code: 'ID', prefix: '+62' },
      { name: 'Ireland', code: 'IE', prefix: '+353' },
      { name: 'Israel', code: 'IL', prefix: '+972' },
      { name: 'Italy', code: 'IT', prefix: '+39' },
      { name: 'Japan', code: 'JP', prefix: '+81' },
      { name: 'Kenya', code: 'KE', prefix: '+254' },
      { name: 'Luxembourg', code: 'LU', prefix: '+352' },
      { name: 'Mexico', code: 'MX', prefix: '+52' },
      { name: 'Netherlands', code: 'NL', prefix: '+31' },
      { name: 'New Zealand', code: 'NZ', prefix: '+64' },
      { name: 'Nicaragua', code: 'NI', prefix: '+505' },
      { name: 'Norway', code: 'NO', prefix: '+47' },
      { name: 'Panama', code: 'PA', prefix: '+507' },
      { name: 'Paraguay', code: 'PY', prefix: '+595' },
      { name: 'Peru', code: 'PE', prefix: '+51' },
      { name: 'Philippines', code: 'PH', prefix: '+63' },
      { name: 'Poland', code: 'PL', prefix: '+48' },
      { name: 'Portugal', code: 'PT', prefix: '+351' },
      { name: 'Puerto Rico', code: 'PR', prefix: '+1-787' },
      { name: 'Romania', code: 'RO', prefix: '+40' },
      { name: 'Russia', code: 'RU', prefix: '+7' },
      { name: 'Saudi Arabia', code: 'SA', prefix: '+966' },
      { name: 'Singapore', code: 'SG', prefix: '+65' },
      { name: 'South Africa', code: 'ZA', prefix: '+27' },
      { name: 'South Korea', code: 'KR', prefix: '+82' },
      { name: 'Spain', code: 'ES', prefix: '+34' },
      { name: 'Sweden', code: 'SE', prefix: '+46' },
      { name: 'Switzerland', code: 'CH', prefix: '+41' },
      { name: 'Thailand', code: 'TH', prefix: '+66' },
      { name: 'Turkey', code: 'TR', prefix: '+90' },
      { name: 'Ukraine', code: 'UA', prefix: '+380' },
      { name: 'United Arab Emirates', code: 'AE', prefix: '+971' },
      { name: 'United Kingdom', code: 'GB', prefix: '+44' },
      { name: 'United States', code: 'US', prefix: '+1' },
      { name: 'Uruguay', code: 'UY', prefix: '+598' },
      { name: 'Venezuela', code: 'VE', prefix: '+58' },
      { name: 'Vietnam', code: 'VN', prefix: '+84' }
    ];
  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Getters

  get payload(): CustomerChangePhoneRequestDto {
    return {
      id: this.data.id,
      phone_prefix: this.ctlPhonePrefix.value,
      phone_number: this.ctlPhoneNumber.value.toString(),
      description: this.contrlDescription.value
    };
  }

  // Events
  evtOnSubmit(): void{
    this.isSubmitted = true;
    if(this.ctlPhonePrefix.invalid){
      this.alertService.showToast({
        position: 'top-end',
        icon: "warning",
        title: "Debe seleccionar el prefijo de su número telefónico",
        showCloseButton: true,
        timerProgressBar: true,
        timer: 4000,
        target: "body"
      })
      return;
    }

    if(this.ctlPhoneNumber.invalid){
      this.alertService.showToast({
        position: 'top-end',
        icon: "warning",
        title: "Debe ingresar su número telefónico",
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

    if((this.ctlPhonePrefix.value + this.ctlPhoneNumber.value) === (this.data.pref_telefono+this.data.telefono)){
      this.alertService.showToast({
        position: 'top-end',
        icon: "warning",
        title: "El número telefónico debe ser diferente al actual",
        showCloseButton: true,
        timerProgressBar: true,
        timer: 4000,
        target: "body"
      })
      return;
    }


    this.confirmationService.confirm({
        header: `¿Modificar al número telefónico ${this.ctlPhonePrefix.value}${this.ctlPhoneNumber.value}?`,
        message: 'Confirmar la operación.',
        accept: () => {

            this.ctlPhoneNumber.disable();
            this.ctlPhonePrefix.disable();
            this.contrlDescription.disable();
            this.ldSubmit = true;
            
            const subs = this.api.changePhone(this.payload).subscribe({
              next: (res: boolean) => {
                this.alertService.showToast({
                  position: 'top-right',
                  icon: "success",
                  title: "Se modifico con exito el número telefónico del cliente.",
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
                this.ctlPhoneNumber.enable();
                this.ctlPhonePrefix.enable();
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
