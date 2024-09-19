import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'teste-frontend-fluxo-de-caixa';
  selectedMonth: number = new Date().getMonth() + 1;

  onMonthChange(month: number): void {
    this.selectedMonth = Number.isInteger(month) ? month : Math.floor(month);

    console.log(typeof this.selectedMonth);

    this.updateComponents();
  }

  updateComponents(): void {
    const event = new CustomEvent('monthChanged', {
      detail: { month: this.selectedMonth }
    });
    window.dispatchEvent(event);
  }
}
