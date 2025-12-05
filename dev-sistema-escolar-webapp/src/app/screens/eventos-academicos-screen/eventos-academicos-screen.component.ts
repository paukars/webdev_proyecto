import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmacionEventoModalComponent } from 'src/app/modals/confirmacion-evento-modal/confirmacion-evento-modal.component';
import { AsistentesEventoModalComponent } from 'src/app/modals/asistentes-evento-modal/asistentes-evento-modal.component';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-eventos-academicos-screen',
  templateUrl: './eventos-academicos-screen.component.html',
  styleUrls: [
    '../maestros-screen/maestros-screen.component.scss',
    './eventos-academicos-screen.component.scss'
  ]
})
export class EventosAcademicosScreenComponent implements OnInit {

  public displayedColumns: string[] = [];
  public dataSource = new MatTableDataSource<EventoAcademico>([]);
  public listaEventos: EventoAcademico[] = [];
  public rol: string = '';
  public esAdmin = false;
  public esMaestro = false;
  public esAlumno = false;
  public name_user: string = '';
  public token: string = '';

  public isLoading = false;

  private readonly columnasBase = ['titulo', 'programa', 'publico', 'fecha', 'horario', 'modalidad', 'sede', 'cupo'];

  @ViewChild(MatPaginator)
  set paginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort)
  set sort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  constructor(
    private eventosService: EventosAcademicosService,
    private facadeService: FacadeService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.esAdmin = this.rol === 'administrador';
    this.esMaestro = this.rol === 'maestro';
    this.esAlumno = this.rol === 'alumno';
    this.token = this.facadeService.getSessionToken();

    if (!this.token) {
      this.router.navigate(['/']);
      return;
    }

    this.displayedColumns = this.esAdmin
      ? [...this.columnasBase, 'asistentes', 'editar', 'eliminar']
      : [...this.columnasBase, 'registro'];
    this.configurarFiltro();
    this.obtenerEventos();
  }

  public obtenerEventos(): void {
    this.isLoading = true;
    this.eventosService.obtenerEventos().subscribe(
      (response) => {
        const lista = Array.isArray(response)
          ? response
          : (Array.isArray(response?.results) ? response.results : []);
        this.listaEventos = lista;
        this.dataSource.data = [...this.listaEventos];
        this.isLoading = false;
      },
      (error) => {
        console.error('Error al obtener eventos', error);
        alert('No se pudieron obtener los eventos académicos.');
        this.isLoading = false;
      }
    );
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public editarEvento(evento: EventoAcademico): void {
    if (!this.esAdmin) {
      return;
    }
    this.router.navigate(['registro-usuarios', 'evento', evento.id]);
  }

  public registrarEvento(evento: EventoAcademico): void {
    if (!this.puedeRegistrarse()) {
      return;
    }
    this.eventosService.registrarAsistencia(evento.id).subscribe(
      () => {
        alert('Te has registrado en el evento.');
        this.obtenerEventos();
      },
      (error) => {
        console.error('Error al registrarse en evento', error);
        const mensaje = error?.error?.detail || 'No se pudo registrar en el evento.';
        alert(mensaje);
      }
    );
  }

  public cancelarRegistro(evento: EventoAcademico): void {
    if (!this.puedeRegistrarse()) {
      return;
    }
    this.eventosService.cancelarAsistencia(evento.id).subscribe(
      () => {
        alert('Has cancelado tu registro.');
        this.obtenerEventos();
      },
      (error) => {
        console.error('Error al cancelar registro', error);
        const mensaje = error?.error?.detail || 'No se pudo cancelar tu registro.';
        alert(mensaje);
      }
    );
  }

  public verAsistentes(evento: EventoAcademico): void {
    if (!this.esAdmin) {
      return;
    }
    const dialogRef = this.dialog.open(AsistentesEventoModalComponent, {
      width: '640px',
      data: { evento }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.refetch) {
        this.obtenerEventos();
      }
    });
  }

  public confirmarEliminar(evento: EventoAcademico): void {
    if (!this.esAdmin) {
      return;
    }
    const dialogRef = this.dialog.open(ConfirmacionEventoModalComponent, {
      data: {
        title: 'Eliminar evento',
        message: `¿Deseas eliminar el evento "${evento.titulo}"? Esta acción no se puede deshacer.`,
        confirmText: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.eventosService.eliminarEvento(evento.id).subscribe(
          () => {
            alert('Evento eliminado correctamente.');
            this.obtenerEventos();
          },
          (error) => {
            console.error('Error al eliminar evento', error);
            alert('No se pudo eliminar el evento seleccionado.');
          }
        );
      }
    });
  }

  public getPublicoLabel(value: string): string {
    const map: Record<string, string> = {
      alumnos: 'Alumnos',
      maestros: 'Maestros',
      administradores: 'Administradores',
      publico_general: 'Público general'
    };
    return map[value] || value;
  }

  public getModalidadLabel(value: string): string {
    const map: Record<string, string> = {
      presencial: 'Presencial',
      virtual: 'Virtual',
      hibrido: 'Híbrido'
    };
    return map[value] || value;
  }

  public formatearHora(hora?: string): string {
    if (!hora) {
      return '--:--';
    }
    return hora.toString().slice(0, 5);
  }

  private configurarFiltro(): void {
    this.dataSource.filterPredicate = (data: EventoAcademico, filter: string) => {
      const searchable = `${data.titulo} ${data.programa_educativo} ${data.publico_objetivo} ${data.modalidad} ${data.sede}`.toLowerCase();
      return searchable.includes(filter);
    };
  }

  private puedeRegistrarse(): boolean {
    return this.esAlumno || this.esMaestro;
  }
}

export interface EventoAcademico {
  id: number;
  titulo: string;
  descripcion: string;
  sede: string;
  publico_objetivo: string;
  programa_educativo: string;
  fecha_evento: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_maximo: number;
  modalidad: string;
  total_asistentes?: number;
  cupos_disponibles?: number;
  inscrito?: boolean;
  confirmado?: boolean;
  registro_id?: number | null;
}
