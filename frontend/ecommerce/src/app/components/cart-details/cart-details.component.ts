import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

    cartItems: CartItem[] = [];
    totalPrice: number = 0;
    totalQuantity: number = 0;

    constructor(private cartService : CartService) { }

    ngOnInit(): void {
      this.listCartDetails();
    }

    listCartDetails() {

      // get the cart items from cartService
      this.cartItems = this.cartService.cartItems;

      // subscribe to the cart totalPrice
      this.cartService.totalPrice.subscribe(
          data => this.totalPrice = data
      );

      // subscribe to the cart totalQuantity
      this.cartService.totalQuantity.subscribe(
          data => this.totalQuantity = data
      )

      // compute total price and quantity
      this.cartService.computeCartTotal();

    }

    // increment item quantity from the cart
    incrementQuantity(theCartItem: CartItem) {
      this.cartService.addToCart(theCartItem);
    }

    // decrement item quantity from the cart
    decrementQuantity(theCartItem: CartItem) {
      this.cartService.decrementQuantity(theCartItem);
    }

    remove(theCartItem: CartItem) {
      this.cartService.remove(theCartItem);
    }
}
