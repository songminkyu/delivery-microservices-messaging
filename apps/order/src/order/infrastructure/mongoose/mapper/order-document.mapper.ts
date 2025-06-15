import { OrderDocument } from '../entity/order.entity';
import { OrderEntity } from '../../../domain/order.entity';

export class OrderDocumentMapper {
  constructor(private readonly document: OrderDocument) {}
  toDomain(): OrderEntity {
    const order = new OrderEntity({
      customer: this.document.customer,
      products: this.document.products,
      deliveryAddress: this.document.deliveryAddress,
    });

    order.setId(this.document._id.toString());
    order.setPayment(this.document.payment);
    return order;
  }
}
