import React from 'react';
import ColorScheme, { COLORS } from '../Utils/ColorHelper';

export default class TrackLegend extends React.Component {
  static propTypes = {
    colorScheme: React.PropTypes.object,
  }

  _renderLegendItem(dat) {

  }

  render() {
    return (
      <div>
      {
        legends.map((dat) => {
          return this._renderLegendItem(dat)
        })
      }
      </div>
    );
  }
}