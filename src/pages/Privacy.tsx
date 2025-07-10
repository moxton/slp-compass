import React from "react";

const Privacy = () => (
  <div className="max-w-2xl mx-auto py-12 px-4">
    <h1 className="text-3xl font-bold mb-6">SLP Compass – Privacy Policy</h1>
    <p className="mb-4">Effective Date: July 2025</p>
    <p className="mb-4">SLP Compass respects your privacy and is designed with confidentiality in mind. This brief policy explains what we collect, how we use it, and your responsibilities.</p>

    <h2 className="text-xl font-semibold mt-8 mb-2">Information We Collect</h2>
    <ul className="list-disc pl-6 mb-4">
      <li><strong>Account Data:</strong> If you create an account, we may collect your email address and account preferences.</li>
      <li><strong>Usage Data:</strong> We may collect non-identifying data such as device type, general location, and anonymous usage analytics to improve our service.</li>
      <li><strong>Generated Content:</strong> We store only non-identifiable plan data and user inputs when needed to deliver your requested outputs. We do not store PHI or PII by design.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">Your Responsibility</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>Users must not input any personally identifiable information (PII) or protected health information (PHI). Use client initials or codes only.</li>
      <li>Users are responsible for compliance with privacy laws like HIPAA and FERPA.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">How We Use Data</h2>
    <ul className="list-disc pl-6 mb-4">
      <li>We use usage data to maintain, improve, and secure the tool.</li>
      <li>We do not sell or share your data with third parties for marketing purposes.</li>
    </ul>

    <h2 className="text-xl font-semibold mt-8 mb-2">Data Security</h2>
    <p className="mb-4">We use industry-standard tools to store and protect any data we do collect. However, no system can be 100% secure, so please avoid sharing sensitive information.</p>

    <h2 className="text-xl font-semibold mt-8 mb-2">Changes</h2>
    <p className="mb-4">We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated date.</p>

    <h2 className="text-xl font-semibold mt-8 mb-2">Contact Us</h2>
    <p className="mb-4">For questions, please contact us at <a href="mailto:helloslpcompass@gmail.com" className="text-blue-600 underline">helloslpcompass@gmail.com</a>.</p>
  </div>
);

export default Privacy; 