import { connect } from "react-redux";
import { State } from "./reducer";
import { HelloComponent } from "./hello.component";

const mapStateToProps = (state: State) => {
  return {
    username: state.userProfileReducer.firstname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export const HelloContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(HelloComponent);
