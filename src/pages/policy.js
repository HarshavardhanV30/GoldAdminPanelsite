import React, { useState } from 'react';

const LegalPolicies = () => {
  const [activeTab, setActiveTab] = useState('all');

  const companyDetails = {
    name: "G-buyer",
    website: "https://goldappadminpanel.vercel.app/",
    contactEmail: "rajureddi60@gmail.com",
    address: "1-31A Maturu,Atchuthapuram mandal,duppituru,visakhapatnam",
    phone: "+91 8186009630"
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>{companyDetails.name}</h1>
        <p style={styles.subtitle}>Legal Policies, Terms & Compliance Documentation</p>
        <p style={styles.updated}>Last Updated: July 2026</p>
      </header>

      {/* Navigation Filter Tabs */}
      <div style={styles.navContainer}>
        <button 
          style={activeTab === 'all' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('all')}
        >
          All Policies
        </button>
        <button 
          style={activeTab === 'privacy' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('privacy')}
        >
          Privacy Policy
        </button>
        <button 
          style={activeTab === 'refund' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('refund')}
        >
          Refund Policy
        </button>
        <button 
          style={activeTab === 'return' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('return')}
        >
          Return Policy
        </button>
        <button 
          style={activeTab === 'shipping' ? styles.activeTab : styles.tab} 
          onClick={() => setActiveTab('shipping')}
        >
          Shipping Policy
        </button>
      </div>

      <div style={styles.contentBox}>
        {/* PRIVACY POLICY */}
        {(activeTab === 'all' || activeTab === 'privacy') && (
          <section style={styles.section} id="privacy_policy">
            <h2 style={styles.heading}>1. Privacy Policy</h2>
            <p style={styles.text}>
              At <strong>{companyDetails.name}</strong> (accessible via {companyDetails.website}), protecting your personal and financial privacy is our highest priority. This Privacy Policy outlines the types of information we collect, how it is processed, and the measures taken to safeguard your data in accordance with applicable Indian laws and financial guidelines.
            </p>

            <h3 style={styles.subHeading}>1.1 Information We Collect</h3>
            <p style={styles.text}>To facilitate digital gold buying and selling operations, we collect:</p>
            <ul style={styles.list}>
              <li><strong>Personal Identification Data:</strong> Full Name, Mobile Number, Email Address, and Date of Birth.</li>
              <li><strong>KYC Documentation:</strong> PAN Card details, Aadhaar number details, or bank account verification details required under Indian Anti-Money Laundering (AML) compliance for precious metals trading.</li>
              <li><strong>Financial & Transactional Data:</strong> Payment transaction reference numbers, UPI IDs, payment status via integrated payment gateways (e.g., PhonePe), and transaction histories.</li>
              <li><strong>Device & Log Data:</strong> IP address, device identifiers, app version, OS details, and network logs to ensure security and prevent fraudulent transactions.</li>
            </ul>

            <h3 style={styles.subHeading}>1.2 Usage of Collected Information</h3>
            <p style={styles.text}>Your data is strictly utilized for the following operational purposes:</p>
            <ul style={styles.list}>
              <li>Verifying user identities and processing buy/sell gold transactions seamlessly.</li>
              <li>Executing instant credit or debit settlement processes via integrated payment gateway channels like PhonePe.</li>
              <li>Complying with statutory tax mandates (e.g., GST reporting, TDS deductions on transactions as applicable).</li>
              <li>Detecting, preventing, and mitigating fraudulent transactions, unauthorized account access, and illegal activities.</li>
            </ul>

            <h3 style={styles.subHeading}>1.3 Data Protection & Security Controls</h3>
            <p style={styles.text}>
              We implement industry-standard encryption protocols (SSL/TLS encryption) to secure all data transmissions. We do not store sensitive payment credentials such as card CVVs, Net Banking passwords, or UPI PINs on our servers; all payment transactions are routed securely through PCI-DSS compliant third-party payment processors like PhonePe.
            </p>

            <h3 style={styles.subHeading}>1.4 Third-Party Disclosure</h3>
            <p style={styles.text}>
              We do not sell, rent, or trade your personal data to third parties for marketing purposes. Data is only shared with authorized payment service providers, vault custodians, or government regulators when required by law or legal proceedings.
            </p>
          </section>
        )}

        {/* REFUND POLICY */}
        {(activeTab === 'all' || activeTab === 'refund') && (
          <section style={styles.section} id="refund_policy">
            <h2 style={styles.heading}>2. Refund & Cancellation Policy</h2>
            <p style={styles.text}>
              Due to the volatile nature of live precious metals markets (gold prices fluctuate continuously based on global market conditions), transactions executed on <strong>{companyDetails.name}</strong> are subject to strict financial terms.
            </p>

            <h3 style={styles.subHeading}>2.1 Non-Cancellable Transactions</h3>
            <p style={styles.text}>
              Once a buy or sell gold order is placed and confirmed through our app, the market rate is locked instantly. Therefore, buy and sell orders cannot be cancelled, revoked, or modified once confirmed by the payment gateway.
            </p>

            <h3 style={styles.subHeading}>2.2 Refund Conditions & Technical Failures</h3>
            <p style={styles.text}>Refunds are handled under the following specific conditions:</p>
            <ul style={styles.list}>
              <li>
                <strong>Failed Transactions (Debited but Not Processed):</strong> If your bank account or UPI account via PhonePe is debited for a gold purchase, but the transaction fails or the digital gold is not credited to your digital vault due to network glitches, the debited amount will automatically be refunded to your original payment source within <strong>5 to 7 working days</strong> as per standard banking protocol.
              </li>
              <li>
                <strong>Overpayments or Duplicate Deductions:</strong> In cases of double deduction due to server delays, the surplus amount will be reversed to the original payment instrument within 3 to 5 business days after internal reconciliation.
              </li>
            </ul>

            <h3 style={styles.subHeading}>2.3 Resolution Mechanism</h3>
            <p style={styles.text}>
              For any payment reconciliation inquiries, users can reach out to our dedicated support team at <strong>{companyDetails.contactEmail}</strong> with the transaction reference ID, date, and payment screenshot.
            </p>
          </section>
        )}

        {/* RETURN POLICY */}
        {(activeTab === 'all' || activeTab === 'return') && (
          <section style={styles.section} id="return_policy">
            <h2 style={styles.heading}>3. Return Policy</h2>
            <p style={styles.text}>
              <strong>Notice: My Business Does Not Support Returns.</strong>
            </p>
            <p style={styles.text}>
              <strong>{companyDetails.name}</strong> strictly operates as an online digital portal for buying and selling digital gold products. Because digital gold assets are allocated electronically into accredited digital vault accounts immediately upon purchase, physical returns, exchange options, or product replacements are non-applicable.
            </p>
            <p style={styles.text}>
              Users wishing to liquidate their holdings can utilize our in-app <strong>"SELL"</strong> feature at any time to convert their digital gold holdings back into INR, which will be directly credited to their verified bank account or UPI ID via PhonePe.
            </p>
          </section>
        )}

        {/* SHIPPING POLICY */}
        {(activeTab === 'all' || activeTab === 'shipping') && (
          <section style={styles.section} id="shipping_policy">
            <h2 style={styles.heading}>4. Shipping & Delivery Policy</h2>
            <p style={styles.text}>
              <strong>Notice: My Business Does Not Ship Physical Goods.</strong>
            </p>
            <p style={styles.text}>
              All products offered on <strong>{companyDetails.name}</strong> are purely digital assets (Digital Gold). 
            </p>
            <ul style={styles.list}>
              <li><strong>No Physical Shipping:</strong> We do not ship, transport, or deliver physical gold, coins, bars, or physical merchandise to physical home addresses.</li>
              <li><strong>Instant Electronic Delivery:</strong> Upon successful payment completion via PhonePe, your purchased gold quantity (in grams/rupees) is instantly calculated based on live rates and digitally credited to your secure in-app ledger account immediately (typically within 0 to 60 seconds).</li>
              <li><strong>Delivery Confirmation:</strong> Digital receipts and updated balance statements are instantly issued via SMS, email notification, and in-app dashboard views.</li>
            </ul>
          </section>
        )}

        {/* CONTACT INFORMATION */}
        <section style={styles.contactSection}>
          <h2 style={styles.heading}>5. Customer Support & Grievance Contact</h2>
          <p style={styles.text}>
            If you have questions regarding these legal policies, refund statuses, or operational terms, feel free to contact us:
          </p>
          <p style={styles.text}><strong>Company Name:</strong> {companyDetails.name}</p>
          <p style={styles.text}><strong>Website URL:</strong> {companyDetails.website}</p>
          <p style={styles.text}><strong>Support Email:</strong> {companyDetails.contactEmail}</p>
          <p style={styles.text}><strong>Address:</strong> {companyDetails.address}</p>
        </section>
      </div>
    </div>
  );
};

// Inline CSS Styles for single-file self-contained deployment
const styles = {
  container: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#222',
    backgroundColor: '#f9f9fb',
    lineHeight: '1.6',
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e2e8f0',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    margin: '0 0 10px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: '#4b5563',
    margin: '0 0 5px 0',
  },
  updated: {
    fontSize: '13px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  navContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    flexWrap: 'wrap',
    marginBottom: '25px',
  },
  tab: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    color: '#374151',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  activeTab: {
    padding: '10px 16px',
    fontSize: '14px',
    fontWeight: '600',
    border: '1px solid #2563eb',
    borderRadius: '6px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    cursor: 'pointer',
  },
  contentBox: {
    backgroundColor: '#ffffff',
    padding: '35px',
    borderRadius: '10px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  section: {
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #f3f4f6',
  },
  heading: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: '15px',
  },
  subHeading: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginTop: '20px',
    marginBottom: '8px',
  },
  text: {
    fontSize: '15px',
    color: '#4b5563',
    marginBottom: '12px',
  },
  list: {
    paddingLeft: '20px',
    marginBottom: '15px',
    color: '#4b5563',
    fontSize: '15px',
  },
  contactSection: {
    marginTop: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    borderLeft: '4px solid #2563eb',
  }
};

export default LegalPolicies;
