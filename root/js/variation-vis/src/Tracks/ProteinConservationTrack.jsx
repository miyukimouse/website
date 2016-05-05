import React from 'react';
import BasicTrack from './BasicTrack';
import { DataLoader, SubstitutionHelper } from '../Utils';
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
    const sequenceList = this.props.sequenceList;

    const binConfig = [xMin, xMax, DEFAULT_MAX_BIN_COUNT];
    const {binWidth} = new DataLoader.BinHelper(...binConfig);
    const bins = DataLoader.BinHelper.getBins(...binConfig);

    return bins.map((binStart) => {
      return sequenceList.map((sequence) => {
        const binEnd = binStart + binWidth;
        const subSequence = sequence.substring(binStart, binEnd);
        return {
          start: binStart,
          end: binEnd,
          sequence: subSequence
        };
      });
    });

  }

  _getSegmentScore(segment) {
    let [sequence1, sequence2] = segment;
    sequence1 =  sequence1.sequence;
    sequence2 =  sequence2.sequence;

    const length = sequence1.length;
    const scores = Array(length);
    for (let i = 0; i < length; i++) {
      scores[i] = SubstitutionHelper.getSubstitutionScore(sequence1[i], sequence2[i]);
    }
    return this._computeMedian(scores);
  }

  _computeMedian(values) {
    const sortedValues = values.concat().sort();
    const mid = sortedValues.length / 2;
    if (values.length % 2 === 0) {
      return (sortedValues[Math.ceil(mid)] + sortedValues[Math.floor(mid)]) / 2;
    } else {
      return sortedValues[Math.floor(mid)];
    }
  }


  _getColorScheme(annotatedSegments) {
    return new ColorScheme((dat, index) => {
      return 'score';
    }, {
      score: COLORS.BLACK
    });
  }

  _getAnnotatedSegments(segments) {
    const [scoreMin, scoreMax] = SubstitutionHelper.getScoreRange('PAM250');
    // const binCount = 10;
    // const BinHelper = new DataLoader.BinHelper(...scoreRange, binCount);

    return segments.map((segment) => {
      const score = this._getSegmentScore(segment);
      let standardizedScore = (score - scoreMin) / (scoreMax - scoreMin);

      console.log(`op score ${standardizedScore}`)
      console.log([score, scoreMin, scoreMax]);
      console.log(segments);
      //standardizedScore = Math.round(standardizedScore * 10) /  10; // round to one decimal place

      return {
        ...segment[0],
        score: score,
        fillOpacity: standardizedScore,
      };
    });
  }

  render() {
    const segments = this._getSequenceSegments();
    const annotatedSegments = this._getAnnotatedSegments(segments);
    // console.log(annotatedSegments);
    return true ? <g>
      <BasicTrack
        {...this.props}
        colorScheme={this._getColorScheme()}
        data={annotatedSegments}/>
    </g> : null;
  }
}