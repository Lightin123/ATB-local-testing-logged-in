import React from 'react';
import styles from './WhoWeAre.module.css';
import atbLogo from '/assets/ATBlogo.jpg';
import walkImg from '/assets/walk.jpg';
import SWP2 from '/assets/SWP2.jpeg';
import WWW from '/assets/WWW.jpg';

const WhoWeAre = () => (
  <>
    <section className="relative w-full h-[50vh] mt-16">
      <div className="absolute inset-0 grid grid-cols-2">
        <img src={SWP2} className="w-full h-full object-cover" alt="" />
        <img src={WWW} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
        <h1 className={styles.title}>Who We Are</h1>
        <img src={atbLogo} className="h-36 w-auto my-8" alt="ATB logo" />
        <p className="text-lg text-white">Community. Well Served.</p>
      </div>
    </section>
    <div className={styles.container}>

    <div className="mt-6 text-center">
      <p className={styles.paragraph}>
        Thank you for considering ATB Community Management, Inc. for your Association’s management needs. We are a specialized HOA management company that believes in providing Above the Bar service—where responsiveness, reliability, and personalized attention are at the core of everything we do.
      </p>
    </div>

    <section className={styles.section}>
      <div className={styles.card}>
        <p className={styles.paragraph}>
          ATB Community Management, Inc. was founded by Jordan Bailey and Alyssa Lawrence, two dedicated professionals who bring a combined 20+ years of HOA industry experience with a strong foundation in financial management and operational efficiency.
        </p>
      </div>
    </section>

    <section className={styles.section}>
      <div className="flex flex-col lg:flex-row items-start lg:items-stretch gap-4 mt-12">
        <div className="flex-1">
          <div className={styles.card}>
            <h2 className={styles.subheading}>Why ATB?</h2>
            <ul className={styles.list}>
              <li>Unmatched Responsiveness</li>
              <li>Financial Expertise</li>
              <li>Exclusive Style Service</li>
              <li>Technology-Driven Efficiency</li>
              <li>Commitment to Community</li>
            </ul>
          </div>
        </div>
        <div className="flex-1 rounded-lg overflow-hidden">
          <img src={walkImg} className="w-full h-full object-cover" alt="Walk image" />
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <h2 className={styles.subheading}>Background &amp; Experience</h2>
      <div className={styles.columns}>
        <div className={styles.card}>
          <p className={styles.paragraph}>
            Our team brings a comprehensive skill set that spans day-to-day operations, long-term planning, and transparent financial management. This balanced expertise ensures every community receives attentive service backed by sound accounting principles.
          </p>
        </div>
        <div className={styles.card}>
          <p className={styles.paragraph}>
            We work hand in hand with board members, leveraging automated processes and technology to streamline operations. Since launching in December 2024, our growth reflects the trust our communities place in us.
          </p>
        </div>
      </div>
    </section>

    <section className={styles.section}>
      <div className={styles.card}>
        <p className={styles.paragraph}>
          We would love the opportunity to discuss how ATB Community Management, Inc., can support your Association and provide a level of Above the Bar service that exceeds expectations. We look forward to working with you. —Jordan Bailey, President; Alyssa Lawrence, Vice President.
        </p>
      </div>
    </section>
  </div>
  </>
);

export default WhoWeAre;
