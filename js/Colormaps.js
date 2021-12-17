const continuousMapConversion = {
    'Blues': d3.interpolateBlues,
    'Greens': d3.interpolateGreens,
    'Greys': d3.interpolateGreys,
    'Oranges': d3.interpolateOranges,
    'Purples': d3.interpolatePurples,
    'Reds': d3.interpolateReds,
    'Turbo': d3.interpolateTurbo,
    'Viridis': d3.interpolateViridis,
    'Inferno': d3.interpolateInferno,
    'Magma': d3.interpolateMagma,
    'Plasma': d3.interpolatePlasma,
    'Cividis': d3.interpolateCividis,
    'Warm': d3.interpolateWarm,
    'Cool': d3.interpolateCool,
    'Rainbow': d3.interpolateRainbow,
    'Sinebow': d3.interpolateSinebow
};
const categoricalMapConversion = {
    'Category10': d3.schemeCategory10,
    'Accent': d3.schemeAccent,
    'Dark2': d3.schemeDark2,
    'Paired': d3.schemePaired,
    'Pastel1': d3.schemePastel1,
    'Pastel2': d3.schemePastel2,
    'Set1': d3.schemeSet1,
    'Set2': d3.schemeSet2,
    'Set3': d3.schemeSet3,
    'Tableau10': d3.schemeTableau10
};

function make_colorbar_continuous(valueArray, colormap) {
    const min_val = d3.min(valueArray);
    const max_val = d3.max(valueArray);
    const colorBar = d3.scaleSequential().domain([min_val, max_val])
        .interpolator(continuousMapConversion[colormap]);
    return colorBar;
};

function make_colorbar_categorical(valueArray, colormap) {
    const uniqueVal = valueArray.filter((v, i, a) => a.indexOf(v) === i);
    const colorBar = d3.scaleOrdinal().domain(uniqueVal)
        .range(categoricalMapConversion[colormap]);
    return colorBar;
};