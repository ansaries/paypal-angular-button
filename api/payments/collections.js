import { Mongo } from 'meteor/mongo';

export const Payments = new Mongo.Collection('pmt_transactions');
export const Products = new Mongo.Collection('products');

function notAllowed() {
  return false;
}

Payments.allow({
  insert: notAllowed,
  remove: notAllowed,
  update: notAllowed,
});
Products.allow({
  insert: notAllowed,
  remove: notAllowed,
  update: notAllowed,
});
