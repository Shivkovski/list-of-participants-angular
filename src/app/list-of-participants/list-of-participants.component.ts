import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list-of-participants',
  templateUrl: './list-of-participants.component.html',
  styleUrls: ['./list-of-participants.component.css']
})
export class ListOfParticipantsComponent implements OnInit {
  ngOnInit(): void {
    let activeNavbarItems: any = document.querySelectorAll('.navbarLinks')
    for (let id = 0;id<activeNavbarItems.length;id++){
      if (location.href==activeNavbarItems[id]){
        activeNavbarItems[id].classList.add('active', 'disabled')
      } else {
        activeNavbarItems[id].classList.remove('active', 'disabled')
      };
    };
    const members = document.getElementById('participants') as HTMLInputElement;
    const myStorage: Storage = localStorage;
    if (myStorage.getItem('members')?.length! > 0){
      let membersStorage = JSON.parse(myStorage.getItem('members')!);
      for(let id=0;id<membersStorage.length!;id++){
        let firstName = membersStorage[id]['firstName'];
        let lastName = membersStorage[id]['lastName'];
        let birthdate = this.birthdateTransfer(membersStorage[id]['birthdate']);
        let email = membersStorage[id]['email'];
        let country = membersStorage[id]['country'];
        let phone = membersStorage[id]['phone'];
        let report = membersStorage[id]['report'];

        let company
        let position

        if(membersStorage[id]['company']){
          company = membersStorage[id]['company']
        };
        if(membersStorage[id]['position']){
          position = membersStorage[id]['position']
        };

        let fullName = firstName + " " + lastName;

        let member = `Name: ${fullName},
birthdate: ${birthdate},
report subject: ${report},
country: ${country}, phone number: ${phone},
email: ${email}`

        if(company){member += `,\ncompany: ${company}`};
        if(position){member += `, position: ${position}`};

        console.log(member);

        var li = document.createElement('li');
        li.appendChild(document.createTextNode(member));
        li.setAttribute('class', 'list-group-item');
        members.appendChild(li);
      };
    } else {
      var li = document.createElement('li');
      li.appendChild(document.createTextNode('This list is empty.'));
      li.setAttribute('class', 'list-group-item');
      members.appendChild(li);
    };
  };

  public birthdateTransfer(obj: any) {
    let date = new Date(obj)
    let dateStrMonth = date.getMonth() + 1;
    let dateStrDay = date.getDate();
    let dateStrYear = date.getFullYear();

    let dateStr = dateStrDay + " " + dateStrMonth + " " + dateStrYear;
    return dateStr;
  };
}
