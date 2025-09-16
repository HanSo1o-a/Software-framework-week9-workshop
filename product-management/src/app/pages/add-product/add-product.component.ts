import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-product.component.html',
})
export class AddProductComponent {
  model: Product = { id: 0, name: '', description: '', price: 0, units: 0 };
  saving = false;
  error = '';

  constructor(private api: ProductService, private router: Router) {}

  submit() {
    this.saving = true;
    this.api.add(this.model).subscribe({
      next: () => this.router.navigate(['/products']),
      error: (e) => { this.error = e?.error?.message || '添加失败'; this.saving = false; }
    });
  }
}
