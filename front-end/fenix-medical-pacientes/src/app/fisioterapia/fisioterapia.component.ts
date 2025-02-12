import { Component } from '@angular/core';

@Component({
  selector: 'app-fisioterapia',
  templateUrl: './fisioterapia.component.html',
  styleUrls: ['./fisioterapia.component.css']
})
export class FisioterapiaComponent {
  toggleInfo(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = element.style.display === 'block' ? 'none' : 'block';
    }
  }
}
