import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { AdministradoresService } from 'src/app/services/administradores.service';

@Component({
  selector: 'app-admin-screen',
  templateUrl: './admin-screen.component.html',
  styleUrls: ['./admin-screen.component.scss']
})
export class AdminScreenComponent implements OnInit {

  public name_user: string = '';
  public rol: string = '';
  public token: string = '';

  public lista_admins: DatosAdmin[] = [];

  displayedColumns: string[] = [
    'clave_admin',   // clave del administrador
    'nombre',        // first_name + last_name
    'email',
    'telefono',
    'rfc',
    'edad',
    'ocupacion',
    'editar',
    'eliminar'
  ];

  dataSource = new MatTableDataSource<DatosAdmin>([]);

  // Setters para que paginator/sort funcionen aunque la tabla esté dentro de *ngIf
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
    public adminService: AdministradoresService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();

    if (!this.token) {
      this.router.navigate(['/']);
      return;
    }

    // Filtro por campos básicos
    this.dataSource.filterPredicate = (data: DatosAdmin, filter: string) => {
      const f = filter.trim().toLowerCase();
      return (
        (data.clave_admin || '').toLowerCase().includes(f) ||
        (data.first_name || '').toLowerCase().includes(f) ||
        (data.last_name || '').toLowerCase().includes(f) ||
        (data.email || '').toLowerCase().includes(f)
      );
    };

    this.obtenerAdministradores();
  }

  obtenerAdministradores(): void {
    this.adminService.obtenerListaAdmins().subscribe(
      (response) => {
        // response es un objeto paginado { count, next, previous, results: [...] }
        const results = Array.isArray(response)
          ? response
          : (response?.results ?? []);

        // Normalizamos: sacamos nombre y email desde user
        this.lista_admins = (results as any[]).map((admin: any) => {
          const first_name = admin.user?.first_name ?? admin.first_name ?? '';
          const last_name = admin.user?.last_name ?? admin.last_name ?? '';
          const email = admin.user?.email ?? admin.email ?? '';

          return {
            id: admin.id,
            clave_admin: admin.clave_admin,
            first_name,
            last_name,
            email,
            telefono: admin.telefono,
            rfc: admin.rfc,
            edad: admin.edad,
            ocupacion: admin.ocupacion,
          } as DatosAdmin;
        });

        // Para el *ngIf del template:
        // ahora lista_admins.length será 10 en tu ejemplo
        this.dataSource.data = this.lista_admins;
      },
      (error) => {
        console.error('Error obteniendo administradores: ', error);
        alert('No se pudo obtener la lista de administradores.');
      }
    );
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goEditar(idUser: number): void {
    this.router.navigate([`registro-usuarios/administrador/${idUser}`]);
  }

  delete(idUser: number): void {
    const userIdSession = Number(this.facadeService.getUserId());

    if (
      this.rol === 'administrador' ||
      (this.rol === 'admin' && userIdSession === idUser)
    ) {
      const dialogRef = this.dialog.open(EliminarUserModalComponent, {
        data: { id: idUser, rol: 'administrador' },
        height: '288px',
        width: '328px'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.isDelete) {
          alert('Administrador eliminado correctamente.');
          // Si no quieres recargar la página, cambia esto por this.obtenerAdministradores();
          window.location.reload();
        } else {
          alert('No se pudo eliminar el administrador.');
        }
      });

    } else {
      alert('No tienes permisos para eliminar este administrador.');
    }
  }
}

export interface DatosAdmin {
  id: number;
  clave_admin: string;
  first_name: string;
  last_name: string;
  email: string;
  telefono: string;
  rfc: string;
  edad: number;
  ocupacion: string;
}
