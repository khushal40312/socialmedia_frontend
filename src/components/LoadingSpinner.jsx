import React from 'react'

export default function LoadingSpinner() {
  return (
    <>
      <div style={{ marginBottom: "100px" }} className="d-flex  justify-content-center spinner">
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
