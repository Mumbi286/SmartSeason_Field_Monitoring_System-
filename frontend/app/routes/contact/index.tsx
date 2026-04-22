const ContactPage = () => {
  return (
    <section className="max-w-2xl rounded-lg border border-slate-800 bg-slate-900 p-6 space-y-3">
      <h2 className="text-2xl font-bold text-slate-100">Contact Us</h2>
      <p className="text-slate-300 text-sm">
        Reach out for support, feature requests, or onboarding guidance.
      </p>
      <div className="space-y-1 text-sm text-slate-300">
        <p>Email: support@smartseason.test</p>
        <p>Phone: +254 712 345 678</p>
      </div>
    </section>
  );
};

export default ContactPage;