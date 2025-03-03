import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { store } from "./redux/store";
import { routerConfig } from "./router/routerConfig";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={routerConfig} />
  </Provider>
);
