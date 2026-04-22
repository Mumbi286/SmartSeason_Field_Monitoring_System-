import { Link } from "react-router";
import { useAppContext } from "~/context/AppContext";

type HeroProps = {
  name?: string;
  text?: string;
};

// Making it more dynamic by destructure
const Hero = ({
  text = "Track crop progress, assign field agents, and monitor stage updates in one place. SmartSeason helps teams make timely decisions and reduce avoidable crop risk.",
}) => {
  const { currentUser } = useAppContext();

  return (
    <header className="relative z-0 overflow-hidden text-white min-h-[60vh] sm:min-h-[65vh] flex items-center justify-center px-4 py-12 sm:py-16">
      {/* background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/maizeplants.jpg"
          alt="Maize plants background"
          className="w-full h-full object-cover object-center brightness-50"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-black/60" />

      <div className="relative z-20 mx-auto w-full max-w-3xl text-center">
        <h2 className="text-3xl sm:text-4xl mb-4 font-bold">
          Farm Smarter. Harvest Better. Profit More
        </h2>
        <p className="text-base sm:text-lg text-gray-100 max-w-2xl mx-auto">
          {text}
        </p>
        <h2 className="text-base sm:text-lg text-green-200 max-w-2xl mx-auto font-extrabold mt-3">
          Monitor your fields. Predict your seasons. Grow with confidence
        </h2>
        {/* Buttons  */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mt-6">
          <Link
            to={currentUser ? "/dashboard" : "/login"}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            {currentUser ? "Open Dashboard" : "Get Started"}
          </Link>
          <Link
            to="/contact"
            className="border border-green-500 text-blue-100 px-6 py-2 rounded hover:bg-green-600 hover:text-white transition"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Hero;
