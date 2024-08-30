import { Component, Input } from '@angular/core';
import { LoginService } from '../service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

  @Input() name: any;
  fullName: string = '';
  firstletter = '';

  constructor(private reg: LoginService, private router: Router) {}
  capitalizeFirstLetter(inputString: string): string {
    return inputString.charAt(0).toUpperCase() + inputString.slice(1);
  }

  ngOnInit() {
    this.fullName = this.capitalizeFirstLetter(this.reg.getname());
    this.firstletter = this.fullName.charAt(0);

  }
  goBack(){
    this.router.navigate(["dashboard"])
  }
}
