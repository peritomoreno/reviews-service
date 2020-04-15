const formatEmptyResponse = (charArray, product_id) => {
  let output = {
    product_id: product_id,
    ratings: {},
    recommended: {},
    characteristics: {},
  };

  for (let char of charArray) {
    let charData = {};
    if (char.name === "Size") {
      charData.id = 1;
      charData.value = null;
      output.characteristics[char.name] = charData;
    } else if (char.name === "Width") {
      charData.id = 2;
      charData.value = null;
      output.characteristics[char.name] = charData;
    } else if (char.name === "Comfort") {
      charData.id = 3;
      charData.value = null;
      output.characteristics[char.name] = charData;
    } else if (char.name === "Quality") {
      charData.id = 4;
      charData.value = null;
      output.characteristics[char.name] = charData;
    } else if (char.name === "Length") {
      charData.id = 5;
      charData.value = null;
      output.characteristics[char.name] = charData;
    } else if (char.name === "Fit") {
      charData.id = 6;
      charData.value = null;
      output.characteristics[char.name] = charData;
    }
  }

  return output;
};

module.exports = formatEmptyResponse;
