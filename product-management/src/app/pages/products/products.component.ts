import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error = '';

  constructor(private api: ProductService, private router: Router) {}

  ngOnInit(): void { this.fetch(); }

  fetch() {
    this.loading = true;
    this.api.list().subscribe({
      next: (data) => { this.products = data; this.loading = false; },
      error: () => { this.error = '加载失败'; this.loading = false; }
    });
  }

  goAdd() { this.router.navigate(['/add']); }

  goEdit(p: Product) {
    if (p._id) this.router.navigate(['/update', String(p._id).trim()]);
}

  remove(p: Product) {
    if (!p._id) return;
    if (!confirm(`Are you sure to delete ${p.name}？`)) return;
    this.api.remove(p._id).subscribe({
      next: () => this.fetch(),
      error: () => alert('failed to delete')
    });
  }
}