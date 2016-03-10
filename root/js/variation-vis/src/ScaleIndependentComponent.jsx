import React, { Component } from "react";

export class ScaleIndependentComponent extends Component {

  static contextTypes = {
    zoomFactor: React.PropTypes.number
  }

  static propTypes = {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired
  }

  render() {

    const {x, y} = this.props;
    const containerWidth = this.props.width / this.context.zoomFactor;
    const containerHeight = this.props.height;

    const scaleSetting = {
      x,
      y,
      width: containerWidth,
      height: containerHeight,
      viewBox: `0 0 ${this.props.width} ${containerHeight + 10}`,
      preserveAspectRatio: "none meet"
    };

    return (
      <svg {...scaleSetting}>
        {this.props.children}
      </svg>);
  }
};
