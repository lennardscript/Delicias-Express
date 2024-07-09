import React from 'react'

export default function CardIcon() {
  return (
    <>
      <div className="row mb-3 p-4 justify-content-center">
        <div className="col-lg-5 col-md-6 col-sm-8 col-10">
          <div className="card">
            <div className="card-header pb-2">
              <div className="row">
                <div className="col-lg-6 col-7">
                </div>
                <div className="col-lg-6 col-5 my-auto text-end">
                </div>
              </div>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center">
              <img className="img-fluid max-width-550 max-width-sm-300 max-width-md-400 max-width-lg-500" src="./assets/img/delicias-express-logo.png" alt="logo_delicias" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
