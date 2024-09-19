import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TransactionsComponent } from './transactions.component';

describe('TransactionsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        TransactionsComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(TransactionsComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'cashFlowApp'`, () => {
    const fixture = TestBed.createComponent(TransactionsComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('cashFlowApp');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(TransactionsComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('cashFlowApp app is running!');
  });
});
