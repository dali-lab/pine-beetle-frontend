import { connect } from 'react-redux';

import { setDataMode } from '../../state/actions';

import Header from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      dataMode,
    },
  } = state;

  return {
    dataMode,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setDataMode: (mode) => {
      dispatch(setDataMode(mode));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);
