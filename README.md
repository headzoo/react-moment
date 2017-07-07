react-moment
============
React component for the [moment](http://momentjs.com/) date library.

[![Build Status](https://travis-ci.org/headzoo/react-moment.svg?branch=master)](https://travis-ci.org/headzoo/react-moment)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://raw.githubusercontent.com/headzoo/react-moment/master/LICENSE)

* [Installing](#installing)
* [Timezone Support](#timezone-support)
* [Quick Start](#quick-start)
* [Props](#props)
    * [Interval](#interval)
    * [Formatting](#formatting)
    * [Parsing Dates](#parsing-dates)
    * [From Now](#from-now)
    * [From](#from)
    * [To Now](#to-now)
    * [To](#to)
    * [Unix Timestamps](#unix-timestamps)
    * [Timezone](#timezone)
    * [Locale](#locale)
    * [As](#as)
    * [OnChange](#onchange)
    * [Other Props](#other-props)
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
        let dateToFormat = '1976-04-19T12:59-0500';
        <Moment>{dateToFormat}</Moment>
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
        let dateToFormat = '1976-04-19T12:59-0500';
        <Moment date={dateToFormat} />
    }
}
```

The date value may be a string, object, array, or `Date` instance.

```jsx
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        let dateToFormat = new Date('1976-04-19T12:59-0500');
        <Moment date={dateToFormat} />
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
        <Moment as="span" interval={30000}>1976-04-19T12:59-0500</Moment>
    }
}
```

Disables updating.
```jsx
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment as="span" interval={0}>1976-04-19T12:59-0500</Moment>
    }
}
```


#### Formatting
_format={string}_

Formats the date according to the given format string.

```jsx
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment format="YYYY/MM/DD">1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time>1976/04/19</time>
```


#### Parsing Dates
_parse={string}_

Moment can parse most standard date formats. Use the `parse` attribute to tell moment how to parse the given date when non-standard.

```jsx
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment parse="YYYY-MM-DD HH:mm">1976-04-19 12:59</Moment>
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
        <Moment fromNow>1976-04-19T12:59-0500</Moment>
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
        <Moment from="2015-04-19">1976-04-19T12:59-0500</Moment>
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
        <Moment toNow>1976-04-19T12:59-0500</Moment>
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
        <Moment to="2015-04-19">1976-04-19T12:59-0500</Moment>
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
        let unixTimestamp = 198784740;
        <Moment unix>{unixTimestamp}</Moment>
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
        let unixTimestamp = 198784740;
        <Moment unix tz="America/Los_Angeles">{unixTimestamp}</Moment>
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
        let dateToFormat = '1976-04-19T12:59-0500';
        <Moment locale="de">{dateToFormat}</Moment>
    }
}
```

#### As
_as={string|React.Component}_

An element type to render as (string or function).

```jsx
import React  from 'react';
import Moment from 'react-moment';

exports default class MyComponent extends React.Component {
    render() {
        <Moment as="span">1976-04-19T12:59-0500</Moment>
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
        <Moment onChange={(val) => { console.log(val); }}>1976-04-19T12:59-0500</Moment>
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
        <Moment className="datetime" aria-hidden={true}>1976-04-19T12:59-0500</Moment>
    }
}
```

Outputs:

```html
<time class="datetime" aria-hidden="true">Mon Apr 19 1976 12:59:00 GMT-0500</time>
```


### Usage with React Native

If you are using React Native then you'll have to pass in `Text`.

```javascript
import Moment from 'react-moment';
import { Text } from 'react-native';
```

Then:

```html
<Moment as={Text} >1976-04-19T12:59-0500</Moment>
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
