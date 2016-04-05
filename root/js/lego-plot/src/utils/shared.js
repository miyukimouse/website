export function tag2Url(tag) {
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
  }

  if (wbId) {
    return `/species/all/${wbClass.toLowerCase()}/${wbId}`;
  }
}
