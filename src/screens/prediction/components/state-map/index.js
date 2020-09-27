import { connect } from 'react-redux';

import StateMap from './component';

import {
  setState,
} from '../../../../state/actions';

const mapStateToProps = (state) => {
  const {
    selections: {
      state: selectedState,
    },
  } = state;

  return {
    selectedState,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setState: (state) => {
      dispatch(setState(state));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(StateMap);
