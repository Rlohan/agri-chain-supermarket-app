import React from "react";

const header = props => {
  let button = null;
  if (props.showButton) {
    button = (
      <div className="row">
        <div className="offset-md-9 col-md-3">
          <button className="btn btn-primary" onClick={props.signOut}>Sign Out</button>
        </div>
      </div>
    );
  }
  return (
    <>
      <h2>Supermarket App</h2>
      {button}
    </>
  );
};

export default header;
