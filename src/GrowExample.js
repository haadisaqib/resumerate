import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

function BorderExample() {
  return (
    <div>
      <Spinner animation="border" variant="primary" />
      <p>Please Wait...</p>
    </div>
  );
}

export default BorderExample;
