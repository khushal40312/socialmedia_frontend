import React from 'react'

export default function MoreSpinner() {
    return (
        <div className='d-flex align-items-center justify-content-center'>
            <div  style={{ width: "1rem", height: "1rem" }} className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ width: "1rem", height: "1rem" }} className="spinner-grow text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ width: "1rem", height: "1rem" }} className="spinner-grow text-success" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ width: "1rem", height: "1rem" }} className="spinner-grow text-danger" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div style={{ width: "1rem", height: "1rem" }} className="spinner-grow text-warning" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}
