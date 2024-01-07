// ServerResponseModal.js
import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const ServerResponseModal = ({ show, handleClose, rating, tips }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Server Response</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {rating !== undefined && <p>Rating: {rating}</p>}
        {tips && (
          <div>
            <p>Tips:</p>
            <ul>
              {Array.isArray(tips) &&
                tips.map((tip, index) => <li key={index}>{tip}</li>)}
            </ul>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ServerResponseModal;
