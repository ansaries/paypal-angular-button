import bodyParser from 'body-parser';
import ipn from 'paypal-ipn';
import { Picker } from 'meteor/meteorhacks:picker';
import { Async } from 'meteor/meteorhacks:async';
import { Payments } from './collections';


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

