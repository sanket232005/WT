import { Component } from '@angular/core';

@Component({
selector:'app-student-profile',
standalone:true,
templateUrl:'./student-profile.html',
styleUrl:'./student-profile.css'
})

export class StudentProfileComponent{

studentName='Divya';

course='AIML';

profileImage=
'https://via.placeholder.com/150';

changeImage(){

this.profileImage=
'https://via.placeholder.com/200';

}

}
