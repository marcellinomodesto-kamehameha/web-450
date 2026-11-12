import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SigninComponent } from './signin.component';
import {HttpTestingController} from '@angular/common/http/testing';

describe('SigninComponent', () => {
  let component: SigninComponent;
  let fixture: ComponentFixture<SigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SigninComponent] // Import SigninComponent
    })
    .compileComponents();

    fixture = TestBed.createComponent(SigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Sign In"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('.signin__title');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sign In');
  });

  it('should initialize the signinForm with null values', () => {
    const usernameControl = component.signinForm.controls['username'];
    const passwordControl = component.signinForm.controls['password'];
    expect(usernameControl.value).toBeNull();
    expect(passwordControl.value).toBeNull();
    expect(usernameControl.valid).toBeFalse();
    expect(passwordControl.valid).toBeFalse();
  });

  it('should not submit the form if fields are not filled', () => {
    spyOn(component, 'signin').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.signin__button');
    submitButton.click();

    expect(component.signin).toHaveBeenCalled();
    expect(component.signinForm.valid).toBeFalse();
    expect(component.errorMessage).toBe('Please fill in all fields.');
  });

  //Tests that a password is missing the required uppercase letter and number and marks it as invalid
  it('should reject a password that does not meet the requirements', () => {
    component.signinForm.controls['password'].setValue('password');

    expect(component.signinForm.controls['password'].valid).toBeFalse();
  });

  //Tests that an unsuccessful sign-in API request displays an invalid username and password message.
  it('should display an error when the sign in api fails', () => {
    const httpMock = TestBed.inject(HttpTestingController);

    component.signinForm.controls['username'].setValue('testuser');
    component.signinForm.controls['password'].setValue('Password123');

    component.signin();

    const request = httpMock.expectOne('http://localhost:3000/api/security/signin');
    request.flush({}, {status: 401, statusText: 'Unauthorized' });

    expect(component.errorMessage).toBe('Invalid username or password');

  })


});