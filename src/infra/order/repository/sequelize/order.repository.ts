
import Order from '../../../../domain/checkout/entity/order';
import OrderItem from '../../../../domain/checkout/entity/order_item';
import OrderRepositoryInterface from '../../../../domain/checkout/repository/order-repository.interface';
import OrderItemModel from './order-item.model';
import OrderModel from './order.model';


export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }

  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        customer_id: entity.customerId,
        total: entity.total()
      },
      {
        where: {
          id: entity.id,
        }
      }
    )

    const existingItems = await OrderItemModel.findAll({
      where: { order_id: entity.id },
    });

    const existingItemIds = existingItems.map((i) => i.id);
    const newItemIds = entity.items.map((i) => i.id);

    for (const item of entity.items) {
      if (existingItemIds.includes(item.id)) {
        await OrderItemModel.update(
          {
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
          },
          { where: { id: item.id } }
        );
      } else {
        await OrderItemModel.create({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
          order_id: entity.id,
        });
      }
    }

    const itemsToRemove = existingItemIds.filter(
      (id) => !newItemIds.includes(id)
    );

    if (itemsToRemove.length > 0) {
      await OrderItemModel.destroy({ where: { id: itemsToRemove } });
    }
  }

  async find(id: string): Promise<Order> {
    let orderModel

    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        include: [OrderItemModel],
        rejectOnEmpty: true
      });
    } catch (error) {
      throw new Error("Order not found");
    }

    const items = orderModel.items.map(
      (item) =>
        new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
    );

    return new Order(orderModel.id, orderModel.customer_id, items);
  }

  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({
      include: [OrderItemModel],
    });

    return orderModels.map((orderModel) => {
      const items = orderModel.items.map(
        (item) =>
          new OrderItem(item.id, item.name, item.price, item.product_id, item.quantity)
      );
      return new Order(orderModel.id, orderModel.customer_id, items);
    });

  }
}
