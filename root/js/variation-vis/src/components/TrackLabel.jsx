import React from 'react';
import { Button, ButtonGroup, ButtonToolbar, Glyphicon } from 'react-bootstrap';

export default class TrackLabel extends React.Component {

  static propTypes = {
    index: React.PropTypes.number, //.isRequired,
    name: React.PropTypes.string,
    y: React.PropTypes.number,
    onTrackDescriptionRequest: React.PropTypes.func,
  }

  handleClick = () => {
    this.props.onTrackDescriptionRequest(this.props.index);
  }

  render() {
    const style = {
      position: 'absolute',
      top: this.props.y,
      left: 0,
      padding: '5px 10px',
    };

    const buttonWrapperStyle = {
      minWidth: 40,
      display: 'table-cell',
      verticalAlign: 'middle'
    };

    const labelWrapperStyle = {
      width: '80%',
      paddingRight: 10,
      textAlign: 'right',
      display: 'table-cell',
      verticalAlign: 'middle'
    };

    return <div style={style}>
      <div style={labelWrapperStyle}>
        <h5>{this.props.name}</h5>
      </div>
      <div style={buttonWrapperStyle}>
      {
        this.props.onTrackDescriptionRequest ? <Button bsStyle="default"
          onClick={this.handleClick}>
          <Glyphicon glyph="question-sign"/>
        </Button> : null
      }
      </div>
    </div>
  }

}
