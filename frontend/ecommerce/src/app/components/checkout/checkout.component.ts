import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkcoutFormGroup: FormGroup;

  constructor() { }

  ngOnInit(): void {
    // this.checkcoutFormGroup = this.formBuilder.group({
    //     customer: this.formBuilder.group({
    //       firstName: [''],
    //       lastName: [''],
    //       email: ['']
    //     })
    // });
  }

  
}
