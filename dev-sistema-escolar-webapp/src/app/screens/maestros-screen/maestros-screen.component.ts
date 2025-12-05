import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-maestros-screen',
  templateUrl: './maestros-screen.component.html',
  styleUrls: ['./maestros-screen.component.scss']
})
export class MaestrosScreenComponent implements OnInit {

  public name_user: string = '';
  public rol: string = '';
  public token: string = '';
  public lista_maestros: any[] = [];
  public userId: number = 0;

  // Columnas de la tabla (ajusta los IDs si en tu HTML se llaman distinto)
  displayedColumns: string[] = [
    'id_trabajador',
    'nombre',
    'email',
    'fecha_nacimiento',
    'telefono',
    'rfc',
    'cubiculo',
    'area_investigacion',
    'editar',
    'eliminar'
  ];

  // DataSource de la tabla
  dataSource = new MatTableDataSource<DatosUsuario>([]);

  // Se usan setters para enlazar paginator/sort aunque la tabla/paginador estén dentro de *ngIf
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
    public maestrosService: MaestrosService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.userId = Number(this.facadeService.getUserId()) || 0;

    // Validar que haya inicio de sesión
    this.token = this.facadeService.getSessionToken();
    console.log('Token: ', this.token);
    if (this.token === '') {
      this.router.navigate(['/']);
      return;
    }

    // Filtro por campos específicos
    this.dataSource.filterPredicate = (data: DatosUsuario, filter: string) => {
      const f = filter.trim().toLowerCase();
      return (
        (String(data.id_trabajador) || '').toLowerCase().includes(f) ||
        (data.first_name || '').toLowerCase().includes(f) ||
        (data.last_name || '').toLowerCase().includes(f) ||
        (data.email || '').toLowerCase().includes(f)
      );
    };

    // Obtener maestros
    this.obtenerMaestros();
  }

  // Consumimos el servicio para obtener la lista de maestros
  public obtenerMaestros(): void {
    this.maestrosService.obtenerListaMaestros().subscribe(
      (response) => {
        this.lista_maestros = response;
        console.log('Lista users: ', this.lista_maestros);

        if (this.lista_maestros.length > 0) {
          // Agregar datos del nombre y email desde user
          this.lista_maestros.forEach(usuario => {
            if (usuario.user) {
              usuario.first_name = usuario.user.first_name;
              usuario.last_name = usuario.user.last_name;
              usuario.email = usuario.user.email;
            }
          });

          console.log('Maestros: ', this.lista_maestros);

          // Solo actualizar data, no crear un nuevo dataSource
          this.dataSource.data = this.lista_maestros as DatosUsuario[];
        }
      },
      (error) => {
        console.error('Error al obtener la lista de maestros: ', error);
        alert('No se pudo obtener la lista de maestros');
      }
    );
  }

  // Filtro desde el input (igual que en alumnos)
  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public puedeEditarMaestro(idMaestro: number): boolean {
    if (this.rol === 'administrador') {
      return true;
    }
    if (this.rol === 'maestro') {
      return Number(this.userId) === Number(idMaestro);
    }
    return false;
  }

  public goEditar(idUser: number): void {
    if (!this.puedeEditarMaestro(idUser)) {
      alert('Solo puedes editar tu propio perfil.');
      return;
    }
    this.router.navigate(['registro-usuarios/maestros/' + idUser]);
  }

  public delete(idUser: number): void {
    // Se obtiene el ID del usuario en sesión, es decir, quien intenta eliminar
    const userIdSession = Number(this.facadeService.getUserId());
    // El parámetro idUser es el ID del maestro a eliminar
    // Administrador puede eliminar cualquier maestro
    // Maestro solo puede eliminar su propio registro
    if (this.rol === 'administrador' || (this.rol === 'maestro' && userIdSession === idUser)) {
      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: { id: idUser, rol: 'maestro' },
        height: '288px',
        width: '328px',
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          console.log('Maestro eliminado');
          alert('Maestro eliminado correctamente.');
          window.location.reload();
        } else {
          alert('Maestro no se ha podido eliminar.');
          console.log('No se eliminó el maestro');
        }
      });
    } else {
      alert('No tienes permisos para eliminar este maestro.');
    }
  }
}

// Esto va fuera de la clase
export interface DatosUsuario {
  id: number;
  id_trabajador: number;
  first_name: string;
  last_name: string;
  email: string;
  fecha_nacimiento: string;
  telefono: string;
  rfc: string;
  cubiculo: string;
  area_investigacion: number;
}
