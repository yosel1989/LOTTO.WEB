import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ListSettingsVariableComponent } from 'app/features/settings/components/lists/list-settings-variable/list-settings-variable.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-settings-variables',
  imports: [
    ListSettingsVariableComponent
  ],
  templateUrl: './settings-variables.component.html',
  styleUrl: './settings-variables.component.scss',
  providers: [DialogService]
})
export class SettingsVariablesComponent implements OnInit, AfterViewInit{

    constructor(
    ) {
    }

    ngOnInit(): void{
    }

    ngAfterViewInit(): void{
        
    }

    // Getters



    // Events


    // handlers


}
