import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { FacadeService } from 'src/app/services/facade.service';

@Component({
  selector: 'app-registro-alumnos',
  templateUrl: './registro-alumnos.component.html',
  styleUrls: ['./registro-alumnos.component.scss']
})
export class RegistroAlumnosComponent implements OnInit, OnChanges {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public alumno: any = {};
  public token: string = "";
  public errors: any = {};
  public editar: boolean = false;
  public idUser: Number = 0;

  constructor(
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private alumnosService: AlumnosService,
    private facadeService: FacadeService
  ) { }

  ngOnInit(): void {
    this.token = this.facadeService.getSessionToken();

    const tieneDatosPrevios = this.alumno && Object.keys(this.alumno).length > 0;
    if (!tieneDatosPrevios) {
      // Inicializamos con el esquema base para evitar referencias indefinidas
      this.alumno = {
        ...this.alumnosService.esquemaAlumno(),
        rol: this.rol || 'alumno'
      };
    } else {
      this.alumno.rol = this.alumno.rol || this.rol || 'alumno';
    }

    const idParam = this.activatedRoute.snapshot.params['id'];
    if (idParam && !this.datos_user) {
      this.editar = true;
      this.idUser = idParam;
      this.cargarAlumnoDesdeApi(Number(idParam));
    } else if (this.datos_user) {
      this.asignarAlumnoDesdeInput(this.datos_user);
    }

    console.log("Datos alumno: ", this.alumno);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos_user'] && changes['datos_user'].currentValue) {
      this.asignarAlumnoDesdeInput(changes['datos_user'].currentValue);
    }
  }

  private asignarAlumnoDesdeInput(data: any) {
    if (!data) {
      return;
    }
    this.editar = true;
    this.idUser = data.id;
    this.alumno = this.mapearAlumno(data);
  }

  private cargarAlumnoDesdeApi(id: number) {
    this.alumnosService.obtenerAlumnoPorID(id).subscribe(
      (response) => {
        console.log("Alumno cargado:", response);
        this.alumno = this.mapearAlumno(response);
      },
      (error) => {
        console.error("Error al cargar alumno:", error);
        alert("Error al cargar los datos del alumno");
      }
    );
  }

  private mapearAlumno(data: any) {
    const userData = data?.user || {};
    return {
      id: data?.id,
      matricula: data?.matricula || '',
      curp: (data?.curp || '').toUpperCase(),
      rfc: (data?.rfc || '').toUpperCase(),
      fecha_nacimiento: data?.fecha_nacimiento || '',
      edad: data?.edad || '',
      telefono: data?.telefono || '',
      ocupacion: data?.ocupacion || '',
      first_name: userData.first_name || data?.first_name || '',
      last_name: userData.last_name || data?.last_name || '',
      email: userData.email || data?.email || '',
      rol: 'alumno'
    };
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    //Validamos si el formulario está lleno y correcto
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // Lógica para registrar un nuevo alumno
    if (this.alumno.password == this.alumno.confirmar_password) {
      this.alumnosService.registrarAlumno(this.alumno).subscribe(
        (response) => {
          // Redirigir o mostrar mensaje de éxito
          alert("Alumno registrado exitosamente");
          console.log("Alumno registrado: ", response);
          if (this.token && this.token !== "") {
            this.router.navigate(["alumnos"]);
          } else {
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          // Manejar errores de la API
          alert("Error al registrar alumno");
          console.error("Error al registrar alumno: ", error);
        }
      );
    } else {
      alert("Las contraseñas no coinciden");
      this.alumno.password = "";
      this.alumno.confirmar_password = "";
    }
  }

  public actualizar() {
    // Validación de los datos
    this.errors = {};
    this.errors = this.alumnosService.validarAlumno(this.alumno, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // Ejecutar el servicio de actualización
    this.alumnosService.actualizarAlumno(this.alumno).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Alumno actualizado exitosamente");
        console.log("Alumno actualizado: ", response);
        this.router.navigate(["alumnos"]);
      },
      (error) => {
        // Manejar errores de la API
        alert("Error al actualizar alumno");
        console.error("Error al actualizar alumno: ", error);
      }
    );
  }

  //Funciones para password
  showPassword() {
    if (this.inputType_1 == 'password') {
      this.inputType_1 = 'text';
      this.hide_1 = true;
    }
    else {
      this.inputType_1 = 'password';
      this.hide_1 = false;
    }
  }

  showPwdConfirmar() {
    if (this.inputType_2 == 'password') {
      this.inputType_2 = 'text';
      this.hide_2 = true;
    }
    else {
      this.inputType_2 = 'password';
      this.hide_2 = false;
    }
  }

  //Función para detectar el cambio de fecha
  public changeFecha(event: any) {
    console.log(event);
    console.log(event.value.toISOString());

    this.alumno.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.alumno.fecha_nacimiento);
  }

  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

}
