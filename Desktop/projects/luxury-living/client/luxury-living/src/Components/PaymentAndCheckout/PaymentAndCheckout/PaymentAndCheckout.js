import React from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';
import PaymentAndCheckoutFrom from '../PaymentAndCheckoutFrom/PaymentAndCheckoutFrom';

const stripePromise = loadStripe('pk_test_51JniR4CjFfDBPmGGYxs2NouOcvsS2OaXkJ9JPd75UOJQGPFvAaiVMsXuRpyrXMFyaKhRf8fm7BOQlywMZEvRZP1B00SHpviol7');

const Payment = () => {

    
    return (
        <div>
            <Elements stripe={stripePromise}>
                <PaymentAndCheckoutFrom />
            </Elements>
            
        </div>
    );
};

export default Payment;