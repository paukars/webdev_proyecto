import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-registro-maestros',
  templateUrl: './registro-maestros.component.html',
  styleUrls: ['./registro-maestros.component.scss']
})
export class RegistroMaestrosComponent implements OnInit, OnChanges {

  @Input() rol: string = "";
  @Input() datos_user: any = {};

  //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public maestro: any = {};
  public errors: any = {};
  public editar: boolean = false;
  public token: string = "";
  public idUser: Number = 0;

  //Para el select
  public areas: any[] = [
    { value: '1', viewValue: 'Desarrollo Web' },
    { value: '2', viewValue: 'Programación' },
    { value: '3', viewValue: 'Bases de datos' },
    { value: '4', viewValue: 'Redes' },
    { value: '5', viewValue: 'Matemáticas' },
  ];

  public materias: any[] = [
    { value: '1', nombre: 'Aplicaciones Web' },
    { value: '2', nombre: 'Programación 1' },
    { value: '3', nombre: 'Bases de datos' },
    { value: '4', nombre: 'Tecnologías Web' },
    { value: '5', nombre: 'Minería de datos' },
    { value: '6', nombre: 'Desarrollo móvil' },
    { value: '7', nombre: 'Estructuras de datos' },
    { value: '8', nombre: 'Administración de redes' },
    { value: '9', nombre: 'Ingeniería de Software' },
    { value: '10', nombre: 'Administración de S.O.' },
  ];

  constructor(
    private router: Router,
    private location: Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private maestrosService: MaestrosService
  ) { }

  ngOnInit(): void {
    this.token = this.facadeService.getSessionToken();

    const tieneDatosPrevios = this.maestro && Object.keys(this.maestro).length > 0;
    if (!tieneDatosPrevios) {
      this.maestro = {
        ...this.maestrosService.esquemaMaestro(),
        rol: this.rol || 'maestro',
        materias_json: []
      };
    } else {
      this.maestro.rol = this.maestro.rol || this.rol || 'maestro';
      this.maestro.materias_json = this.normalizarMaterias(this.maestro.materias_json);
    }

    const idParam = this.activatedRoute.snapshot.params['id'];
    if (idParam && !this.datos_user) {
      this.editar = true;
      this.idUser = this.activatedRoute.snapshot.params['id'];
      this.cargarMaestroDesdeApi(Number(this.idUser));
    } else if (this.datos_user) {
      this.asignarMaestroDesdeInput(this.datos_user);
    }

    console.log("Datos maestro: ", this.maestro);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datos_user'] && changes['datos_user'].currentValue) {
      this.asignarMaestroDesdeInput(changes['datos_user'].currentValue);
    }
  }

  private asignarMaestroDesdeInput(data: any) {
    if (!data) {
      return;
    }
    this.editar = true;
    this.idUser = data.id;
    this.maestro = this.mapearMaestro(data);
  }

  private cargarMaestroDesdeApi(id: number) {
    this.maestrosService.obtenerMaestroPorID(id).subscribe(
      (response) => {
        console.log("Maestro cargado:", response);
        this.maestro = this.mapearMaestro(response);
      },
      (error) => {
        console.error("Error al cargar maestro:", error);
        alert("Error al cargar los datos del maestro");
      }
    );
  }

  private mapearMaestro(data: any) {
    const userData = data?.user || {};
    return {
      id: data?.id,
      id_trabajador: data?.id_trabajador || '',
      fecha_nacimiento: data?.fecha_nacimiento || '',
      telefono: data?.telefono || '',
      rfc: (data?.rfc || '').toUpperCase(),
      cubiculo: data?.cubiculo || '',
      area_investigacion: data?.area_investigacion || '',
      materias_json: this.normalizarMaterias(data?.materias_json),
      first_name: userData.first_name || data?.first_name || '',
      last_name: userData.last_name || data?.last_name || '',
      email: userData.email || data?.email || '',
      rol: 'maestro'
    };
  }

  private normalizarMaterias(materias: any): string[] {
    if (Array.isArray(materias)) {
      return [...materias];
    }
    if (typeof materias === 'string' && materias.trim().length > 0) {
      try {
        const parsed = JSON.parse(materias);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        console.warn('No se pudieron parsear las materias recibidas', error);
        return [];
      }
    }
    return [];
  }

  public regresar() {
    this.location.back();
  }

  public registrar() {
    //Validamos si el formulario está lleno y correcto
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }
    //Validar la contraseña
    if (this.maestro.password == this.maestro.confirmar_password) {
      this.maestrosService.registrarMaestro(this.maestro).subscribe(
        (response) => {
          // Redirigir o mostrar mensaje de éxito
          alert("Maestro registrado exitosamente");
          console.log("Maestro registrado: ", response);
          if (this.token && this.token !== "") {
            this.router.navigate(["maestros"]);
          } else {
            this.router.navigate(["/"]);
          }
        },
        (error) => {
          // Manejar errores de la API
          alert("Error al registrar maestro");
          console.error("Error al registrar maestro: ", error);
        }
      );
    } else {
      alert("Las contraseñas no coinciden");
      this.maestro.password = "";
      this.maestro.confirmar_password = "";
    }
  }

  public actualizar() {
    // Validación de los datos
    this.errors = {};
    this.errors = this.maestrosService.validarMaestro(this.maestro, this.editar);
    if (Object.keys(this.errors).length > 0) {
      return false;
    }

    // Ejecutar el servicio de actualización
    this.maestrosService.actualizarMaestro(this.maestro).subscribe(
      (response) => {
        // Redirigir o mostrar mensaje de éxito
        alert("Maestro actualizado exitosamente");
        console.log("Maestro actualizado: ", response);
        this.router.navigate(["maestros"]);
      },
      (error) => {
        // Manejar errores de la API
        alert("Error al actualizar maestro");
        console.error("Error al actualizar maestro: ", error);
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

    this.maestro.fecha_nacimiento = event.value.toISOString().split("T")[0];
    console.log("Fecha: ", this.maestro.fecha_nacimiento);
  }

  // Funciones para los checkbox
  public checkboxChange(event: any) {
    console.log("Evento: ", event);
    if (event.checked) {
      this.maestro.materias_json.push(event.source.value)
    } else {
      console.log(event.source.value);
      this.maestro.materias_json.forEach((materia, i) => {
        if (materia == event.source.value) {
          this.maestro.materias_json.splice(i, 1)
        }
      });
    }
    console.log("Array materias: ", this.maestro);
  }

  public revisarSeleccion(nombre: string) {
    if (this.maestro.materias_json) {
      var busqueda = this.maestro.materias_json.find((element) => element == nombre);
      if (busqueda != undefined) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

}
