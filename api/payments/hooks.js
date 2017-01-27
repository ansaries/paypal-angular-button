import { Meteor } from 'meteor/meteor';
import { Payments, Products } from './collections';


if (Meteor.isServer) {
  // ///////// Payments ///////////////
  // Need meteor add matb33:collection-hooks for below.
  Payments.after.insert(function (userId, doc) {
    try {
      Products.update(doc.itemNumber, { $inc: { sold: 1 } });
    } catch (err) {
      console.log(err);
    }
  });
}
