import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface para a transação
interface Transaction {
  id: number;
  description: string;
  type: 'entrada' | 'saida';
  value: number;
  date: string;
}

@Injectable({
  providedIn: 'root',
})

export class ApiService {
  private apiUrl = 'https://economia.awesomeapi.com.br/last/USD-BRL';
  private readonly LOCAL_STORAGE_KEY = 'transactions';

  constructor(private http: HttpClient) {}

  getDolarData(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
