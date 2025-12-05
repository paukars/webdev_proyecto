import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventosAcademicosService, EventoRegistro } from 'src/app/services/eventos-academicos.service';

export interface AsistentesEventoModalData {
  evento: { id: number; titulo: string };
}

@Component({
  selector: 'app-asistentes-evento-modal',
  templateUrl: './asistentes-evento-modal.component.html',
  styleUrls: ['./asistentes-evento-modal.component.scss']
})
export class AsistentesEventoModalComponent implements OnInit {

  public displayedColumns: string[] = ['nombre', 'rol', 'email', 'confirmado'];
  public registros: EventoRegistro[] = [];
  public isLoading = true;
  public seModifico = false;
  public error = '';

  constructor(
    private dialogRef: MatDialogRef<AsistentesEventoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AsistentesEventoModalData,
    private eventosService: EventosAcademicosService
  ) { }

  ngOnInit(): void {
    this.cargarRegistros();
  }

  public cerrar(): void {
    this.dialogRef.close({ refetch: this.seModifico });
  }

  public toggleConfirmacion(registro: EventoRegistro, confirmado: boolean): void {
    this.eventosService.actualizarConfirmacion(registro.id, confirmado).subscribe(
      (response) => {
        registro.confirmado = response?.registro?.confirmado ?? confirmado;
        this.seModifico = true;
      },
      (error) => {
        console.error('Error al actualizar confirmación', error);
        alert('No se pudo actualizar la asistencia.');
        this.cargarRegistros();
      }
    );
  }

  private cargarRegistros(): void {
    this.isLoading = true;
    this.error = '';
    this.eventosService.obtenerAsistentes(this.data.evento.id).subscribe(
      (response) => {
        this.registros = response?.registros || [];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener asistentes', error);
        this.error = 'No se pudieron cargar los asistentes.';
        this.isLoading = false;
      }
    );
  }
}
