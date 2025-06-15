export enum PaymentStatus {
  pending = 'Pending',
  rejected = 'Rejected',
  approved = 'Approved',
}

export enum PaymentMethod {
  creditCard = 'CreditCard',
  kakao = 'Kakao',
}

export enum NotificationStatus {
  pending = 'pending',
  sent = 'sent',
}

export class PaymentModel {
  id: string;
  orderId: string;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrRegistration: string;
  passwordTwoDigits: string;
  notificationStatus: NotificationStatus;
  amount: number;
  userEmail: string;

  constructor(param: {
    paymentMethod: PaymentMethod;
    cardNumber: string;
    expiryYear: string;
    expiryMonth: string;
    birthOrRegistration: string;
    passwordTwoDigits: string;
    amount: number;
    userEmail: string;
    orderId: string;
  }) {
    this.paymentStatus = PaymentStatus.pending;
    this.notificationStatus = NotificationStatus.pending;
    this.paymentMethod = param.paymentMethod;
    this.cardNumber = param.cardNumber;
    this.expiryYear = param.expiryYear;
    this.expiryMonth = param.expiryMonth;
    this.birthOrRegistration = param.birthOrRegistration;
    this.passwordTwoDigits = param.passwordTwoDigits;
    this.amount = param.amount;
    this.userEmail = param.userEmail;
    this.orderId = param.orderId;
  }

  assignId(id: string) {
    this.id = id;
  }
  processPayment() {
    if (!this.id) {
      throw new Error('결제 ID가 없어서 결제를 처리할 수 없습니다.');
    }
    this.paymentStatus = PaymentStatus.approved;
  }
  rejectPayment() {
    if (!this.id) {
      throw new Error('결제 ID가 없어서 결제를 거절할 수 없습니다.');
    }
    this.paymentStatus = PaymentStatus.rejected;
  }
  sendNotification() {
    this.notificationStatus = NotificationStatus.sent;
  }
}
