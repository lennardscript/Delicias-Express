import React from "react";

export default function CardHeader() {
  return (
    <>
      <div className="row-cols-2">
        <div className="col-xl-2 offset-sm-3 col-sm-6 mb-xl-0 mb-2">
          <div className="card">
            <div className="card-header p-3 pt-1">
              <div className="icon icon-lg icon-shape bg-danger shadow-primary text-center border-radius-xl mt-n4 position-absolute">
                <i className="material-icons opacity-10">person</i>
              </div>
              <div className="text-end pt-4">
                <p className="text-sm mb-0 text-capitalize">Bienvenido(a)!</p>
                <h4 className="mb-0">Jerson Django</h4>
              </div>
            </div>
            <div className="card-footer p-3"></div>
          </div>
        </div>
      </div>
    </>
  );
}
