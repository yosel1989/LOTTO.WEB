import { CurrencyPipe, formatDate, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, effect, inject, Input, OnChanges, OnInit, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { DashboardDateRangeRequestDto, DashboardTop10SalesResponseDto } from 'app/features/dashboard/models/dashboard.model';
import { DashboardService } from 'app/features/dashboard/services/dashboard.service';

import { ChartModule } from 'primeng/chart';

import { Chart } from 'chart.js';
import { ButtonModule } from 'primeng/button';
import { LoaderComponent } from 'app/shared/components/loader/loder.component';

@Component({
  selector: 'app-chart-top10-total-sales',
  imports: [
    ChartModule, 
    ButtonModule, 
    LoaderComponent
],
  templateUrl: './chart-top10-total-sales.component.html',
  styleUrl: './chart-top10-total-sales.component.scss',
  providers: [CurrencyPipe]
})
export class ChartTop10TotalSalesComponent implements OnInit, AfterViewInit, OnChanges {
    @Input() start_date: string | null = null;
    @Input() end_date: string | null = null;
    @Input() styleClass: string = 'h-[30rem] w-full';

    data: any;

    options: any;

    platformId = inject(PLATFORM_ID);

    year: number = new Date().getFullYear();

    mode: 'month' | 'day' = 'month';
    month: number | null = null;
    monthNames: string[] = [];

    loading = false;

    constructor(
        private cd: ChangeDetectorRef,
        private api: DashboardService
    ) {}

    themeEffect = effect(() => {
        this.initChart();
    });

    ngOnInit() {
        //console.log('Chart.js version:', Chart.version);
    }

    ngAfterViewInit(): void {
        console.log('Chart.js version:', Chart.version);
        this.initChart();
        this.getChartData();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['start_date'] || changes['end_date']) {
            this.getChartData();
        }
    }

    // Getters

    get request(): DashboardDateRangeRequestDto{
        return {
            date_start: this.start_date ?? formatDate(new Date(), 'yyyy-MM-dd', 'es_EU'),
            date_end: this.end_date ?? formatDate(new Date(), 'yyyy-MM-dd', 'es_EU')
        };
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
                        borderRadius: 7,
                    }
                ]
            };

            this.options = {
                indexAxis: 'y',
                maintainAspectRatio: false,
                aspectRatio: 0.6,
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
        this.api.getTop10Sales(this.request).subscribe((response: DashboardTop10SalesResponseDto[]) => {
            this.data.labels = response.map(item => item.local_name);
            this.options.plugins.title.text = `Total monto vendido por Local - Top 10`;
            this.options.plugins.subtitle.text = `${this.start_date} al ${this.end_date}`;
            this.data.datasets[0].data = response.map(item => item.total_sales);
            this.data = {...this.data};
            this.options = {...this.options};
            this.cd.detectChanges();
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
