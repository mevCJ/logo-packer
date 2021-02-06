/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
    'use strict';

    var csInterface = new CSInterface();


    function init() {

        themeManager.init();
        var exportJSX =  csInterface.getSystemPath(SystemPath.EXTENSION) + '/jsx/export.jsx';
        var script = '$.evalFile("' + exportJSX + '");';
        csInterface.evalScript(script);

        $("#generate_btn").click(function () {
            var label = $('#logotype_select').val();
            csInterface.evalScript(`generateLogoVariation('${label}')`);
        });

        $("#export_btn").click(function () {
            csInterface.evalScript(`exportFiles()`);
        });
    }

    init();

}());

