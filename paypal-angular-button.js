// Write your package code here!

// Variables exported by this module can be imported by other packages and
// applications. See paypal-angular-button-tests.js for an example of importing.
export const name = 'paypal-angular-button';

// /////////////////// Modules /////////////////////
import angular from 'angular';
// ////////////// Templates /////////////////////////
import templateMain from './paypal-angular-button.html';

class PaypalButton {
  constructor($scope) {
    'ngInject';

    this.email = 'arslan-facilitator@fixonclick.com'; // your sandbox test account.
    this.returnUrl = this.returnUrl || 'https://www.yourdomain.com';

    
  }
}


const moduleName = 'paypalButton'; // Change This with Component Name

export default angular
  .module(moduleName, [
  ])
  .component(name, {
    template: templateMain,
    controller: PaypalButton,
    controllerAs: moduleName,
    bindings: {
      itemName: '<',
      itemNumber: '<',
      user: '<',
      shoppingUrl: '<',
      returnUrl: '<',
      notifyUrl: '<',
      cancelUrl: '<',
      amount: '<',
      currency: '<',
      btnText: '<',
      btnClass: '@',
    },
  });
