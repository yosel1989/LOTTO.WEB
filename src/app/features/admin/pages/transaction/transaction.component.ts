import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FltTransactionTblComponent } from 'app/features/transaction/components/filters/flt-transaction-tbl/flt-transaction-tbl.component';
import { TblTransactionsComponent } from 'app/features/transaction/components/tables/tbl-transactions/tbl-transactions.component';

@Component({
  selector: 'app-transaction',
  imports: [ConfirmPopupModule, ToastModule, ButtonModule, TooltipModule, FltTransactionTblComponent, TblTransactionsComponent],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class TransactionComponent implements OnInit, AfterViewInit{
    @ViewChild('flTransaction') flTransaction: any;


    constructor(
    ) {}

    ngOnInit(): void{

    }

    ngAfterViewInit(): void{
    }

    // Events

    evtOnValueChanges(evt: any): void{
      console.log('filter data', evt);
    }

}
