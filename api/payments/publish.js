import { Meteor } from 'meteor/meteor';
import { Products, Payments } from './collections';
import { check } from 'meteor/check';
import { Counts } from 'meteor/tmeasday:publish-counts';

if (Meteor.isServer) {
  Meteor.publish('products', function () {
    return Products.find({
      active: true,
    });
  });
  Meteor.publish('transactions', function (options) {
    check(options, Object);
    const where = {
      userId: this.userId,
    };
    Counts.publish(this, 'numberOfTransactions', Payments.find(where), {
      noReady: true,
    });
    return Payments.find(where, options);
  });
}