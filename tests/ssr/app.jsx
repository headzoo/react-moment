import React from 'react';
import Moment from '../../dist/index';

/**
 *
 */
class App extends React.Component {
  /**
   * @returns {*}
   */
  render() {
    return (
      <div>
        The time is now:&nbsp;
        <Moment />
      </div>
    );
  }
}

export default App;
