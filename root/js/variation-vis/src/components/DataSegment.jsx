import React, { Component } from "react";
import ReactDOM from "react-dom";
$.fn.transition = require("semantic-ui-transition");
$.fn.popup = require("semantic-ui-popup");

export default class Button extends React.Component {

  static propTypes = {
    tip: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  componentDidMount() {
    // const node = ReactDOM.findDOMNode(this);
    // $(node).popup({
    //   content: 'aaaaa'
    // });
  }

  componentDidUpdate() {
    // const node = ReactDOM.findDOMNode(this);
    // $(node).popup({
    //   content: 'aaaaa'
    // });
    // const node = ReactDOM.findDOMNode(this);
    // $(node).popup('refresh');
   // $('.ui.dropdown').dropdown('refresh');
  }

  render() {

    return (
      <rect {...this.props}/>);
  }
};