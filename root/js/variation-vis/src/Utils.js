import jquery from 'jquery';

export const TRACK_HEIGHT = 20;

export class WBDataModel {
  constructor(){
    // place to store raw results from previous requests
    this._raw = {};
  }

  _getOrFetch(name, url){

    if (!this._raw[name]) {
      this._raw[name] = new Promise((resolve, reject) => {
        console.log(url);
        jquery.ajax(url, {
        //  contentType: 'application/json',
          success: (result) => {
            resolve(result);
          },
          error: (error) => {
            console.log(`Error: ${error}`);
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
}

/*
  handles homology info and aligned sequence fetching, i.e. with the /homology/id/ API.
  Delegate gene specific tasks to GeneModel class
*/
export class HomologyModel extends WBDataModel {
  constructor(sourceGeneId, targetSpecies='homo_sapiens'){
    super();
    this.geneId = sourceGeneId;
    this.targetSpecies = targetSpecies;  // species to retrieve homology info from

    const alignedDNAPromise = this.getAlignedDNA();
    this.targetGeneModel = this._getTargetGeneId().then((targetGeneId) => {
      return new GeneModel(targetGeneId, alignedDNAPromise);
    });
    // make sourceGeneModel a Promise to be consistent with the targetGeneModel
    this.sourceGeneModel = new Promise((resolve) => {
      resolve(new GeneModel(sourceGeneId, alignedDNAPromise));
    });

  }

  getSouceGeneModel() {

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
      return homologs.find((h) => h.target.species === this.targetSpecies);
    }
    return null;
  }

  _getTargetGeneId() {
    return this.getAlignedDNA().then((data) => {
      return data.target.id;
    });
  }
}

/*
  handles data fetchin and coordinates conversion for CDS and protein domains,
  which are specific to a gene
*/
export class GeneModel extends WBDataModel {

  constructor(geneId, alignedDNAPromise) {
    super();
    this.geneId = geneId;
    this.alignedDNAPromise = alignedDNAPromise;
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

      const start = this._splicedCoordConverter.convert(coords.start);
      const end = this._splicedCoordConverter.convert(coords.end - 1);  // end coord here is considered outside side of CDS, would have getting undefined
      return coords.strand > 0 ? {
//        ...coords,
        start: start,
        end: end + 1,  // 1-based end
      } : {
        start: end,
        end: start + 1  // 1-based end
      };
    });
  }

  getAlignmentCoords(coords) {

    return this.alignedDNAPromise.then((data) => {
      if (!this._alignmentCoordConverter){
        const fakeStopCodon = ' '.repeat(3); // to correct the cDNA sequence to match the model
        this._alignmentCoordConverter = this._createAlignedCoordConverter(data.source.align_seq + fakeStopCodon);
      }
    })
    .then(() => {
      return this.getRelativeCoords(coords);
    })
    .then((relativeCoords) => {
      return {
//        ...coords,
        start: this._alignmentCoordConverter.convert(relativeCoords.start),
        end: this._alignmentCoordConverter.convert(relativeCoords.end)
      };
    });

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

    return {
      convert: (coord) => _coordsMap[coord]
    };
  }

// used to convert to coordinates relative to spliced transcript
  _createSplicedCoordConverter(cdss) {

    const _prefixLengths = [0];
    cdss.reduce((prev, segment, index) => {
      const segmentLength = segment.end - segment.start;
      const prefixLength = prev + segmentLength;
      _prefixLengths.push(prefixLength);

      return prefixLength;
    }, _prefixLengths[0]);

    const strand = cdss[0].strand;

    const _getSplicedCoord = (coord) => {
      const index = cdss.findIndex((segment) => coord >= segment.start && coord < segment.end);
      if (index || index === 0) {
        // coord occurs on one of the CDSs
        // offset to the start of the CDS (start in the biological sense)
        const offset = strand > 0 ? coord - cdss[index].start : cdss[index].end - coord - 1;
        return _prefixLengths[index] + offset;
      }
    }

    return {
      convert: _getSplicedCoord
    };
  }

// used to convert to map the genomic coordinate for target to that of the source
  _createAlignedCoordConverter(alignedSeq) {
    const _coordsMap = [];
    for (let i=0; i<alignedSeq.length; i++){
      if (alignedSeq[i] !== '-'){
        _coordsMap.push(i);
      }
    }
    _coordsMap.push(alignedSeq.length);  // for end coordinate

    return {
      convert: (coord) => _coordsMap[coord]
    };
  }
}
