# Angular Meteor Paypal
This package implements only the paypal html button method.


## To install
From your Meteor project directory:
```sh
$ meteor add arslan:angular-paypal-button
```
## Basic Usage

##### Client side
How to implement a simple paypal button in your template :
```html
    <paypal-button 
        user="$ctrl.user"
        item-name="$ctrl.product.itemName"
        item-number = "$ctrl.product._id"
        shoppingUrl = "https://www.yourdomain.com/store"
        returnUrl = "https://www.yourdomain.com/thankyou"
        notify-url="'https://www.yourdomain.com/paypalcallback'"
        cancelUrl = "https://www.yourdomain.com/store"
        amount="$ctrl.product.price"
        currency="'USD'"
        btn-text="'Buy Now'"
        btn-class="your-custom-button-class">
    </paypal-button>
```
This is it ! Now you will need to create some routing for:
* Return url
* Notify url | For : **Server Side**
* Cancel url
* Shopping url

## Walkthrough
For this example we will use __picker__ for server side route handling :
```sh
$ meteor add meteorhacks:picker
```
We will create a backend route for the notify url.
```js
import bodyParser from 'body-parser';

var postRoutes = Picker.filter(function(req, res) {
    return req.method == "POST";
});

Picker.middleware( bodyParser.json() );
Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

postRoutes.route('/paypalcallback', function(params, request, response, next) {

    PaypalReturn = request.body;

    response.setHeader( 'Content-Type', 'application/json' );
    response.statusCode = 200;
    response.end(JSON.stringify(PaypalReturn));

});
```
Now you got a response from paypal with the transaction data in PaypalReturn obj, if you want to verify PayPal IPN messages, you will need to require paypal-ipn.
```sh
$ meteor npm install paypal-ipn --save
```
Once done your server code will become :
```js
import bodyParser from 'body-parser';
import ipn from 'paypal-ipn';
import { Picker } from 'meteor/meteorhacks:picker';
import { Async } from 'meteor/meteorhacks:async';
import { Payments } from './api/payments';


function handlePayment(paypalReturn) {
  const payment = {
      _id = paypalReturn.txn_id,
      userId = paypalReturn.custom, // I sent the userId in it from the HTML button component.
      amount = Number(paypalReturn.mc_gross),
      transactionId = paypalReturn.txn_id,   
      itemName = paypalReturn.item_name,
      itemNumber = paypalReturn.item_number, // I sent the product_id in it.
      payerEmail = paypalReturn.payer_email,
      paymentMethod = 'paypal',
  };
  const alreadyPaid = Payments.findOne(payment._id); 

  if (payment.amount > 0 && !alreadyPaid) { // ignore duplicate calls from paypal.
    //Try the code block, as i have implemented Payments.after.insert() hook, which may throw an exception.
    //You can also insert without try/catch block.
    try {     
      Payments.insert(payment);
    } catch(err) {
      console.log(`Error in saving payment id(${payment.transactionId}): `, err);
    }
  }
  console.log('payment done, for txnID: ', payment.transactionId);
}


var postRoutes = Picker.filter(function(req, res) {
    return req.method == "POST";
});

Picker.middleware( bodyParser.json() );
Picker.middleware( bodyParser.urlencoded( { extended: false } ) );

postRoutes.route('/paypalcallback', function(params, request, response, next) {

    PaypalReturn = request.body;

    response.setHeader( 'Content-Type', 'application/json' );
    response.statusCode = 200;

    ipn.verify(PaypalReturn, {'allow_sandbox': true}, function callback(err, mes) {
        if(mes === 'VERIFIED'){
            //For more information on PaypalReturn object
            //Visit https://developer.paypal.com/docs/classic/paypal-payments-standard/integration-guide/Appx_websitestandard_htmlvariables/
            handlePayment(PaypalReturn);
        }
    });
    // call response.end(), otherwise paypal will keep on posting the data on the notify_url.
    // which may create duplicate transactions, though i handled the duplicate check in the handle payment.
    response.end(); 
    
});

```

## Credits
This package uses Open Source components. You can find the source code of their open source projects along with license information below. We acknowledge and are grateful to these developers for their contributions to open source.

* ie76 : [Meteor Paypal](https://github.com/ie76/meteor-paypal)
* andzdroid : [PayPal IPN Verification](https://github.com/andzdroid/paypal-ipn)
* meteorhacks : [Picker - Server Side Router for Meteor](https://github.com/meteorhacks/picker)


License
----

MIT
