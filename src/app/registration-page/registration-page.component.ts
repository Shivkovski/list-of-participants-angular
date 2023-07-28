import { Component, OnInit } from '@angular/core';

import * as intlTelInput from 'intl-tel-input';

export class User {
  public firstName!: any;
  public lastName!: any;
  public birthdate!: any;
  public email!: any;
  public country!: any;
  public phone!: any;
  public report!: any;

  public company!: any;
  public position!: any;
}

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.css']
})
export class RegistrationPageComponent implements OnInit {
  public iti: any;
  public maxDate = new Date(Date.now() - 568036800000);
  public minDate = new Date(Date.now() - 2145872736000);
  public model = new User();
  public errorMap = ["Invalid number", "Invalid country code", "Too short", "Too long", "Invalid number"];
  public newMember: any = {};
  public myStorage: Storage = window.localStorage;
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

    this.model.country = (countryInputElement as HTMLInputElement).value;

    for(let i = 0; i < countryData.length; i++) {
      const country = countryData[i];
      const optionNode = document.createElement('option');
      optionNode.value = country.iso2;
      const textNode = document.createTextNode(country.name);
      optionNode.appendChild(textNode);
      countryInputElement?.appendChild(optionNode);
    };

    let activeNavbarItems: any = document.querySelectorAll('.navbarLinks');
    for (let id = 0;id<activeNavbarItems.length;id++){
      if (location.href==activeNavbarItems[id]){
        activeNavbarItems[id].classList.add('active', 'disabled');
      } else {
        activeNavbarItems[id].classList.remove('active', 'disabled');
      };
    };

    document.querySelector('div.iti')?.setAttribute('style', 'width: 100%;');

    if(this.myStorage.getItem('member')){
      let countryInput = (document.getElementById('country')) as HTMLInputElement;

      let member = JSON.parse(this.myStorage.getItem('member')!)
      console.log(member)

      this.model.firstName = member[0]['firstName'];
      this.model.lastName = member[0]['lastName'];
      this.model.birthdate = member[0]['birthdate'];
      this.model.email = member[0]['email'];
      countryInput.value = member[0]['country'];
      this.model.phone = member[0]['phone'];
      this.model.report = member[0]['report'];
      this.iti.setCountry(countryInput.value)
      if(member[0]['company']){
        this.model.company = member[0]['company'];
      }
      if(member[0]['position']){
        this.model.position = member[0]['position'];
      }
    }
  };

  public countryChangeSync() {
    const countryInputElement = document.getElementById('country');
    const countryElement = countryInputElement as HTMLInputElement;

    this.iti.setCountry(countryElement.value);
  };

  public numberChangeSync() {
    const countryInputElement = document.getElementById('country');
    const countryElement = countryInputElement as HTMLInputElement;

    countryElement.value = this.iti.getSelectedCountryData().iso2;
    this.model.country = countryElement.value;
  };

  public numberReset() {
    const alertMsg = document.getElementById('alertMsg') as HTMLInputElement;
    alertMsg.classList.remove('alert-success', 'alert-danger');
    alertMsg.hidden = true;
  };

  public numberError() {
    const phoneInputElement = document.getElementById('phone') as HTMLInputElement;
    const alertMsg = document.getElementById('alertMsg') as HTMLInputElement;
    this.numberReset();
    if (phoneInputElement.value.trim()) {
      if (this.iti.isValidNumber()) {
        alertMsg.innerText = "Success!";
        alertMsg.hidden = false;
        alertMsg.classList.add('alert-success');
      } else {
        const errorCode = this.iti.getValidationError();
        alertMsg.innerHTML = this.errorMap[errorCode];
        alertMsg.hidden = false;
        alertMsg.classList.add('alert-danger');
      };
      setInterval(this.numberReset, 5000);
    };
  };

  public switchParts() {
    const firstPart = document.getElementById('firstPart') as HTMLInputElement;
    const secondPart = document.getElementById('secondPart') as HTMLInputElement;
    const alertMsg = document.getElementById('alertMsg') as HTMLInputElement;
    this.numberReset();

    if (firstPart.hidden == false && secondPart.hidden == true) {
      this.checkFirstPart();
      if (this.checkFirstPart() == true) {
      firstPart.hidden = true;
      secondPart.hidden = false;
      } else {
        alertMsg.innerText = "Check all fields!"
        alertMsg.hidden = false;
        alertMsg.classList.add('alert-danger');
      };
    } else {
      firstPart.hidden = false;
      secondPart.hidden = true;
    };
  };

  public checkFirstPart() {
    if (this.model.firstName && this.model.lastName && this.model.email && this.model.birthdate && this.model.phone && this.model.country && this.model.report && this.iti.isValidNumber())
    {
      return true;
    } else {
      return false;
    };
  };

  public localStorageUpdate(obj: object){
    let members = [];
    if (localStorage.getItem('members') !== null){
      members = JSON.parse(this.myStorage.getItem('members')!);
    };
    members.push(obj);
    this.myStorage.setItem('members', JSON.stringify(members));
    this.myStorage.setItem('member', '')
  };

  public dataUpdate(){
    const firstPart = document.getElementById('firstPart') as HTMLInputElement;
    const secondPart = document.getElementById('secondPart') as HTMLInputElement;
    if(firstPart.hidden == false){
      this.newMember.firstName = this.model.firstName;
      this.newMember.lastName = this.model.lastName;
      this.newMember.birthdate = this.birthdateTransfer();
      this.newMember.email = this.model.email;
      this.newMember.country = this.model.country;
      this.newMember.phone = this.model.phone;
      this.newMember.report = this.model.report;
    } else if(secondPart.hidden == false){
      this.newMember.company = this.model.company;
      this.newMember.position = this.model.position;
    };

    let memberSave = [];
    memberSave.push(this.newMember);
    this.myStorage.setItem('member', JSON.stringify(memberSave));
  };

  public birthdateTransfer(){
    let date = new Date(this.model.birthdate)
    let dateStrMonth = date.getMonth() + 1;
    let dateStrDay = date.getDate();
    let dateStrYear = date.getFullYear();

    let dateStr = dateStrDay + " " + dateStrMonth + " " + dateStrYear;
    return dateStr;
  };

}

