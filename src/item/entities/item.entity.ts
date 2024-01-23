import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('items')
export class Item {
  @PrimaryColumn()
  id: number;
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column()
  price: number;
}
