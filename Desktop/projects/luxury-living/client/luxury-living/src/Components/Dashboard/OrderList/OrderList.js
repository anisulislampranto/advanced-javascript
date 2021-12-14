import React from 'react';

const OrderList = (props) => {
    const {_id ,name, email, serviceName, servicePrice, date} = props.order;

    const handleConfirmOrder = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', name)
        formData.append('email', email)
        formData.append('servicePrice', servicePrice)
        formData.append('serviceName', serviceName)
        formData.append('date', date)
        formData.append('id', _id)


        fetch('http://localhost:4040/addConfirmedOrder', {
            method: 'POST', 
            body: formData
        }).then( res => res.json())
        .then(data => {
            if (data) {
                alert('Successfully Added to confirmed Order List')
            }
        })
        console.log(formData);
    }
    const handleCompleteOrder = (e) => {
        e.preventDefault();

        const formData2 = new FormData();
        formData2.append('name', name)
        formData2.append('email', email)
        formData2.append('servicePrice', servicePrice)
        formData2.append('serviceName', serviceName)
        formData2.append('date', date)
        formData2.append('id', _id)


        fetch('http://localhost:4040/addCompletedOrder', {
            method: 'POST', 
            body: formData2
        }).then( res => res.json())
        .then(data => {
            if (data) {
                alert('Successfully Added to Completed Order List')
            }
        })
        console.log('formData2',  formData2);

    }


    return (
        <tbody>
            <tr>
                <td>{name}</td>
                <td>{email}</td>
                <td>{serviceName}</td>
                <td>${servicePrice}</td>
                <td>{date}</td>
                <td>
                    <div class="btn-group">
                        <button type="button" class="border-0 dropdown-toggle bg-transparent text-dark" data-bs-toggle="dropdown" aria-expanded="false">
                            Action
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#" onClick={handleConfirmOrder}>Confirm Order</a></li>
                            <li><a class="dropdown-item" href="#" onClick={handleCompleteOrder}>Complete Order</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        </tbody>
    );
};

export default OrderList;