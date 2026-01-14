import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormControl, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

import { SorteoChangeStatusPayloadDto, SorteoCollectionResponseDto } from 'app/features/lottery/models/sorteo.model';
import { SorteoService } from 'app/features/lottery/services/sorteo.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-mdl-cambiar-estado-sorteo',
  imports: [FormsModule, InputNumberModule, InputTextModule, TextareaModule, ButtonModule, ReactiveFormsModule, MessageModule, ConfirmDialog],
  templateUrl: './mdl-cambiar-estado-sorteo.component.html',
  styleUrl: './mdl-cambiar-estado-sorteo.component.scss',
  providers: [ConfirmationService]
})
export class MdlCambiarEstadoSorteoComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() Estado!: string;
  @Input() Data!: SorteoCollectionResponseDto;
  @Output() OnCreated: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() OnCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  frmCambiarEstado: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  ldSubmit: boolean = false;

  private subs = new Subscription();
  

  constructor(
    private fb: FormBuilder,
    private apiService: SorteoService,
    private confirmationService: ConfirmationService
	) {
    this.frmCambiarEstado = this.fb.group({
      descripcion: new FormControl(null, Validators.maxLength(500))
    });
  }

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Getters
  get f(): any {
    return this.frmCambiarEstado.controls;
  }

  get payload(): SorteoChangeStatusPayloadDto {
    const form = this.frmCambiarEstado.value;

    return {
      descripcion: form.descripcion,
      uuid: this.Data.uuid,
      estado: this.Estado
    };
  }

  // Events
  evtOnSubmit(): void{
    this.confirmationService.confirm({
        header: '¿Cambiar estado?',
        message: 'Confirmar la operación.',
        accept: () => {
            this.isSubmitted = true;
            if(this.frmCambiarEstado.invalid){
              return;
            }
            
            this.frmCambiarEstado.disable();
            this.ldSubmit = true;
            
            const subs = this.apiService.changeStatus(this.payload).subscribe({
              next: (res: boolean) => {
                this.frmCambiarEstado.enable();
                this.ldSubmit = false;
                this.OnCreated.emit(res);
              },
              error: (err: any) => {
                this.frmCambiarEstado.enable();
                this.ldSubmit = false;
              }
            });
            this.subs.add(subs);
           
        },
        reject: () => {
            
        },
    });
  }

  evtOnClose(): void{
    this.OnCanceled.emit(true);
  }


}
