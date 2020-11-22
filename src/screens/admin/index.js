import { connect } from 'react-redux';

import { signOut } from '../../state/actions';

import Admin from './component';

const mapStateToProps = (state) => {
  const {
    user: {
      user,
    },
  } = state;

  const isLoggedIn = Object.keys(user).length > 0;

  return {
    isLoggedIn,
    user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signOut: () => {
      dispatch(signOut());
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Admin);
