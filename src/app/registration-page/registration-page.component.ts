import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

import * as intlTelInput from 'intl-tel-input';

export class User {
  public firstName!: string;
  public lastName!: string;
  public birthdate!: Date;
  public email!: string;
  public country!: string;
  public phone!: string;
  public report!: string;
}

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit, OnChanges {
  public iti: any;
  public maxDate = new Date(Date.now() - 568036800000);
  public model = new User();
  public errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
  ngOnInit(): void {
    const phoneInputElement = document.getElementById('phone');
    const countryData = window.intlTelInputGlobals.getCountryData();
    const countryInputElement = document.getElementById('country');
    this.iti = intlTelInput(phoneInputElement!, {
      initialCountry: 'auto',
      separateDialCode: true,
      utilsScript: 'https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/18.1.8/js/utils.js',
      geoIpLookup: function(callback: any) {
        fetch('https://ipapi.co/json')
        .then(function(res) {return res.json();})
        .then(function(data) {callback(data.country_code);})
        .catch(function() {callback("ua");});
      },
    });

    for(let i = 0; i < countryData.length; i++) {
      const country = countryData[i];
      const optionNode = document.createElement('option');
      optionNode.value = country.iso2;
      const textNode = document.createTextNode(country.name);
      optionNode.appendChild(textNode);
      countryInputElement?.appendChild(optionNode);
    };

    let activeNavbarItems: any = document.querySelectorAll('.navbarLinks')
    for (let id = 0;id<activeNavbarItems.length;id++){
      if (location.href==activeNavbarItems[id]){
        activeNavbarItems[id].classList.add('active', 'disabled')
      } else {
        activeNavbarItems[id].classList.remove('active', 'disabled')
      };
    };

    document.querySelector('div.iti')?.setAttribute('style', 'width: 100%;');
  };
  ngOnChanges(changes: SimpleChanges): void {

  };

  public countryChangeSync() {
    const countryInputElement = document.getElementById('country');
    const countryElement = countryInputElement as HTMLInputElement;

    this.iti.setCountry(countryElement.value)
  };

  public numberChangeSync() {
    const countryInputElement = document.getElementById('country');
    const countryElement = countryInputElement as HTMLInputElement;

    countryElement.value = this.iti.getSelectedCountryData().iso2;
  };

  public numberErrorReset() {
    const errorMsg = document.getElementById('errorMsg') as HTMLInputElement;
    errorMsg.hidden = true;
  };

  public numberError() {
    const phoneInputElement = document.getElementById('phone') as HTMLInputElement;
    const errorMsg = document.getElementById('errorMsg') as HTMLInputElement;
    this.numberErrorReset();
    if (phoneInputElement.value.trim()) {
      if (this.iti.isValidNumber()) {

      } else {
        const errorCode = this.iti.getValidationError();
        errorMsg.innerHTML = this.errorMap[errorCode];
        errorMsg.hidden = false;
      }
    }
  }

}

