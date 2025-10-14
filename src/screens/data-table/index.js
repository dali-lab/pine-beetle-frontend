import { connect } from 'react-redux';

import { getSparseData } from '../../state/actions';
import DataTableScreen from './component';

const mapStateToProps = (state) => {
  const {
    data: {
      sparseData,
      fetchingSparseData,
    },
    error: {
      fetchError: {
        text: errorText,
      },
    },
    selections: {
      dataMode,
    },
  } = state;

  return {
    sparseData,
    isLoading: fetchingSparseData,
    errorText: errorText && errorText.length > 0 ? errorText[errorText.length - 1] : null,
    dataMode,
  };
};

const mapDispatchToProps = (dispatch) => ({
  getSparseData: (filters) => dispatch(getSparseData(filters)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataTableScreen);
