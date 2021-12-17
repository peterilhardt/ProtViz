var LiteMolPluginInstance;
(function (LiteMolPluginInstance) {
    var CustomTheme;
    (function (CustomTheme) {
        var Core = LiteMol.Core;
        var Visualization = LiteMol.Visualization;
        var Bootstrap = LiteMol.Bootstrap;
        var Q = Core.Structure.Query;
        var ColorMapper = /** @class */ (function () {
            function ColorMapper() {
                this.uniqueColors = [];
                this.map = Core.Utils.FastMap.create();
            }

            Object.defineProperty(ColorMapper.prototype, "colorMap", {
                get: function () {
                    var map = Core.Utils.FastMap.create();
                    this.uniqueColors.forEach(function (c, i) {
                        return map.set(i, c);
                    });
                    return map;
                },
                enumerable: true,
                configurable: true
            });
            ColorMapper.prototype.addColor = function (color) {
                var id = color.r + "-" + color.g + "-" + color.b;
                if (this.map.has(id))
                    return this.map.get(id);
                var index = this.uniqueColors.length;
                this.uniqueColors.push(Visualization.Color.fromRgb(color.r, color.g, color.b));
                this.map.set(id, index);
                return index;
            };
            return ColorMapper;
        }());

        function createTheme(model, colorDef) {
            var mapper = new ColorMapper();
            mapper.addColor(colorDef.base);
            var map = new Uint8Array(model.data.atoms.count);
            for (var _i = 0, _a = colorDef.entries; _i < _a.length; _i++) {
                var e = _a[_i];
                var query = Q.sequence(e.entity_id.toString(), e.struct_asym_id, {seqNumber: e.start_residue_number}, {seqNumber: e.end_residue_number}).compile();
                var colorIndex = mapper.addColor(e.color);
                for (var _b = 0, _c = query(model.queryContext).fragments; _b < _c.length; _b++) {
                    var f = _c[_b];
                    for (var _d = 0, _e = f.atomIndices; _d < _e.length; _d++) {
                        var a = _e[_d];
                        map[a] = colorIndex;
                    }
                }
            }
            var fallbackColor = {r: 0.6, g: 0.6, b: 0.6};
            var selectionColor = {r: 0, g: 0, b: 1};
            var highlightColor = {r: 1, g: 0, b: 1};
            var colors = Core.Utils.FastMap.create();
            colors.set('Uniform', fallbackColor);
            colors.set('Selection', selectionColor);
            colors.set('Highlight', highlightColor);
            var mapping = Visualization.Theme.createColorMapMapping(function (i) {
                return map[i];
            }, mapper.colorMap, fallbackColor);
            // make the theme "sticky" so that it persist "ResetScene" command.
            return Visualization.Theme.createMapping(mapping, {colors: colors, isSticky: true});
        }

        CustomTheme.createTheme = createTheme;

        function applyTheme(plugin, modelRef, theme) {
            var visuals = plugin.selectEntities(Bootstrap.Tree.Selection.byRef(modelRef).subtree().ofType(Bootstrap.Entity.Molecule.Visual));
            for (var _i = 0, visuals_2 = visuals; _i < visuals_2.length; _i++) {
                var v = visuals_2[_i];
                plugin.command(Bootstrap.Command.Visual.UpdateBasicTheme, {visual: v, theme: theme});
            }
        }

        CustomTheme.applyTheme = applyTheme;
    })(CustomTheme = LiteMolPluginInstance.CustomTheme || (LiteMolPluginInstance.CustomTheme = {}));
})(LiteMolPluginInstance || (LiteMolPluginInstance = {}));