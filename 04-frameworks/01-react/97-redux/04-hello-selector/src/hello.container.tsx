import { connect } from "react-redux";
import { State } from "./reducer";
import { HelloComponent } from "./hello.component";
import { getFullname } from "./reducer/selector";

const mapStateToProps = (state: State) => {
  return {
    username: getFullname(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export const HelloContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HelloComponent);
