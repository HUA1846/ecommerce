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

  // pagination
  searchProductPaginate(thePage: number, 
    thePageSize: number, keyword): Observable<GetResponseProducts> {
      const searchUrl = `${this.baseUrl}/search/findByNameContaining` +
      `?name=${keyword}&page=${thePage}&size=${thePageSize}`;

      return this.httpClient.get<GetResponseProducts>(searchUrl);
    }
  
  getProductListPaginate(thePage: number, thePageSize: number,
      theCategoryId: number): Observable<GetResponseProducts> {
      // build url based on category id, page, and size
      const url = `${this.baseUrl}/search/findByCategoryId` +
                  `?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`;
      return this.httpClient.get<GetResponseProducts>(url);
  }

  // product details
  getProductDetails(productId: number): Observable<Product> {
      const productUrl = `${this.baseUrl}/${productId}`;
      return this.httpClient.get<Product>(productUrl);
  }

  // invoked in product-list component by calling subscribe()
  getProductList(categoryId: number): Observable<Product[]> {
    // build url based on categroy id
      const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${categoryId}`;

      return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]> {

      return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
        map(response => response._embedded.productCategory));
  }

  searchProducts(keyword: string): Observable<Product[]> {
      const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}`;
      return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
      return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
        map(response => response._embedded.products));
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[]; // get an array of products
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number 
 }
}

interface GetResponseProductCategory {
  // - unwrap the JSON from Spring Data REST _embedded entry
 _embedded: {
   productCategory: ProductCategory[];
 }
}
