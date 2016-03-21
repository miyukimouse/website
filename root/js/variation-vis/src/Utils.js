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
    console.log(url);
    return this._getOrFetch('_aligned_dna', url)
      .then((data) => this._parseAligned(data));    
  }

  getAlignedProtein() {
    const url = this._urlFor('homology/id/' + this.geneId, {
      sequence: 'protein',
      type: 'orthologues'      
    });
    console.log(url);
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

  getExons() {
    const url = this._urlFor('overlap/id/' + this.geneId, {
      feature: 'exon'
    });
    console.log(url);
    return this._getOrFetch('_exon', url);
  }

  getDomains() {

  }

  getGene() {
    const url = this._urlFor('overlap/id/' + this.geneId, {
      feature: 'gene'
    });
    console.log(url);
    return this._getOrFetch('_gene', url);
  }


  getRelativeCoords(coords) {
    return this.getGene().then((data) => {
      const geneStart = data[0]['start'];
      const geneEnd = data[0]['end'];

      // convert from 1 base coordinates relative to chromoseome
      //to relative to gene (0 based start, and 1 based end)
      return {
        start: coords.start - geneStart,
        end: coords.end - geneStart + 1
      };
    });
  }

  getAlignmentCoords(coords) {
    return this.getAlignedDNA().then((data) => {
      if (!this._alignmentCoordConverter){
        this._alignmentCoordConverter = this._createAlignedCoordConverter(data.source.align_seq);
      }
    })
    .then(() => {
      return this.getRelativeCoords(coords);
    })
    .then((relativeCoords) => {
      return {
        start: this._alignmentCoordConverter.convert(relativeCoords.start),
        end: this._alignmentCoordConverter.convert(relativeCoords.end)
      };
    });

  }


  _getOrFetch(name, url){
    const dataPromise = new Promise((resolve, reject) => {
      if (this[name]) {
        resolve(this[name]);
      } else {
        jquery.ajax(url, {
          success: (result) => {
            this[name] = result;
            resolve(result);
          },
          error: (error) => {
            reject(error);
          }
        });
      }
    });
    return dataPromise;
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

  _createAlignedCoordConverter(alignedSeq) {
    const _coordsMap = [];
    for (let i=0; i<alignedSeq.length; i++){
      if (alignedSeq[i] !== '-'){
        _coordsMap.push(i);
      }
    }
    return {
      convert: (coord) => _coordsMap[coord]
    };
  }
}
