import React from 'react';
import BasicTrack from './BasicTrack';
import { DataLoader } from '../Utils';
import ColorScheme, { COLORS } from '../DataDecorator';

const DEFAULT_MAX_BIN_COUNT = 100;  // default maximum number of bins to show in the visible region
const SUBTRACK_HEIGHT = 30;

export default class AlignmnetTrack extends React.Component {
  static propTypes = {
    ...BasicTrack.propTypes
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
      counter += length;

      return {
        start,
        end
      };
    });

    return gapsCoords;

  }

  render() {
    const gaps = this._getGapsCoords();
    console.log();

    return <g>
      <BasicTrack
        {...this.props}
        data={this.props.data}/>
    </g>;
  }
}