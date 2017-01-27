// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by paypal-angular-button.js.
import { name as packageName } from "meteor/arslan:paypal-angular-button";

// Write your tests here!
// Here is an example.
Tinytest.add('paypal-angular-button - example', function (test) {
  test.equal(packageName, "paypal-angular-button");
});
