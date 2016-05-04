import React from 'react';
import BasicTrack from './BasicTrack';
import { DataLoader } from '../Utils';
import ColorScheme, { COLORS } from '../DataDecorator';

const DEFAULT_MAX_BIN_COUNT = 100;  // default maximum number of bins to show in the visible region

export default class ProteinConcervationTrack extends React.Component {
  static propTypes = {
    ...BasicTrack.propTypes,
    xMin: React.PropTypes.number,
    xMax: React.PropTypes.number,
    sequenceList: React.PropTypes.arrayOf(React.PropTypes.string),
  }


  _getSequenceSegments() {
    // converting the coordinate from cDNA to protein
    const multiplier = 3;
    const xMin = this.props.xMin/multiplier;
    const xMax = this.props.xMax/multiplier;

    // const {minBin, maxBin, binWidth} = new DataLoader.BinHelper(
    //   xMin, xMax, DEFAULT_MAX_BIN_COUNT);
    const bins = DataLoader.BinHelper.getBins(xMin, xMax, DEFAULT_MAX_BIN_COUNT);


  }

  _getColorScheme() {
    return new ColorScheme((dat, index) => {
      return 'gap'
    }, {
      gap: COLORS.GREY
    });
  }

  render() {
    const segments = this._getSequenceSegments();
    const segmentScores = [];
    return true ? <g>
      <BasicTrack
        {...this.props}
        colorScheme={this._getColorScheme()}
        data={segmentScores}/>
    </g> : null;
  }
}