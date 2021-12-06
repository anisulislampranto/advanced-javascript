import React, { useEffect, useState } from 'react';
import {PaymentElement, CardElement,useStripe,useElements} from '@stripe/react-stripe-js';
import Sidebar from '../../Dashboard/Sidebar/Sidebar';

const PaymentForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [title, setTitle] = useState('');
    const [success, setSuccess]= useState('');
    const [paymentError, setPaymentError] = useState(null)
    const [paymentSuccess, setPaymentSuccess] =  useState(null)
    
    const stripe = useStripe();
    const elements = useElements();



    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);

        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            // console.log('[error]', error);
            setPaymentError(error.message)
            setPaymentSuccess('')
        } else {
            // console.log('[PaymentMethod]', paymentMethod);
            // alert('Payment success')
            setPaymentSuccess(paymentMethod)
            setPaymentError('')
        }


        const formData = new FormData();
        formData.append('name', name)
        formData.append('email', email)
        formData.append('title', title)

    }

  
    return (


        <div className='contianer-fluid row'>
            <div className="col-md-2 sidebar">
              <Sidebar />
            </div>

            <div className="col-md-10" style={{position: 'absolute', right:0}}>

                <h1>Book Service</h1>
                <form onSubmit={handleSubmit} className="w-50">
                    
                    <div className="form-group">
                        <label for="exampleInputName1"> Name </label>
                        <input onBlur={e => setName(e.target.value)} type="text" name="name" className="form-control"  placeholder="Enter Your Name" />
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1"> Email</label>
                        <input onBlur={e => setEmail(e.target.value)} type="text" name="email" className="form-control"  placeholder="Enter Your Email" />
                    </div>

                    <div className="form-group">
                        <label for="exampleInputEmail1"> Service title </label>
                        <input onBlur={e => setTitle(e.target.value)} type="text" name="title" className="form-control"  placeholder="Enter Service Title" />
                    </div>
                    

                    {/* <button type="submit" class="btn btn-primary my-3">Submit</button> */}
                    <CardElement />
                    <button className="mt-5 btn btn-primary" type="submit" disabled={!stripe}> Pay & Checkout </button>

                </form>
                {success && <p style={{ color: 'green' }}>{success}</p>}              
                {paymentError && <p className='text-danger'>{paymentError}</p>}
                {paymentSuccess && <p className='text-primary '>payment success</p>}

            </div>

        </div>

        

    );
};

export default PaymentForm;