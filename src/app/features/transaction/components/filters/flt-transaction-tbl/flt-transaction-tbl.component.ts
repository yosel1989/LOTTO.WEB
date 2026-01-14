import { AfterViewInit, Component, EventEmitter, HostListener, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { UbigeoService } from 'app/shared/services/ubigeo.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { SelectModule } from 'primeng/select';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { OverlayOptions } from 'primeng/api';
import { GenderService } from 'app/shared/services/gender.service';
import { formatDate } from '@angular/common';
import { TransactionFilterPayload } from 'app/features/transaction/models/transaction.model';

@Component({
  selector: 'app-flt-transaction-tbl',
  imports: [PanelModule, AvatarModule, ButtonModule, MenuModule, CardModule, InputTextModule, DatePickerModule, SelectModule, ReactiveFormsModule, FormsModule, IconFieldModule, InputIconModule],
  templateUrl: './flt-transaction-tbl.component.html',
  styleUrl: './flt-transaction-tbl.component.scss',
  providers: []
})
export class FltTransactionTblComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() OnValueChanges: EventEmitter<TransactionFilterPayload | null> = new EventEmitter<TransactionFilterPayload | null>();

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
        playId: new FormControl(null),
        customerId: new FormControl(null),
        type: new FormControl(null),
        firstName: new FormControl(null),
        lastName: new FormControl(null),
        email: new FormControl(null),
        userName: new FormControl(null),
        origin: new FormControl(null)
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

  get payload(): TransactionFilterPayload{
    return{
      play_id: this.f.idCustomer.value ? parseInt(this.f.idCustomer.value, 10) : null,
      customer_id: this.f.idCustomer.value ? parseInt(this.f.idCustomer.value, 10) : null,
      type: this.f.type.value,
      first_name_customer: this.f.firstName.value,
      last_name_customer: this.f.lastName.value,
      email: this.f.email.value,
      user_name: this.f.userName.value,
      created_at: this.f.createdAt.value ? formatDate(this.f.createdAt.value, 'yyyy-MM-dd', 'en-US') : null,
      origin: this.f.origin.value
    }
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth <= 768;
  }
  

}
