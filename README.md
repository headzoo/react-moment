react-moment
============
React component for the [moment](http://momentjs.com/) date library.

[![Build Status](https://img.shields.io/travis/headzoo/react-moment/master.svg?style=flat-square)](https://travis-ci.org/headzoo/react-moment)
[![NPM Downloads](https://img.shields.io/npm/dm/react-moment.svg?style=flat-square)](https://www.npmjs.com/package/react-moment)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/headzoo/react-moment/master/LICENSE)

* [Installing](#installing)
* [Timezone Support](#timezone-support)
* [Quick Start](#quick-start)
* [Props](#props)
    * [Interval](#interval)
    * [Formatting](#formatting)
    * [Parsing Dates](#parsing-dates)
    * [Add and Subtract](#add-and-subtract)
    * [From Now](#from-now)
    * [From](#from)
    * [To Now](#to-now)
    * [To](#to)
    * [Unix Timestamps](#unix-timestamps)
    * [Timezone](#timezone)
    * [Locale](#locale)
    * [Element](#element)
    * [OnChange](#onchange)
    * [Other Props](#other-props)
* [Pooled Timer](#pooled-timer)
* [Global Config](#global-config)
* [Usage with React Native](#usage-with-react-native)
* [License](#license)
* [Contributors](#contributors)


### Installing
Use npm to install `react-moment` along with its peer dependency, `moment`.

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

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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


#### Parsing Dates
_parse={string}_

Moment can parse most standard date formats. Use the `parse` attribute to tell moment how to parse the given date when non-standard. See the [Moment docs on parsing](https://momentjs.com/docs/#/parsing/string-format/) for more information.

```jsx
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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


#### From
_from={string}_

```jsx
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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


#### Unix Timestamps
_unix={bool}_

Tells Moment to parse the given date value as a unix timestamp.

```jsx
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
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


#### Timezone
_tz={string}_

Sets the timezone. To enable server side rendering (SSR), client and server has to provide same datetime, based on common Timezone. The `tz` attribute will enable set the common timezone.

```jsx
import React  from 'react';
import Moment from 'react-moment';
import 'moment-timezone';

exports default class MyComponent extends React.Component {
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


#### Locale
_locale={string}_

Sets the locale used to display the date.

```jsx
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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

exports default class MyComponent extends React.Component {
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

* globalLocale
* globalFormat
* globalParse
* globalElement

```jsx
import React  from 'react';
import ReactDOM from 'react-dom';
import Moment from 'react-moment';

// Set the locale for every react-moment instance to French.
Moment.globalLocale = 'fr';

// Set the output format for every react-moment instance.
Moment.globalFormat = 'D MMM YYYY';

// Use a <span> tag for every react-moment instance.
Moment.globalElement = 'span';

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
