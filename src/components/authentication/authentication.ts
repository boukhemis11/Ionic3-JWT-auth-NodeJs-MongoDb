import { Component } from '@angular/core';
import { AuthProvider } from '../../providers/auth/auth';
import { HomePage } from '../../pages/home/home';
import { NavController,Events } from 'ionic-angular';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the AuthenticationComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'authentication',
  templateUrl: 'authentication.html'
})
export class AuthenticationComponent {
  public data: any;

  constructor(public fb: FormBuilder, public navCtrl: NavController,private authprovider:AuthProvider, private events: Events) {

  }
  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);

  loginForm: FormGroup = this.fb.group({
    username: this.username,
    password: this.password,
  });

  loginUser(formdata: any): void{
    this.authprovider.login(this.loginForm.value)
      .then(
        data => this.handleLoginSuccess(this.loginForm.value)
      ).catch(()=>{
        console.log("catched auth")
      }
    )
  }

  handleLoginSuccess(data) {
    this.events.publish('app:setUser', data);
  }


}
