import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Auth.css";

function GuestComplaint() {
  const [submittedId, setSubmittedId] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    category: "Infrastructure",
    subject: "",
    description: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const randomId = `CMP-GUEST-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    setSubmittedId(randomId);
  };

  const resetForm = () => {
    setSubmittedId(null);

    setFormData({
      fullName: "",
      email: "",
      category: "Infrastructure",
      subject: "",
      description: "",
    });
  };

  return (
    <main className="guest-page">

      <div className="guest-container">

        <Link to="/" className="guest-back">
          Back to Home
        </Link>


        <div className="guest-card">

          {!submittedId ? (
            <>
              <div className="guest-header">

                <span className="auth-eyebrow">
                  GUEST SUBMISSION
                </span>

                <h1>
                  Submit a complaint
                </h1>

                <p>
                  Report a campus concern without creating
                  a student account.
                </p>

              </div>


              <form
                className="auth-form"
                onSubmit={handleSubmit}
              >

                <div className="form-group">

                  <label htmlFor="guestName">
                    Full Name
                  </label>

                  <input
                    id="guestName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="guestEmail">
                    Email Address
                  </label>

                  <input
                    id="guestEmail"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="guestCategory">
                    Category
                  </label>

                  <select
                    id="guestCategory"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Infrastructure">
                      Infrastructure / Campus Facilities
                    </option>

                    <option value="Event/Guest Services">
                      Event / Guest Services
                    </option>

                    <option value="Security">
                      Security & Access
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                </div>


                <div className="form-group">

                  <label htmlFor="guestSubject">
                    Subject
                  </label>

                  <input
                    id="guestSubject"
                    name="subject"
                    type="text"
                    required
                    placeholder="Brief summary of your concern"
                    value={formData.subject}
                    onChange={handleChange}
                  />

                </div>


                <div className="form-group">

                  <label htmlFor="guestDescription">
                    Description
                  </label>

                  <textarea
                    id="guestDescription"
                    name="description"
                    required
                    rows="5"
                    placeholder="Describe the issue in detail"
                    value={formData.description}
                    onChange={handleChange}
                  />

                </div>


                <button
                  type="submit"
                  className="auth-submit"
                >
                  Submit Complaint
                </button>

              </form>
            </>
          ) : (
            <div className="guest-success">

              <span className="success-label">
                SUBMISSION RECEIVED
              </span>

              <h1>
                Complaint submitted
              </h1>

              <p>
                Keep the following tracking ID so you can
                reference this complaint later.
              </p>

              <div className="tracking-id">
                {submittedId}
              </div>

              <button
                type="button"
                className="auth-submit"
                onClick={resetForm}
              >
                Submit Another Complaint
              </button>

              <Link
                to="/"
                className="guest-home-link"
              >
                Return to CampusVoice
              </Link>

            </div>
          )}

        </div>

      </div>

    </main>
  );
}

export default GuestComplaint;