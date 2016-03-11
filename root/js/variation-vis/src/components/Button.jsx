import React, { Component } from "react";

export default class Button extends React.Component {

  render() {

    return (
      <button className="ui button" {...this.props}>
      {this.props.children}
      </button>);
  }
};