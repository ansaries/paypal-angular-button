import { Meteor } from 'meteor/meteor';
import { Products } from './api/payments';
import './api/payments';

if(Meteor.isServer) {
    Meteor.startup(() => {
        if (Products.find().count() === 0) {
            const products = [
            {
                itemName: 'Product A',
                price: 100,
                active: true,
                offer: true,
                offerDescription: 'Luxuary Product and its description',
                features: [
                'free customer support',
                'free business page',
                'free pictures upload',
                ],
            },
            {
                itemName: 'Product B',
                price: 450,
                active: true,
                offer: true,
                offerDescription: 'Luxuary Product and its description',
                features: [
                'free customer support',
                'free business page',
                'free pictures upload',
                ],
            },
            {
                itemName: 'Product C',
                price: 450,
                active: true,
                offer: true,
                offerDescription: 'Luxuary Product and its description',
                features: [
                'free customer support',
                'free business page',
                'free pictures upload',
                ],
            },

            ];

            products.forEach((product) => {
            Products.insert(product);
            });
        }

    });
}