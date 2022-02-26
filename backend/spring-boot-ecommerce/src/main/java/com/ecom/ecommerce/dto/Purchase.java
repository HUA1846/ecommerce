package com.ecom.ecommerce.dto; // data transfer object

import com.ecom.ecommerce.entity.*;
import java.util.Set;
import lombok.Data; // Generates getters for all fields

@Data
public class Purchase {
    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
