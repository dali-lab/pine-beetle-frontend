import { connect } from 'react-redux';

import { signUp } from '../../../../state/actions';

import AddUser from './component';

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUser: (email, password, firstName, lastName, onSuccess, onError) => {
      dispatch(signUp(email, password, firstName, lastName, onSuccess, onError));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddUser);
