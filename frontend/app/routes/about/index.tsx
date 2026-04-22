const companyHighlights = [
  {
    title: "Summary",
    content:
      "The Smart Season Field Monitoring System is a digital solution designed to transform modern agriculture through real-time data monitoring and analysis. It enables farmers and agribusiness stakeholders to track field conditions, manage resources efficiently, and make informed decisions based on accurate environmental and seasonal insights. By reducing uncertainty and improving planning, the system helps increase productivity, minimize losses, and drive profitability across farming operations",
  },
  {
    title: "Mission",
    content:
      "To empower farmers and agricultural businesses with intelligent, data-driven tools that improve decision-making, optimize resource use, and enhance productivity across every farming season.",
  },
  {
    title: "Vision",
    content:
      "To become a leading smart agriculture solution that revolutionizes farming by making precision, efficiency, and sustainability accessible to every farmer.",
  },
];

const ratings = [
  { label: "Ease of Use", score: 4.8 },
  { label: "Data Accuracy", score: 4.7 },
  { label: "Support", score: 4.6 },
  { label: "Overall Satisfaction", score: 4.9 },
];

const comments = [
  {
    name: "Amina Kimani",
    text: "The field alerts helped us react early and avoid losses during unexpected weather changes.",
  },
  {
    name: "Daniel Kemboi",
    text: "Clean dashboard, useful trends, and easy onboarding for my farm team.",
  },
  {
    name: "Grace Nyeri",
    text: "I now plan irrigation with confidence because the updates are consistent and clear.",
  },
  {
    name: "Samuel Mutuma",
    text: "The recommendations are practical, and our seasonal planning has improved a lot.",
  },
];

const AboutPage = () => {
  const scrollingComments = [...comments, ...comments];
  const maxStars = 5;

  return (
    <section className="space-y-10 text-white">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          About SmartSeason Field
        </h1>
        <p className="text-gray-300">
          Learn more about who we are, what users are saying, and how the
          platform supports better farming decisions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {companyHighlights.map((item) => (
          <article
            key={item.title}
            className="bg-green-900/55 border border-green-700 rounded-xl p-5"
          >
            <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
            <p className="text-gray-200 leading-relaxed">{item.content}</p>
          </article>
        ))}
      </div>

      <div className="bg-green-900/55 border border-green-700 rounded-xl p-6 overflow-hidden">
        <h2 className="text-2xl font-semibold mb-4">User Comments</h2>
        <div className="relative overflow-hidden">
          <div className="flex w-max gap-4 animate-[comment-marquee_22s_linear_infinite]">
            {scrollingComments.map((comment, index) => (
              <article
                key={`${comment.name}-${index}`}
                className="w-80 shrink-0 bg-green-950/60 border border-green-800 rounded-lg p-4"
              >
                <p className="text-gray-100 mb-3">"{comment.text}"</p>
                <p className="text-sm text-green-300 font-semibold">
                  - {comment.name}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-green-900/55 border border-green-700 rounded-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Ratings from Users</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {ratings.map((rating) => (
            <div
              key={rating.label}
              className="bg-green-950/50 rounded-lg px-4 py-3 border border-green-800"
            >
              <p className="text-sm text-green-200">{rating.label}</p>
              <p className="text-xl font-bold text-yellow-300">
                {rating.score.toFixed(1)} / 5.0
              </p>
              <div className="mt-1 text-yellow-400 tracking-wide">
                {"★".repeat(Math.round(rating.score))}
                {"☆".repeat(maxStars - Math.round(rating.score))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPage;