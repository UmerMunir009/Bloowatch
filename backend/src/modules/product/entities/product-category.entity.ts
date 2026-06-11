import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn } from 'typeorm';
import { Product } from './product.entity';
import { Category } from '../../category/entities/category.entity';

@Entity('product_categories')
export class ProductCategory {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Product, product => product.productCategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ name: 'product_id', type: 'uuid' })
    productId: string;

    @ManyToOne(() => Category, category => category.productCategories, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ name: 'category_id', type: 'uuid' })
    categoryId: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;
}