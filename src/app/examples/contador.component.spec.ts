import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ContadorComponent } from './contador.component';

// Teste de componente com TestBed e ComponentFixture.
describe('ContadorComponent', () => {
  let fixture: ComponentFixture<ContadorComponent>;
  let component: ContadorComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContadorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ContadorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // primeira renderização
  });

  it('cria o componente', () => {
    expect(component).toBeTruthy();
  });

  it('mostra 0 ao iniciar', () => {
    const p: HTMLElement = fixture.nativeElement.querySelector('.valor');
    expect(p.textContent?.trim()).toBe('0');
  });

  it('incrementa ao clicar no botão', () => {
    const botao = fixture.debugElement.query(By.css('button'));

    botao.triggerEventHandler('click');
    fixture.detectChanges(); // atualiza o DOM após mudar o estado

    const p: HTMLElement = fixture.nativeElement.querySelector('.valor');
    expect(p.textContent?.trim()).toBe('1');
    expect(component.valor()).toBe(1);
  });
});
