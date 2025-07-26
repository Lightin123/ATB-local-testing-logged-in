import ContactUsForm from '../components/ContactUsForm';

const ContactUs = () => (
  <div className="pt-24">
    <div className="mt-12">
      <h1 className="text-3xl font-semibold">Contact Us</h1>
      <div className="max-w-[1200px] p-12 bg-white rounded-xl shadow-2xl">
        <ContactUsForm />
      </div>
    </div>
  </div>
);

export default ContactUs;
