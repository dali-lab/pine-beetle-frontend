import { connect } from 'react-redux';

import PlayWithModel from './component';

const mapStateToProps = (state) => {
  const {
    selections: {
      county,
      state: selectedState,
      year,
    },
    trappings: {
      county: countyTrappingsData,
      rangerDistrict: rangerDistrictTrappingsData,
    },
  } = state;

  return {
    county,
    countyTrappingsData,
    rangerDistrictTrappingsData,
    selectedState,
    year,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayWithModel);
