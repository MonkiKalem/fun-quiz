import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizCard = ({ quiz }) => {
    const navigate = useNavigate();

    return (
        <div className="card" style={{ width: '18rem', margin: '10px' }}>
            <div className="card-body">
                <h5 className="card-title">{quiz.title}</h5>
                <p className="card-text">{quiz.description}</p>
                <button className="btn btn-primary" onClick={() => navigate(`/quiz/${quiz.id}`)}>
                    Start Quiz
                </button>
            </div>
        </div>
    );
};

export default QuizCard;
