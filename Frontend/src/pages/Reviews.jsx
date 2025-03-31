import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reviews = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('/api/reviews')
            .then(response => setReviews(response.data))
            .catch(error => setError('Error fetching reviews'));
    }, []);

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        if (newReview.trim() === '') {
            setError('Review cannot be empty');
            return;
        }

        // Post new review to API
        axios.post('/api/reviews', { review: newReview })
            .then(response => {
                setReviews([...reviews, response.data]);
                setNewReview('');
                setError('');
            })
            .catch(error => setError('Error submitting review'));
    };

    return (
        <div>
            <h1>Customer Reviews</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {reviews.map((review, index) => (
                    <li key={index}>{review}</li>
                ))}
            </ul>
            <form onSubmit={handleReviewSubmit}>
                <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Write your review here"
                />
                <button type="submit">Submit Review</button>
            </form>
        </div>
    );
};

export default Reviews;