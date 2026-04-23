import { FiMail, FiPhone } from "react-icons/fi";

const ContactPage = () => {
  return (
    <section className="max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-6 space-y-3">
      <h2 className="text-2xl font-bold text-slate-100">Contact Us</h2>
      <p className="text-slate-300 text-sm">
        Don't hesitate to reach out for support, feature requests, or onboarding guidance.
      </p>
      <div className="space-y-2 text-sm text-slate-300">
        <p className="flex items-center gap-2">
          <FiMail className="text-green-300" aria-hidden="true" />
          <span>Email: support@smartseason.test</span>
        </p>
        <p className="flex items-center gap-2">
          <FiPhone className="text-green-300" aria-hidden="true" />
          <span>Phone: +254 712 345 678</span>
        </p>
      </div>
    </section>
  );
};

export default ContactPage;