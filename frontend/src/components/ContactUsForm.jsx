import PropTypes from 'prop-types';

import styles from './ContactUsForm.module.css';

const ContactUsForm = ({
  firstName = '',
  lastName = '',
  phone = '',
  email = '',
  boardPosition = [],
  communityName = '',
  communityLocation = '',
  numberOfUnits = '',
  propertyType = '',
  description = '',
  referral = '',
}) => {
  const handleSubmit = async e => {
    e.preventDefault();
    const form = e.target;
    const formData = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      phone: form.phone.value,
      email: form.email.value,
      boardPosition: Array.from(
        form.querySelectorAll('input[name="boardPosition"]:checked')
      ).map(el => el.value),
      communityName: form.communityName.value,
      communityLocation: form.communityLocation.value,
      numberOfUnits: form.numberOfUnits.value,
      propertyType: form.propertyType.value,
      description: form.description.value,
      referral: form.referral.value,
    };

    await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    window.location.href =
      'mailto:atbmanagement4@gmail.com?subject=Contact%20Form&body=' +
      encodeURIComponent(JSON.stringify(formData, null, 2));
  };

  return (
    <div className={styles.container}>
      <div className={styles.infoBlock}>
        <div className="image-frame">
          <img src="/assets/ATB-Logo.jpg" alt="ATB logo" width={150} />
        </div>
        <h1>Community. Well Served.</h1>
        <p>
          Are you a prospective board member, developer, or builder seeking a new management company?
          Please complete the Request for Proposal form and ATB’s Business Development Manager will
          contact you promptly during normal business hours. We sincerely appreciate your interest in
          ATB and assure you that all inquiries will be kept confidential.
        </p>
      </div>
      <div className={styles.formColumn}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label
              htmlFor="firstName"
              className="block w-full mb-4 text-gray-800"
            >
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              defaultValue={firstName}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="lastName"
              className="block w-full mb-4 text-gray-800"
            >
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              defaultValue={lastName}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="phone"
              className="block w-full mb-4 text-gray-800"
            >
              Your Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              defaultValue={phone}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="email"
              className="block w-full mb-4 text-gray-800"
            >
              Your Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={email}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
          <fieldset className={`${styles.formGroup} ${styles.optionsRow}`}>
            <legend>Board Position</legend>
            <label>
              <input
                type="checkbox"
                name="boardPosition"
                value="President"
                defaultChecked={boardPosition.includes('President')}
              />
              President
            </label>
            <label>
              <input
                type="checkbox"
                name="boardPosition"
                value="VP"
                defaultChecked={boardPosition.includes('VP')}
              />
              VP
            </label>
            <label>
              <input
                type="checkbox"
                name="boardPosition"
                value="Secretary"
                defaultChecked={boardPosition.includes('Secretary')}
              />
              Secretary
            </label>
            <label>
              <input
                type="checkbox"
                name="boardPosition"
                value="Treasurer"
                defaultChecked={boardPosition.includes('Treasurer')}
              />
              Treasurer
            </label>
            <label>
              <input
                type="checkbox"
                name="boardPosition"
                value="Developer/Builder"
                defaultChecked={boardPosition.includes('Developer/Builder')}
              />
              Developer/Builder
            </label>
            <label>
              <input
                type="checkbox"
                name="boardPosition"
                value="Other"
                defaultChecked={boardPosition.includes('Other')}
              />
              Other
            </label>
          </fieldset>
          <div className={styles.formGroup}>
            <label
              htmlFor="communityName"
              className="block w-full mb-4 text-gray-800"
            >
              Community Name
            </label>
            <input
              id="communityName"
              name="communityName"
              type="text"
              defaultValue={communityName}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="communityLocation"
              className="block w-full mb-4 text-gray-800"
            >
              Community Location
            </label>
            <input
              id="communityLocation"
              name="communityLocation"
              type="text"
              defaultValue={communityLocation}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="numberOfUnits"
              className="block w-full mb-4 text-gray-800"
            >
              Number of Units
            </label>
            <input
              id="numberOfUnits"
              name="numberOfUnits"
              type="number"
              defaultValue={numberOfUnits}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
          <fieldset className={`${styles.formGroup} ${styles.optionsRow}`}>
            <legend>Property Type</legend>
            <label>
              <input
                type="radio"
                name="propertyType"
                value="Single Family"
                defaultChecked={propertyType === 'Single Family'}
              />
              Single Family
            </label>
            <label>
              <input
                type="radio"
                name="propertyType"
                value="Townhome"
                defaultChecked={propertyType === 'Townhome'}
              />
              Townhome
            </label>
            <label>
              <input
                type="radio"
                name="propertyType"
                value="Condo"
                defaultChecked={propertyType === 'Condo'}
              />
              Condo
            </label>
            <label>
              <input
                type="radio"
                name="propertyType"
                value="Mixed Use"
                defaultChecked={propertyType === 'Mixed Use'}
              />
              Mixed Use
            </label>
          </fieldset>
          <div className={styles.formGroup}>
            <label
              htmlFor="description"
              className="block w-full mb-4 text-gray-800"
            >
              Tell Us About Your Community
            </label>
            <textarea
              id="description"
              name="description"
              defaultValue={description}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
          <div className={styles.formGroup}>
            <label
              htmlFor="referral"
              className="block w-full mb-4 text-gray-800"
            >
              How did you hear about us?
            </label>
            <input
              id="referral"
              name="referral"
              type="text"
              defaultValue={referral}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:border-blue-500"
            />
          </div>
          <div className={styles.formGroup}>
            <button
              type="submit"
              className="w-full py-3 bg-[#FFC857] text-[#1A2A44] font-semibold rounded-lg hover:bg-[#e6b64b] transition"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ContactUsForm.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  phone: PropTypes.string,
  email: PropTypes.string,
  boardPosition: PropTypes.arrayOf(PropTypes.string),
  communityName: PropTypes.string,
  communityLocation: PropTypes.string,
  numberOfUnits: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  propertyType: PropTypes.string,
  description: PropTypes.string,
  referral: PropTypes.string,
};

export default ContactUsForm;
