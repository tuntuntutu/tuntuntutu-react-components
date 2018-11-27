const checkRules = (val, rules) => {
  const { noEmptyString = false } = rules;

  if (val === undefined) return false;

  if (noEmptyString && val === '') {
    return false;
  }

  return true;
};

/* 判断元素类型 */
const getItemType = (data) => {
  let dataType;

  if (typeof data === 'object' && Object.prototype.toString.call(data) === '[object Object]') {
    dataType = 'object';
  } else if (typeof data === 'object' && Object.prototype.toString.call(data) === '[object Array]') {
    dataType = 'array';
  } else if (typeof data === 'string') {
    dataType = 'string';
  }

  return dataType;
};


/**
 * 去除request data中 undefined 或者 空字符串（trim之后，由rules中的noEmptyString决定）
 *
 * @param    {object}  data     request data
 * @param    {object}  rules    数据规则，noEmoji, 默认true
 */
const juicer = (data, rules = {}) => {
  switch (getItemType(data)) {
    case 'string':
      if (rules.noEmoji) {
        const ranges = /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[A9|AE]\u3030|\uA9|\uAE|\u3030/ig;// eslint-disable-line

        return data.trim().replace(ranges, '');
      }

      return data.trim();
    case 'array':
      return data.reduce((ret, item) => {
        const nItem = juicer(item, rules);

        checkRules(nItem, rules) && ret.push(nItem);

        return ret;
      }, []);
    case 'object':
      return Object.keys(data).reduce((ret, item) => {
        const nItem = juicer(data[item], rules);

        checkRules(nItem, rules) && (ret[item] = nItem);

        return ret;
      }, {});
    default:
      return data;
  }
};

export default juicer;
