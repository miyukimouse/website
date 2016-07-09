import React from 'react';
import BasicTrack from './BasicTrack';
import SequenceComponent from '../components/SequenceComponent';
import { DataLoader, SubstitutionHelper } from '../Utils';
import ColorScheme, { COLORS } from '../Utils/ColorHelper';

const DEFAULT_MAX_BIN_COUNT = 100;  // default maximum number of bins to show in the visible region

export default class SequenceTrack extends React.Component {
  static propTypes = {
    ...BasicTrack.propTypes,
    xMin: React.PropTypes.number,
    xMax: React.PropTypes.number,
    sequence: React.PropTypes.string,
  };

  static contextTypes = {
    isZoomPanOccuring: React.PropTypes.bool,
    viewWidth: React.PropTypes.number,
  }

  static getDefaultColorScheme() {
    return new ColorScheme((dat, index) => {
      return index;
    }, {
      // positive: {
      //   colorId: COLORS.BLUE,
      //   description: 'Conserved'
      // },
      // nonPositive: {
      //   colorId: COLORS.ORANGE,
      //   description: 'Not conserved'
      // }
    });
  }

  renderSequence = () => {
    const {xMin, xMax, sequence} = this.props;
    const rawSegmentLength = xMax - xMin;
    const xMinSegment = Math.max(0, xMin);
    const xMaxSegment = Math.min(xMax, sequence.length);
    const sequenceSegment = sequence.slice(xMinSegment, xMaxSegment);

    const {start, end} = this.getHorizontalPosition({
      start: xMinSegment,
      end: xMaxSegment
    });

    const apparentSegmentWidth = this.context.viewWidth / rawSegmentLength * sequenceSegment.length;

    return <SequenceComponent {...this.props}
        ref={(ref) => this.sequenceComponent = ref}
        width={end - start}
        sequence={sequenceSegment}
        apparentWidth={apparentSegmentWidth}
        x={start}
        y={this.props.y}/>
  }

  getHorizontalPosition = (dat) => {
    return {
      start: this.props.coordinateMapping.toSVGCoordinate(dat.start),
      end: this.props.coordinateMapping.toSVGCoordinate(dat.end)
    }
  }

  shouldShowSequence = () => {
    return this.sequenceComponent && this.sequenceComponent.shouldShow();
  }

  render() {
    return this.renderSequence();
  }
}