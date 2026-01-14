import { AfterViewInit, Component, OnInit } from '@angular/core';

import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-customer-reports',
  imports: [TabsModule],
  templateUrl: './customer-reports.component.html',
  styleUrl: './customer-reports.component.scss',
  providers: []
})
export class CustomerReportsComponent implements OnInit, AfterViewInit{

    tabs = [
        { value: '0', label: 'Información del jugador', icon: 'pi pi-home' },
        { value: '1', label: 'Información adicional', icon: 'pi pi-chart-line' },
        { value: '2', label: 'Info Privada de Jugador', icon: 'pi pi-list' },
        { value: '3', label: 'Verificación de Jugador',  icon: 'pi pi-inbox' },
        { value: '4', label: 'Notas', icon: 'pi pi-inbox' },
        { value: '5', label: 'Documento de Imagen', icon: 'pi pi-inbox' },
        { value: '6', label: 'Mensajes',  icon: 'pi pi-inbox' },
        { value: '7', label: 'Emails', icon: 'pi pi-inbox' },
        { value: '8', label: 'Juegos Favoritos', icon: 'pi pi-inbox' },
    ];

    constructor(
    ) {}

    ngOnInit(): void{
    
    }

    ngAfterViewInit(): void{
      // Additional initialization if needed after the view is initialized
    }

    // Events

    evtOnTabChange($event: any): void{
      console.log('Tab Changed:', $event);
    }

    // Data

    loadData(): void{
      
    }

}
