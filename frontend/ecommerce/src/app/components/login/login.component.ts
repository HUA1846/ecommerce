import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

import * as OktaSignIn from '@okta/okta-signin-widget';
import appConfig from 'src/app/config/app-config';
import { OKTA_AUTH } from '@okta/okta-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  oktaSignin: any;

  constructor(private oktaAuthService: OktaAuthStateService, @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) {
      this.oktaSignin = new OktaSignIn({
        logo: 'assets/images/logo.png',
        baseUrl: appConfig.oidc.issuer.split('/oauth2')[0],
        clientId: appConfig.oidc.clientId,
        redirectUri: appConfig.oidc.redirectUri,
        authParams: {
          pkce: true, // proof key for code exchange
          issuer: appConfig.oidc.issuer,
          scopes: appConfig.oidc.scopes
        }
      });
   }

  ngOnInit(): void {
    // remove any previous elements
   
    this.oktaSignin.remove();

    // match the html div id
    this.oktaSignin.renderEl({
      el: '#okta-sign-in-widget'},
      (response) => {
        if (response.status === 'SUCCESS') {
          this.oktaAuth.signInWithRedirect();
        }
      },
      (error) => {
        throw error;
      }
    );
  }

}
