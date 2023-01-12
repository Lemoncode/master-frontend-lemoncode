import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  labelText = 'Search: ';

  muestraAlert(name: string) {
    alert('El nombre es: ' + name);
  }

  escribeLog(name: string) {
    console.log('El nombre es: ' + name);
  }
}
