import { connect } from 'react-redux';

import ChangePassword from './component';

const mapStateToProps = (state) => {
  const {
    user: {
      user: {
        email,
      },
    },
  } = state;

  return {
    email,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChangePassword);
