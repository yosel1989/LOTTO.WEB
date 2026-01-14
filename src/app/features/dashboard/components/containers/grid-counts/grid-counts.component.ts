import { CommonModule, CurrencyPipe, formatDate } from '@angular/common';
import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, signal, SimpleChanges } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { DashboardCountsRequestDto } from 'app/features/dashboard/models/dashboard.model';
import { DashboardService } from 'app/features/dashboard/services/dashboard.service';
import { Loader2Component } from 'app/shared/components/loader2/loder2.component';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-grid-counts',
  imports: [SkeletonModule, CommonModule, Loader2Component, CardModule ],
  templateUrl: './grid-counts.component.html',
  styleUrl: './grid-counts.component.scss',
  providers: [CurrencyPipe]
})
export class GridCountsComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

    @Input() start_date: string | null = null;
    @Input() end_date: string | null = null;

    private reloadTrigger = signal(0);
 

    counts = rxResource({
        stream: () => {
        // Cada vez que reloadTrigger cambia, se ejecuta este stream
        this.reloadTrigger(); // ← esto hace que rxResource cancele y recargue

        return this.api.getCounts(this.request);
        }
    });

    totalCounts = rxResource({
        stream: () => {
            // Cada vez que reloadTrigger cambia, se ejecuta este stream
            this.reloadTrigger(); // ← esto hace que rxResource cancele y recargue

            return this.api.getTotalCounts(this.request);
        }
    });

    constructor(
        private api: DashboardService
    ) {}

    ngOnInit(): void {
        
    }

    ngAfterViewInit(): void {
        
    }

    ngOnDestroy(): void {
        
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['start_date'] || changes['end_date']) {
            this.counts.reload();
            this.totalCounts.reload();
        }
    }

    // Getters
    
    get request(): DashboardCountsRequestDto{
        return {
            date_start: this.start_date ?? formatDate(new Date(), 'yyyy-MM-dd', 'es_EU'),
            date_end: this.end_date ?? formatDate(new Date(), 'yyyy-MM-dd', 'es_EU')
        };
    }

    // Functions

    private reload(): void {
        this.reloadTrigger.update(v => v + 1); // fuerza nueva ejecución
    }

}
