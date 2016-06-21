import WBDataModel from './WBDataModel';
import GeneModel from './GeneModel';
/*
  handles homology info and aligned sequence fetching, i.e. with the /homology/id/ API.
  Delegate gene specific tasks to GeneModel class
*/
export default class HomologyModel extends WBDataModel {
  constructor(sourceGeneId, targetSpecies='homo_sapiens'){
    super();
    this.geneId = sourceGeneId;
    this.targetSpecies = targetSpecies;  // species to retrieve homology info from

    const alignedSourceDNAPromise = this.getAlignedSourceDNA();
    const alignedTargetDNAPromise = this.getAlignedTargetDNA();
    const alignedSourceProteinPromise = this.getAlignedSourceProtein();
    const alignedTargetProteinPromise = this.getAlignedTargetProtein();

    // make sourceGeneModel a Promise to be consistent with the targetGeneModel
    this.sourceGeneModel = new Promise((resolve) => {
      resolve(new GeneModel(sourceGeneId, alignedSourceDNAPromise, alignedSourceProteinPromise));
    });
    this.targetGeneModel = this._getTargetGeneId().then((targetGeneId) => {
      return new GeneModel(targetGeneId, alignedTargetDNAPromise, alignedTargetProteinPromise);
    });

  }

  getAlignedDNA() {
    const url = this._urlFor('homology/id/' + this.geneId, {
      sequence: 'cdna',
      type: 'orthologues'
    });

    return this._getOrFetch('_aligned_dna', url)
      .then((data) => this._parseAligned(data));
  }

  getAlignedTargetDNA() {
    return this.getAlignedDNA().then((data) => data.target);
  }

  getAlignedSourceDNA() {
    return this.getAlignedDNA().then((data) => data.source);
  }

  getAlignedProtein() {
    const url = this._urlFor('homology/id/' + this.geneId, {
      sequence: 'protein',
      type: 'orthologues'
    });

    return this._getOrFetch('_aligned_protein', url)
      .then((data) => this._parseAligned(data));
  }

  getAlignedTargetProtein() {
    return this.getAlignedProtein().then((data) => data.target);
  }

  getAlignedSourceProtein() {
    return this.getAlignedProtein().then((data) => data.source);
  }

  _parseAligned(data) {
    if (data['data'].length > 0){
      const homologs = data['data'][0].homologies;
      const selectHomolog = homologs.find((h) => h.target.species === this.targetSpecies);
      return selectHomolog;
    }
    return null;
  }

  _getTargetGeneId() {
    return this.getAlignedDNA().then((data) => {
      return data.target.id;
    });
  }
}

