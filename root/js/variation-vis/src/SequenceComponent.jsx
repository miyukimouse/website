import React from 'react';
//import { ScaleIndependentComponent } from './ScaleIndependentComponent.jsx';

const MIN_SEQUENCE_CHAR_WIDTH = 8;  // hide sequence if not enough space per char

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
      y: y + (yOffset || 0)
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
              x="0" y="6" text-anchor="start"
              font-size="4"
              font-family="monospace,Courier New"
              textLength={width}
              lengthAdjust="spacingAndGlyphs"
              fill="black">
          {this.props.sequence}
        </text> : null;
  }
}

export default SequenceComponent;
