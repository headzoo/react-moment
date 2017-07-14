import React from 'react';
import formatter from '../formatter';
import Code from './Code';

const usage = `
import React  from 'react';
import Moment from 'react-moment';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      date: '1976-04-19T12:59-0500'
    };
  }
  
  render() {
    const { date } = this.state;
    
    return (
      <Moment format="MMMM Do YYYY">
        {date}
      </Moment>
    )
  }
}
`;

const output = `
<time>April 19th 1976</time>
`;

const UsageSection = () => (
  <section>
    <h2>Usage</h2>
    <Code lang="jsx">
      {usage}
    </Code>
    <div className="form-text text-muted">
      Outputs
    </div>
    <Code lang="html">{output}</Code>
    <p>
      See the <a href="https://github.com/headzoo/react-moment/blob/master/README.md">documentation</a> for more detailed examples.
    </p>
  </section>
);

export default UsageSection;