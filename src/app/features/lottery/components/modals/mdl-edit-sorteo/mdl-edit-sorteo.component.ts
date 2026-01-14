import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors} from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { EditorModule } from 'primeng/editor';
import { MessageModule } from 'primeng/message';

import { SorteoCreateResponseDto, SorteoFindByIdResponseDto, SorteoUpdatePayloadDto } from 'app/features/lottery/models/sorteo.model';
import { SorteoService } from 'app/features/lottery/services/sorteo.service';
import { CommonModule, formatDate } from '@angular/common';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Subscription } from 'rxjs';
import { SkeletonModule } from 'primeng/skeleton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';


@Component({
  selector: 'app-mdl-edit-sorteo',
  imports: [FormsModule, DatePicker, InputNumberModule, InputTextModule, TextareaModule, ButtonModule, EditorModule, ReactiveFormsModule, MessageModule, ConfirmDialog, SkeletonModule, CommonModule, ToggleSwitchModule],
  templateUrl: './mdl-edit-sorteo.component.html',
  styleUrl: './mdl-edit-sorteo.component.scss',
  providers: [ConfirmationService]
})
export class MdlEditSorteoComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input() Id!: number;
  @Output() OnCreated: EventEmitter<SorteoCreateResponseDto> = new EventEmitter<SorteoCreateResponseDto>();
  @Output() OnCanceled: EventEmitter<boolean> = new EventEmitter<boolean>();

  frmEditarSorteo: FormGroup = new FormGroup({});
  isSubmitted: boolean = false;
  ldSubmit: boolean = false;
  ldData: boolean = false;

  private subs = new Subscription();
  

  constructor(
    private fb: FormBuilder,
    private apiService: SorteoService,
    private confirmationService: ConfirmationService
	) {
    this.frmEditarSorteo = this.fb.group({
      nombre: new FormControl(null, [Validators.required, Validators.maxLength(500)]),
      slug: new FormControl(null, [Validators.required, Validators.maxLength(500), this.slugValido]),
      descripcion: new FormControl(null, Validators.maxLength(500)),
      fechaVentaInicio: new FormControl(null, Validators.required),
      fechaVentaFin: new FormControl(null, [Validators.required, this.fechaMayorQue('fechaVentaInicio')]),
      fechaSorteo: new FormControl(null, [Validators.required, this.fechaMayorIgualQue('fechaVentaFin')]),
      fechaExtSorteo: new FormControl(null, this.fechaMayorQue('fechaSorteo')),
      precioRifa: new FormControl(0, [Validators.min(1), Validators.required]),
      numeroInicial: new FormControl(1, [Validators.min(1), Validators.required]),
      numeroFinal: new FormControl(null, [Validators.required, this.numeroMayorQue('numeroInicial'), Validators.max(99999)]),
      mostrarRifas: new FormControl(true, Validators.required),
    });
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // Getters
  get f(): any {
    return this.frmEditarSorteo.controls;
  }

  get payload(): SorteoUpdatePayloadDto {
    const form = this.frmEditarSorteo.value;

    return {
      uuid: this.Id.toString(),
      nombre: form.nombre,
      descripcion: form.descripcion,
      f_inicio_venta: formatDate(form.fechaVentaInicio, 'yyyy-MM-ddTHH:mm:00', 'en-US'),
      f_fin_venta: formatDate(form.fechaVentaFin, 'yyyy-MM-ddTHH:mm:00', 'en-US'),
      f_sorteo: formatDate(form.fechaSorteo, 'yyyy-MM-ddTHH:mm:00', 'en-US'),
      f_ext_sorteo: form.fechaExtSorteo ? formatDate(form.fechaExtSorteo, 'yyyy-MM-ddTHH:mm:00', 'en-US') : null,
      precio_rifa: form.precioRifa,
      numero_min: form.numeroInicial,
      numero_max: form.numeroFinal,
      flag_rifas: form.mostrarRifas
    };
  }

  // Events
  evtOnSubmit(): void{
    this.isSubmitted = true;
    if(this.frmEditarSorteo.invalid){
      return;
    }

    this.confirmationService.confirm({
        header: '¿Guardar cambios?',
        message: 'Confirmar la operación.',
        accept: () => {

            this.frmEditarSorteo.disable();
            this.ldSubmit = true;
            
            const subs = this.apiService.createSorteo(this.payload).subscribe({
              next: (res: SorteoCreateResponseDto) => {
                this.frmEditarSorteo.enable();
                this.ldSubmit = false;
                this.OnCreated.emit(res);
              },
              error: (err: any) => {
                this.frmEditarSorteo.enable();
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

  // Data
  loadData(): void{
    this.ldData = true;
    this.frmEditarSorteo.disable();
    const sub = this.apiService.findSorteo(this.Id).subscribe({
      next: (res: SorteoFindByIdResponseDto) => {
        this.frmEditarSorteo.enable();
        this.ldData = false;
        this.handlerOnGetRequestSuccess(res);
      },
      error: (err: any) => {
        this.frmEditarSorteo.enable();
        this.ldData = false;
      }
    });
    this.subs.add(sub);
  }


  // Validators
  numeroMayorQue(controlComparado: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null; // Evita errores si el control aún no está en el grupo

      const comparado = control.parent.get(controlComparado);
      if (!comparado) return null;

      const valorActual = control.value;
      const valorComparado = comparado.value;

      if (valorActual != null && valorComparado != null && valorActual <= valorComparado) {
        return { numeroMayorQue: { requeridoMayorQue: controlComparado } };
      }

      return null;
    };
  };

  fechaMayorQue(controlComparado: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const comparado = control.parent.get(controlComparado);
      if (!comparado) return null;

      const fechaActual = control.value;
      const fechaComparada = comparado.value;

      if (fechaActual && fechaComparada) {
        const fechaA = new Date(fechaActual);
        const fechaB = new Date(fechaComparada);

        if (fechaA <= fechaB) {
          return { fechaMayorQue: { requeridoMayorQue: controlComparado } };
        }
      }

      return null;
    };
  }

  fechaMayorIgualQue(controlComparado: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;

      const comparado = control.parent.get(controlComparado);
      if (!comparado) return null;

      const fechaActual = control.value;
      const fechaComparada = comparado.value;

      if (fechaActual && fechaComparada) {
        const fechaA = new Date(fechaActual);
        const fechaB = new Date(fechaComparada);

        if (fechaA < fechaB) {
          return { fechaMayorIgualQue: { requeridoMayorIgualQue: controlComparado } };
        }
      }

      return null;
    };
  }

  slugValido(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;

      if (typeof valor !== 'string') return null;

      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

      if (!slugRegex.test(valor)) {
        return { slugInvalido: true };
      }

      return null;
    };
  }

  // Handlers
  handlerOnGetRequestSuccess(res: SorteoFindByIdResponseDto): void {
    this.frmEditarSorteo.setValue({
      nombre: res.nombre,
      slug: res.slug,
      descripcion: res.descripcion,
      fechaVentaInicio: new Date(res.f_inicio_venta),
      fechaVentaFin: new Date(res.f_fin_venta),
      fechaSorteo: new Date(res.f_sorteo),
      fechaExtSorteo: res.f_ext_sorteo ? new Date(res.f_ext_sorteo) : null,
      precioRifa: res.precio_rifa,
      numeroInicial: res.numero_min,
      numeroFinal: res.numero_max,
      mostrarRifas: res.flag_rifas
    });
  }

}
