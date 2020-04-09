var formatMetaCharacteristics = (characteristics) => {
  let data = {};

  // Loop thru all of the characteristics for formatting purposes (O(1) Time Complexity - Max Six Iterations)
  for (let characteristic in characteristics) {
    let charData = { id: 0, value: "" };
    let value = characteristics[characteristic];

    if (characteristic === "Size") {
      charData.id = 1;
      charData.value = formatNumber(characteristics[characteristic]);
      data[characteristic] = charData;
    } else if (characteristic === "Width") {
      charData.id = 2;
      charData.value = formatNumber(characteristics[characteristic]);
      data[characteristic] = charData;
    } else if (characteristic === "Comfort") {
      charData.id = 3;
      charData.value = formatNumber(characteristics[characteristic]);
      data[characteristic] = charData;
    } else if (characteristic === "Quality") {
      charData.id = 4;
      charData.value = formatNumber(characteristics[characteristic]);
      data[characteristic] = charData;
    } else if (characteristic === "Length") {
      charData.id = 5;
      charData.value = formatNumber(characteristics[characteristic]);
      data[characteristic] = charData;
    } else if (characteristic === "Fit") {
      charData.id = 6;
      charData.value = formatNumber(characteristics[characteristic]);
      data[characteristic] = charData;
    }
  }
  return data;
};

module.exports.formatMetaCharacteristics = formatMetaCharacteristics;

var formatNumber = (num) => {
  return (Math.round(num * 4) / 4).toFixed(2);
};
