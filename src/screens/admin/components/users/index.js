import { connect } from 'react-redux';
import Users from './component';

const mapStateToProps = (state) => {
  const {
    user: { user },
  } = state;

  return {
    activeUser: user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Users);
