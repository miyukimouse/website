import React, { Component } from "react";
import ReactDOM from "react-dom";

const CharApparentWidth = 8;

export default class Button extends React.Component {

  static propTypes = {
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  _getDimension() {
    let {width} = this.props;
    width = width < 1 ? 1 : width;

    return {
      ...this.props,
      width
    }
  }

  render() {

    return (
      <rect {...this._getDimension()}/>
    );
  }
};