react-moment
============
React component for the [moment](http://momentjs.com/) date library.

[![Build Status](https://img.shields.io/travis/headzoo/react-moment/master.svg?style=flat-square)](https://travis-ci.org/headzoo/react-moment)
[![Coverage Status](https://img.shields.io/coveralls/github/headzoo/react-moment.svg?style=flat-square)](https://coveralls.io/github/headzoo/react-moment?branch=master)
[![NPM Downloads](https://img.shields.io/npm/dm/react-moment.svg?style=flat-square)](https://www.npmjs.com/package/react-moment)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/headzoo/react-moment/master/LICENSE)

- [Installing](#installing)
- [Timezone Support](#timezone-support)
- [Quick Start](#quick-start)
- [Props](#props)
    - [Interval](#interval)
    - [Formatting](#formatting)
    - [Parsing Dates](#parsing-dates)
    - [Add and Subtract](#add-and-subtract)
    - [From Now](#from-now)
    - [From Now During](#from-now-during)
    - [From](#from)
    - [To Now](#to-now)
    - [To](#to)
    - [Filter](#filter)
    - [With Title](#with-title)
    - [Title Format](#title-format)
    - [Difference](#difference)
    - [Duration](#duration)
    - [Duration From Now](#duration-from-now)
    - [Unix Timestamps](#unix-timestamps)
    - [Local](#local)
    - [Timezone](#timezone)
    - [Calendar](#calendar)
    - [Locale](#locale)
    - [Element](#element)
    - [OnChange](#onchange)
    - [Other Props](#other-props)
- [Pooled Timer](#pooled-timer)
- [Global Config](#global-config)
- [Usage with React Native](#usage-with-react-native)
- [License](#license)
- [Contributors](#contributors)


### Installing
Node 8 or greater is required. Use npm to install `react-moment` along with its peer dependency, `moment`.

```sh
npm install --save moment react-moment
```


### Timezone Support
The `moment-timezone` package is required to use the timezone related functions.

```sh
npm install --save moment-timezone
```

Then import the package into your project.

```jsx
import React from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

export default class App extends React.Component {
    ...
}
```


### Quick Start

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            const dateToFormat = '1976-04-19T12:59-0500';
            <Moment>{dateToFormat}</Moment>
        );
    }
}
```

Outputs:

```html
<time>Mon Apr 19 1976 12:59:00 GMT-0500</time>
```

The above example could also be written this way if you prefer to pass the date using an attribute rather than as a child to `<Moment>`.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            const dateToFormat = '1976-04-19T12:59-0500';
            <Moment date={dateToFormat} />
        );
    }
}
```

The date value may be a string, object, array, or `Date` instance.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            const dateToFormat = new Date('1976-04-19T12:59-0500');
            <Moment date={dateToFormat} />
        );
    }
}
```


### Props
The component supports the following props. See the [Moment docs](https://momentjs.com/docs/) for more information.

#### Interval
_interval={number}_

By default the time updates every 60 seconds (60000 milliseconds). Use the `interval` prop to change or disable updating.

Updates the time every 30 seconds (30000 milliseconds).
```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment interval={30000}>
                1976-04-19T12:59-0500
            </Moment>
        );
    }
}
```

Disables updating.
```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment interval={0}>
                1976-04-19T12:59-0500
            </Moment>
        );
    }
}
```


#### Formatting
_format={string}_

Formats the date according to the given format string. See the [Moment docs on formatting](https://momentjs.com/docs/#/parsing/string-format/) for more information.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment format="YYYY/MM/DD">
                1976-04-19T12:59-0500
            </Moment>
        );
    }
}
```

Outputs:

```html
<time>1976/04/19</time>
```

For Duration and DurationFromNow formatting, the formatting is done using a separate library. See the [Moment-Duration-Format docs on formatting](https://github.com/jsmreese/moment-duration-format#template) for more information.

```jsx
import React  from 'react';
import Moment from 'react-moment';
import moment from 'moment';

export default class MyComponent extends React.Component {
    const start = moment().add(-4, 'm');
    render() {
        return (
        <Moment date={start} format="hh:mm:ss" durationFromNow />
        );
    }
}
```

Outputs:

```html
<time>00:04:00</time>
```

#### Trim
_trim={string|bool}_

When formatting duration time, the largest-magnitude tokens are automatically trimmed when they have no value. See the [Moment-Duration-Format docs on trim](https://github.com/jsmreese/moment-duration-format#trim) for more information.

```jsx
import React  from 'react';
import Moment from 'react-moment';
import moment from 'moment';

export default class MyComponent extends React.Component {
    const start = moment().add(-4, 'm');
    render() {
        return (
        <Moment date={start} format="hh:mm:ss" trim durationFromNow />
        );
    }
}
```

Outputs:

```html
<time>04:00</time>
```

#### Parsing Dates
_parse={string}_

Moment can parse most standard date formats. Use the `parse` attribute to tell moment how to parse the given date when non-standard. See the [Moment docs on parsing](https://momentjs.com/docs/#/parsing/string-format/) for more information.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment parse="YYYY-MM-DD HH:mm">
                1976-04-19 12:59
            </Moment>
        );
    }
}
```

#### Add and Subtract
_add={object}_

_subtract={object}_

Used to add and subtract periods of time from the given date, with the time periods expressed as object literals. See the [Moment docs on add and subtract](https://momentjs.com/docs/#/manipulating/add/) for more information.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        const date = new Date();

        return (
            <div>
                <Moment add={{ hours: 12 }}>{date}</Moment>
                <Moment add={{ days: 1, hours: 12 }}>{date}</Moment>
                <Moment subtract={{ hours: 12 }}>{date}</Moment>
                <Moment subtract={{ days: 1, hours: 12 }}>{date}</Moment>
            </div>
        );
    }
}
```

#### From Now
_fromNow={bool}_

Sometimes called timeago or relative time, displays the date as the time _from now_, e.g. "5 minutes ago".

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment fromNow>1976-04-19T12:59-0500</Moment>
        );
    }
}
```

Outputs:

```html
<time>40 years ago</time>
```

Including `ago` with `fromNow` will omit the suffix from the relative time.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment fromNow ago>1976-04-19T12:59-0500</Moment>
        );
    }
}
```

Outputs:

```html
<time>40 years</time>
```

#### From Now During

_fromNowDuring={number}_

Setting _fromNowDuring_ will display the relative time as with _fromNow_ but just during its value in milliseconds, after that _format_ will be used instead.

#### From
_from={string}_

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment from="2015-04-19">1976-04-19T12:59-0500</Moment>
        );
    }
}
```

Outputs:

```html
<time>39 years</time>
```


#### To Now
_toNow={bool}_

Similar to `fromNow`, but gives the opposite interval.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment toNow>1976-04-19T12:59-0500</Moment>
        );
    }
}
```

Outputs:

```html
<time>40 years ago</time>
```


#### To
_to={string}_

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment to="2015-04-19">1976-04-19T12:59-0500</Moment>
        );
    }
}
```

Outputs:

```html
<time>39 years</time>
```

#### Filter
_filter={function}_

A function which modifies/transforms the date value prior to rendering.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        const toUpperCaseFilter = (d) => {
            return d.toUpperCase();
        };

        return (
            const dateToFormat = '1976-04-19T12:59-0500';
            <Moment filter={toUpperCaseFilter}>{dateToFormat}</Moment>
        );
    }
}
```

Outputs:

```html
<time>MON APR 19 1976 12:59:00 GMT-0500</time>
```


#### With Title
_withTitle={bool}_

Adds a `title` attribute to the element with the complete date.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment format="D MMM YYYY" withTitle>
                1976-04-19T12:59-0500
            </Moment>
        );
    }
}
```

Outputs:

```html
<time title="1976-04-19T12:59-0500">19 Apr 1976</time>
```


#### Title Format
_titleFormat={string}_

How the `title` date is formatted when using the `withTitle` attribute.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment titleFormat="D MMM YYYY" withTitle>
                1976-04-19T12:59-0500
            </Moment>
        );
    }
}
```

Outputs:

```html
<time title="19 Apr 1976">1976-04-19T12:59-0500</time>
```


#### Difference
_diff={string}_

_decimal={bool}_

_unit={string}_

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <div>
              <Moment diff="2015-04-19">1976-04-19T12:59-0500</Moment>
              <Moment diff="2015-04-19" unit="days">1976-04-19T12:59-0500</Moment>
              <Moment diff="2015-04-19" unit="years" decimal>1976-04-19T12:59-0500</Moment>
            </div>
        );
    }
}
```

#### Duration
_duration={string}_

_date={string}_

Shows the duration (elapsed time) between two dates. `duration` property should be behind `date` property time-wise.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment duration="2018-11-1T10:59-0500"
                    date="2018-11-1T12:59-0500"
            />
        );
    }
}
```

#### Duration From Now

_durationFromNow={bool}_

Shows the duration (elapsed time) between now and the provided datetime.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment date="2018-11-1T12:59-0500"
                    durationFromNow
            />
        );
    }
}
```

#### Unix Timestamps
_unix={bool}_

Tells Moment to parse the given date value as a unix timestamp.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        const unixTimestamp = 198784740;
        return (
            <Moment unix>{unixTimestamp}</Moment>
        );
    }
}
```

Outputs:

```html
<time>Mon Apr 19 1976 12:59:00 GMT-0500</time>
```

#### Local
_local={bool}_

Outputs the result in local time.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment local>
                2018-11-01T12:59-0500
            </Moment>
        );
    }
}
```

Outputs:

```html
<time>Thu Nov 01 2018 18:59:00 GMT+0100</time>
```


#### Timezone
_tz={string}_

Sets the timezone. To enable server side rendering (SSR), client and server has to provide same datetime, based on common Timezone. The `tz` attribute will enable set the common timezone.

```jsx
import React  from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

export default class MyComponent extends React.Component {
    render() {
        const unixTimestamp = 198784740;
        return (
            <Moment unix tz="America/Los_Angeles">
                {unixTimestamp}
            </Moment>
        );
    }
}
```

Outputs:

```html
<time>Mon Apr 19 1976 09:59:00 GMT-0800</time>
```

#### Calendar
_calendar={object|bool}_

Customize the strings used for the calendar function.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        const calendarStrings = {
            lastDay : '[Yesterday at] LT',
            sameDay : '[Today at] LT',
            nextDay : '[Tomorrow at] LT',
            lastWeek : '[last] dddd [at] LT',
            nextWeek : 'dddd [at] LT',
            sameElse : 'L'
        };

        return (
            <Moment calendar={calendarStrings}>
                '1976-04-19T12:59-0500'
            </Moment>
        );
    }
}
```


#### Locale
_locale={string}_

Sets the locale used to display the date.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        const dateToFormat = '1976-04-19T12:59-0500';
        return (
            <Moment locale="de">{dateToFormat}</Moment>
        );
    }
}
```

**Note**
In some cases the language file is not automatically loaded by moment, and it must be manually loaded. For example, to use the French locale, add the following to your bootstrap (e.g. index.js) script.

```js
import 'moment/locale/fr';
```

#### Element
_element={string|React.Component}_

The element type to render as (string or function).

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment element="span">1976-04-19T12:59-0500</Moment>
        );
    }
}
```

Outputs:

```html
<span>Mon Apr 19 1976 12:59:00 GMT-0500</span>
```


#### OnChange
_onChange={func}_

The `onChange` prop is called each time the date is updated, which by default is every 60 seconds. The function receives the new date value.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment onChange={(val) => { console.log(val); }}>
                1976-04-19T12:59-0500
            </Moment>
        );
    }
}
```


#### Other Props
Any other properties are passed to the `<time>` element.

```jsx
import React  from 'react';
import Moment from 'react-moment';

export default class MyComponent extends React.Component {
    render() {
        return (
            <Moment className="datetime" aria-hidden={true}>
                1976-04-19T12:59-0500
            </Moment>
        );
    }
}
```

Outputs:

```html
<time class="datetime" aria-hidden="true">Mon Apr 19 1976 12:59:00 GMT-0500</time>
```


### Pooled Timer
By default a timer is created for each mounted `<Moment />` instance to update the date value, which is fine when you only have a few instances on the page. However, performance can take a hit when you have many mounted instance. The problem is solved by using a pooled timer.

When pooled timing is enabled, react-moment will only use a single timer to update all mounted `<Moment />` instances. Pooled timing is enabled by calling `startPooledTimer()` and stopped by calling `clearPooledTimer()`.

Call the `startPooledTimer()` static method from your bootstrapping script (usually index.js) to initialize the timer.

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Moment from 'react-moment';
import App from './components/app';

// Start the pooled timer which runs every 60 seconds
// (60000 milliseconds) by default.
Moment.startPooledTimer();

// Or set the update interval. This will update the mounted
// instances every 30 seconds.
// Moment.startPooledTimer(30000);

ReactDOM.render(<App />, document.getElementById('mount'));
```

Note: The `interval` prop set on each `<Moment />` instance is ignored when using pooled timing, except where `interval={0}` to disable updating.

Note: The `startPooledTimer()` method must be called before any `<Moment />` instances are mounted.


### Global Config
Some prop values may be set globally so you don't have to set them on every react-moment instance.

* globalMoment
* globalLocale
* globalFormat
* globalParse
* globalFilter
* globalElement
* globalTimezone
* globalLocal

```jsx
import React  from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment/min/moment-with-locales';
import Moment from 'react-moment';

// Sets the moment instance to use.
Moment.globalMoment = moment;

// Set the locale for every react-moment instance to French.
Moment.globalLocale = 'fr';

// Set the output format for every react-moment instance.
Moment.globalFormat = 'D MMM YYYY';

// Set the timezone for every instance.
Moment.globalTimezone = 'America/Los_Angeles';

// Set the output timezone for local for every instance.
Moment.globalLocal = true;

// Use a <span> tag for every react-moment instance.
Moment.globalElement = 'span';

// Upper case all rendered dates.
Moment.globalFilter = (d) => {
    return d.toUpperCase();
};

const App = () => (
    <Moment>1976-04-19T12:59-0500</Moment>
);

ReactDOM.render(<App />, document.getElementById('mount'));
```

You can override the global values on a per-instance basis using regular props.

```jsx
import React  from 'react';
import ReactDOM from 'react-dom';
import Moment from 'react-moment';

// Set the locale for every react-moment instance to French.
Moment.globalLocale = 'fr';

const App = () => (
    <div>
        {/*
            Renders using the 'fr' locale due to the global setting.
        */}
        <Moment>1976-04-19T12:59-0500</Moment>

        {/*
            Overrides the global locale and uses 'en' instead.
        */}
        <Moment locale="en">1976-04-19T12:59-0500</Moment>
    </div>
);

ReactDOM.render(<App />, document.getElementById('mount'));
```


### Usage with React Native
If you are using React Native then you'll have to pass in `Text`.

```javascript
import Moment from 'react-moment';
import { Text } from 'react-native';
```

Then:

```html
<Moment element={Text} >1976-04-19T12:59-0500</Moment>
```


### License
This software is released under the MIT license. See LICENSE for more details.


### Contributors

* [markacola](https://github.com/markacola)
* [nclavaud](https://github.com/nclavaud)
* [Idan Gozlan](https://github.com/idangozlan)
* [Oliver Vartiainen](https://github.com/firoxer)
* [a-x-](https://github.com/a-x-)
* [khell](https://github.com/khell)
* [ali-master](https://github.com/ali-master)
* [tujoworker](https://github.com/tujoworker)
* [GaelGRIFFON](https://github.com/GaelGRIFFON)
* [jamesjryan](https://github.com/jamesjryan)
* [brasskazoo](https://github.com/brasskazoo)
* [henvo](https://github.com/henvo)
* [tadeo](https://github.com/tadeo)
* [centrual](https://github.com/centrual)
* [beniaminrychter](https://github.com/beniaminrychter)
* [joefatora](https://github.com/joefatora)
* [etairi](https://github.com/etairi)
* [tulak](https://github.com/tulak)
* [pesimeao](https://github.com/pesimeao)
* [DoctorHowser](https://github.com/DoctorHowser)
* [trevorr](https://github.com/trevorr)
* [arome](https://github.com/arome)
