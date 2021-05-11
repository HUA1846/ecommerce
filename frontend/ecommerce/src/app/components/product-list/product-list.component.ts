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

  products: Product[];
  currentCategoryId: number;
  constructor(private productService: ProductService,
          private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
        this.listProducts();
    } )
  }

  listProducts() {
    //chek if "id" parameter is availabe
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      //get the "id" param string. Convert string to number using "+"
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    } else {
      // set a default value
      this.currentCategoryId = 1;
    }

      // get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data; // assign the returned data to local variable array
      }
    )
  }

}
