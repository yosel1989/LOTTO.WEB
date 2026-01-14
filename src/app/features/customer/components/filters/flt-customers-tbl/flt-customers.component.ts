import { AfterViewInit, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { UbigeoService } from 'app/shared/services/ubigeo.service';
import { rxResource, toObservable } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { OverlayOptions } from 'primeng/api';
import { GenderService } from 'app/shared/services/gender.service';
import { CustomerFilterPayload } from 'app/features/customer/models/customer.model';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-flt-customers',
  imports: [PanelModule, AvatarModule, ButtonModule, MenuModule, CardModule, InputTextModule, DatePickerModule, SelectModule, ReactiveFormsModule, FormsModule, IconFieldModule, InputIconModule],
  templateUrl: './flt-customers.component.html',
  styleUrl: './flt-customers.component.scss',
  providers: []
})
export class FltCustomersComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() OnValueChanges: EventEmitter<CustomerFilterPayload | null> = new EventEmitter<CustomerFilterPayload | null>();

  frmFilterCustomer: FormGroup = new FormGroup({});
  codeDepartment$ = new BehaviorSubject<string | null>(null);
  codeProvince$ = new BehaviorSubject<string | null>(null);

  items: { label?: string; icon?: string; separator?: boolean }[] = [];

  isMobile = false;

  genders = rxResource({
    stream: () => this.genderService.getAll()
  });
  
  departments = rxResource({
    stream: () => this.ubigeoService.getDepartamentsAll()
  });

  provinces = rxResource({
    stream: () =>
        this.codeDepartment$.pipe(
        switchMap(code =>
            code
            ? this.ubigeoService.getAllProvinceByDepartment(code)
            : of([])
        )
        )
    });

  districts = rxResource({
    stream: () =>
        this.codeProvince$.pipe(
        switchMap(code =>
            code
            ? this.ubigeoService.getAllDistrictsByProvince(code)
            : of([])
        )
        )
    });

  constructor(
    private ubigeoService: UbigeoService,
    private genderService: GenderService,
    private fb: FormBuilder
  ) {
    this.frmFilterCustomer = this.fb.group({
        createdAt: new FormControl(null),
        userName: new FormControl(null),
        idCustomer: new FormControl(null),
        idDepartment: new FormControl(null),
        idProvince: new FormControl(null),
        idDistrict: new FormControl(null),
        lastLoginDate: new FormControl(null),
        verifiedAt: new FormControl(null),
        firstName: new FormControl(null),
        lastName: new FormControl(null),
        idGender: new FormControl(null),
        email: new FormControl(null),
        birthDate: new FormControl(null)
    });

    this.frmFilterCustomer.get('idDepartment')?.valueChanges.subscribe(val => {
        this.codeDepartment$.next(val);
        this.f.idProvince.setValue(null);
        this.f.idDistrict.setValue(null);
    });

    this.frmFilterCustomer.get('idProvince')?.valueChanges.subscribe(val => {
        this.codeProvince$.next(val);
        this.f.idDistrict.setValue(null);
    });

    this.frmFilterCustomer.valueChanges.subscribe(formValue => {
      this.OnValueChanges.emit(this.payload);
    });
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= 768;

		this.items = [
            {
                label: 'Refresh',
                icon: 'pi pi-refresh'
            },
            {
                label: 'Search',
                icon: 'pi pi-search'
            },
            {
                separator: true
            },
            {
                label: 'Delete',
                icon: 'pi pi-times'
            }
        ];
  }

  ngAfterViewInit(): void {
	
  }

  ngOnDestroy(): void {
	
  }

  // Getters

  get f(): any{
    return this.frmFilterCustomer.controls;
  }

  get getOverlayOptions(): OverlayOptions {
    return this.isMobile
      ? {
          mode: 'modal',
          styleClass: 'text-xs!',
          contentStyleClass: 'text-xs!'
        }
      : {
          styleClass: 'text-xs!',
          contentStyleClass: 'text-xs!'
        };
  }

  get payload(): CustomerFilterPayload{
    return{
      created_at: this.f.createdAt.value ? formatDate(this.f.createdAt.value, 'yyyy-MM-dd', 'en-US') : null,
      user_name: this.f.userName.value,
      id_customer: this.f.idCustomer.value ? parseInt(this.f.idCustomer.value, 10) : null,
      id_department: this.f.idDepartment.value,
      id_province: this.f.idProvince.value,
      id_district: this.f.idDistrict.value,
      last_login_date: this.f.lastLoginDate.value ? formatDate(this.f.lastLoginDate.value, 'yyyy-MM-dd', 'en-US') : null,
      verified_at: this.f.verifiedAt.value ? formatDate(this.f.verifiedAt.value, 'yyyy-MM-dd', 'en-US') : null,
      first_name: this.f.firstName.value,
      last_name: this.f.lastName.value,
      id_gender: this.f.idGender.value ? parseInt(this.f.idGender.value) : null,
      email: this.f.email.value,
      birth_date: this.f.birthDate.value ? formatDate(this.f.birthDate.value, 'yyyy-MM-dd', 'en-US') : null
    }
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }
  

}
