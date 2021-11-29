import React, { useEffect, useState } from 'react';
import Review from '../Review/Review';

const Reviews = () => {

    const [reviews, setReviews] = useState([]);

    useEffect(()=>{
        fetch('http://localhost:4040/reviews')
        .then(res => res.json())
        .then(data => setReviews(data))
    },[])

    console.log(reviews);

    return (
        <div className='text-center'>
            <p> {reviews.length} Reviews</p>
            <div className="container-fluid row">
                {
                    reviews.map(review => <Review review={review} ></Review>)
                }
            </div>
        </div>
    );
};

export default Reviews;