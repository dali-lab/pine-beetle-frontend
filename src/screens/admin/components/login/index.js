import { connect } from 'react-redux';

import { login } from '../../../../state/actions';

import Login from './component';

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (email, password, onSuccess, onError) => {
      dispatch(login(email, password, onSuccess, onError));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);
