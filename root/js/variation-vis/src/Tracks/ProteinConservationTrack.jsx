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
    const sequenceList = this.props.sequenceList;

    const binConfig = [this.props.xMin, this.props.xMax, DEFAULT_MAX_BIN_COUNT];
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
    //return this._computeMean(scores);
    return this._computeMedian(scores);
  }

  _computeMedian(values) {
    // TODO: reimplement using randomized Quick select to reduce time complexity from O(nlog(n)) to O(n)
    const sortedValues = values.concat().sort();
    const mid = sortedValues.length / 2;
    if (values.length % 2 === 0) {
      return (sortedValues[Math.ceil(mid)] + sortedValues[Math.floor(mid)]) / 2;
    } else {
      return sortedValues[Math.floor(mid)];
    }
  }

  _computeMean(values) {
    const sum = values.reduce((sum, currentValue) => sum + currentValue, 0);
    return sum / values.length;
  }

  _getColorScheme(annotatedSegments) {
    return new ColorScheme((dat, index) => {
      return dat.score > 0 ? 'positive' : 'nonPositive';
    }, {
      positive: COLORS.BLUE,
      nonPositive: COLORS.ORANGE
    });
  }

  _getAnnotatedSegments(segments) {
    const [scoreMin, scoreMax] = SubstitutionHelper.getScoreRange('PAM250');
    // const binCount = 10;
    // const BinHelper = new DataLoader.BinHelper(...scoreRange, binCount);

    return segments.map((segment) => {
      const score = this._getSegmentScore(segment);
      let standardizedScore = this._getStandardizedScore(score, scoreMin, scoreMax);

      //standardizedScore = Math.round(standardizedScore * 10) /  10; // round to one decimal place
      return {
        ...segment[0],
        score: standardizedScore,
        fillOpacity: Math.sqrt(Math.max(0, standardizedScore)),
      };
    });
  }

  _getStandardizedScore(score, scoreMin, scoreMax) {
    if (!score) {
      return 0;
    }
    const absoluteScore = Math.abs(score);
    const absoluteBound = score === absoluteScore ? scoreMax : Math.abs(scoreMin);
    return absoluteScore / absoluteBound * (score === absoluteScore ? 1 : -1);
  }

  render() {
    const segments = this._getSequenceSegments();
    const annotatedSegments = this._getAnnotatedSegments(segments);
    const colorScheme = this._getColorScheme(annotatedSegments);
    // console.log(annotatedSegments);
    return true ? <g>
      <BasicTrack
        {...this.props}
        opacity={1}
        colorScheme={colorScheme}
        data={annotatedSegments}/>
    </g> : null;
  }
}