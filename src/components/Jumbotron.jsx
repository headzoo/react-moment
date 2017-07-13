import React from 'react';

const Jumbotron = () => (
  <div className="jumbotron">
    <h1 className="page-title">
      react-moment
    </h1>
    <code className="code-npm-install">
      npm install --save moment react-moment
    </code>
    <p className="lead">
      React component for the <a href="http://momentjs.com/" target="_blank">moment</a> date library.
    </p>
    <p>
      <a href="https://github.com/headzoo/react-moment" className="btn btn-primary btn-project">
        <img src="images/github.png" alt="Github" />
        <span>Project on Github</span>
      </a>
      <a href="https://www.npmjs.com/package/react-moment" className="btn btn-primary btn-project">
        <img src="images/npm.png" alt="npm" />
        <span>Project on npm</span>
      </a>
    </p>
  </div>
);

export default Jumbotron;
