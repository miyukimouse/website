import nodeTemplate from "./node.handlebars";
import nodeModalTemplate from "./nodeModal.handlebars";
import { tag2Url } from '../shared';

export function getNodeFaceInHTML(node, associations){

  return nodeTemplate({
    title: 'aaaa',
    associations: associations
  });

  return;
}

export default function getNodeFace(node, associations) {
  var nodes = null;
  var edges = null;
  var network = null;

  var DIR = 'img/refresh-cl/';
  var LENGTH_MAIN = 150;
  var LENGTH_SUB = 50;


  var data = '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">' +
      '<rect x="0" y="0" width="100%" height="100%" fill="#7890A7" stroke-width="20" stroke="#ffffff" ></rect>' +
      '<foreignObject x="15" y="10" width="100%" height="100%">' +
      '<div xmlns="http://www.w3.org/1999/xhtml" style="font-size:40px">' +
      getNodeFaceInHTML(node, associations) +
      '</div>' +
      '</foreignObject>' +
      '</svg>';

  var DOMURL = window.URL || window.webkitURL || window;

  var img = new Image();
  var svg = new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
  var url = DOMURL.createObjectURL(svg);
  return url;
}

export function getNodeModal(node, associations, modalContainer){

  associations = associations.map((e) => {
    return {
      ...e,
      toNode: {
        ...e.toNode,
        link: tag2Url(e.toNode)
      }
    }
  });
  associations.sort((a, b) => a.predicate_id < b.predicate_id);

  node = {
    ...node,
    link: tag2Url(node)
  }

  console.log(node);
  console.log(associations);

  const modalHtml = nodeModalTemplate({
    node,
    associations
  });
  return modalHtml;
}
