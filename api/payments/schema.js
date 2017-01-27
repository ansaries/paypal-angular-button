import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Payments, Products } from './collections';

export let Schema;

Schema = {};

Schema.Payments = new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  paidAt: {
    type: Date,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();  // Prevent user from supplying their own value
    },
  },
  amount: {
    type: Number,
    decimal: true,
  },
  transactionId: {
    type: String,
  },
  type: {
    type: String,
    allowedValues: ['credit', 'debit'],
  },
  itemName: {
    type: String,
  },
  itemNumber: {
    type: String,
  },
  payerEmail: {
    type: String,
    optional: true,
  },
  paymentMethod: {
    type: String,
    allowedValues: ['paypal', 'swipe'],
  },
});

Schema.Products = new SimpleSchema({
  price: {
    type: Number,
    decimal: true,
  },
  itemName: {
    type: String,
  },
  active: {
    type: Boolean,
  },
  offer: {
    type: Boolean,
  },
  offerDescription: {
    type: String,
    optional: true,
  },
  features: {
    type: [String],
    optional: true,
  },
  sold: {
    type: Number,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return 0;
      } else if (this.isUpsert) {
        return { $setOnInsert: 0 };
      }
      return this.value || this.unset();
    },
  },
  createdAt: {
    type: Date,
    optional: true,
    autoValue() {
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
      this.unset();  // Prevent user from supplying their own value
    },
  },
  updatedAt: {
    type: Date,
    autoValue() {
      if (this.isUpdate) {
        return new Date();
      }
    },
    denyInsert: true,
    optional: true,
  },
});


Payments.attachSchema(Schema.Payments);
Products.attachSchema(Schema.Products);