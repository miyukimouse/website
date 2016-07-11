import React from 'react';
import BasicTrack from './BasicTrack';
import ProteinConservedRegionTrack from './ProteinConservedRegionTrack';
import SequenceTrack from './SequenceTrack';
import { DataLoader, SubstitutionHelper } from '../Utils';
import ColorScheme, { Palette } from '../Utils/ColorHelper';

const DEFAULT_MAX_BIN_COUNT = 100;  // default maximum number of bins to show in the visible region

export default class ProteinConservationTrack extends React.Component {
  static propTypes = {
    ...BasicTrack.propTypes,
    xMin: React.PropTypes.number,
    xMax: React.PropTypes.number,
    sequenceList: React.PropTypes.arrayOf(React.PropTypes.string),
  };

  static getDefaultColorScheme() {
    const clustalXPalette = new Palette([
      ['YELLOW', 'rgb(247, 225, 34)'],
      ['LIGHT_BLUE', 'rgb(116, 170, 206)'],
      ['TEAL', 'rgb(0, 172, 187)'],
      ['ORANGE','rgb(227, 159, 101)'],
      ['PINK','rgb(233, 143, 149)'],
      ['MAGENTA','rgb(183, 110, 170)'],
      ['GREEN','rgb(7, 166, 80)'],
      ['RED','rgb(231, 55, 48)'],
      ['WHITE', 'rgb(255, 255, 255)'],
      ['GREY', 'rgb(200, 200, 200)']
    ]);
    const residueCategories = [
      ['A', 'I', 'L', 'M', 'F', 'W', 'V'],
      ['R', 'K'],
      ['N', 'Q'],
      ['D', 'E'],
      ['C', 'G'],
      ['H', 'Y'],
      ['P'],
      ['B', 'X', 'Z'],
      ['-'],
    ];
    const categoryMap = new Map(residueCategories.reduce((accumulator, category, categoryIndex) => {
      return accumulator.concat(category.map((residue) => [residue, categoryIndex]));
    }, []));
    return new ColorScheme((residue, index) => {
      return categoryMap.get(residue);
    }, {
      0: {
        colorId: clustalXPalette.LIGHT_BLUE,
      },
      1: {
        colorId: clustalXPalette.RED,
      },
      2: {
        colorId: clustalXPalette.GREEN,
      },
      3: {
        colorId: clustalXPalette.MAGENTA,
      },
      4: {
        colorId: clustalXPalette.ORANGE,
      },
      5: {
        colorId: clustalXPalette.TEAL,
      },
      6: {
        colorId: clustalXPalette.YELLOW,
      },
      7: {
        colorId: clustalXPalette.WHITE,
      },
      8: {
        colorId: clustalXPalette.GREY,
      }
    }, null, {
      palette: clustalXPalette
    });
  }

  render() {
    return <g>
    {
      this.props.sequenceList.map((sequence, index) => {
        const extraProps = {};
        return <SequenceTrack
          key={`sequence-${index}`}
          {...this.props}
          ref={(ref) => this.sequenceTrack = this.sequenceTrack || ref}
          sequence={sequence}
          colorScheme={ProteinConservationTrack.getDefaultColorScheme()}
          y={this.props.y + 20 * index}/>
      })
    }
    {
      this.sequenceTrack && this.sequenceTrack.shouldShowSequence() ? null : <ProteinConservedRegionTrack {...this.props}/>
    }
    </g>;
  }
}