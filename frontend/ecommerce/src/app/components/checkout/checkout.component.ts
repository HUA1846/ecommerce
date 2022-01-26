import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { MyValidators } from 'src/app/validators/my-validators';

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
          firstName: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.whiteSpaceOnly]),
          lastName: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.whiteSpaceOnly]),
          email: new FormControl('', [Validators.required, 
                                      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
        }),
        shippingAddress: this.formBuilder.group({
          street: new FormControl('', [Validators.required, Validators.minLength(5), MyValidators.whiteSpaceOnly]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.whiteSpaceOnly]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{5}(?:-\d{4})?)?$/)]),
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

    // Form validation. Touching all groups triiggers the display of error messages for all
    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

    console.log(this.checkoutFormGroup.get('customer').value.email);
    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);
  }
  
  // getter methods are for html templates to access the form control
  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get street() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get city() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get state() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get country() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get zipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }


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
