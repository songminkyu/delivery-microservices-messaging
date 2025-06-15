export interface NetworkOutputPort {
  sendNotification(orderId: string, to: string): void;
}