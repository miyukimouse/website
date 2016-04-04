import { GOClient, WBModelGraphView } from './utils';
import $ from 'jquery';
import '../node_modules/bootstrap/dist/js/bootstrap.js';
import './main.less';
import 'babel-polyfill';
import page from './main.html';


GOClient.getModelByGene('UniProtKB:Q9GYQ4', function(graph, context){
  console.log(graph);
});

export class LegoPlot {
  constructor(gid, selector='#root') {
    const containerElement = this._setupPage(selector);
    this._plotPromise = this._createPlot(gid, containerElement);
  }

  setMode(mode){
    this._plotPromise.then((plot) => plot.update(mode));
  }

  _setupPage(selector){
    // load the page
    var rootContainer = $(selector);
    rootContainer.html(page);
    var containerElement = $(rootContainer).find('.lego-graph-container')[0];

    // setup navigation, ie switching between view options
    rootContainer.delegate('.navigation .mode-choice', 'click', (event) => {
      const mode = event.target.dataset.mode;
      this.setMode(mode);

      const linkWrapper =  $(event.target).closest('li');
      linkWrapper.siblings().removeClass('active');
      linkWrapper.addClass('active');
    });

    // return the DOM element that the plot will attach to
    return containerElement;
  }

  _createPlot(gid, containerElement){
    return new Promise(function(resolve, reject) {
      GOClient.getModelByGene('UniProtKB:Q9GYQ4', function(graphJSON, context){

        // create a network
        var modelView = new WBModelGraphView(graphJSON, containerElement);

        resolve(modelView);

      });
    });
  }
}
