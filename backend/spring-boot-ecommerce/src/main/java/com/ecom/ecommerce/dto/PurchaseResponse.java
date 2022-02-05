package com.ecom.ecommerce.dto;

import lombok.Data;
import lombok.NonNull;

@Data
public class PurchaseResponse {

    // has to be final field for lombok gette to work
    // or add @NonNull
    @NonNull
    private String orderTrackingNumber;
}
