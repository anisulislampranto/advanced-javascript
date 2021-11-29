import React from 'react';

const Review = ({review}) => {
    console.log(review)
    return (
        <div className='col-md-4'>
            <h5>{review.name}</h5>
            <p>{review.review}</p>
        </div>
    );
};

export default Review;