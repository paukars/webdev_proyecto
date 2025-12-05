import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { AlumnosService } from 'src/app/services/alumnos.service';

@Component({
  selector: 'app-alumnos-screen',
  templateUrl: './alumnos-screen.component.html',
  styleUrls: ['./alumnos-screen.component.scss']
})
export class AlumnosScreenComponent implements OnInit {

  public name_user: string = '';
  public rol: string = '';
  public token: string = '';
  public lista_alumnos: DatosAlumno[] = [];
  public searchValue: string = '';

  private readonly columnasPrincipales: string[] = [
    'matricula',
    'nombre',
    'email',
    'fecha_nacimiento',
    'curp',
    'rfc',
    'edad',
    'telefono'
  ];
  // Columnas para la tabla (se ajustan según permisos)
  displayedColumns: string[] = [];

  // DataSource de la mat-table
  dataSource = new MatTableDataSource<DatosAlumno>([]);

  // Se usan setters para enlazar paginator/sort aunque la tabla tenga *ngIf
  @ViewChild(MatPaginator)
  set matPaginator(paginator: MatPaginator) {
    if (paginator) {
      this.dataSource.paginator = paginator;
    }
  }

  @ViewChild(MatSort)
  set matSort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  constructor(
    public facadeService: FacadeService,
    public alumnosService: AlumnosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();
    this.configurarColumnas();

    if (!this.token) {
      this.router.navigate(['/']);
      return;
    }

    // Configuramos el filtro (case-insensitive)
    this.dataSource.filterPredicate = (data: DatosAlumno, filter: string) => {
      const f = filter.trim().toLowerCase();
      return (
        (data.matricula || '').toLowerCase().includes(f) ||
        (data.first_name || '').toLowerCase().includes(f) ||
        (data.last_name || '').toLowerCase().includes(f) ||
        (data.email || '').toLowerCase().includes(f)
      );
    };

    this.obtenerAlumnos();
  }

  private configurarColumnas(): void {
    this.displayedColumns = [...this.columnasPrincipales];
    if (this.puedeGestionarAlumnos()) {
      this.displayedColumns.push('editar', 'eliminar');
    }
  }

  // Obtener lista de alumnos
  public obtenerAlumnos(): void {
    this.alumnosService.obtenerListaAlumnos().subscribe(
      (response) => {
        // Normalizamos por si viene anidado en `user`
        const lista = (response as any[]).map((alumno: any) => {
          if (alumno.user) {
            return {
              ...alumno,
              first_name: alumno.user.first_name,
              last_name: alumno.user.last_name,
              email: alumno.user.email,
            };
          }
          return alumno;
        });

        this.lista_alumnos = lista as DatosAlumno[];
        this.dataSource.data = this.lista_alumnos;
      },
      (error) => {
        console.error('No se pudo obtener la lista de alumnos', error);
      }
    );
  }

  public puedeGestionarAlumnos(): boolean {
    return this.rol === 'administrador' || this.rol === 'maestro';
  }

  // Filtro de la tabla (ligado al input de tu HTML)
  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchValue = filterValue;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // Volver a la primera página al aplicar filtro
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public goEditar(idUser: number): void {
    if (!this.puedeGestionarAlumnos()) {
      alert('No tienes permisos para actualizar alumnos.');
      return;
    }
    this.router.navigate([`registro-usuarios/alumno/${idUser}`]);
  }

  public delete(idUser: number): void {
    if (this.puedeGestionarAlumnos()) {
      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: { id: idUser, rol: 'alumno' },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          console.log('Alumno eliminado');
          alert('Alumno eliminado correctamente.');
          // Si quieres, aquí podrías llamar this.obtenerAlumnos() en lugar de recargar
          window.location.reload();
        } else {
          console.log('No se eliminó el alumno');
          alert('Alumno no se ha podido eliminar.');
        }
      });
    } else {
      alert('No tienes permisos para eliminar alumnos.');
    }
  }
}

export interface DatosAlumno {
  id: number;
  matricula: string;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  curp: string;
  rfc: string;
  edad: number;
  telefono: string;
}
