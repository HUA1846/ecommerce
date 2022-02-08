import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
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
              private shopFormService: ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) {}

  ngOnInit(): void {
    this.listCheckoutDetails();

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
          zipCode: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{5}(?:-\d{4})?)?$/)])
        }),
        billingAddress: this.formBuilder.group({
          street: new FormControl('', [Validators.required, Validators.minLength(5), MyValidators.whiteSpaceOnly]),
          city: new FormControl('', [Validators.required, Validators.minLength(2), MyValidators.whiteSpaceOnly]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.pattern(/^(?:\d{5}(?:-\d{4})?)?$/)])
        }),
        creditCard: this.formBuilder.group({
          cardType: new FormControl('', [Validators.required]),
          nameOnCard: new FormControl('', [Validators.required, MyValidators.whiteSpaceOnly]),
          cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
          securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
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

    // Form validation. Touching all groups triiggers the display of error messages for all
    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cartItems from cartService
    // add cartItems to Order (orderItems)
    const cartItems = this.cartService.cartItems;
    let orderItems: OrderItem[] = cartItems.map(cartItem => new OrderItem(cartItem));

    // get all fields that purchase required:
    // customer, shipping/billing address, order, orderitems
    let purchase = new Purchase();

    // Purchase - address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;
    console.log(purchase.shippingAddress.state);

    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
    
    // Purchase - Customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // Purchase - Order
    purchase.order = order;

    // Purchase - OrderItems
    purchase.orderItems = orderItems;

    // call REST api via the checkoutService
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`We received your order.\nYour order tracking number is\n ${response.orderTrackingNumber}`);
        this.resetCart();
      },
      error: err => {
        alert(`Something went wrong. We can't process your order. Error: ${err.message}`)
      }
    });
  }
  resetCart() {
    // reset cartService
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    // reset the checkout form
    this.checkoutFormGroup.reset();

    // navigate back to product page
    this.router.navigateByUrl('/products');
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
  get billingStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType')}
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard')}
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber')}
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode')}

  listCheckoutDetails() {
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

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
