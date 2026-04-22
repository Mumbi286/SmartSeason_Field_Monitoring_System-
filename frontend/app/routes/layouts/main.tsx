import { Outlet } from "react-router";


const MainLayout = () => {
  return (
    <>
      <section className="max-w-6xl mx-auto px-4 py-8">
        <Outlet />
      </section>
    </>
  );
};

export default MainLayout;
