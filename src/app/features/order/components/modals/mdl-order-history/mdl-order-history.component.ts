import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { OrderDTO } from 'app/features/order/models/order.model';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { AlertService } from 'app/shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OrderHistoryResponseDto } from 'app/features/order/models/order-history.model';
import { OrderHistoryService } from 'app/features/order/services/order-history.service';
import { TimelineModule } from 'primeng/timeline';

@Component({
  selector: 'app-mdl-order-history',
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
  templateUrl: './mdl-order-history.component.html',
  styleUrl: './mdl-order-history.component.scss',
  providers: [ConfirmationService]
})
export class MdlOrderHistoryComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data!: OrderDTO;
  @Output() OnClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  collection: OrderHistoryResponseDto[] = [];

  loading: boolean = true;

  constructor(
    private api: OrderHistoryService,
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
    this.api.getAllByOrder(this.data.uuid).subscribe({
      next: (res: OrderHistoryResponseDto[]) => {
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
