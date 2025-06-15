export enum PaymentMethod {
  creditCard = 'CreditCard',
  kakao = 'Kakao',
}
export class PaymentEntity {
  paymentId: string;
  paymentMethod: PaymentMethod;
  paymentName: string;
  amount: number;

  constructor(param: PaymentEntity) {
    this.paymentId = param.paymentId;
    this.paymentMethod = param.paymentMethod;
    this.paymentName = param.paymentName;
    this.amount = param.amount;
  }
}
