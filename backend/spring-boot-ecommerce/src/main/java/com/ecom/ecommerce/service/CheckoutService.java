package com.ecom.ecommerce.service;

import com.ecom.ecommerce.dto.Purchase;
import com.ecom.ecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    // pass in a purchase, return a purchase response
    PurchaseResponse placeOrder(Purchase purchase);
}
