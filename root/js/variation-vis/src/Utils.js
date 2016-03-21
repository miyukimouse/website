import jquery from 'jquery';

export const TRACK_HEIGHT = 20;



export class GeneModel {

  constructor(geneId) {
    this.geneId = geneId;
  }

  getAlignedDNASequence() {
    const url = this._urlFor('homology/id/' + this.geneId, {
      sequence: 'cdna',
      type: 'orthologues'
    });
    console.log(url);
    return this._getOrFetch('_aligned_dna', url)
      .then((data) => this._parseAligned(data));    
  }

  getAlignedProteinSequence() {
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


  getRelativeCoords(coords, markerCoords) {

  }

  getAlignmentCoords(coords) {

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
}
