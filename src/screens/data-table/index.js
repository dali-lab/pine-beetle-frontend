import { connect } from 'react-redux';

import {
  mapDataTableDispatchToProps,
  mapDataTableStateToProps,
} from '../../state/selectors';
import DataTableScreen from './component';

export default connect(
  mapDataTableStateToProps,
  mapDataTableDispatchToProps
)(DataTableScreen);
