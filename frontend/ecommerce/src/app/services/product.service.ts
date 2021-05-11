import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // reactive javascript
import { Product } from '../common/product';
import { map } from 'rxjs/operators'; 
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) { }

  // invoked in product-list component by calling subscribe()
  getProductList(categoryId: number): Observable<Product[]> {
    // build url based on categroy id
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    )
  };
}

interface GetResponseProducts {
  _embedded: {
    products: Product[]; // get an array of products
  }
}

interface GetResponseProductCategory {
  // - unwrap the JSON from Spring Data REST _embedded entry
 _embedded: {
   productCategory: ProductCategory[];
 }
}
