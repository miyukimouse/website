import React from 'react';
//import { ScaleIndependentComponent } from './ScaleIndependentComponent.jsx';

const MIN_SEQUENCE_CHAR_WIDTH = 14;  // hide sequence if not enough space per char

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

  static contextTypes = {
    zoomFactor: React.PropTypes.number,
    viewWidth: React.PropTypes.number,
  }

  getCoord = (offsets) => {
    const {x,y, width} = this.props;
    const {xOffset, yOffset} = offsets || {};

    return {
      x: 0,
      y: y + (yOffset || 0) + 15
    }
  }

  _getCharWidth = () => {
    const visibleCharCount = this.props.sequence.length / this.context.zoomFactor;
    const charWidth = this.context.viewWidth / visibleCharCount;
    return charWidth;
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

    //console.log(coords);

    return this.props.sequence && this._getCharWidth() > MIN_SEQUENCE_CHAR_WIDTH ?
        <text is="svg-text"
              class="sequence-text"
              {...coords}
              text-anchor="start"
              font-size="12"
              font-family='Menlo, Monaco, Consolas, "Courier New", monospace'
              textLength={width}
              lengthAdjust="spacing"
              fill="#333333">
          {this.props.sequence}
        </text> : null;
  }
}

export default SequenceComponent;
