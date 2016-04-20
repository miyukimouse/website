import React from 'react';
import BasicTrack from './BasicTrack';

export default class VariationTrack extends React.Component {
  static propTypes = {
    ...BasicTrack.propTypes
  }

  static contextTypes = {
    getXMin: React.PropTypes.func,
    getXMax: React.PropTypes.func,
  }

  render() {
    <BasicTrack {...this.props}/>
  }
}