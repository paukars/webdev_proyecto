import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { EventosAcademicosService } from 'src/app/services/eventos-academicos.service';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  public total_user: any = {};
  public eventos: any[] = [];

  lineChartData: any = { labels: [], datasets: [] };
  lineChartOption = { responsive: true, maintainAspectRatio: false };
  lineChartPlugins = [DatalabelsPlugin];

  barChartData: any = { labels: [], datasets: [] };
  barChartOption = { responsive: true, maintainAspectRatio: false };
  barChartPlugins = [DatalabelsPlugin];

  pieChartData: any = { labels: [], datasets: [] };
  pieChartOption = { responsive: true, maintainAspectRatio: false };
  pieChartPlugins = [DatalabelsPlugin];

  doughnutChartData: any = { labels: [], datasets: [] };
  doughnutChartOption = { responsive: true, maintainAspectRatio: false, indexAxis: 'y' as const };
  doughnutChartPlugins = [DatalabelsPlugin];

  constructor(
    private administradoresServices: AdministradoresService,
    private eventosService: EventosAcademicosService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
    this.obtenerEventos();
  }

  private obtenerTotalUsers(): void {
    this.administradoresServices.getTotalUsuarios().subscribe(
      (response)=>{
        this.total_user = response;
        this.actualizarGraficasUsuarios();
        this.actualizarGraficaPromedioEdad();
      }, (error)=>{
        console.log("Error al obtener total de usuarios ", error);
        alert("No se pudo obtener el total de cada rol de usuarios");
      }
    );
  }

  private obtenerEventos(): void {
    this.eventosService.obtenerEventos().subscribe(
      (response) => {
        this.eventos = Array.isArray(response) ? response : (response?.results || []);
        this.actualizarGraficasEventos();
      },
      (error) => {
        console.error("Error al obtener eventos", error);
        alert("No se pudo obtener la lista de eventos para las gráficas.");
        this.eventos = [];
        this.actualizarGraficasEventos();
      }
    );
  }

  private actualizarGraficasUsuarios(): void {
    const admins = Number(
      this.total_user?.admins ??
      this.total_user?.administradores ??
      this.total_user?.total_admins ??
      0
    );
    const maestros = Number(
      this.total_user?.maestros ??
      this.total_user?.teachers ??
      0
    );
    const alumnos = Number(
      this.total_user?.alumnos ??
      this.total_user?.students ??
      0
    );
    const labels = ["Administradores", "Maestros", "Alumnos"];
    const data = [admins, maestros, alumnos];
    const colors = ['#F88406', '#82D3FB', '#31E731'];

    this.pieChartData = {
      labels,
      datasets: [{
        data,
        backgroundColor: colors
      }]
    };
  }

  private actualizarGraficasEventos(): void {
    const eventos = this.eventos || [];

    const asistentesLabels = eventos.map(ev => ev.titulo);
    const asistentesData = eventos.map(ev => ev.total_asistentes || 0);
    this.barChartData = {
      labels: asistentesLabels.length ? asistentesLabels : ['Sin eventos'],
      datasets: [{
        data: asistentesLabels.length ? asistentesData : [0],
        label: 'Asistentes por evento',
        backgroundColor: this.obtenerColores(asistentesLabels.length || 1)
      }]
    };

    const publicoMap: Record<string, number> = {};
    const modalidadMap: Record<string, number> = {};
    eventos.forEach(ev => {
      const publico = this.capitalize(ev.publico_objetivo || 'Desconocido');
      publicoMap[publico] = (publicoMap[publico] || 0) + 1;
      const modalidad = this.capitalize(ev.modalidad || 'Desconocida');
      modalidadMap[modalidad] = (modalidadMap[modalidad] || 0) + 1;
    });

    const publicoLabels = Object.keys(publicoMap).length ? Object.keys(publicoMap) : ['Sin eventos'];
    const publicoData = publicoLabels.map(label => publicoMap[label] || 0);
    this.lineChartData = {
      labels: publicoLabels,
      datasets: [{
        data: publicoData,
        label: 'Eventos por público objetivo',
        borderColor: '#F88406',
        backgroundColor: '#F88406',
        fill: false,
        tension: 0.3
      }]
    };

  }

  private actualizarGraficaPromedioEdad(): void {
    const promedioAdmins = Number(this.total_user?.promedio_admins ?? 0);
    const promedioMaestros = Number(this.total_user?.promedio_maestros ?? 0);
    const promedioAlumnos = Number(this.total_user?.promedio_alumnos ?? 0);

    this.doughnutChartData = {
      labels: ['Administradores', 'Maestros', 'Alumnos'],
      datasets: [{
        data: [promedioAdmins, promedioMaestros, promedioAlumnos],
        label: 'Edad promedio',
        backgroundColor: '#82D3FB'
      }]
    };
  }

  private obtenerColores(total: number): string[] {
    const palette: string[] = ['#F88406', '#FCFF44', '#82D3FB', '#FB82F5', '#2AD84A', '#31E7E7', '#F1C8F2'];
    if (total <= palette.length) {
      return palette.slice(0, total);
    }
    const result: string[] = [];
    for (let i = 0; i < total; i++) {
      result.push(palette[i % palette.length]);
    }
    return result;
  }

  private capitalize(valor: string): string {
    if (!valor) {
      return 'Desconocido';
    }
    const lower = valor.toString().toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  }

}
