import { PaymentDocument } from '../document/payment.document';
import { PaymentModel } from '../../../../domain/payment.domain';
export class PaymentDocumentMapper {
  constructor(private readonly document: PaymentDocument) {}

  toDomain() {
    const model = new PaymentModel({
      paymentMethod: this.document.paymentMethod,
      cardNumber: this.document.cardNumber,
      expiryYear: this.document.expiryYear,
      expiryMonth: this.document.expiryMonth,
      birthOrRegistration: this.document.birthOrRegistration,
      passwordTwoDigits: this.document.passwordTwoDigits,
      amount: this.document.amount,
      userEmail: this.document.userEmail,
      orderId: this.document.orderId,
    });
    model.assignId(this.document._id.toString());
    return model;
  }
  toPaymentQueryMicroservicePayload() {
    // userEmail: string;
    // amount: number;
    // paymentStatus: PaymentStatus;
    // cardNumberLastFourDigits: string;
    return {
      _id: this.document._id,
      userEmail: this.document.userEmail,
      amount: this.document.amount,
      paymentStatus: this.document.paymentStatus,
      cardNumberLastFourDigits: this.document.cardNumber.slice(-4),
      orderId: this.document.orderId,
    };
  }
}
