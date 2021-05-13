import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  currentCategory: string = "Books";
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // properties for pagination
  thePageNumber: number = 1;
	thePageSize: number = 5;
  theTotalElements: number = 0;


  constructor(private productService: ProductService,
          private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
        this.listProducts();
    } )
  }

  listProducts() {
     this.searchMode = this.route.snapshot.paramMap.has('keyword');

     if(this.searchMode) {
        this.handleSearchProducts();
     } else {
       this.handleListProducts();
     }
    
  }
    handleListProducts() {
        //chek if "id" parameter is availabe
        const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

        if(hasCategoryId) {
          //get the "id" param string. Convert string to number using "+"
          this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
          this.currentCategory = this.route.snapshot.paramMap.get('name');

        } else {
          // set a default value
          this.currentCategoryId = 1;
          this.currentCategory = 'Books'
        }
        
        /* Check if category has changed. 
           Angular will reuse a component if it is currently being viewed
        */

        /* If category id is different than the previos one, 
           reset thePageNumber back to 1
        */
        if(this.previousCategoryId != this.currentCategoryId) {
            this.thePageNumber = 1;
        }

        this.previousCategoryId = this.currentCategoryId;
        console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

        this.productService.getProductListPaginate(this.thePageNumber - 1, 
                                                   this.thePageSize, 
                                                   this.currentCategoryId)
                                                   .subscribe(this.processResult())
        
    
        // get the products for the given category id
        // this.productService.getProductList(this.currentCategoryId).subscribe(
        //   data => {
        //     this.products = data; // assign the returned data to local variable array
        //   }
        // )
    }
    

    handleSearchProducts() {
         const theKeyWord: string = this.route.snapshot.paramMap.get('keyword');

         this.productService.searchProducts(theKeyWord).subscribe(
            data => {
                this.products = data;
            }
         )
    }

    processResult() {
      return data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1; // angular is one-based
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    }

    updatePageSize(value: number) {
        this.thePageSize = value;
        this.thePageNumber = 1;
        this.listProducts();
    }
}
