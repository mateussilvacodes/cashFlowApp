import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockDataService {

  private readonly MOCK_DATA_URL = 'assets/mock-transactions.json';
  constructor(private http: HttpClient) {}

  getMockTransactions(): Observable<any> {
    return this.http.get(this.MOCK_DATA_URL);
  }
}