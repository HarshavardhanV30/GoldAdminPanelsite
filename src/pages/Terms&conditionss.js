// TermsAndConditions.js
import React from "react";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  // Inline styles
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "40px auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#fff8e1",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    header: {
      textAlign: "center",
      marginBottom: "30px",
    },
    headerTitle: {
      color: "#bfa34f",
    },
    section: {
      marginBottom: "20px",
    },
    sectionTitle: {
      color: "#a67c00",
    },
    paragraph: {
      color: "#333",
      lineHeight: "1.6",
    },
    footer: {
      textAlign: "center",
      marginTop: "30px",
    },
    backButton: {
      backgroundColor: "#bfa34f",
      color: "white",
      padding: "10px 20px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.headerTitle}>Terms and Conditions - GBuyers</h1>
      </header>

      <div>
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>1. Introduction</h2>
          <p style={styles.paragraph}>
            Welcome to GBuyers! These Terms and Conditions govern your use of our
            mobile application and services, including buying and selling gold
            and availing doorstep loans. By using GBuyers, you agree to follow
            these rules and regulations.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>2. Account Registration</h2>
          <p style={styles.paragraph}>
            Users must register an account to access features such as gold
            selling or applying for doorstep loans. Ensure all provided
            information is accurate and up-to-date. Account credentials must be
            kept confidential.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>3. Gold Selling</h2>
          <p style={styles.paragraph}>
            GBuyers allows customers to sell gold items securely. Users must
            provide accurate product details, including images, purity, and
            weight. Payments for sold gold will be processed through verified
            banking channels. The company reserves the right to verify gold
            authenticity before finalizing transactions.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>4. Doorstep Loans via Bank</h2>
          <p style={styles.paragraph}>
            GBuyers offers doorstep loans in collaboration with partner banks.
            Users must submit accurate personal, KYC, and financial information
            to apply. Loan approval and disbursal are subject to bank verification
            and credit evaluation. GBuyers is not responsible for loan approval
            decisions.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>5. Payments</h2>
          <p style={styles.paragraph}>
            All payments for gold selling and loan disbursal are securely
            processed through verified banking channels. Users must ensure
            sufficient funds and accurate bank details. Refunds, if applicable,
            will follow our refund and dispute resolution policies.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>6. User Responsibilities</h2>
          <p style={styles.paragraph}>
            Users are responsible for maintaining the confidentiality of account
            credentials and ensuring accurate submission of gold selling and loan
            details. Any unauthorized access or misuse should be reported
            immediately.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>7. Prohibited Activities</h2>
          <p style={styles.paragraph}>
            Users must not use GBuyers for illegal activities, fraudulent loans,
            fake gold submissions, or actions that could harm other users or
            the platform’s operations.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>8. Limitation of Liability</h2>
          <p style={styles.paragraph}>
            GBuyers is not liable for any loss, damage, or issues arising from
            gold transactions or loan applications, including technical errors,
            banking delays, or user mistakes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>9. Modifications</h2>
          <p style={styles.paragraph}>
            GBuyers may update these Terms and Conditions at any time. Users are
            encouraged to review this page periodically to stay informed about
            any changes.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>10. Termination</h2>
          <p style={styles.paragraph}>
            Accounts may be suspended or terminated if users violate these terms
            or engage in harmful activities, including fraudulent gold submissions
            or misuse of loan services.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>11. Contact Us</h2>
          <p style={styles.paragraph}>
            For questions regarding these Terms and Conditions, gold selling,
            or doorstep loans, contact our support at support@gbuyers.com.
          </p>
        </section>
      </div>

      <div style={styles.footer}>
        <button style={styles.backButton} onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
