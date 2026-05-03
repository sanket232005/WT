import { Component } from '@angular/core';

import { StudentProfileComponent }
from './student-profile/student-profile';

@Component({
selector:'app-root',
standalone:true,

imports:[
StudentProfileComponent
],

template:`
<app-student-profile>
</app-student-profile>
`
})

export class AppComponent{

}