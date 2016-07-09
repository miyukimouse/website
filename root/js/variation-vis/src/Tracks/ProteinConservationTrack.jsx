import React from 'react';
import BasicTrack from './BasicTrack';
import ProteinConservedRegionTrack from './ProteinConservedRegionTrack';
import SequenceTrack from './SequenceTrack';
import { DataLoader, SubstitutionHelper } from '../Utils';
import ColorScheme, { COLORS } from '../Utils/ColorHelper';

const DEFAULT_MAX_BIN_COUNT = 100;  // default maximum number of bins to show in the visible region

export default class ProteinConcervationTrack extends React.Component {
  static propTypes = {
    ...BasicTrack.propTypes,
    xMin: React.PropTypes.number,
    xMax: React.PropTypes.number,
    sequenceList: React.PropTypes.arrayOf(React.PropTypes.string),
  };

  static getDefaultColorScheme() {
    return new ColorScheme((residue, index) => {
      return residue;
    }, {
    });
  }

  render() {
    return <g>
    {
      this.props.sequenceList.map((sequence, index) => {
        const extraProps = {};
        return <SequenceTrack
          {...this.props}
          ref={(ref) => this.sequenceTrack = this.sequenceTrack || ref}
          sequence={sequence}
          colorScheme={ProteinConcervationTrack.getDefaultColorScheme()}
          y={this.props.y + 15 * index}/>
      })
    }
    {
      this.sequenceTrack && this.sequenceTrack.shouldShowSequence() ? null : <ProteinConservedRegionTrack {...this.props}/>
    }
    </g>;
  }
}