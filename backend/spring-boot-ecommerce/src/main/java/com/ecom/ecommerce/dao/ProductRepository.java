package com.ecom.ecommerce.dao;

import com.ecom.ecommerce.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;

// specify entity type(Product) and entity's primary key type (Long)
// accept calls from web browser scripts from this origin
@CrossOrigin("http://localhost:4200")
public interface ProductRepository extends JpaRepository<Product, Long> {
}
