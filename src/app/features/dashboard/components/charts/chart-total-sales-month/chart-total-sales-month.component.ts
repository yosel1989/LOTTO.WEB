import { CurrencyPipe, formatDate, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, effect, ElementRef, inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { tablerBorderRadius, tablerClick } from '@ng-icons/tabler-icons';
import { DashboardDateRangeRequestDto, DashboardTotalSalesMonthResponseDto } from 'app/features/dashboard/models/dashboard.model';
import { DashboardService } from 'app/features/dashboard/services/dashboard.service';

import { ChartModule } from 'primeng/chart';

import { Chart } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { LoaderComponent } from 'app/shared/components/loader/loder.component';
import { SelectModule } from 'primeng/select';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chart-total-sales-month',
  imports: [
    ChartModule, 
    ButtonModule, 
    LoaderComponent,
    SelectModule,
    ReactiveFormsModule
],
  templateUrl: './chart-total-sales-month.component.html',
  styleUrl: './chart-total-sales-month.component.scss',
  providers: [CurrencyPipe]
})
export class ChartTotalSalesMonthComponent implements OnInit, AfterViewInit {

    @ViewChild('myChart') myChartRef!: ElementRef<HTMLCanvasElement>;
    chart!: Chart
    @Input() styleClass: string = 'h-[30rem] w-full';

    data: any;

    options: any;

    platformId = inject(PLATFORM_ID);

    year: number = new Date().getFullYear();

    mode: 'month' | 'day' = 'month';
    month: number | null = null;
    monthNames: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    months: any[] = [
        {id: 1, name: 'Enero'},
        {id: 2, name: 'Febrero'},
        {id: 3, name: 'Marzo'},
        {id: 4, name: 'Abril'},
        {id: 5, name: 'Mayo'},
        {id: 6, name: 'Junio'},
        {id: 7, name: 'Julio'},
        {id: 8, name: 'Agosto'},
        {id: 9, name: 'Setiembre'},
        {id: 10, name: 'Octubre'},
        {id: 11, name: 'Noviembre'},
        {id: 12, name: 'Diciembre'}
    ];

    loading = false;

    constructor(
        private cd: ChangeDetectorRef,
        private api: DashboardService
    ) {}

    themeEffect = effect(() => {
        this.initChart();
    });

    ctrlMonth = new FormControl(null);

    ngOnInit() {
        this.ctrlMonth.valueChanges.subscribe((res) => {
            this.mode = res ? "day" : "month";

            if(!res){
                this.getChartData();
            }else{
                this.month = parseInt(res, 10);
                this.options.plugins!.title.text = `Ventas diarias de ${this.monthNames[this.month-1]}`;
                this.getChartDataByDay(this.year, this.month!);
            }
        });
    }

    ngAfterViewInit(): void {
        console.log('Chart.js version:', Chart.version);
        this.initChart();
        this.getChartData();
    }

    initChart() {
        if (isPlatformBrowser(this.platformId)) {

            const documentStyle = getComputedStyle(document.documentElement);
            const textColor = documentStyle.getPropertyValue('--p-text-color');
            const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
            const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');


            const borderHex = documentStyle.getPropertyValue('--p-primary-500').trim();
            const borderGreen300Hex = documentStyle.getPropertyValue('--p-green-500').trim();
            const borderColorWithOpacity = this.hexToRgba(borderHex, 0.5); // 50% opacidad

            this.data = {
                labels: this.monthNames,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Total Venta',
                        backgroundColor: borderColorWithOpacity,
                        data: [],
                        borderColor: documentStyle.getPropertyValue('--p-primary-300'),
                        borderWidth: 2,
                        borderRadius: 15,
                        tablerClick: () => { console.log('click') },
                    },
                    {
                        type: 'bar',
                        label: 'Total Tickes',
                        backgroundColor: this.hexToRgba(borderGreen300Hex, 0.5),
                        data: [],
                        borderColor: documentStyle.getPropertyValue('--p-green-300'),
                        borderWidth: 2,
                        borderRadius: 15
                    }
                ]
            };


            this.options = {
                maintainAspectRatio: false,
                aspectRatio: 0.6,
                /*onClick: (event: any, elements: any, chart: any) => {

                    
                    if (elements.length > 0 && this.mode === 'month') {
                        const element = elements[0];
                        const datasetIndex = element.datasetIndex;
                        const index = element.index;

                        const label = chart.data.labels[index];
                        const value = chart.data.datasets[datasetIndex].data[index];

                        this.month = index + 1;
                        this.options.plugins!.title.text = `Ventas diarias de ${this.monthNames[index]}`;

                        // Aquí puedes llamar a tu API o actualizar el gráfico
                        this.getChartDataByDay(this.year, this.month!);
                    }
                },*/
                plugins: {
                    title: {
                        display: true,
                        text: `Ventas por Mes`
                    },
                    subtitle: {
                        display: true,
                        text: this.year.toString()
                    },
                    legend: {
                        labels: {
                            color: textColor
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context: any) {
                            const label = context.dataset.label;
                            const value = context.raw;

                            // Solo aplica prefijo si es "Total Venta"
                            if (label === 'Total Venta') {
                                return ` Soles: S/ ${value}`;
                            } else {
                                return ` Tickets: ${value}`;
                            }
                            }
                        }
                    },

                    customButton: {
                        // plugin inline
                        afterDraw: (chart: any) => {
                            const { ctx } = chart;
                            ctx.save();
                            ctx.fillStyle = '#1976d2';
                            ctx.fillRect(chart.width - 100, chart.height - 40, 80, 30); // botón
                            ctx.fillStyle = '#fff';
                            ctx.font = '14px Arial';
                            ctx.fillText('Regresar', chart.width - 90, chart.height - 20);
                            ctx.restore();
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    },
                    y: {
                        ticks: {
                            color: textColorSecondary
                        },
                        grid: {
                            color: surfaceBorder
                        }
                    }
                },
                onHover: (event: any, chartElement: any) => {
                    const canvas = event.native ? event.native.target : event.target;
                    canvas.style.cursor = chartElement.length ? 'pointer' : 'default';
                }
            };
            this.cd.markForCheck();

        }
    }

    // Data

    getChartData() {
        this.loading = true;
        this.api.getTotalSalesMonth().subscribe((response: DashboardTotalSalesMonthResponseDto[]) => {

            this.data.labels = this.monthNames;
            this.options.plugins.title.text = `Ventas por mes`;
            this.data.datasets[0].data = response.map(item => item.total_sales);
            this.data.datasets[1].data = response.map(item => item.total_tickets);
            this.data = {...this.data};
            this.options = {...this.options};
            this.cd.detectChanges();
            this.mode = 'month';
            this.loading = false;

        }, error => {
            this.loading = false;
        });
    }

    getChartDataByDay(year: number, month: number): void {
        console.log('Cargando datos por día para', year, month);
        this.loading = true;
        this.api.getTotalSalesDayByMonth(year, month).subscribe((response: any[]) => {
            this.data.labels = response.map(item => item.day);
            this.options.plugins.title.text = `Ventas diarias de ${this.monthNames[month - 1]}`;
            this.data.datasets[0].data = response.map(item => item.total_sales);
            this.data.datasets[1].data = response.map(item => item.total_tickets);
            this.data = {...this.data};
            this.options = {...this.options};
            this.cd.detectChanges();
            this.mode = 'day';
            this.loading = false;
        }, error => {
            this.loading = false;
        });
    }


    hexToRgba(hex: string, alpha: number): string {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }



    // Events

    evtReturn(): void{
        this.getChartData();
    } 

}
