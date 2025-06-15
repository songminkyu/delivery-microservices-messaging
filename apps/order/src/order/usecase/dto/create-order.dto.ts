import { PaymentMethod } from '../../domain/payment.entity';

export interface CreateOrderDto {
  userId: string;
  productIds: string[];
  address: AddressDto;
  payment: PaymentDto;
}
export interface AddressDto {
  name: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}
export interface PaymentDto {
  paymentMethod: PaymentMethod;
  paymentName: string;
  cardNumber: string;
  expiryYear: string;
  expiryMonth: string;
  birthOrRegistration: string;
  passwordTwoDigits: string;
  amount: number;
}
