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
    colorScheme: React.PropTypes.object,
  };

  static contextTypes = {
    isZoomPanOccuring: React.PropTypes.bool,
    viewWidth: React.PropTypes.number,
  }

  renderSequence = () => {
    const {xMin, xMax} = this.props;
    const rawSegmentLength = xMax - xMin;
    const segment = this.getVisibleSegment();
    const apparentSegmentWidth =
      this.context.viewWidth / rawSegmentLength * segment.sequence.length;

    const {start, end} = this.getHorizontalPosition({
      start: segment.start,
      end: segment.end
    });

    return <SequenceComponent {...this.props}
        ref={(ref) => this.sequenceComponent = ref}
        width={end - start}
        sequence={segment.sequence}
        apparentWidth={apparentSegmentWidth}
        x={start}
        y={this.props.y}/>
  }

  renderColor = () => {
    const segment = this.getVisibleSegment();
    const {start, end} = this.getHorizontalPosition(segment);
    const unitWidth = (end - start) / segment.sequence.length;
    const characters = segment.sequence.split('');

    return this.props.colorScheme && this.shouldShowSequence() ?
      characters.map((char, index) => {
        const color = this.props.colorScheme.getColorFor(char, index);
        const x = start + unitWidth * index;
        return <rect
          key={index + segment.start}
          fill={color}
          x={x}
          y={this.props.y}
          width={unitWidth}
          height={20}/>
      }) : null;

  }

  getHorizontalPosition = (dat) => {
    return {
      start: this.props.coordinateMapping.toSVGCoordinate(dat.start),
      end: this.props.coordinateMapping.toSVGCoordinate(dat.end)
    }
  }

  getVisibleSegment = () => {
    const {xMin, xMax, sequence} = this.props;
    const xMinSegment = Math.max(0, xMin);
    const xMaxSegment = Math.min(xMax, sequence.length);
    const sequenceSegment = sequence.slice(xMinSegment, xMaxSegment);
    return {
      sequence: sequenceSegment,
      start: xMinSegment,
      end: xMaxSegment
    }
  }

  shouldShowSequence = () => {
    return this.sequenceComponent && this.sequenceComponent.shouldShow();
  }

  render() {
    return <g>
    {
      this.renderColor()
    }
    {
      this.renderSequence()
    }
    }
    </g>
  }
}