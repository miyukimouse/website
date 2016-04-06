export function tag2Url(tag) {
  const {wbId, wbClass} = _getWormBaseTag(tag);

  if (wbId) {
    return `/species/all/${wbClass.toLowerCase()}/${wbId}`;
  }
}

export function tag2Rest(tag, widgetName) {
  const {wbId, wbClass} = _getWormBaseTag(tag);

  if (wbId) {
    return `/rest/widget/${wbClass.toLowerCase()}/${wbId}/${widgetName}?content-type=application/json`;
  }
}

function _getWormBaseTag(tag) {
  const tagClass = tag.class_id || '';
  const matched = tagClass.match(/(\w+)\:(\w+)/);
  const [match, prefix, suffix] = matched ? matched : [];

  let wbId, wbClass;
  if (prefix ==='WBbt'){
    wbId = match;
    wbClass = 'anatomy_term';
  } else if (prefix === 'GO'){
    wbId = match;
    wbClass = 'go_term';
  } else if (prefix === 'UniProtKB'){
    wbId = suffix;
    wbClass = 'gene';
  } else if (prefix === 'WB'){
    const idMatched = suffix.match(/WB(\w+?)\d+/);
    [wbId, wbClass] = idMatched ? idMatched : [suffix, 'all'];
    wbClass =  wbClass.toLowerCase();
  }
  return {
    wbId,
    wbClass
  }
}

export function parseNodeOverview(node, json) {
  const {wbClass} = _getWormBaseTag(node);

  if (wbClass === 'go_term') {
    return (new GONodeOverview(node, json)).getBlurb();
  } else if (wbClass === 'anatomy_term') {
    return (new AnatomyNodeOverview(node, json)).getBlurb();
  } else if (wbClass === 'gene') {
    return (new GeneNodeOverview(node, json)).getBlurb();
  }
}

class NodeOverview {
  constructor(node, json) {
    this._node = node;
    this._json = json;
  }

  getBlurb() {
    return this._json.fields;
  }

  _cleanBlurb(obj) {
    const newObj = {};
    Object.keys(obj).forEach((key) => {
      const hasData = obj[key] && obj[key].data;

      // remove empty fields
      if (hasData){
        const newKey = key.replace(/_+/g, ' '); // remove underscore in field names
        newObj[newKey] = obj[key];
      }
    });
    return newObj;
  }

}

class GONodeOverview extends NodeOverview {

  getBlurb(){
    const {
      definition,
      type
    } = super.getBlurb();

    return this._cleanBlurb({
      definition,
      type
    });
  }

}


class AnatomyNodeOverview extends NodeOverview {

  getBlurb(){
    const {
      definition
    } = super.getBlurb();

    return this._cleanBlurb({
      definition
    });
  }

}

class GeneNodeOverview extends NodeOverview {

  getBlurb(){
    const {
      concise_description
    } = super.getBlurb();

    return this._cleanBlurb({
      concise_description: {
        data: this._getFieldData(concise_description).text
      }
    });
  }

  _getFieldData(field){
    return (field && field.data) || {};
  }

}
