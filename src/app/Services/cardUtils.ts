import { CreditCard, Address } from "../app.models";

export default class CardUtils {
    static getCardType(card: CreditCard): string {
      if (card.cardNumber && card.cardNumber.length > 1) {
         const firstDigit: string = card.cardNumber.substring(0, 1);
         if (firstDigit === '3') {
            return 'Amex';
         } else if (firstDigit === '4') {
            return 'Visa';
         } else if (firstDigit === '5') {
            return 'MasterCard';
         } else if (firstDigit === '6') {
            return 'Discover';
         }
      }
      return '';
   }

   static getCardTypeIndex(cardType: string): string {
      if ( cardType !== undefined && cardType !== null) {
         if (cardType === 'Amex') {
            return '3';
         } else if (cardType === 'Visa') {
            return '4';
         } else if (cardType === 'MasterCard') {
            return '5';
         } else if (cardType === 'Discover') {
            return '6';
         }
      }
      return '';
   }

   static getAddressTypes(): any[] {
      return [
         { id: 1, name: 'Shipping address' },
         { id: 2, name: 'Billing address' }
      ];

   }
}