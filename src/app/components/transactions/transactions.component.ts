import { Component, AfterViewInit, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MockDataService } from './mock-data.service';

interface Transaction {
  id: number;
  description: string;
  type: 'entrada' | 'saida';
  amount: number;
  date: string;
}

@Component({
  selector: 'transactions-component',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss']
})
export class TransactionsComponent implements AfterViewInit, OnInit, OnChanges {
  @Input() selectedMonth: number = new Date().getMonth() + 1;
  title = 'teste-frontend-fluxo-de-caixa';

  private readonly LOCAL_STORAGE_KEY = 'transactions';

  transactions: Transaction[] = [];
  transaction: Transaction = {
    id: 0,
    description: '',
    type: 'entrada',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  };

  constructor(private mockDataService: MockDataService) {}

  ngOnInit() {
    this.initializeTransactions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMonth'] && !changes['selectedMonth'].isFirstChange()) {
      this.loadTransactions();
    }
  }

  ngAfterViewInit() {
    const swipeContainers = document.querySelectorAll<HTMLElement>('.slideable-item');

    swipeContainers.forEach((container: HTMLElement) => {
      let startX: number;
      let currentX: number;

      container.addEventListener('touchstart', (e: TouchEvent) => {
        startX = e.touches[0].clientX;
      });

      container.addEventListener('touchmove', (e: TouchEvent) => {
        currentX = e.touches[0].clientX;
        const diffX = currentX - startX;

        if (diffX < -50) {
          container.classList.add('swipe-active');
        } else if (diffX > 50) {
          container.classList.remove('swipe-active');
        }
      });
    });
  }

  initializeTransactions(): void {
    const transactions = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY) || '[]');
    if (transactions.length === 0) {
      this.mockDataService.getMockTransactions().subscribe(mockTransactions => {
        this.createInitialTransactions(mockTransactions);
      });
    } else {
      this.transactions = transactions;
    }
  }

  createInitialTransactions(mockTransactions: Transaction[]): void {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(mockTransactions));
    this.transactions = mockTransactions;
    this.updateBalance();
  }

  addTransaction(): void {
    const { id, description, type, amount } = this.transaction;
    const date = this.getDateForSelectedMonth();
    if (id) {
      this.updateTransaction(id, { description, type, amount, date });
    } else {
      this.createTransaction(description, type as 'entrada' | 'saida', amount, date);
    }
  }

  createTransaction(description: string, type: 'entrada' | 'saida', amount: number, date: string): void {
    const transactions: Transaction[] = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY) || '[]');
    const newTransaction: Transaction = { id: Date.now(), description, type, amount: parseFloat(amount.toString()), date };
    transactions.push(newTransaction);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(transactions));
    this.updateBalance();
    this.resetTransactionForm();
    this.loadTransactions();
  }

  updateTransaction(id: number, updatedTransaction: Omit<Transaction, 'id'>): void {
    let transactions: Transaction[] = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY) || '[]');
    const transactionIndex = transactions.findIndex(transaction => transaction.id === id);
    if (transactionIndex !== -1) {
      transactions[transactionIndex] = { id, ...updatedTransaction };
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(transactions));
      this.updateBalance();
      this.loadTransactions();
    }
  }

  deleteTransaction(id: number): void {
    let transactions: Transaction[] = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY) || '[]');
    transactions = transactions.filter(transaction => transaction.id !== id);
    localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(transactions));
    this.updateBalance();
    this.loadTransactions();
  }

  updateBalance(): void {
    const transactions: Transaction[] = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY) || '[]');
    const totalEntrada = transactions
      .filter(t => t.type === 'entrada')
      .reduce((sum, t) => sum + t.amount, 0);
    const totalSaida = transactions
      .filter(t => t.type === 'saida')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalEntrada - totalSaida;

    const event = new CustomEvent('balanceUpdate', {
      detail: { evento: 'atualização de saldo', balance }
    });
    window.dispatchEvent(event);
  }

  isMobile(): boolean {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  switchBottomSheet() {
    if (!this.isMobile()) {
      return;
    }

    const bottomSheet = document.querySelector<HTMLElement>('.bottom-sheet');
    const overlay = document.querySelector<HTMLElement>('.add-transaction-overlay');

    if (bottomSheet && overlay) {
      if (bottomSheet.classList.contains('active')) {
        bottomSheet.classList.remove('active');
        bottomSheet.classList.add('hide');
        overlay.classList.remove('active');
      } else {
        bottomSheet.classList.add('active');
        bottomSheet.classList.remove('hide');
        overlay.classList.add('active');
      }
    }
  }

  editTransaction(id: number): void {
    const transaction = this.transactions.find(t => t.id === id);
    if (transaction) {
      this.transaction = { ...transaction };
      this.switchBottomSheet();
    }
  }

  resetTransactionForm(): void {
    this.transaction = {
      id: 0,
      description: '',
      type: 'entrada',
      amount: 0,
      date: this.getDateForSelectedMonth()
    };
  }

  loadTransactions(): void {
    const allTransactions: Transaction[] = JSON.parse(localStorage.getItem(this.LOCAL_STORAGE_KEY) || '[]');
    this.transactions = allTransactions.filter(t => new Date(t.date).getMonth() + 1 === this.selectedMonth);
  }

  private getDateForSelectedMonth(): string {
    const today = new Date();
    const year = today.getFullYear();
    const day = today.getDate();
    return new Date(year, this.selectedMonth - 1, day).toISOString().split('T')[0];
  }
}
