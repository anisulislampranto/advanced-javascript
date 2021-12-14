import React, { useContext, useEffect, useState } from 'react';
import { CardElement,useStripe,useElements} from '@stripe/react-stripe-js';
import Sidebar from '../../Dashboard/Sidebar/Sidebar';
import { useParams } from 'react-router';
import { UserContext } from '../../../App';

const PaymentAndCheckoutFrom = () => {
    const {serviceId} = useParams();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [success, setSuccess]= useState('');
    const [paymentError, setPaymentError] = useState(null);
    const [paymentSuccess, setPaymentSuccess] =  useState(null);
    const [serviceInfo, setServiceInfo] = useState({});
    const [loggedInUser] = useContext(UserContext);

    

    const stripe = useStripe();
    const elements = useElements();


    const handleSubmit = async (e) => {
        e.preventDefault();


        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('serviceName', serviceName);
        formData.append('servicePrice', serviceInfo.price);
        // formData.append('icon', serviceInfo.image); 
        formData.append('date', new Date());

            fetch('http://localhost:4040/addBooking', {
            method: 'POST',
            body: formData
            }).then(res => res.json())
            .then( data => {
                if(data && paymentSuccess) {
                    setSuccess('Your order has been succesfully placed')
                }
                else( setSuccess('Order Placed Without Payment. Please Try again with a valid payment Gateway.'))
            })

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

         
    }

    useEffect(()=>{
        fetch('http://localhost:4040/service/'+ serviceId )
        .then(res =>res.json())
        .then(data => setServiceInfo(data[0]))
    },[serviceId])

    console.log(serviceInfo);
    
    return (


        <div className='contianer-fluid row'>
            <div className="col-md-2 sidebar">
              <Sidebar />
            </div>

            <div className="col-md-10" style={{position: 'absolute', right:0}}>

                <h1>Book Service {loggedInUser.name}</h1>
                <form onSubmit={handleSubmit} className="w-50">
                    
                    <div className="form-group">
                        <label for="exampleInputName1"> Name </label>
                        <input onBlur={e => setName(e.target.value)} type="text" name="name" defaultValue={loggedInUser.name} className="form-control"  placeholder="Enter Your Name" />
                    </div>
                    <div className="form-group">
                        <label for="exampleInputEmail1"> Email</label>
                        <input onBlur={e => setEmail(e.target.value)} type="text" name="email" defaultValue={loggedInUser.email} className="form-control"  placeholder="Enter Your Email" />
                    </div>

                    <div className="form-group">
                        <label for="exampleInputEmail1"> Service title </label>
                        <input onBlur={e => setServiceName(e.target.value)} type="text" name="serviceName" defaultValue={serviceInfo?.title} className="form-control"  placeholder="Enter Service Title" />
                    </div>
                    
                    <br />
                    {/* <button type="submit" class="btn btn-primary my-3">Submit</button> */}
                    <CardElement />
                    <br />
                    <p>Selected Service Charge ${serviceInfo?.price}</p>
                    <button className="mt-5 btn btn-primary" type="submit" disabled={!stripe}> Pay & Checkout </button>

                </form>
                {success && <p style={{ color: 'green' }}>{success}</p>}              
                {paymentError && <p className='text-danger'>{paymentError}</p>}
                {paymentSuccess && <p className='text-primary '>payment success</p>}

            </div>

        </div>

        

    );
};

export default PaymentAndCheckoutFrom;