import React from 'react';
import BasicTrack from './BasicTrack';
import { DataLoader } from '../Utils';
import ColorScheme, { COLORS } from '../DataDecorator';

const DEFAULT_MAX_BIN_COUNT = 100;  // default maximum number of bins to show in the visible region
const SUBTRACK_HEIGHT = 30;

export default class AlignmnetTrack extends React.Component {
  static propTypes = {
    ...BasicTrack.propTypes,
    xMin: React.PropTypes.number,
    xMax: React.PropTypes.number,
  }

  _getGapsCoords() {
    const sequence = this.props.sequence;
    const matches = sequence.match(/(-+)/g);

    let counter = 0;  // counter marks the start of uncheched sequence

    // find coordinates for each gap
    const gapsCoords = matches.map((gap) => {
      const start = sequence.indexOf('-', counter);
      const length = gap.length;
      const end = start + length;
      counter = end;

      return {
        start,
        end
      };
    });

    return gapsCoords;

  }

  _keepLongGaps(gapsCoords) {
    const xMin = this.props.xMin;
    const xMax = this.props.xMax;

    const lengthThreshold = DataLoader.BinHelper.getBinWidth(
      xMin, xMax, DEFAULT_MAX_BIN_COUNT);

    const longGaps = gapsCoords.filter(({start, end}) =>{
      return end - start > lengthThreshold;
    });
    return longGaps;
  }

  _getColorScheme() {
    return new ColorScheme((dat, index) => {
      return 'gap'
    }, {
      gap: COLORS.GREY
    });
  }

  render() {
    const gaps = this._getGapsCoords();
    const longGaps = this._keepLongGaps(gaps);

    return <g>
      <BasicTrack
        {...this.props}
        data={this.props.data}/>
      <BasicTrack
        {...this.props}
        colorScheme={this._getColorScheme()}
        data={longGaps}/>
    </g>;
  }
}