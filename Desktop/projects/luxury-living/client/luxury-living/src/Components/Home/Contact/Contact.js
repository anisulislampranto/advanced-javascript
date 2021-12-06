import React from "react";

const Contact = () => {

    
  return (
      
      <div className='text-center container' >
        <p>Contact</p>
        <h2>Let us handle your project, professionally.</h2>
      <form className="mx-5 px-5 my-4 py-5 text-center">
        <div class="form-row">
          <div class="form-group">
            <div class="form-row d-flex">
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  placeholder="First name"
                />
              </div>
              <div class="col mx-3">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Last name"
                />
              </div>
            </div>
          </div>
          <div class="form-group mt-3">
            <div class="form-row d-flex">
              <div class="col">
                <input
                  type="text"
                  class="form-control"
                  placeholder=" Enter Your Email"
                />
              </div>
              <div class="col mx-3">
                <input
                  type="number"
                  class="form-control"
                  placeholder=" Enter Your Number"
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor=""></label>
            <textarea placeholder="Your Message" class="form-control" id="exampleFormControlTextarea1" rows="6"></textarea>
          </div>
        </div>

        <button type="submit" class="btn btn-primary mt-2">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;
