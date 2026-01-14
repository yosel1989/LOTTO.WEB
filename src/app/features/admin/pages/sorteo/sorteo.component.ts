import { AfterViewInit, Component, OnInit } from '@angular/core';
import { TblSorteosComponent } from "../../../lottery/components/tables/tbl-sorteos/tbl-sorteos.component";
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-sorteo',
  imports: [TblSorteosComponent, ConfirmPopupModule, ToastModule, ButtonModule, TooltipModule],
  templateUrl: './sorteo.component.html',
  styleUrl: './sorteo.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class SorteoComponent implements OnInit, AfterViewInit{


    constructor(
    ) {}

    ngOnInit(): void{

    }

    ngAfterViewInit(): void{
        
    }

}
