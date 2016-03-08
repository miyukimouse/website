import React from 'react';

const TRACK_HEIGHT = 20;

export default class Tooltip extends React.Component {

  static propTypes = {
    x: React.PropTypes.number.isRequired,
    y: React.PropTypes.number.isRequired,
    width: React.PropTypes.number,
    tip: React.PropTypes.string
  }

  static defaultProps = {
    width: 30
  }

  getCoord = (offsets) => {
    const {x,y, width} = this.props;
    const {xOffset, yOffset} = offsets || {};

    return {
      x: x - width/2 + (xOffset || 0),
      y: y + (yOffset || 0)
    }
  }

  render() {
    return (
      <g>
        <rect {...this.getCoord({yOffset: TRACK_HEIGHT* 0.1})} height="6" width="30" fill="lightblue" />
        <text {...this.getCoord({xOffset: 2, yOffset:TRACK_HEIGHT* 0.3})} fontSize="4" textAnchor="start" fill="blue"  height="20" width="20">
          {this.props.tip}
        </text>
      </g>

    );
  }

}