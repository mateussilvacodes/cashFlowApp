import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input } from '@angular/core';
import { ApiService } from '../../httpClient.component';

@Component({
  selector: 'balance-component',
  templateUrl: './balance.component.html',
  styleUrls: ['./balance.component.scss']
})
export class BalanceComponent implements OnInit, OnDestroy {
  title = 'teste-frontend-fluxo-de-caixa';

  balance = {
    totalEntrada: 0,
    totalSaida: 0,
    saldo: 0
  };

  dolarPrice: string | undefined;

  private balanceUpdateListener!: (event: CustomEvent) => void;

  @Input() month: number = new Date().getMonth() + 1;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadBalanceFromLocalStorage();
    this.balanceUpdateListener = (event: CustomEvent) => this.updateBalance();
    window.addEventListener('balanceUpdate', this.balanceUpdateListener as EventListener);
  }

  ngAfterViewInit() {
    this.apiService.getDolarData().subscribe(
      (response) => {
        const rawDolarPrice = response.USDBRL.ask;
        this.dolarPrice = rawDolarPrice.slice(0, 4);
      },
      (error) => {
        console.error('Erro ao buscar dados:', error);
      }
    );
  }

  ngOnDestroy() {
    window.removeEventListener('balanceUpdate', this.balanceUpdateListener as EventListener);
  }

  loadBalanceFromLocalStorage(): void {
    const transactions: any[] = JSON.parse(localStorage.getItem('transactions') || '[]');

    const totalEntrada = transactions
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalSaida = transactions
      .filter(t => t.type === 'saida')
      .reduce((sum, t) => sum + t.amount, 0);
    const saldo = totalEntrada - totalSaida;

    this.balance = {
      totalEntrada,
      totalSaida,
      saldo
    };
  }

  updateBalance(): void {
    this.loadBalanceFromLocalStorage();
    this.cdr.detectChanges();
  }
}
