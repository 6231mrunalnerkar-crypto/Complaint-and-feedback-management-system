import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/About.css";

function About() {
  return (
    <>
      <Navbar />

      <main className="about-page">

        {/* ==================== HERO ==================== */}
        <section className="about-hero">
          <div className="about-hero-content">

            <span className="about-label">
              ABOUT CAMPUSVOICE
            </span>

            <h1>
              Campus concerns,
              <br />
              <span>properly heard.</span>
            </h1>

            <p>
              CampusVoice is a centralized Complaint and Feedback
              Management System designed to make communication between
              students and educational institutions simpler, faster,
              and more transparent.
            </p>

            <div className="about-hero-actions">

              <Link
                to="/register"
                className="about-primary-btn"
              >
                Get Started
              </Link>

              <Link
                to="/"
                className="about-secondary-btn"
              >
                ← Back to Home
              </Link>

            </div>

          </div>
        </section>


        {/* ==================== WHY CAMPUSVOICE ==================== */}
        <section className="about-section">

          <div className="about-section-heading">

            <span className="about-label">
              WHY CAMPUSVOICE
            </span>

            <h2>
              Turning concerns into
              <span> meaningful action.</span>
            </h2>

            <p>
              Traditional complaint systems often depend on paper forms,
              emails, or verbal communication. These approaches can make
              complaints difficult to track, delay responses, and create
              gaps in communication between students and administration.
            </p>

          </div>


          <div className="about-problem-grid">

            <div className="about-info-card">

              <div className="about-card-number">
                01
              </div>

              <h3>
                Centralized Management
              </h3>

              <p>
                Complaints and feedback can be managed through a single
                centralized platform instead of scattered manual records.
              </p>

            </div>


            <div className="about-info-card">

              <div className="about-card-number">
                02
              </div>

              <h3>
                Transparent Tracking
              </h3>

              <p>
                Students can follow the progress of their complaints and
                stay informed about their current status.
              </p>

            </div>


            <div className="about-info-card">

              <div className="about-card-number">
                03
              </div>

              <h3>
                Better Communication
              </h3>

              <p>
                The system improves communication between students,
                staff, departments, and administrators.
              </p>

            </div>

          </div>

        </section>


        {/* ==================== OBJECTIVES ==================== */}
        <section className="about-section about-objectives">

          <div className="about-section-heading">

            <span className="about-label">
              OUR OBJECTIVES
            </span>

            <h2>
              Built around the needs
              <span> of the campus.</span>
            </h2>

          </div>


          <div className="objectives-grid">

            <div className="objective-item">
              <span>01</span>
              <p>
                Provide a centralized web-based complaint and feedback
                management platform.
              </p>
            </div>

            <div className="objective-item">
              <span>02</span>
              <p>
                Provide secure authentication for students, staff, and
                administrators.
              </p>
            </div>

            <div className="objective-item">
              <span>03</span>
              <p>
                Allow students to submit complaints and feedback online.
              </p>
            </div>

            <div className="objective-item">
              <span>04</span>
              <p>
                Allow guest users to submit complaints anonymously.
              </p>
            </div>

            <div className="objective-item">
              <span>05</span>
              <p>
                Categorize complaints and assign them to appropriate
                departments.
              </p>
            </div>

            <div className="objective-item">
              <span>06</span>
              <p>
                Enable users to track complaint progress and status.
              </p>
            </div>

            <div className="objective-item">
              <span>07</span>
              <p>
                Provide administrators with complaint analytics and
                reports.
              </p>
            </div>

            <div className="objective-item">
              <span>08</span>
              <p>
                Reduce paperwork while improving transparency and
                communication.
              </p>
            </div>

          </div>

        </section>


        {/* ==================== HOW IT WORKS ==================== */}
        <section className="about-section">

          <div className="about-section-heading">

            <span className="about-label">
              HOW IT WORKS
            </span>

            <h2>
              From complaint to
              <span> resolution.</span>
            </h2>

          </div>


          <div className="about-process">

            <div className="process-step">

              <div className="process-number">
                01
              </div>

              <h3>
                Submit
              </h3>

              <p>
                A student or guest submits a complaint or feedback
                through the platform.
              </p>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                02
              </div>

              <h3>
                Categorize
              </h3>

              <p>
                The complaint is organized according to its relevant
                category or department.
              </p>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                03
              </div>

              <h3>
                Assign
              </h3>

              <p>
                Administrators assign complaints to the appropriate
                staff member or department.
              </p>

            </div>


            <div className="process-line"></div>


            <div className="process-step">

              <div className="process-number">
                04
              </div>

              <h3>
                Resolve
              </h3>

              <p>
                Staff members update the complaint status until the
                issue reaches resolution.
              </p>

            </div>

          </div>

        </section>


        {/* ==================== SYSTEM HIGHLIGHTS ==================== */}
        <section className="about-section about-features">

          <div className="about-section-heading">

            <span className="about-label">
              SYSTEM HIGHLIGHTS
            </span>

            <h2>
              Everything in
              <span> one place.</span>
            </h2>

          </div>


          <div className="features-about-grid">

            <div className="feature-about-card">

              <h3>
                Student Portal
              </h3>

              <p>
                Students can submit complaints, provide feedback, and
                monitor the progress of their submissions.
              </p>

            </div>


            <div className="feature-about-card">

              <h3>
                Guest Complaints
              </h3>

              <p>
                Guest users can submit complaints without creating a
                registered account.
              </p>

            </div>


            <div className="feature-about-card">

              <h3>
                Staff Dashboard
              </h3>

              <p>
                Staff members can manage assigned complaints and update
                their status throughout the resolution process.
              </p>

            </div>


            <div className="feature-about-card">

              <h3>
                Admin Dashboard
              </h3>

              <p>
                Administrators can monitor complaints, assignments,
                users, reports, and system activities.
              </p>

            </div>


            <div className="feature-about-card">

              <h3>
                Complaint Tracking
              </h3>

              <p>
                Users can track complaint progress and stay informed
                about the current status of their submissions.
              </p>

            </div>


            <div className="feature-about-card">

              <h3>
                Analytics & Reports
              </h3>

              <p>
                Administrators can review complaint trends and generate
                useful reports for monitoring and decision-making.
              </p>

            </div>

          </div>

        </section>


        {/* ==================== TERMS & CONDITIONS ==================== */}
        <section className="about-terms">

          <div className="about-section-heading">

            <span className="about-label">
              TERMS OF USE
            </span>

            <h2>
              Terms & <span>Conditions</span>
            </h2>

            <p>
              Please review these terms carefully before using CampusVoice.
              By accessing or using the platform, you agree to comply with
              the following terms and conditions.
            </p>

          </div>


          <div className="terms-list">

            <div className="term-item">

              <span>01</span>

              <div>
                <h3>
                  Acceptance of Terms
                </h3>

                <p>
                  By accessing or using CampusVoice, you acknowledge that
                  you have read, understood, and agreed to these Terms &
                  Conditions. If you do not agree with any part of these
                  terms, you should discontinue use of the platform.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>02</span>

              <div>
                <h3>
                  Appropriate Use of the Platform
                </h3>

                <p>
                  CampusVoice is intended for submitting legitimate campus
                  complaints, concerns, and constructive feedback. Users
                  must use the platform responsibly and must not use it
                  for spam, harassment, false reporting, or activities
                  unrelated to genuine institutional concerns.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>03</span>

              <div>
                <h3>
                  Accuracy of Information
                </h3>

                <p>
                  Users are responsible for providing accurate and relevant
                  information when registering an account or submitting a
                  complaint or feedback. Intentionally providing false,
                  misleading, or fabricated information may result in the
                  submission being reviewed or restricted.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>04</span>

              <div>
                <h3>
                  Respectful Communication
                </h3>

                <p>
                  All complaints and feedback should be communicated in a
                  professional and respectful manner. Content containing
                  abusive, threatening, discriminatory, defamatory, or
                  inappropriate language is not permitted.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>05</span>

              <div>
                <h3>
                  Complaint Review and Resolution
                </h3>

                <p>
                  Submission of a complaint does not guarantee a specific
                  resolution or outcome. Each complaint may be reviewed by
                  the appropriate department or authorized staff member and
                  handled according to institutional procedures.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>06</span>

              <div>
                <h3>
                  Complaint Status and Updates
                </h3>

                <p>
                  Complaint statuses are provided to help users understand
                  the progress of their submissions. Status information may
                  be updated by authorized staff or administrators as the
                  complaint moves through the resolution process.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>07</span>

              <div>
                <h3>
                  Account Security
                </h3>

                <p>
                  Registered users are responsible for maintaining the
                  confidentiality of their login credentials and should not
                  share their account information with others. Any suspected
                  unauthorized access should be reported to the appropriate
                  administrator.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>08</span>

              <div>
                <h3>
                  Anonymous Submissions
                </h3>

                <p>
                  Guest users may submit complaints without creating a
                  registered account. Anonymous submissions should still
                  contain genuine and relevant information and must comply
                  with all applicable platform rules.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>09</span>

              <div>
                <h3>
                  Privacy and Information Handling
                </h3>

                <p>
                  Information submitted through CampusVoice should be
                  handled in accordance with the institution's applicable
                  privacy, security, and data-protection policies. Users
                  should avoid submitting unnecessary personal or
                  confidential information.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>10</span>

              <div>
                <h3>
                  Prohibited Activities
                </h3>

                <p>
                  Users must not attempt to gain unauthorized access,
                  interfere with system operations, manipulate complaint
                  records, misuse another user's account, or perform any
                  activity intended to compromise the availability,
                  integrity, or security of the platform.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>11</span>

              <div>
                <h3>
                  System Availability
                </h3>

                <p>
                  CampusVoice may occasionally be unavailable because of
                  maintenance, updates, technical issues, or circumstances
                  beyond the control of the system administrators.
                  Reasonable efforts may be taken to restore normal service.
                </p>
              </div>

            </div>


            <div className="term-item">

              <span>12</span>

              <div>
                <h3>
                  Changes to These Terms
                </h3>

                <p>
                  These Terms & Conditions may be revised periodically to
                  reflect changes in system functionality, institutional
                  requirements, security practices, or applicable policies.
                  Updated terms will apply once published on the platform.
                </p>
              </div>

            </div>

          </div>


          {/* Important Notice */}
          <div className="terms-notice">

            <strong>
              Important Notice
            </strong>

            <p>
              CampusVoice is intended to support communication and complaint
              management within an educational institution. The platform
              does not replace official institutional procedures, emergency
              services, or other channels that may be required for urgent
              matters.
            </p>

          </div>

        </section>


        {/* ==================== CTA ==================== */}
        <section className="about-cta">

          <span className="about-label">
            HAVE A CONCERN?
          </span>

          <h2>
            Your voice deserves
            <br />
            to be heard.
          </h2>

          <p>
            Join CampusVoice and make campus communication
            simpler and more transparent.
          </p>


          <div className="about-cta-buttons">

            <Link
              to="/register"
              className="about-primary-btn"
            >
              Create Account
            </Link>

            <Link
              to="/login"
              className="about-secondary-btn"
            >
              Sign In
            </Link>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default About;