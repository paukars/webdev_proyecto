import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmacionEventoModalComponent } from 'src/app/modals/confirmacion-evento-modal/confirmacion-evento-modal.component';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';

@Component({
  selector: 'app-registro-eventos',
  templateUrl: './registro-eventos.component.html',
  styleUrls: [
    '../registro-maestros/registro-maestros.component.scss',
    './registro-eventos.component.scss'
  ]
})
export class RegistroEventosComponent implements OnInit, OnChanges {

  @Input() modo: 'create' | 'edit' = 'create';
  @Input() evento: any = null;
  @Output() cancelar = new EventEmitter<void>();
  @Output() guardado = new EventEmitter<void>();

  public eventoForm: any = {};
  public errors: any = {};
  public programasDisponibles: string[] = [];
  public fechaControl: Date | null = null;

  constructor(
    private eventosService: EventosAcademicosService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.inicializarFormulario(this.evento);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['evento'] && !changes['evento'].firstChange) {
      this.inicializarFormulario(changes['evento'].currentValue);
    }
    if (changes['modo'] && !changes['modo'].firstChange && this.modo === 'create') {
      this.inicializarFormulario(null);
    }
  }

  public onPublicoObjetivoChange(value: string): void {
    this.eventoForm.publico_objetivo = value;
    this.actualizarProgramasDisponibles();
  }

  public actualizarFecha(fecha: Date | null): void {
    this.fechaControl = fecha;
    if (fecha) {
      this.eventoForm.fecha_evento = this.formatearFecha(fecha);
    } else {
      this.eventoForm.fecha_evento = '';
    }
  }

  public guardarEvento(): void {
    const esEdicion = this.modo === 'edit';
    this.errors = this.eventosService.validarEvento(this.eventoForm);
    if (Object.keys(this.errors).length > 0) {
      return;
    }

    const payload = this.prepararPayload();

    if (esEdicion) {
      const dialogRef = this.dialog.open(ConfirmacionEventoModalComponent, {
        data: {
          title: 'Actualizar evento',
          message: '¿Confirmas que deseas actualizar la información del evento?',
          confirmText: 'Actualizar'
        }
      });

      dialogRef.afterClosed().subscribe(confirmado => {
        if (confirmado) {
          this.eventosService.actualizarEvento(payload).subscribe(
            () => this.emitirGuardado(),
            (error) => this.manejarError('No se pudo actualizar el evento.', error)
          );
        }
      });
    } else {
      this.eventosService.crearEvento(payload).subscribe(
        () => this.emitirGuardado(),
        (error) => this.manejarError('No se pudo crear el evento.', error)
      );
    }
  }

  public cancelarFormulario(): void {
    this.cancelar.emit();
  }

  private inicializarFormulario(data: any): void {
    const base = this.eventosService.esquemaEvento();
    if (data) {
      this.eventoForm = {
        ...base,
        ...data,
        hora_inicio: this.normalizarHora(data.hora_inicio || base.hora_inicio),
        hora_fin: this.normalizarHora(data.hora_fin || base.hora_fin),
        fecha_evento: data.fecha_evento || ''
      };
      this.fechaControl = data.fecha_evento ? new Date(data.fecha_evento) : null;
    } else {
      this.eventoForm = { ...base };
      this.fechaControl = null;
    }
    this.errors = {};
    this.actualizarProgramasDisponibles();
  }

  private actualizarProgramasDisponibles(): void {
    this.programasDisponibles = this.eventosService.obtenerProgramasPorPublico(this.eventoForm.publico_objetivo) || [];
    if (this.programasDisponibles.length > 0 && !this.programasDisponibles.includes(this.eventoForm.programa_educativo)) {
      this.eventoForm.programa_educativo = this.programasDisponibles[0];
    }
  }

  private prepararPayload(): any {
    const payload = {
      ...this.eventoForm,
      fecha_evento: this.eventoForm.fecha_evento || (this.fechaControl ? this.formatearFecha(this.fechaControl) : ''),
      hora_inicio: this.normalizarHora(this.eventoForm.hora_inicio),
      hora_fin: this.normalizarHora(this.eventoForm.hora_fin),
      cupo_maximo: Number(this.eventoForm.cupo_maximo)
    };

    if (this.modo === 'edit') {
      payload.id = this.eventoForm.id;
    }
    return payload;
  }

  private normalizarHora(hora: string): string {
    if (!hora) {
      return '';
    }
    return hora.toString().slice(0, 5);
  }

  private formatearFecha(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = `${fecha.getMonth() + 1}`.padStart(2, '0');
    const day = `${fecha.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private emitirGuardado(): void {
    this.guardado.emit();
  }

  private manejarError(mensaje: string, error: any): void {
    console.error(mensaje, error);
    alert(mensaje);
  }
}
