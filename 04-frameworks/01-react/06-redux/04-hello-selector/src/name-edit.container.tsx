import { connect } from "react-redux";
import { NameEditComponent } from "./name-edit.component";
import { updateUserProfileName } from "./action";
import { State } from "./reducer";

const mapStateToProps = (state: State) => {
  return {
    username: state.userProfileReducer.firstname,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onChange: (name: string) => dispatch(updateUserProfileName(name)),
  };
};

export const NameEditContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(NameEditComponent);
