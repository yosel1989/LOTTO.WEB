import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { TabsModule } from 'primeng/tabs';
import { ArchivoRoutingModule } from "../archivo/archivo-routing.module";
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  imports: [TabsModule, CardModule, ArchivoRoutingModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
  providers: [ConfirmationService, MessageService]
})
export class SettingsComponent implements OnInit, AfterViewInit{


    constructor(
    ) {}

    ngOnInit(): void{

    }

    ngAfterViewInit(): void{
        
    }

}
