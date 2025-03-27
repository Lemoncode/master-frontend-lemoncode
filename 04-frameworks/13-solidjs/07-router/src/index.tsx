import { Router, Route } from "@solidjs/router";
import { render } from "solid-js/web";
import "./styles.css";
import { MemberProvider } from "./members.store";
import { MemberListPage } from "./member-list.page";
import { MemberDetailPage } from "./member-detail.page";

const App = () => {
  return (
    <Router>
      <Route path="/" component={MemberListPage} />
      <Route path="/member/:id" component={MemberDetailPage} />
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
