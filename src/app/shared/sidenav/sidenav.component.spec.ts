
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { SidenavComponent } from './sidenav.component';

describe('SidenavComponent', () => {
  let component: SidenavComponent;
  let fixture: ComponentFixture<SidenavComponent>;

  beforeEach(fakeAsync(() => {
    void TestBed.configureTestingModule({
      declarations: [ SidenavComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidenavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should compile', async () => {
    await expect(component).toBeTruthy();
  });
});
