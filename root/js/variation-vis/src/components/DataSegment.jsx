import React, { Component } from "react";
import ReactDOM from "react-dom";

export default class Button extends React.Component {

  static propTypes = {
    tip: React.PropTypes.string,
    x: React.PropTypes.number,
    y: React.PropTypes.number,
    width: React.PropTypes.number,
    height: React.PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = {
      labelWidthInitial: null
    };
  }

  static contextTypes = {
    zoomFactor: React.PropTypes.number
  }

  componentDidMount() {
    const labelNode = this.refs.label;
    const labelWidthInitial = labelNode.getBBox().width;

    this.setState({
      labelWidthInitial
    });
  }

  // componentDidUpdate() {
  // }

  _getDimension() {
    let {width} = this.props;
    width = width < 1 ? 1 : width;

    return {
      ...this.props,
      width
    }
  }

  _getLabelVisibility() {
    if (this.state.labelWidthInitial && this._getLabelScaledWidth() < this.props.width * 0.8){
      return 'visible';
    }else{
      return 'hidden';
    }
  }

  _getLabelScaledWidth() {
    return this.state.labelWidthInitial / this.context.zoomFactor;
  }

  _getLabelCoords() {
    const x = this.props.x + this.props.width / 2;
    const y = this.props.y + 5;

    if (this.state.labelWidthInitial) {
      return {
        x,
        y,
        textLength: this._getLabelScaledWidth()
      }
    } else {
      return {
        x,
        y
      }
    }
  }

  render() {

    return (
      <g>
        <rect {...this._getDimension()}/>
        <text ref="label"
              is="svg-text"
              visibility={this._getLabelVisibility()}
              text-anchor='middle'
              font-size="4"
              lengthAdjust="spacingAndGlyphs"
              {...this._getLabelCoords()}>
        {
          this.props.tip
        }
        </text>
      </g>);
  }
};