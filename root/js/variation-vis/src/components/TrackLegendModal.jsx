import React from 'react';
import { Modal, Button, closeButton, Popover, Overlay } from 'react-bootstrap';
import ColorScheme, { COLORS } from '../Utils/ColorHelper';
import TrackLegend from './TrackLegend';

export default class TrackLegendModel extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
    colorScheme: React.PropTypes.object,
    onTrackDescriptionCancel: React.PropTypes.func,
  }

  handleHide = () => {
    if (this.props.onTrackDescriptionCancel) {
      this.props.onTrackDescriptionCancel();
    }
  }

  render() {
    // let popover = <Popover title="popover">very popover. such engagement</Popover>;
    // let tooltip = <Tooltip>wow.</Tooltip>;

    return (
      <div>
        <Modal
          container={this}
          show={true}
          onHide={this.handleHide}>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          {
            <TrackLegend
              colorScheme={this.props.colorScheme}/>
          }
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleHide}>Close</Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}