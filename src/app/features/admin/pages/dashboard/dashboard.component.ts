import { Component, OnInit } from '@angular/core';
import { DatePickerModule } from 'primeng/datepicker';
import { Select } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';
import { formatDate } from '@angular/common';
import { GridCountsComponent } from 'app/features/dashboard/components/containers/grid-counts/grid-counts.component';
import { ChartTotalSalesMonthComponent } from 'app/features/dashboard/components/charts/chart-total-sales-month/chart-total-sales-month.component';
import { StorageService } from 'app/core/services/storage.service';
import { User } from 'app/features/auth/services/auth.interface';
import { Router } from '@angular/router';
import { ProfileEnum } from 'app/core/enums/profile.enum';
import { ChartTop10TotalSalesComponent } from 'app/features/dashboard/components/charts/chart-top10-total-sales/chart-top10-total-sales.component';
import { ChartTop10TotalTicketsComponent } from 'app/features/dashboard/components/charts/chart-top10-total-tickets/chart-top10-total-tickets.component';
import { ChartTotalSalesByOriginComponent } from 'app/features/dashboard/components/charts/chart-total-sales-by-origin/chart-total-sales-by-origin.component';
import { ChartTotalSalesByPaymentTypeComponent } from 'app/features/dashboard/components/charts/chart-total-sales-by-payment-type/chart-total-sales-by-payment-type.component';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [
    FormsModule, 
    ReactiveFormsModule, 
    DatePickerModule, 
    Select, 
    ButtonModule, 
    InputGroupModule, 
    InputGroupAddonModule, 
    SkeletonModule, 
    CardModule, 
    GridCountsComponent, 
    ChartTotalSalesMonthComponent,
    ChartTop10TotalSalesComponent,
    ChartTop10TotalTicketsComponent,
    ChartTotalSalesByOriginComponent,
    ChartTotalSalesByPaymentTypeComponent
  ],
  providers: []
})
export class DashboardComponent implements OnInit{

  profileEnum = ProfileEnum;

  options: any[] | undefined;
  typeDateSelect: FormControl = new FormControl('today');
  datesFormControl: FormControl = new FormControl([]);
  loading: boolean = false;

  dates: {date_from: string | null, date_to: string | null} = {date_from: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'), date_to: formatDate(new Date(), 'yyyy-MM-dd', 'en-US')};  

  user: User | null = null; 

  currentUser: User | null = null;

  constructor(
    private storageService: StorageService,
    private router: Router
  ) {
    this.typeDateSelect.valueChanges.subscribe(value => {
        const today = new Date();
        switch( value ) {
            case 'today': 
                    this.dates = {date_from: formatDate(new Date(), 'yyyy-MM-dd', 'en-US'), date_to: formatDate(new Date(), 'yyyy-MM-dd', 'en-US')};  
                    break;
            case 'yesterday': 
                    const yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);
                    this.dates = {date_from: formatDate(yesterday, 'yyyy-MM-dd', 'en-US'), date_to: formatDate(yesterday, 'yyyy-MM-dd', 'en-US')};  
                    break;
            case 'week': 
                    const dayOfWeek = today.getDay();
                    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
                    const monday = new Date(today);
                    monday.setDate(today.getDate() + diffToMonday);
                    const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
                    const sunday = new Date(today);
                    sunday.setDate(today.getDate() + diffToSunday);
                    this.dates = {date_from: formatDate(monday, 'yyyy-MM-dd', 'en-US'), date_to: formatDate(sunday, 'yyyy-MM-dd', 'en-US')};
                    break;
            case 'month':
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0); 
                    this.dates = {date_from: formatDate(startOfMonth, 'yyyy-MM-dd', 'en-US'), date_to: formatDate(endOfMonth, 'yyyy-MM-dd', 'en-US')};

                    break;
            case 'range': break;
            default: 
                    break;
        }
    });

    this.user = this.storageService.getUser();
    this.currentUser = this.storageService.getUser();

    if(this.hasProfile(1255) || this.hasProfile(this.profileEnum.SECTORISTA) ) // Charity
    {
      this.router.navigate(['/admin/report/orders']);
    }
  }

  ngOnInit() {
    this.options = [
            {
                name: 'Hoy',
                code: 'today',
            },
            {
                name: 'Ayer',
                code: 'yesterday',
            },
            {
                name: 'Esta semana',
                code: 'week'
            },
            {
                name: 'Este mes',
                code: 'month'
            },
            {
                name: 'Rango fechas',
                code: 'range'
            }
        ];
  }

  // Events
  
  evtOnDatePickerSelect($event: any): void{
    if(this.datesFormControl.value[0] && this.datesFormControl.value[1]){
        const date_from = formatDate(this.datesFormControl.value[0], 'yyyy-MM-dd', 'en-US');
        const date_to = formatDate(this.datesFormControl.value[1], 'yyyy-MM-dd', 'en-US');
        this.dates.date_from = date_from;
        this.dates.date_to = date_to;
    }
  }


  // Data

  hasProfile(profile: number): boolean{
    const profileIds = this.user?.profiles.map((x: any) => x.id);
    return profileIds?.includes(profile) ?? false;
  }

}
