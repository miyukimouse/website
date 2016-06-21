import React from 'react';
import BasicTrack from './BasicTrack';
import { DataLoader } from '../Utils';
import ColorScheme, { COLORS } from '../Utils/ColorHelper';

const DEFAULT_MAX_BIN_COUNT = 100;  // default maximum number of bins to show in the visible region
const SUBTRACK_HEIGHT = 30;

export default class VariationTrack extends React.Component {
  static propTypes = {
    ...BasicTrack.propTypes,
    xMin: React.PropTypes.number,
    xMax: React.PropTypes.number,
    onHeightChange: React.PropTypes.func,
    outerHeight: React.PropTypes.number,
  }

  componentWillMount() {
    this._updateTrackHeight(this.props);
  }

  // componentWillReceiveProps(nextProps) {
  //   this._updateTrackHeight(nextProps);
  // }

  _updateTrackHeight = (nextProps) => {
    const {data, index, outerHeight, onHeightChange} = nextProps;
    if (data){
      const binLengths = this._bin(data).map((bin) => bin.data.length);
      const numOfSubtracks = Math.max(...binLengths, 1);
      const newTrackHeight = 20 + numOfSubtracks * SUBTRACK_HEIGHT;
      if (newTrackHeight !== outerHeight) {
        console.log('will initiate height change')
        onHeightChange(index, newTrackHeight);
      }
    }
  }

  _bin(variations) {
    const binnedVariations = new DataLoader.BinnedLoader(variations,
      this.props.xMin, this.props.xMax, DEFAULT_MAX_BIN_COUNT);
    const binnedData = binnedVariations.map((bin) => {
      return {
        ...bin,
        tip: bin.data.map((v) => v.composite_change || '').join('<br/>')
      };
    });
    return binnedData;
  }

  _getDataWithIdentifier(){
    // attach identifier to data to be able to identify corresponding entries across bins,
    // because a single entry could end up in multiple bins.
    return this.props.data.map((dat, index) => {
      return {
        ...dat,
        _id: index,
      }
    })
  }

  // split a track into subtracks such that no overlapping features occur in the same track.
  // use as few subtracks as possible
  _decompose(binnedData) {
    const binLengths = binnedData.map((bin) => bin.data.length);
    const numOfSubtracks = Math.max(...binLengths);
    const subtrackData = [];
    const datToSubtrack = {};

    binnedData.forEach((bin) => {

      let availbleSubtracks = [];

      // initialize available tracks
      for (let trackIndex = 0; trackIndex < numOfSubtracks; trackIndex++){
        availbleSubtracks.push(trackIndex);
      }

      // assign data to available tracks
      bin.data.forEach((dat) => {
        const datId = dat._id;
        let trackId;
        if (datToSubtrack[datId]) {
          trackId = datToSubtrack[datId];
        } else {
          trackId = availbleSubtracks[0];
          datToSubtrack[datId] = trackId;
        }

        subtrackData[trackId] = subtrackData[trackId] || [];
        subtrackData[trackId].push({
          ...bin,
          data: dat,
          tip: dat.composite_change + `<br/>${dat.molecular_change}`
        });

        // used tracks are not available any more
        availbleSubtracks = availbleSubtracks.filter((availableTrackId) => availableTrackId !== trackId);
      });

    })
    return subtrackData;
  }

  _getColorScheme() {
    const knownChangeType = new Set(['Nonsense', 'Missense', 'Insertion', 'Deletion'])
    return new ColorScheme((dat, index) => {
      const descriptor = [].concat(dat.data.molecular_change, dat.data.effects);
      const types = descriptor.filter((value) => knownChangeType.has(value));
      return types.length > 0 ? types[0] : 'Other';
    }, {
      Nonsense: COLORS.RED,
      Missense: COLORS.BLUE,
      Insertion: COLORS.GREEN,
      Deletion:COLORS.MAGENTA,
      Other: COLORS.YELLOW
    });
  }


  render() {
    const data = this._getDataWithIdentifier();
    const binnedData = this._bin(data);
    const subtrackData = this._decompose(binnedData);

    return <g>
      {
        subtrackData.map((subtrackData, index) => {
          return <BasicTrack
            {...this.props}
            y={this.props.y + SUBTRACK_HEIGHT * index}
            colorScheme={this._getColorScheme()}
            data={subtrackData}/>
        })
      }
      </g>;
  }
}