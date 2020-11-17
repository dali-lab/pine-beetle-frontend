import { connect } from 'react-redux';

import InputContainer from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      year,
    },
  } = state;

  return {
    year,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InputContainer);
