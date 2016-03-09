import React from 'react';
import { ScaleIndependentComponent } from './ScaleIndependentComponent.jsx';

class SequenceComponent extends React.Component {

  static propTypes = {
    y: React.PropTypes.number.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    sequence: React.PropTypes.string
  }

  // static defaultProps = {
  //   width: 30,
  //   height: 20
  // }

  getCoord = (offsets) => {
    const {x,y, width} = this.props;
    const {xOffset, yOffset} = offsets || {};

    return {
      x: 0,
      y: y + (yOffset || 0)
    }
  }

  render() {

    const {x, y} = this.getCoord();
    const {width, height} = this.props;
    const coords = {
      width,
      height,
      x,
      y
    };

    console.log(coords);

    return (
      <ScaleIndependentComponent {...coords}>
        <text x="0" y="12" textAnchor="start" fill="white"
              fontFamily="monospace,Courier"
              is="svg-text"
              textLength={width}
              lengthAdjust="spacingAndGlyphs">
          {this.props.sequence}
        </text>
      </ScaleIndependentComponent>)
  }
}

export default SequenceComponent;
