/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

(function () {
    "use strict";

    var csInterface = new CSInterface();
    // resize doesnt seem to work in illustrator
    csInterface.resizeContent(250, window.innerHeight);
    console.log(SystemPath.EXTENSION)
    function loadJSX(pPath) {
        var scriptPath = csInterface.getSystemPath(SystemPath.EXTENSION) + pPath;
        csInterface.evalScript('evalFile("' + scriptPath + '")');
    }
    window.mediaType = "";
    window.forMats = [];
    window.sepaRator = "";
    window.clientName = $("#clientName").val();
    window.logoType = $("#logotype").val();
    /*
        https://stackoverflow.com/questions/4335069/calling-a-javascript-function-from-another-js-file
        GLobal scope function
        function A() {
            window.B = function() {
                alert("function B is running");
            }
        }
        // CALL FUNCTION B FROM GLOBAL SCOPE
        B();
    */
    window.exportingFiles = function(exportfiles){
        if(exportfiles){
            $("#dragOver").addClass("exporting");
            $("#dropOver").addClass("loading");
            $("#dropOverTxt").text("Exporting files");
        } else {
            $("#dragOver").removeClass("exporting");
            $("#dropOver").removeClass("loading");
            $("#dropOverTxt").text("");
        }
    };
    window.throwMessage = function (run, message) {
        var messages = $("#messages");
        var content = $("#content");
        content.addClass("blur");
        if (run == "true") {
            messages.addClass("visible").removeClass("hidden");
            messages.html(message);
            setTimeout(function () {
                messages.addClass("hidden").removeClass("visible");
                content.removeClass("blur");
            }, 1200);
        } else {
            messages.html(message);
            messages.addClass("visible error errIcon").removeClass("hidden");
            setTimeout(function () {
                messages.addClass("hidden").removeClass("visible").removeClass("error").removeClass("errIcon");
                content.removeClass("blur");
            }, 1200);
        }
    };
    window.outputRun = function (run) {
        if (run == "selection") {
            throwMessage(false, "Nothing selected");
        } else if (run == "clientname") {
            throwMessage(false, "No client name set");
        } else if (run == "logotype") {
            throwMessage(false, "No logo type set");
        } else if (run == "mediatype") {
            throwMessage(false, "No media type set");
        } else if (run == "separator") {
            throwMessage(false, "No separator type set");
        } else if (run == "true") {
            throwMessage(run, "Generation done");
        } else if (run == "false") {
            throwMessage(run, "Generation cancelled");
        }
    };
    function init() {
        themeManager.init();
        monitorCheck(); // check monitor resolution add extra CSS accordingly
        // loadJSX('/jsx/main.jsx');
        var exportJSX = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/export.jsx";
        var script = '$.evalFile("' + exportJSX + '");';
        csInterface.evalScript(script);

        $("#generate_btn").click(function () {
            // mediaType=''; // reset so we dont get double folders
            getValues();
            csInterface.evalScript(`generateLogoVariation('${clientName}','${logoType}','${mediaType}','${sepaRator}','${forMats}')`, function (run) {
                outputRun(run);
            });
        });
        $("#digital_btn").click(function () {
            getValues();
            csInterface.evalScript(`generateLogoVariation('${clientName}','${logoType}','${mediaType}','${sepaRator}','${forMats}')`, function (run) {
                if (run == "selection") {
                    throwMessage(false, "Nothing selected");
                }
                if (run == "true") {
                    throwMessage(run, "Generation done");
                }
                if (run == "false") {
                    throwMessage(run, "Generation cancelled");
                }
            });
        });
        
        $("#export_btn").click(function () {
            getValues();
            exportingFiles(true);
            csInterface.evalScript(`exportFiles('${mediaType}','${forMats}')`, function (run) {
                exportingFiles(false);
                if (run == "true") {
                    throwMessage(run, "Export done");
                } else {
                    throwMessage(run, "Export cancelled");
                }
            });
        });
        $("#instructions").click(function () {
            $("body").toggleClass("closed").toggleClass("open");
        });
        var setDestFolder = $("#setDestFolder");
        var openDestFolder = $("#openDestFolder");
        var clearDestFolder = $("#clearDestFolder");
        var expBtn = $("#export_btn");
        var expPath = $("#expPath");
        
        $("#setDestFolder").click(function () {
            csInterface.evalScript(`setDestFolder()`, function (run) {
                if (run.split(",")[0] == "true") {
                    setDestFolder.addClass("active");
                    openDestFolder.removeClass("disabled");
                    clearDestFolder.removeClass("disabled");
                    expBtn.removeClass("disabled");
                    expPath.val(run.split(",")[1]);
                    throwMessage(run.split(",")[0], "Destination set");
                } else {
                    setDestFolder.removeClass("active");
                    openDestFolder.addClass("disbled");
                    clearDestFolder.addClass("disabled");
                    expBtn.addClass("disabled");
                    throwMessage(false, "No destination set");
                }
            });
        });
        $("#openDestFolder").click(function () {
            csInterface.evalScript(`openDestFolder()`, function (run) {
                if (run == "true") {
                    throwMessage(run, "Opened destination");
                } else {
                    throwMessage(false, "No destination set");
                }
            });
        });
        
        $("#clearDestFolder").click(function () {
            csInterface.evalScript(`clearDestFolder()`, function (run) {
                if (run == "true") {
                    throwMessage(run, "Folder content cleared");
                } else {
                    throwMessage(false, "Action cancelled");
                }
            });
        });
        
        window.getValues = function () {
            console.log("Getting values");
            clientName = $("#clientName").val();
            logoType = $("#logotype").val();
            mediaType = $("input[name='media']:checked").val();
            sepaRator = $("input[name='separator']:checked").val();
            forMats = [];
            $("input:checkbox[name=formats]:checked").each(function () {
                forMats.push($(this).val());
            });
        };
        
        $("input[type='radio']").click(function () {
            mediaType = mediaType == "" ? $("input[name='media']:checked").val() : "";
        });
        
        $("input[type='radio']").click(function () {
            sepaRator = sepaRator == "" ? $("input[name='separator']:checked").val() : "";
        });
        
        $("#resetJSON_btn").click(function () {
            setting.load(false,false,false);
            // $('#svgHolder'). document.deleteContents();
            // document.deleteContents('.svgHolder');
        });

        $("#loadJSON_btn").click(function () {
            setting.load(false,false,true);
        });

        $("#saveJSON_btn").click(function () {
            setting.saves();
        });
        $("#importJSON_btn").click(function () {
            setting.import();
        });
        $("#exportJSON_btn").click(function () {
            setting.export();
        });

        /////////////////////////////////////////////////////////////////////////////////////////
        // FlyoutMenu
        var hostEnv = csInterface.getHostEnvironment();
        var appName = hostEnv.appName;
        var refURLs = {
            ILST: "https://github.com/mevCJ/logo-packer",
            ILST: "https://github.com/mevCJ/logo-packer/issues",
            // 'PHXS' : 'http://yearbook.github.io/esdocs/#/Photoshop/Application',
            // 'PHSP' : 'http://yearbook.github.io/esdocs/#/Photoshop/Application',
            // 'AEFT' : 'http://www.adobe.com/devnet/aftereffects.html'
        };
        var refURL = refURLs[appName];
        // Reloads extension panel
        var menuXML =
            // <MenuItem Id="debugPanel" Label="Debug" Enabled="true" Checkable="true" Checked="false"/> \
            '<Menu> \
            <MenuItem Id="info" Label="Panel info page" Enabled="true" Checked="false"/> \
            <MenuItem Label="---" /> \
            <MenuItem Id="github" Label="View on Github" Enabled="true" Checked="false"/> \
            <MenuItem Id="githubIssue" Label="Report Issue" Enabled="true" Checked="false"/> \
            <MenuItem Label="---" /> \
            <MenuItem Id="reloadPanel" Label="Reload Panel" Enabled="true" Checked="false"/> \
            </Menu>';

        csInterface.setPanelFlyoutMenu(menuXML, flyoutMenuCallback);
        csInterface.addEventListener("com.adobe.csxs.events.flyoutMenuClicked", flyoutMenuCallback);
        csInterface.setContextMenu(menuXML, flyoutMenuCallback);
        csInterface.addEventListener("com.adobe.csxs.events.contextMenuClicked", flyoutMenuCallback);
        var debugPanel = false;
        function flyoutMenuCallback(event) {
            var menuId = event.type && event.data ? event.data.menuId : event;
            if (menuId == "info") {
                csInterface.openURLInDefaultBrowser("https://mevcj.github.io/logo-packer");
                // LoseFocus();
            } else if (menuId == "debugPanel") {
                // toggleDebug();
            } else if (menuId == "github") {
                csInterface.openURLInDefaultBrowser("https://github.com/mevCJ/logo-packer");
                // LoseFocus();
                // window.cep.util.openURLInDefaultBrowser(refURL[0]);
            } else if (menuId == "githubIssue") {
                csInterface.openURLInDefaultBrowser("https://github.com/mevCJ/logo-packer/issues");
                // LoseFocus();
                // window.cep.util.openURLInDefaultBrowser(refURL[1]);
            } else if (menuId == "reloadPanel") {
                location.reload();
            }
        }

        function toggleDebug() {
            debugPanel = !debugPanel;
            // context menu and flyout menu become out of sync, seems like a bug;
            csInterface.updateContextMenuItem("Debug", true, debugPanel);
            csInterface.updatePanelMenuItem("Debug", true, debugPanel);
        }
        /////////////////////////////////////////////////////////////////////////////////////////
    }

    init();
    // forced dd change so panel refreshes
    $("#logotype").trigger("change");
})();
