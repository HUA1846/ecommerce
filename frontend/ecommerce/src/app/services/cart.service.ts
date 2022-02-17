import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];
  totalPrice: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  totalQuantity: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  storage: Storage = localStorage;

  // does not persist data once the browser is closed
  // storage: Storage = sessionStorage; 

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if(data != null) {
      this.cartItems = data;
    }
    this.computeCartTotal();
  }

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

      this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity -= 1;
    if(theCartItem.quantity == 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotal();
    }
  }

  remove(theCartItem: CartItem) {
    const index = this.cartItems.findIndex(item => item.id == theCartItem.id);

    if(index > -1) {
      this.cartItems.splice(index, 1);
    }

    this.computeCartTotal();
  }
}
