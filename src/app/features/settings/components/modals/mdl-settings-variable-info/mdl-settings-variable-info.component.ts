import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { ConfirmationService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AlertService } from 'app/shared/services/alert.service';
import { SettingsVariableDto } from 'app/features/settings/models/settings.model';
import { SettingsVariableService } from 'app/features/settings/services/settings-variable.service';
import { LoaderComponent } from 'app/shared/components/loader/loder.component';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-mdl-settings-variable-info',
  imports: [
    ButtonModule, 
    MessageModule,
    LoaderComponent,
    TextareaModule
  ],
  templateUrl: './mdl-settings-variable-info.component.html',
  styleUrl: './mdl-settings-variable-info.component.scss',
  providers: [ConfirmationService],
  standalone: true
})
export class MdlSettingsVariableInfoComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() id!: number;
  @Output() OnSuccess: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();


  loading: boolean = false;
  variable: SettingsVariableDto | null = null;

  private subs = new Subscription();

  constructor(
    private api: SettingsVariableService,
    private alertService: AlertService
	) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    this.getData();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Events

  evtOnClose(): void{
    this.OnCanceled.emit(true);
  }

  // Data
  
  getData(): void {
    this.loading = true; 
    this.subs.add(
      this.api.getById(this.id).subscribe({
        next: (data: SettingsVariableDto) => {
          this.variable = data;
          this.loading = false;
        },
        error: (error) => {
          this.alertService.showToast({ 
            position: 'top-right',
            icon: 'error', 
            title: 'Error', 
            text: 'Error al obtener la información de la variable.'
          });
          this.loading = false;
        }
      })
    );
  }

            

}
