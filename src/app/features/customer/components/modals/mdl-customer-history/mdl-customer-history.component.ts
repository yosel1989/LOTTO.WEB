import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { AlertService } from 'app/shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { TimelineModule } from 'primeng/timeline';
import { CustomerDto } from 'app/features/customer/models/customer.model';
import { CustomerHistoryResponseDto } from 'app/features/customer/models/customer-history.model';
import { CustomerHistoryService } from 'app/features/customer/services/customer-history.service';

@Component({
  selector: 'app-mdl-customer-history',
  imports: [
    TagModule, 
    DividerModule, 
    MessageModule, 
    CardModule, 
    SkeletonModule, 
    CommonModule, 
    ScrollPanelModule,
    TimelineModule 
  ],
  templateUrl: './mdl-customer-history.component.html',
  styleUrl: './mdl-customer-history.component.scss',
  providers: [ConfirmationService]
})
export class MdlCustomerHistoryComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data!: CustomerDto;
  @Output() OnClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  collection: CustomerHistoryResponseDto[] = [];

  loading: boolean = true;

  constructor(
    private api: CustomerHistoryService,
    private alertService: AlertService
	) {
  }

  ngOnInit(): void {
    this.getCollection();
  }

  ngAfterViewInit(): void {

  }

  ngOnDestroy(): void {
  }

  // Data

  getCollection(): void{
    this.loading = true;
    this.api.getAllByCustomer(this.data.uuid).subscribe({
      next: (res: CustomerHistoryResponseDto[]) => {
        this.collection = res;
        this.loading = false;
      },
      error: (e: any) => {
        this.alertService.showToast({
          title: e.status === 0 ? 'El servidor no responde' : e.error.message,
          icon: 'error',
          position: 'top-right'
        });
        this.loading = false;
        this.OnClose.emit(true);
      }
    });
  }

  // Events

  evtOnClose(): void{
    this.OnClose.emit(true);
  }

}
