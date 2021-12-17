const continuousFeatures = [
    "ASAquick_SolventAccessibility_RawScore", "ASAquick_SolventAccessibility_propensity", "DFLpred_linker_propensity",
    "DRNApred_DNAbinding_propensity", "DRNApred_RNAbinding_propensity", "DisoRDPbind_DNAbinding_propensity",
    "DisoRDPbind_Proteinbinding_propensity", "DisoRDPbind_RNAbinding_propensity", "MMseqs2_conservation_propensity",
    "MoRFchibi_MoRF_propensity", "SCRIBER_Proteinbinding_propensity", "SignalP_propensity", "VSL2B_disorder_propensity"
];
const categoricalFeatures = [
    "ASAquick_SolventAccessibility_binary", "DFLpred_linker_binary", "DRNApred_DNAbinding_binary", "DRNApred_RNAbinding_binary",
    "DisoRDPbind_DNAbinding_binary", "DisoRDPbind_Proteinbinding_binary", "DisoRDPbind_RNAbinding_binary", "MoRFchibi_MoRF_binary",
    "PSIPRED_secondary_structure", "SCRIBER_binary", "SignalP_binary", "VSL2B_disorder_binary", "Sequence"
];
const ordinalFeatures = ["MMseqs2_conservation_decile", "PSIPRED_Coil", "PSIPRED_Helix", "PSIPRED_Strand"];

const continuousColormaps = [
    'Viridis', 'Blues', 'Greens', 'Greys', 'Oranges', 'Purples', 'Reds', 'Turbo',
    'Inferno', 'Magma', 'Plasma', 'Cividis', 'Warm', 'Cool', 'Rainbow', 'Sinebow'
];
const categoricalColormaps = [
    'Set1', 'Category10', 'Accent', 'Dark2', 'Paired', 'Pastel1', 'Pastel2', 
    'Set2', 'Set3', 'Tableau10'
];

const continuousColorOptions = `
    <option value="Viridis">Viridis</option>
    <option value="Blues">Blues</option>
    <option value="Greens">Greens</option>
    <option value="Greys">Greys</option>
    <option value="Oranges">Oranges</option>
    <option value="Purples">Purples</option>
    <option value="Reds">Reds</option>
    <option value="Turbo">Turbo</option>
    <option value="Inferno">Inferno</option>
    <option value="Magma">Magma</option>
    <option value="Plasma">Plasma</option>
    <option value="Cividis">Cividis</option>
    <option value="Warm">Warm</option>
    <option value="Cool">Cool</option>
    <option value="Rainbow">Rainbow</option>
    <option value="Sinebow">Sinebow</option>`;
const categoricalColorOptions = `
    <option value="Set1">Set 1</option>
    <option value="Category10">Category 10</option>
    <option value="Accent">Accent</option>
    <option value="Dark2">Dark 2</option>
    <option value="Paired">Paired</option>
    <option value="Pastel1">Pastel 1</option>
    <option value="Pastel2">Pastel 2</option>
    <option value="Set2">Set 2</option>
    <option value="Set3">Set 3</option>
    <option value="Tableau10">Tableau 10</option>`;

async function read_protein_data(accession_num) {
    const cors_url = 'https://protviz-cors-anywhere.herokuapp.com/';
    const file_url = `${cors_url}http://biomine.cs.vcu.edu/webresults/DESCRIBEPROT/result/${accession_num}_result.json`;
    //const data = await fetch(file_url);
    const data = await d3.json(file_url);
    //console.log(data);
    return data;
};

function update_colors(valueArray, colorbar) {
    const model = proteinInstance.selectEntities('model')[0];
    if (!model) {
        return
    };

    let coloring = {
        base: {r: 255, g: 255, b: 255},
        entries: []
    };

    for (let i = 1; i <= valueArray.length; i++) {
        let colorString = d3.color(colorbar(valueArray[i-1]));
        coloring['entries'].push(
            {
                entity_id: '1',
                struct_asym_id: 'A',
                start_residue_number: i,
                end_residue_number: i,
                color: {r: colorString['r'], g: colorString['g'], b: colorString['b']}
            }
        )
    };
    //console.log(model);
    let theme = LiteMolPluginInstance.CustomTheme.createTheme(model.props.model, coloring);
    LiteMolPluginInstance.CustomTheme.applyTheme(proteinInstance, 'polymer-visual', theme);
};

async function color_protein(feature, colormap) {
    let proteinInput = proteinSearch.elements['protein'].value;
    let data = await read_protein_data(proteinInput);
    let featureData, colorbar;

    if (continuousFeatures.includes(feature)) {
        featureData = data[feature].split(',').map(Number);
        colorbar = make_colorbar_continuous(featureData, colormap);
        colorLegendContinuous(colorbar);
    } else if (categoricalFeatures.includes(feature)) {
        featureData = data[feature].split('');
        colorbar = make_colorbar_categorical(featureData, colormap);
        colorLegendCategorical(colorbar);
    } else if (ordinalFeatures.includes(feature)) {
        if (feature == "MMseqs2_conservation_decile") {
            featureData = data[feature].split('');
        } else {
            featureData = data[feature].split(',');
        };
        featureData = featureData.map(item => parseInt(item, 10));
        colorbar = make_colorbar_continuous(featureData, colormap);
        colorLegendContinuous(colorbar);
    };
    
    //console.log(colorbar(featureData[0]));
    update_colors(featureData, colorbar);
};

d3.select("#residue").on("change", function(d) {
    let selected_option = d3.select(this).property("value");
    let selected_colormap = d3.select('#colormap').property("value");
    let colormapSelect = document.getElementById('colormap');
    let colormap;

    if (categoricalFeatures.includes(selected_option)) {
        colormapSelect.innerHTML = categoricalColorOptions;
    } else {
        colormapSelect.innerHTML = continuousColorOptions;
    };

    if (categoricalFeatures.includes(selected_option)) {
        if (categoricalColormaps.includes(selected_colormap)) {
            colormapSelect.value = selected_colormap;
            colormap = selected_colormap;
        } else {
            colormapSelect.value = 'Set1';
            colormap = 'Set1';
        };
    } else {
        if (continuousColormaps.includes(selected_colormap)) {
            colormapSelect.value = selected_colormap;
            colormap = selected_colormap;
        } else {
            colormapSelect.value = 'Viridis';
            colormap = 'Viridis';
        };
    };

    if (selected_option != 'default') {
        colormapSelect.style.display = 'block';
        document.getElementById('colormapLabel').style.display = 'block';
        color_protein(selected_option, colormap);
    } else {
        colormapSelect.style.display = 'none';
        document.getElementById('colormapLabel').style.display = 'none';
    };
});

d3.select("#colormap").on("change", function(d) {
    let selected_colormap = d3.select(this).property("value");
    let feature = d3.select('#residue').property("value");
    if (feature != 'default') {
        color_protein(feature, selected_colormap);
    };
});