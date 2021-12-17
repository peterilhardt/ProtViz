const Plugin = LiteMol.Plugin;
const Views = Plugin.Views;
const Bootstrap = LiteMol.Bootstrap;
const Transformer = Bootstrap.Entity.Transformer;
const Tree = Bootstrap.Tree;
const Transform = Tree.Transform;

const proteinInstance = LiteMol.Plugin.create({target: '#proteinViewer'});

function applyTransforms(actions) {
    return proteinInstance.applyTransform(actions);
};

const proteinSearch = document.getElementById('proteinSearch');
//const proteinSearchButton = document.getElementById('proteinSearchButton');

proteinSearch.addEventListener('submit', function(event) {
    event.preventDefault();
    Bootstrap.Command.Tree.RemoveNode.dispatch(proteinInstance.context, proteinInstance.context.tree.root);
    let proteinInput = proteinSearch.elements['protein'].value;
    let newUrl = `https://alphafold.ebi.ac.uk/files/AF-${proteinInput}-F1-model_v2.cif`;
    //proteinSearch.action = '/' + proteinInput;

     const action = Transform.build()
         .add(proteinInstance.context.tree.root, Transformer.Data.Download, {
             url: newUrl,
             type: 'String',
             id: proteinInput
         })
         .then(Transformer.Data.ParseCif, {id: proteinInput}, {isBinding: true})
         .then(Transformer.Molecule.CreateFromMmCif, {blockIndex: 0}, {isBinding: true})
         .then(Transformer.Molecule.CreateModel, {modelIndex: 0}, {isBinding: false, ref: 'model'})
         .then(Transformer.Molecule.CreateMacromoleculeVisual, {
             polymer: true,
             polymerRef: 'polymer-visual',
             het: false,
             water: false
         });
     applyTransforms(action)
         .catch(e => {
             proteinSearch.elements['protein'].value = '';
             document.getElementById('protein').value = '';
             console.error(e);
         });
    
    let residueSelect = document.getElementById('residue');
    document.getElementById('residueLabel').style.display = 'block';
    residueSelect.style.display = 'block';
    residueSelect.value = 'default';

    document.getElementById('colormap').style.display = 'none';
    document.getElementById('colormapLabel').style.display = 'none';

    //proteinInstance.loadMolecule({
    //    url: newUrl,
    //    format: 'cif',
    //    id: proteinInput
    //}).catch(e => {
    //    console.error(e);
    //});
});