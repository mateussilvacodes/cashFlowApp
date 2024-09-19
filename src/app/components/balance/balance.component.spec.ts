import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BalanceComponent } from './balance.component';

describe('BalanceComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [
        BalanceComponent
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(BalanceComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'cashFlowApp'`, () => {
    const fixture = TestBed.createComponent(BalanceComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('cashFlowApp');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(BalanceComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('cashFlowApp app is running!');
  });
});
