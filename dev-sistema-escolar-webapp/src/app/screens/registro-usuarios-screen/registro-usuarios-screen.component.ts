import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { FacadeService } from 'src/app/services/facade.service';
import { MatRadioChange } from '@angular/material/radio';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';

@Component({
  selector: 'app-registro-usuarios-screen',
  templateUrl: './registro-usuarios-screen.component.html',
  styleUrls: ['./registro-usuarios-screen.component.scss']
})
export class RegistroUsuariosScreenComponent implements OnInit {

  public tipo: string = "registro-usuarios";
  public user: any = {};
  public editar: boolean = false;
  public rol: string = "";
  public idUser: number = 0;

  //Banderas para el tipo de usuario
  public isAdmin: boolean = false;
  public isAlumno: boolean = false;
  public isMaestro: boolean = false;
  public isEvento: boolean = false;

  public tipo_user: string = "";
  public eventoSeleccionado: any = null;

  constructor(
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private router: Router,
    public facadeService: FacadeService,
    private administradoresService: AdministradoresService,
    private alumnosService: AlumnosService,
    private maestrosService: MaestrosService,
    private eventosService: EventosAcademicosService
  ) { }

  ngOnInit(): void {
    this.user.tipo_usuario = '';

    // Obtener de la URL el rol para saber cual editar
    if (this.activatedRoute.snapshot.params['rol'] != undefined) {
      this.rol = this.activatedRoute.snapshot.params['rol'];
      console.log("Rol detectado: ", this.rol);

      this.activarBanderaSegunRol(this.rol);
    }

    const tipoSeleccionado = this.activatedRoute.snapshot.queryParams['tipo'];
    if (tipoSeleccionado && !this.activatedRoute.snapshot.params['id']) {
      this.activarBanderaSegunRol(tipoSeleccionado);
    }

    // El if valida si existe un parámetro ID en la URL
    if (this.activatedRoute.snapshot.params['id'] != undefined) {
      this.editar = true;
      // Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idUser = this.activatedRoute.snapshot.params['id'];
      console.log("ID User: ", this.idUser);
      // Al iniciar la vista obtiene el usuario por su ID
      this.obtenerUserByID();
    }
  }

  /**
   * Normaliza la cadena de rol para que coincida con los valores esperados
   * (minúsculas y en singular).
   */
  private normalizarRol(rol: string | undefined | null): string {
    if (!rol) {
      return '';
    }
    const lower = rol.trim().toLowerCase();
    return lower.endsWith('s') ? lower.slice(0, -1) : lower;
  }

  private activarBanderaSegunRol(rol: string) {
    const rolNormalizado = this.normalizarRol(rol);

    this.isAdmin = false;
    this.isAlumno = false;
    this.isMaestro = false;
    this.isEvento = false;

    if (rolNormalizado !== "evento") {
      this.eventoSeleccionado = null;
    }

    if (rolNormalizado === "administrador") {
      this.isAdmin = true;
      this.tipo_user = "administrador";
      this.user.tipo_usuario = "administrador";
    } else if (rolNormalizado === "alumno") {
      this.isAlumno = true;
      this.tipo_user = "alumno";
      this.user.tipo_usuario = "alumno";
    } else if (rolNormalizado === "maestro") {
      this.isMaestro = true;
      this.tipo_user = "maestro";
      this.user.tipo_usuario = "maestro";
    } else if (rolNormalizado === "evento") {
      this.isEvento = true;
      this.tipo_user = "evento";
      this.user.tipo_usuario = "evento";
      if (!this.editar) {
        this.eventoSeleccionado = null;
      }
    }
  }

  public radioChange(event: MatRadioChange) {
    if (event.value == "administrador") {
      this.isAdmin = true;
      this.isAlumno = false;
      this.isMaestro = false;
      this.isEvento = false;
      this.tipo_user = "administrador";
    } else if (event.value == "alumno") {
      this.isAdmin = false;
      this.isAlumno = true;
      this.isMaestro = false;
      this.isEvento = false;
      this.tipo_user = "alumno";
    } else if (event.value == "maestro") {
      this.isAdmin = false;
      this.isAlumno = false;
      this.isMaestro = true;
      this.isEvento = false;
      this.tipo_user = "maestro";
    } else if (event.value == "evento") {
      this.isAdmin = false;
      this.isAlumno = false;
      this.isMaestro = false;
      this.isEvento = true;
      this.tipo_user = "evento";
      this.eventoSeleccionado = null;
    }
  }

  public obtenerUserByID() {
    console.log("Obteniendo usuario de tipo: ", this.rol, " con ID: ", this.idUser);

    const rolNormalizado = this.normalizarRol(this.rol);

    if (rolNormalizado == "administrador") {
      this.administradoresService.obtenerAdminPorID(this.idUser).subscribe(
        (response) => {
          this.user = response;
          console.log("Administrador obtenido: ", this.user);
          // Asignar datos, soportando respuesta plana o anidada
          this.user.first_name = response.user?.first_name || response.first_name;
          this.user.last_name = response.user?.last_name || response.last_name;
          this.user.email = response.user?.email || response.email;
          this.user.tipo_usuario = "administrador";
          this.isAdmin = true;
        },
        (error) => {
          console.error("Error al obtener administrador: ", error);
          alert("No se pudo obtener el administrador seleccionado");
        }
      );
    }
    else if (rolNormalizado == "maestro") {
      this.maestrosService.obtenerMaestroPorID(this.idUser).subscribe(
        (response) => {
          this.user = response;
          console.log("Maestro obtenido: ", this.user);
          // Asignar datos, soportando respuesta anidada
          this.user.first_name = response.user?.first_name || response.first_name;
          this.user.last_name = response.user?.last_name || response.last_name;
          this.user.email = response.user?.email || response.email;
          this.user.tipo_usuario = "maestro";
          this.isMaestro = true;
        },
        (error) => {
          console.error("Error al obtener maestro: ", error);
          alert("No se pudo obtener el maestro seleccionado");
        }
      );
    }
    else if (rolNormalizado == "alumno") {
      this.alumnosService.obtenerAlumnoPorID(this.idUser).subscribe(
        (response) => {
          this.user = response;
          console.log("Alumno obtenido: ", this.user);
          // Asignar datos, soportando respuesta anidada
          this.user.first_name = response.user?.first_name || response.first_name;
          this.user.last_name = response.user?.last_name || response.last_name;
          this.user.email = response.user?.email || response.email;
          this.user.tipo_usuario = "alumno";
          this.isAlumno = true;
        },
        (error) => {
          console.error("Error al obtener alumno: ", error);
          alert("No se pudo obtener el alumno seleccionado");
        }
      );
    }
    else if (rolNormalizado == "evento") {
      this.eventosService.obtenerEventoPorId(this.idUser).subscribe(
        (response) => {
          this.eventoSeleccionado = response;
          this.user.tipo_usuario = "evento";
          this.isEvento = true;
        },
        (error) => {
          console.error("Error al obtener evento: ", error);
          alert("No se pudo obtener el evento seleccionado");
        }
      );
    }
  }

  // Función para regresar a la pantalla anterior
  public goBack() {
    this.location.back();
  }

  public onCancelarEvento() {
    this.isEvento = false;
    this.eventoSeleccionado = null;
    this.user.tipo_usuario = '';
    this.location.back();
  }

  public onEventoGuardado() {
    this.isEvento = false;
    this.eventoSeleccionado = null;
    this.user.tipo_usuario = '';
    this.router.navigate(['/eventos-academicos']);
  }
}
