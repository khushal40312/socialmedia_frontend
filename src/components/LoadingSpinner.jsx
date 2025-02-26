import React from 'react'

export default function LoadingSpinner() {
  return (
    <>
       <div className="d-flex my-5 justify-content-center spinner">
            <div
                className="spinner-border"
                role="status"
                style={{ width: "5rem", height: "5rem" }}
            >
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    </>
  )
}
