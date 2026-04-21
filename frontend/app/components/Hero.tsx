import { Link } from "react-router";

type HeroProps = {
  name?: string;
  text?: string;
};

// Making it more dynamic by destructure
const Hero = ({
  name = "[NAME]",
  text = "Take control of your farming decisions with real-time field insights. The Smart Season Field Monitoring System helps you track environmental conditions, optimize resources, and respond to changes before they become costly problems.\Stop relying on guesswork. Start using data to plan every season, protect your crops, and maximize your yields—no matter the conditions.",
}) => {
  return (
    <header className="relative z-0 overflow-hidden text-center py-20 px-4 text-white">
      <div className="absolute inset-0 z-0">
        <img
          src="/maizeplants.jpg"
          alt="Maize plants background"
          className="w-full h-full object-cover brightness-75"
        />
      </div>
      <div className="absolute inset-0 z-10 bg-black/60" />

      <div className="relative z-20 mx-auto max-w-3xl">
        <h2 className="text-4xl mb-4 font-bold">
          Farm Smarter. Harvest Better. Profit More{" "}
        </h2>
        <p className="text-lg text-gray-100 max-w-2xl mx-auto">{text}</p>
        <p className="text-lg text-gray-100 max-w-2xl mx-auto font-extrabold">
          Monitor your fields. Predict your seasons. Grow with confidence
        </p>

        <div className="flex justify-center gap-4 mt-6">
          <Link
            to="/about"
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            About Us
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
