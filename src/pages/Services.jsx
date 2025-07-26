import React from 'react';

const Services = () => (
  <>
    <div className="pt-24 pb-4">
      <h1 className="text-4xl font-bold text-center text-[#0d4f3d]">Our Services</h1>
    </div>

    <div className="px-4">
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="shadow-2xl rounded-2xl p-6 bg-[#F8F9FA] hover:bg-white transition-all">
          <h2 className="text-xl font-bold text-[#0d4f3d] mb-3">Financial &amp; Accounting Management</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Full-service HOA accounting and financial management</li>
            <li>Budget preparation &amp; financial planning for short-term and long-term goals</li>
            <li>Monthly financial reporting with full transparency</li>
            <li>HOA dues collections and delinquency management</li>
            <li>Vendor invoice processing &amp; payments to ensure timely service</li>
            <li>Reserve fund management and financial forecasting</li>
            <li>Insurance coordination &amp; annual tax return filings</li>
          </ul>
        </div>

        <div className="shadow-2xl rounded-2xl p-6 bg-[#F8F9FA] hover:bg-white transition-all">
          <h2 className="text-xl font-bold text-[#0d4f3d] mb-3">HOA Communications &amp; Administrative Support</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Homeowner inquiry management – phone, email, and online portal responses</li>
            <li>Board meeting facilitation, including scheduling and agenda preparation</li>
            <li>Drafting, amending, and enforcing governing documents (CC&amp;Rs, bylaws, policies)</li>
            <li>Violation enforcement &amp; compliance tracking</li>
            <li>Community-wide notices, newsletters, and updates</li>
          </ul>
        </div>

        <div className="shadow-2xl rounded-2xl p-6 bg-[#F8F9FA] hover:bg-white transition-all">
          <h2 className="text-xl font-bold text-[#0d4f3d] mb-3">Maintenance &amp; Vendor Coordination</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Work order management – tracking and resolving maintenance requests</li>
            <li>Vendor selection &amp; contract negotiations to secure quality services at competitive rates</li>
            <li>Scheduling &amp; oversight of maintenance and repairs</li>
            <li>Regular property inspections to ensure community upkeep and compliance</li>
          </ul>
        </div>

        <div className="shadow-2xl rounded-2xl p-6 bg-[#F8F9FA] hover:bg-white transition-all">
          <h2 className="text-xl font-bold text-[#0d4f3d] mb-3">Board Support &amp; Governance</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Guidance on governance best practices and board member training</li>
            <li>Strategic planning &amp; policy development to align with community goals</li>
            <li>Document management &amp; record-keeping for easy board access</li>
          </ul>
        </div>

        <div className="shadow-2xl rounded-2xl p-6 bg-[#F8F9FA] hover:bg-white transition-all">
          <h2 className="text-xl font-bold text-[#0d4f3d] mb-3">Technology &amp; Process Automation</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Homeowner portal access for payments, work orders, and communication</li>
            <li>Automated financial tracking and reporting for real-time insights</li>
            <li>Streamlined processes that allow us to be more present on-site and engaged with the community</li>
          </ul>
        </div>
      </section>
    </div>

    <p className="my-6 text-base leading-relaxed text-gray-800 px-4">
      ATB Community Management, Inc. provides a comprehensive range of HOA management services designed to streamline operations, enhance financial stability, and foster a well-maintained, thriving community. Our approach prioritizes responsiveness, transparency, and efficiency, ensuring that board members and homeowners receive the support they need.
    </p>

    <p className="my-6 text-base leading-relaxed text-gray-800 px-4">
      At ATB Community Management, Inc., we don&rsquo;t just manage communities—we build them. Our hands-on approach ensures that your association receives personalized service, proactive support, and a level of care that exceeds expectations.
    </p>
  </>
);

export default Services;
