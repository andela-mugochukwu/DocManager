import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { searchDocuments } from '../../actions/documentActions';
import Search from '../presentation/Search';

export default
connect(null, { searchDocuments })(withRouter(Search));
