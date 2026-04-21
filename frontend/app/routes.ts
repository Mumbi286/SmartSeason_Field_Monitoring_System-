import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home/index.tsx"),
  route("about", "./routes/about/index.tsx"),
  route("contact", "./routes/contact/index.tsx"),
  route("login", "./routes/login/index.tsx"),
  route("signup", "./routes/signup/index.tsx"),
] satisfies RouteConfig;
