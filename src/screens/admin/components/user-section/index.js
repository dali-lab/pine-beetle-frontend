import { connect } from 'react-redux';
import UserSection from './component';

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

export default connect(mapStateToProps, mapDispatchToProps)(UserSection);
