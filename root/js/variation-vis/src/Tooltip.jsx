import React from 'react';

const TRACK_HEIGHT = 20;

export default class Tooltip extends React.Component {

  static propTypes = {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    tip: React.PropTypes.string
  }

  getCoord = (offsets) => {
    const {x,y} = this.props;
    const {xOffset, yOffset} = offsets || {};

    return {
      x: x + (xOffset || 0),
      y: y + (yOffset || 0)
    }
  }

  render() {
    return (
      <g>
        <rect {...this.getCoord({yOffset: TRACK_HEIGHT* 0.1})} height="6" width="30" fill="white" />
        <text {...this.getCoord({xOffset: 2, yOffset:TRACK_HEIGHT* 0.3})} fontSize="4" textAnchor="start" fill="blue"  height="20" width="20">
          {this.props.tip}
        </text>
      </g>

    );
  }

}