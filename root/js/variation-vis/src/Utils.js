import jquery from 'jquery';

export const TRACK_HEIGHT = 20;



export class GeneModel {

  constructor(geneId) {
    this.geneId = geneId;
  }

  getAlignedDNA() {
    const url = this._urlFor('homology/id/' + this.geneId, {
      sequence: 'cdna',
      type: 'orthologues'
    });

    return this._getOrFetch('_aligned_dna', url)
      .then((data) => this._parseAligned(data));
  }

  getAlignedProtein() {
    const url = this._urlFor('homology/id/' + this.geneId, {
      sequence: 'protein',
      type: 'orthologues'
    });

    return this._getOrFetch('_aligned_protein', url)
      .then((data) => this._parseAligned(data));
  }

  _parseAligned(data) {
    if (data['data'].length > 0){
      const homologs = data['data'][0].homologies;
      return homologs[0];
    }
    return null;
  }

  _parseCoords(data=[]) {
    return data.map((coords) => {
      const {start, end} = coords;
      return {
        ...coords,
        start: start - 1,  // 0 based start
        end: end   // 1 based end
      }
    });
  }

  // getCDSs() {
  //   const url = this._urlFor('overlap/id/' + this.geneId, {
  //     feature: 'cds'
  //   });
  //   console.log(url);
  //   return this._getOrFetch('_cds', url)
  //     .then((data) => this._parseCoords(data));
  // }

  getAlignedCDSs(){
    return this.getCDSs().then((cdss) => {
      const coordsPromises = cdss.map((e) => this.getAlignmentCoords(e));
      return Promise.all(coordsPromises);
    });
  }

  getDomains() {

  }

  getCDSs() {
    const url = this._urlFor('overlap/id/' + this.geneId, {
      feature: 'cds'
    });

    return this._getOrFetch('_cds', url)
      .then((data) => this._parseCoords(data));
  }

  // get coordinate relative to the coding sequence
  getRelativeCoords(coords) {
    return this.getCDSs().then((data) => {
      if (!this._splicedCoordConverter){
        this._splicedCoordConverter =  this._createSplicedCoordConverter(data);
      }
      return {
//        ...coords,
        start: this._splicedCoordConverter.convert(coords.start),
        end: this._splicedCoordConverter.convert(coords.end - 1) + 1 // end coord here is considered outside side of CDS, would have getting undefined
      }
    });
  }

  getAlignmentCoords(coords) {
    console.log('getAlignmentCoords called')
    return this.getAlignedDNA().then((data) => {
      console.log('got aligned DNA');
      if (!this._alignmentCoordConverter){
        const fakeStopCodon = ' '.repeat(3); // to correct the cDNA sequence to match the model
        this._alignmentCoordConverter = this._createAlignedCoordConverter(data.source.align_seq + fakeStopCodon);
      }
    })
    .then(() => {
      console.log('got converter');
      return this.getRelativeCoords(coords);
    })
    .then((relativeCoords) => {
      console.log(relativeCoords);
      return {
//        ...coords,
        start: this._alignmentCoordConverter.convert(relativeCoords.start),
        end: this._alignmentCoordConverter.convert(relativeCoords.end)
      };
    });

  }

  _getOrFetch(name, url){
    if (!this._raw) {
      // place to store raw results from previous requests
      this._raw = {};
    }

    if (!this._raw[name]) {
      this._raw[name] = new Promise((resolve, reject) => {
        console.log(url);
        jquery.ajax(url, {
        //  contentType: 'application/json',
          success: (result) => {
            resolve(result);
          },
          error: (error) => {
            reject(error);
          }
        });
      });
    }

    return this._raw[name];
  }


  _urlFor(path, params={}) {
    const delimiter = ';';
    const paramsNew = {
      ...params,
      'content-type': 'application/json'
    };
    const paramsStr = Object.keys(paramsNew)
    .map((key) => {
      const value = paramsNew[key];
      if (Array.isArray(value)){
        return value.map((v) => `${key}=${v}`).join(delimiter);
      }
      return `${key}=${value}`;
    })
    .join(delimiter);

    return `/rest/parasite/${path}?${paramsStr}`;
  }

// used to convert to coordinates relative to gapped sequence generated during alignment
  _createAlignedCoordConverter(alignedSeq) {
    const _coordsMap = [];
    for (let i=0; i<alignedSeq.length; i++){
      if (alignedSeq[i] !== '-'){
        _coordsMap.push(i);
      }
    }
    _coordsMap.push(alignedSeq.length);  // for end coordinate
    console.log(alignedSeq);
    console.log(_coordsMap);
    return {
      convert: (coord) => _coordsMap[coord]
    };
  }

// used to convert to coordinates relative to spliced transcript
  _createSplicedCoordConverter(cdss) {
    cdss = cdss.slice(0).sort((a, b) => a.start - b.start);
    const _prefixLengths = [0];

    cdss.reduce((prev, segment, index) => {
      const segmentLength = segment.end - segment.start;
      const prefixLength = prev + segmentLength;
      _prefixLengths.push(prefixLength);

      return prefixLength;
    }, _prefixLengths[0]);
    console.log(_prefixLengths);

    const _getSplicedCoord = (coord) => {
      const index = cdss.findIndex((segment) => coord >= segment.start && coord < segment.end);
      if (index || index === 0) {
        // coord occurs on one of the CDSs
        const offset = coord - cdss[index].start; // offset to the start of the CDS
        return _prefixLengths[index] + offset;
      }
    }
    return {
      convert: _getSplicedCoord
    };
  }
}
