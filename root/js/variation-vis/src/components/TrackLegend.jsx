import React from 'react';
import ColorScheme, { COLORS } from '../Utils/ColorHelper';

export default class TrackLegend extends React.Component {
  static propTypes = {
    colorScheme: React.PropTypes.object,
  }

  _renderLegendItem(dat) {
    return (<li>
      {dat.color} - {dat.group}
    </li>)
  }

  render() {
    const colorScheme = this.props.colorScheme;
    return (
      colorScheme ? <div>
      <ul>
      {
        colorScheme.getLegendData().map((dat) => {
          return this._renderLegendItem(dat)
        })
      }
      </ul>
      </div> : null
    );
  }
}