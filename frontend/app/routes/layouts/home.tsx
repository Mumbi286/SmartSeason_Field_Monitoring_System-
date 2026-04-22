import { Outlet } from "react-router";
import Hero from "~/components/Hero";

const HomeLayout = () => {
  return (
    <>
      <Hero />
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <Outlet />
      </section>
    </>
  );
};

export default HomeLayout;
