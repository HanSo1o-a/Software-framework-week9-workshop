import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './update-product.component.html',
})
export class UpdateProductComponent implements OnInit {
  _id = '';
  model?: Product;
  loading = true;
  saving = false;
  error = '';

  constructor(private route: ActivatedRoute, private api: ProductService, private router: Router) {}

  ngOnInit(): void {
  this._id = (this.route.snapshot.paramMap.get('id') || '').trim();
  this.api.getById(this._id).subscribe({
    next: (p) => { console.log('✅ got one:', p); this.model = p; this.loading = false; },
    error: () => { this.error = '加载失败'; this.loading = false; }
  });
}

  submit() {
    if (!this.model) return;
    this.saving = true;
    const { _id, ...payload } = this.model; // 不把 _id 传回去
    this.api.update(this._id, payload).subscribe({
      next: () => this.router.navigate(['/products']),
      error: () => { this.error = '更新失败'; this.saving = false; }
    });
  }
}