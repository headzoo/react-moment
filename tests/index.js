'use strict';

import React     from 'react';
import ReactDOM  from 'react-dom';
import TestUtils from 'react-dom/test-utils';
import moment    from 'moment';
import Moment    from '../src/index';

const DATE_OUTPUT = 'Mon Apr 19 1976 12:59:00 GMT-0500';
const DATE_STRING = '1976-04-19T12:59-0500';
const DATE_DATE   = new Date(DATE_STRING);
const DATE_UNIX   = DATE_DATE.getTime() / 1000;

describe('react-moment', () => {
    
    it('children', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment></Moment>
        );
        let expected = moment().toString();
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
        
        date = TestUtils.renderIntoDocument(
            <Moment>{DATE_STRING}</Moment>
        );
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
        
        date = TestUtils.renderIntoDocument(
            <Moment>{DATE_DATE}</Moment>
        );
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
    });
    
    it('as', () => {
        let date = TestUtils.renderIntoDocument(
          <Moment as="span" parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
        );
        expect(ReactDOM.findDOMNode(date).tagName).toEqual('SPAN');
    });
    
    it('date', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment />
        );
        let expected = moment().toString();
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
        
        date = TestUtils.renderIntoDocument(
            <Moment date={DATE_STRING} />
        );
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
        
        date = TestUtils.renderIntoDocument(
            <Moment date={DATE_DATE} />
        );
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
    });
    
    it('parse', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
        );
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
    });
    
    it('format', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment format="YYYY-MM-DD">{DATE_STRING}</Moment>
        );
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual("1976-04-19");
    });
    
    it('fromNow', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment fromNow>{DATE_STRING}</Moment>
        );
        let expected = moment(DATE_STRING).fromNow();
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
    
        date = TestUtils.renderIntoDocument(
            <Moment fromNow ago>{DATE_STRING}</Moment>
        );
        expected = moment(DATE_STRING).fromNow(true);
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
    });
    
    it('from', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment from="2016-09-20T12:00">{DATE_STRING}</Moment>
        );
        let expected = moment(DATE_STRING).from("2016-09-20T12:00");
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
    
        date = TestUtils.renderIntoDocument(
            <Moment from="2016-09-20T12:00" ago>{DATE_STRING}</Moment>
        );
        expected = moment(DATE_STRING).from("2016-09-20T12:00", true);
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
    });
    
    it('toNow', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment toNow>{DATE_STRING}</Moment>
        );
        let expected = moment(DATE_STRING).toNow();
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
        
        date = TestUtils.renderIntoDocument(
            <Moment toNow ago>{DATE_STRING}</Moment>
        );
        expected = moment(DATE_STRING).toNow(true);
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
    });
    
    it('to', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment to="2016-09-20T12:00">{DATE_STRING}</Moment>
        );
        let expected = moment(DATE_STRING).to("2016-09-20T12:00");
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
    
        date = TestUtils.renderIntoDocument(
            <Moment to="2016-09-20T12:00" ago>{DATE_STRING}</Moment>
        );
        expected = moment(DATE_STRING).to("2016-09-20T12:00", true);
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
    });
    
    it('calendar', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment calendar>{DATE_STRING}</Moment>
        );
        let expected = moment(DATE_STRING).calendar();
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(expected);
    });
    
    it('unix', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment unix>{DATE_UNIX}</Moment>
        );
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);
    });
    
    it('utc', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment utc>1976-04-19T12:59</Moment>
        );
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual('Mon Apr 19 1976 12:59:00 GMT+0000');
    });

    it('tz', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment unix tz="America/Los_Angeles">{DATE_UNIX}</Moment>
        );
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual('Mon Apr 19 1976 09:59:00 GMT-0800');
    });
    
    it('other', () => {
        let date = TestUtils.renderIntoDocument(
            <Moment className="testing" aria-hidden={true}>{DATE_STRING}</Moment>
        );
        expect(ReactDOM.findDOMNode(date).getAttribute('class')).toEqual('testing');
        expect(ReactDOM.findDOMNode(date).getAttribute('aria-hidden')).toEqual('true');
    });

    it('updates content when props are updated', () => {
        const renderInContainer = function(component, componentProps={}) {
            class PropChangeContainer extends React.Component {
                constructor(props) {
                    super(props);
                    this.state = props;
                }
                render() {
                    return React.createElement(component, this.state);
                }
            }

            let container = TestUtils.renderIntoDocument(<PropChangeContainer {...componentProps} />);
            let instance = TestUtils.findRenderedComponentWithType(container, component);

            return [container, instance];
        };

        let [container, date] = renderInContainer(Moment, {children: DATE_STRING});
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(DATE_OUTPUT);

        const NEW_DATE_STRING = '1976-04-20T12:59-0500';
        const NEW_DATE_OUTPUT = 'Tue Apr 20 1976 12:59:00 GMT-0500';

        container.setState({
            children: NEW_DATE_STRING
        });
        expect(ReactDOM.findDOMNode(date).innerHTML).toEqual(NEW_DATE_OUTPUT);
    });
});

