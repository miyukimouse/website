import React from 'react';
import BasicTrack from './BasicTrack';
import { DataLoader } from '../Utils';

const DEFAULT_MAX_BIN_COUNT = 100;  // default maximum number of bins to show in the visible region

export default class VariationTrack extends React.Component {
  static propTypes = {
    ...BasicTrack.propTypes,
    xMin: React.PropTypes.number,
    xMax: React.PropTypes.number,
  }

  _parseData(variations) {
    const xMin = this.props.xMin/3;  // converting the coordinate from cDNA to protein
    const xMax = this.props.xMax/3
    const binnedVariations = new DataLoader.BinnedLoader(variations,
      xMin, xMax, DEFAULT_MAX_BIN_COUNT);
    const binnedData = binnedVariations.map((bin) => {
      return {
        ...bin,
        tip: bin.data.map((v) => v.composite_change || '').join('<br/>')
      };
    });
    return binnedData;
  }

  render() {
    return <BasicTrack {...this.props}
      data={this._parseData(this.props.data)}/>
  }
}