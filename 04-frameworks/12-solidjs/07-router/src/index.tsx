import { Router, Route, Routes } from "@solidjs/router";
import { render } from "solid-js/web";
import "./styles.css";
import { MemberProvider } from "./members.store";
import { MemberListPage } from "./member-list.page";
import { MemberDetailPage } from "./member-detail.page";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MemberListPage />} />
        <Route path="/member/:id" element={<MemberDetailPage />} />
      </Routes>
    </Router>
  );
};

render(
  () => (
    <MemberProvider>
      <App />
    </MemberProvider>
  ),
  document.getElementById("root")
);
