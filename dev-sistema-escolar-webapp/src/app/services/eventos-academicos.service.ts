import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FacadeService } from './facade.service';
import { ErrorsService } from './tools/errors.service';
import { ValidatorService } from './tools/validator.service';

const TEXT_PATTERN = /^[0-9A-Za-zÁÉÍÓÚáéíóúñÑüÜ ,.()#/-]+$/;

@Injectable({
  providedIn: 'root'
})
export class EventosAcademicosService {

  private readonly programasPorPublico: Record<string, string[]> = {
    alumnos: [
      'Ingeniería en Ciencias de la Computación',
      'Matemáticas Aplicadas',
      'Física Educativa',
      'Ingeniería en Electrónica'
    ],
    maestros: [
      'Maestría en Docencia Universitaria',
      'Maestría en Tecnologías de la Información',
      'Doctorado en Ciencias'
    ],
    administradores: [
      'Gestión Educativa',
      'Administración Pública',
      'Transformación Digital'
    ],
    publico_general: [
      'Educación Continua',
      'Divulgación Científica',
      'Actualización Profesional'
    ]
  };

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public obtenerProgramasPorPublico(publico: string): string[] {
    return this.programasPorPublico[publico] || [];
  }

  public esquemaEvento() {
    return {
      id: null,
      titulo: '',
      descripcion: '',
      sede: '',
      publico_objetivo: 'alumnos',
      programa_educativo: this.obtenerProgramasPorPublico('alumnos')[0] || '',
      fecha_evento: '',
      hora_inicio: '09:00',
      hora_fin: '10:00',
      cupo_maximo: 20,
      modalidad: 'presencial'
    };
  }

  public validarEvento(data: any) {
    const errors: Record<string, string> = {};
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (!this.validatorService.required(data.titulo)) {
      errors['titulo'] = this.errorService.required;
    } else if (!TEXT_PATTERN.test(data.titulo.trim())) {
      errors['titulo'] = 'Solo se permiten letras, números y caracteres básicos.';
    } else if (!this.validatorService.max(data.titulo, 150)) {
      errors['titulo'] = this.errorService.max(150);
    }

    if (data.descripcion && !this.validatorService.max(data.descripcion, 600)) {
      errors['descripcion'] = this.errorService.max(600);
    }

    if (!this.validatorService.required(data.sede)) {
      errors['sede'] = this.errorService.required;
    } else if (!TEXT_PATTERN.test(data.sede.trim())) {
      errors['sede'] = 'Solo se permiten letras, números y caracteres básicos.';
    }

    if (!this.validatorService.required(data.publico_objetivo)) {
      errors['publico_objetivo'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.programa_educativo)) {
      errors['programa_educativo'] = this.errorService.required;
    } else if (data.publico_objetivo) {
      const programas = this.obtenerProgramasPorPublico(data.publico_objetivo);
      if (programas.length && !programas.includes(data.programa_educativo)) {
        errors['programa_educativo'] = 'Selecciona un programa válido para el público objetivo.';
      }
    }

    if (!this.validatorService.required(data.fecha_evento)) {
      errors['fecha_evento'] = this.errorService.required;
    } else {
      const fecha = this.parseDate(data.fecha_evento);
      if (!fecha) {
        errors['fecha_evento'] = 'Fecha inválida.';
      } else if (fecha < hoy) {
        errors['fecha_evento'] = 'No se permiten fechas en el pasado.';
      }
    }

    if (!this.validatorService.required(data.hora_inicio)) {
      errors['hora_inicio'] = this.errorService.required;
    }

    if (!this.validatorService.required(data.hora_fin)) {
      errors['hora_fin'] = this.errorService.required;
    }

    if (!errors['hora_inicio'] && !errors['hora_fin']) {
      const inicio = this.parseTime(data.hora_inicio);
      const fin = this.parseTime(data.hora_fin);
      if (!inicio || !fin) {
        errors['hora_fin'] = 'Formato de hora inválido (HH:mm).';
      } else if (inicio >= fin) {
        errors['hora_fin'] = 'La hora de fin debe ser mayor a la de inicio.';
      }
    }

    if (data.cupo_maximo === null || data.cupo_maximo === undefined || data.cupo_maximo === '') {
      errors['cupo_maximo'] = this.errorService.required;
    } else if (Number.isNaN(Number(data.cupo_maximo))) {
      errors['cupo_maximo'] = this.errorService.numeric;
    } else if (Number(data.cupo_maximo) <= 0) {
      errors['cupo_maximo'] = 'El cupo debe ser mayor a cero.';
    }

    if (!this.validatorService.required(data.modalidad)) {
      errors['modalidad'] = this.errorService.required;
    }

    return errors;
  }

  public obtenerEventos(): Observable<any> {
    return this.http.get(`${environment.url_api}/lista-eventos-academicos/`, { headers: this.buildHeaders() });
  }

  public obtenerEventoPorId(id: number): Observable<any> {
    return this.http.get(`${environment.url_api}/eventos-academicos/?id=${id}`, { headers: this.buildHeaders() });
  }

  public crearEvento(data: any): Observable<any> {
    return this.http.post(`${environment.url_api}/eventos-academicos/`, data, { headers: this.buildHeaders() });
  }

  public actualizarEvento(data: any): Observable<any> {
    return this.http.put(`${environment.url_api}/eventos-academicos/`, data, { headers: this.buildHeaders() });
  }

  public eliminarEvento(id: number): Observable<any> {
    return this.http.delete(`${environment.url_api}/eventos-academicos/?id=${id}`, { headers: this.buildHeaders() });
  }

  public registrarAsistencia(eventoId: number): Observable<any> {
    return this.http.post(`${environment.url_api}/eventos-academicos/registro/`, { evento_id: eventoId }, { headers: this.buildHeaders() });
  }

  public cancelarAsistencia(eventoId: number): Observable<any> {
    return this.http.delete(`${environment.url_api}/eventos-academicos/registro/?evento_id=${eventoId}`, { headers: this.buildHeaders() });
  }

  public obtenerAsistentes(eventoId: number): Observable<any> {
    return this.http.get(`${environment.url_api}/eventos-academicos/registro/?evento_id=${eventoId}`, { headers: this.buildHeaders() });
  }

  public actualizarConfirmacion(registroId: number, confirmado: boolean): Observable<any> {
    return this.http.patch(`${environment.url_api}/eventos-academicos/registro/`, { registro_id: registroId, confirmado }, { headers: this.buildHeaders() });
  }

  private buildHeaders(): HttpHeaders {
    const token = this.facadeService.getSessionToken();
    if (token) {
      return new HttpHeaders({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
    }
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  private parseDate(value: any): Date | null {
    if (!value) {
      return null;
    }
    if (value instanceof Date) {
      return new Date(value.getTime());
    }
    const dateCandidate = new Date(value);
    return Number.isNaN(dateCandidate.getTime()) ? null : dateCandidate;
  }

  private parseTime(value: string): number | null {
    if (!value) {
      return null;
    }
    const [hours, minutes] = value.split(':').map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) {
      return null;
    }
    return hours * 60 + minutes;
  }
}

export interface EventoRegistro {
  id: number;
  evento: number;
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  rol: string;
  confirmado: boolean;
  confirmado_en?: string;
  creation: string;
}
