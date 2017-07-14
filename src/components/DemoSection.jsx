import React from 'react';
import Moment from 'react-moment';
import formatter from '../formatter';
import hljs from 'highlight.js';

const FormGroup = ({cols, className, error, label, id, children, ...props}) => (
  <div className={'form-group col-' + cols + ' ' + className + (error ? ' has-danger' : '')} {...props}>
    {label != ''
      ? <label htmlFor={id}>{label}</label>
      : null}
    {children}
  </div>
);

FormGroup.defaultProps = {
  id: '',
  label: '',
  cols: '6',
  className: '',
  error: false
};

export default class DemoSection extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      date: '1976-04-19',
      format: 'MMMM Do YYYY',
      fromNow: false,
      element: 'time'
    };
  }
  
  createCodeComponent() {
    const props = this.state;
    const code  = formatter.removeExtraWhitespace(`<Moment
        date="${props.date}"
        format="${props.format}"
        element="${props.element}"
        fromNow={${props.fromNow}}
    />`);
    
    return {
      __html: hljs.highlight('html', code, true).value
    };
  }
  
  render() {
    const { date, format, fromNow, element } = this.state;
    
    let moment = null;
    if (fromNow) {
      moment = (
        <Moment
          date={date}
          fromNow
          />
      );
    } else {
      moment = (
        <Moment
          date={date}
          format={format}
          />
      );
    }
    
    return (
      <section>
        <pre className="hljs tall" dangerouslySetInnerHTML={this.createCodeComponent()} />
        <div className="form-text text-muted">Outputs</div>
        <pre className="demo-output hljs">
          {`<${element}>`}
          {moment}
          {`</${element}>`}
        </pre>
  
        <div className="form-text text-muted">
          Change the prop values below to update the preview above.
        </div>
        <div className="demo-form">
          <div className="row">
            {/* date */}
            <FormGroup id="form-input-date" label="date">
              <input
                type="text"
                className="form-control"
                id="form-input-date"
                value={date}
                onChange={e => this.setState({date: e.target.value})}
                />
            </FormGroup>
    
            {/* format */}
            <FormGroup id="form-input-format" label="format">
              <input
                type="text"
                className="form-control"
                id="form-input-date"
                value={format}
                onChange={e => this.setState({format: e.target.value})}
                />
            </FormGroup>
          </div>
          <div className="row">
            {/* fromNow */}
            <FormGroup id="form-input-from-now" label="fromNow">
              <select
                id="form-input-from-now"
                className="form-control"
                value={fromNow}
                onChange={e => this.setState({fromNow: e.target.value})}
                >
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>
            </FormGroup>
    
            {/* element */}
            <FormGroup id="form-input-element" label="element">
              <input
                type="text"
                className="form-control"
                id="form-input-element"
                value={element}
                onChange={e => this.setState({element: e.target.value})}
                />
            </FormGroup>
          </div>
        </div>
      </section>
    )
  }
}
