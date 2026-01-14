import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { ConfirmationService } from 'primeng/api';
import { OrderService } from 'app/features/order/services/order.service';
import { OrderDTO } from 'app/features/order/models/order.model';
import { Loader2Component } from 'app/shared/components/loader2/loder2.component';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { LoaderComponent } from 'app/shared/components/loader/loder.component';
import { MessageModule } from 'primeng/message';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { AlertService } from 'app/shared/services/alert.service';
import { CommonModule } from '@angular/common';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-mdl-order-detail',
  imports: [
    //LoaderComponent, 
    //Loader2Component, 
    TagModule, 
    DividerModule, 
    MessageModule, 
    CardModule, 
    SkeletonModule, 
    CommonModule, 
    ScrollPanelModule 
  ],
  templateUrl: './mdl-order-detail.component.html',
  styleUrl: './mdl-order-detail.component.scss',
  providers: [ConfirmationService]
})
export class MdlOrderDetailComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() data!: OrderDTO;
  @Output() OnClose: EventEmitter<boolean> = new EventEmitter<boolean>();

  info?: OrderDTO;
  loading: boolean = false;

  constructor(
    private api: OrderService,
    private alertService: AlertService
	) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.getDetail();
  }

  ngOnDestroy(): void {
  }

  // Data

  getDetail(): void{
    this.loading = true;
    this.api.getDetailByOrderId(this.data.id).subscribe({
      next: (res: OrderDTO) => {
        this.info = res;
        this.loading = false;
      },
      error: (e: any) => {
        this.alertService.showToast({
          title: e.status === 0 ? 'El servidor no responde' : e.error.message,
          icon: 'error',
          position: 'top-right'
        });
        this.loading = false;
        this.OnClose.emit(false);
      }
    });
  }

  // Events

  evtOnClose(): void{
    this.OnClose.emit(true);
  }


}
