import React, { useState } from 'react';
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '2px 8px 8px gray'
  },
};

Modal.setAppElement('#root');

const EditService = ({closeModal,modalIsOpen, selectedServiceId}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [icon, setIcon] = useState(null);
    const [success, setSuccess] = useState(false);

  const handleSubmit = (e)=>{
    e.preventDefault();
    console.log('clicked')
    e.preventDefault();
        if (!icon) {
            return;
        }
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description)
        formData.append('price', price)
        formData.append('icon', icon); 

        fetch('http://localhost:4040/updateService/' + selectedServiceId , {
            method: 'PATCH',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setSuccess('Service Updated successfully')
                    console.log('Service Updated successfully')
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });


  }    
  
  return (
      <div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <h1>Edit/Update Selected Service</h1>
          <form onSubmit={handleSubmit}>
              
              <div className="form-group">
                  <label for="exampleInputName1">Service title</label>
                  <input onBlur={e => setTitle(e.target.value)} type="text" name="title" className="form-control"  placeholder="Enter Service title" />
              </div>
              <div className="form-group">
                  <label for="exampleInputEmail1">Service Description</label>
                  <input onBlur={e => setDescription(e.target.value)} type="text" name="description" className="form-control"  placeholder="Enter Service Description" />
              </div>
              <div className="form-group">
                  <label for="exampleInputEmail1">Service Price</label>
                  <input onBlur={e => setPrice(e.target.value)} type="number" name="price" className="form-control"  placeholder="Enter Service Price" />
              </div>
              <div className="form-group">
                  <label for="exampleFormControlFile1">Upload Service Icon</label>
                  <input onChange={e => setIcon(e.target.files[0])} type="file" className="form-control" placeholder="Service Icon" />
              </div>

              {success && <p style={{ color: 'green' }}>{success}</p>} <br />

              <button type="submit" class="btn btn-primary my-3">Submit Updated Form</button>
              <button class="btn btn-primary mx-3" onClick={closeModal}>close</button>

          </form>
      </Modal>
    </div>
  );
};

export default EditService;