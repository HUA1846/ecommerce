import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

      let existInCart: boolean = false;
      let existingItem: CartItem = undefined;


      existingItem = this.cartItems.find(item => item.id === theCartItem.id);
      if(existingItem !== undefined) {
        existInCart = true;
      }

      if(existInCart) {
        existingItem.quantity += 1;
      } else {
        this.cartItems.push(theCartItem);
      }

      this.computeCartTotal();
  }

  computeCartTotal() {
      let totalPriceValue = 0;
      let totalQuantityValue = 0;
      for(let item of this.cartItems) {
        totalPriceValue += item.unitPrice * item.quantity;
        totalQuantityValue += item.quantity;
      }
    
    /* publish new values, all subscribers will receive the new data.
       .next(...) - publish/send event
    */
      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);
  }
}
