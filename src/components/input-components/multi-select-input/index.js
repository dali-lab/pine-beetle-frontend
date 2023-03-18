import { connect } from 'react-redux';

import { clearSelections } from '../../../state/actions';

import MultiSelectInput from './component';

const mapDispatchToProps = (dispatch) => {
  return {
    clearAllSelections: () => {
      dispatch(clearSelections());
    },
  };
};

export default connect(
  null,
  mapDispatchToProps,
)(MultiSelectInput);
