import { connect } from "react-redux";
import { memberRequest } from "../action";
import { MemberCollectionComponent } from "./member-collection.component";
import { State } from "../reducer";

const mapStateToProps = (state: State) => {
  return {
    memberCollection: state.memberReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadMemberCollection: () => {
      return dispatch(memberRequest());
    },
  };
};

export const MemberCollectionContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MemberCollectionComponent);
