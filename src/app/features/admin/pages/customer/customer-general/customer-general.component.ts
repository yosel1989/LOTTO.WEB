import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TabpanelCustomerInfoComponent } from 'app/features/customer/components/tabpanels/tabpanel-customer-info/tabpanel-customer-info.component';

import { TabsModule } from 'primeng/tabs';

@Component({
  selector: 'app-customer-general',
  imports: [TabsModule, TabpanelCustomerInfoComponent],
  templateUrl: './customer-general.component.html',
  styleUrl: './customer-general.component.scss',
  providers: []
})
export class CustomerGeneralComponent implements OnInit, AfterViewInit{
    customerId: string = '';
    activeTabValue: any = '0';

    tabs = [
        { value: '0', label: 'Información del jugador', icon: 'pi pi-home', disabled: false },
        { value: '1', label: 'Información adicional', icon: 'pi pi-chart-line', disabled: true },
        { value: '2', label: 'Info Privada de Jugador', icon: 'pi pi-list', disabled: true },
        { value: '3', label: 'Verificación de Jugador',  icon: 'pi pi-inbox', disabled: true },
        { value: '4', label: 'Notas', icon: 'pi pi-inbox', disabled: true },
        { value: '5', label: 'Documento de Imagen', icon: 'pi pi-inbox', disabled: true },
        { value: '6', label: 'Mensajes',  icon: 'pi pi-inbox', disabled: true },
        { value: '7', label: 'Emails', icon: 'pi pi-inbox', disabled: true },
        { value: '8', label: 'Juegos Favoritos', icon: 'pi pi-inbox', disabled: true },
    ];

    constructor(
      private routeActive: ActivatedRoute
    ) {}

    ngOnInit(): void{
      this.customerId = this.routeActive.parent?.snapshot.paramMap.get('uuid') || '';
      console.log('UUID desde el hijo:', this.customerId);
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
