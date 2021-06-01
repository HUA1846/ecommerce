import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];
  countries: Country[] = [];
  shippingStates: State[] = [];
  billingStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService) { }

  ngOnInit(): void {
    const startMonth: number = new Date().getMonth() + 1;

    this.checkoutFormGroup = this.formBuilder.group({
        customer: this.formBuilder.group({
          firstName: [''],
          lastName: [''],
          email: ['']    
        }),
        shippingAddress: this.formBuilder.group({
          street: [''],
          city: [''],
          state: [''],
          country: [''],
          zipCode: ['']
        }),
        billingAddress: this.formBuilder.group({
          street: [''],
          city: [''],
          state: [''],
          country: [''],
          zipCode: ['']
        }),
        creditCard: this.formBuilder.group({
          cardType: [''],
          nameOnCard: [''],
          cardNumber: [''],
          securityCode: [''],
          expirationMonth: [''],
          expirationYear: ['']
        })
    });

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
       data => {
         console.log("Retrieved credit card months: " + JSON.stringify(data));
         this.creditCardMonths = data;
       }
    )

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    )

    this.shopFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    )
  }

  onSubmit() {
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value.email);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }
  
  copyAddressToBilling(event) {
    if(event.target.checked) {
      this.checkoutFormGroup.controls.billingAddress
            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
      this.billingStates = this.shippingStates;
    }
    else {
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingStates = [];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear)

    // if the current year equals the selected year, the start with current month
    let startMonth: number;
    if(currentYear === selectedYear) {
       startMonth = new Date().getMonth() + 1;
    } else {
       startMonth = 1;
    }

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
   )
  }

  getStates(formGroupName: string) {
      const formGroup = this.checkoutFormGroup.get(formGroupName);
      const countryCode = formGroup.value.country.code;
      const countryName = formGroup.value.country.name;

      console.log(`${formGroupName} country code: ${countryCode}`);
      console.log(`${formGroupName} country name: ${countryName}`);

      this.shopFormService.getStates(countryCode).subscribe(
          data => {
             if(formGroupName === 'shippingAddress') {
               this.shippingStates = data;
             } 
             else {
               this.billingStates = data;
             }

             // set the first state as default
             formGroup.get('state').setValue(data[0]);
          }
      );
  }
}
