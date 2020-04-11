const characteristicsTransform = (characteristics) => {
  let keys = Object.keys(characteristics);
  for (let key of keys) {
    characteristics[key] = Number(characteristics[key]);
  }
  return characteristics;
};

module.exports = characteristicsTransform;
