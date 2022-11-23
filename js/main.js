/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, window, location, CSInterface, SystemPath, themeManager*/

// From json.js so i can call function from there 
String.prototype.gsep = function (e) {
    return this.replace(/\\/g, e || "/");
};
var PATH = require("path"),
CS = new CSInterface(),
$path = {
    host: CS.getSystemPath(SystemPath.HOST_APPLICATION),
    myDocs: CS.getSystemPath(SystemPath.MY_DOCUMENTS),
    userData: CS.getSystemPath(SystemPath.USER_DATA),
    extension: CS.getSystemPath(SystemPath.EXTENSION),
    commonFiles: CS.getSystemPath(SystemPath.COMMON_FILES),
    application: CS.getSystemPath(SystemPath.APPLICATION),
    project: {},
};
(window.jQuery = require(PATH.normalize($path.extension + "/js/libs/jquery-3.4.1.min.js").gsep())), (window.$ = window.jQuery);
// (window.jQuery = require(PATH.normalize($path.extension + "/js/libs/jquery-2.0.2.min.js").gsep())), (window.$ = window.jQuery);

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
    window.marginVal = $("#margins").val();
    window.marginType = $("#margintype").val();
    window.allArtboards = $("input[name='allartboards']:checked").val();
    window.baseDocType = $("#baseDocType").val();
    window.autoResize = "";
    window.subFolders = "";
    window.checkABhasArt = "";
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
        // console.log(run)
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
        console.log("starting generation")
        console.log("run " + run)
        // console.log(run)
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
            csInterface.evalScript(`generateLogoVariation('${clientName}','${logoType}','${mediaType}','${sepaRator}','${forMats}','${autoResize}')`, function (run) {
                outputRun(run);
            });
        });
        // $("#digital_btn").click(function () {
        //     getValues();
        //     csInterface.evalScript(`generateLogoVariation('${clientName}','${logoType}','${mediaType}','${sepaRator}','${forMats}')`, function (run) {
        //         if (run == "selection") {
        //             throwMessage(false, "Nothing selected");
        //         }
        //         if (run == "true") {
        //             throwMessage(run, "Generation done");
        //         }
        //         if (run == "false") {
        //             throwMessage(run, "Generation cancelled");
        //         }
        //     });
        // });
        
        $("#export_btn").click(function () {
            exportingFiles(true);
            getValues();
            // compensate slower CS versions 
            // panel wont show export animation otherwise
            setTimeout(function () {
                csInterface.evalScript(`exportFiles('${mediaType}','${logoType}','${forMats}','${subFolders}','${checkABhasArt}')`, function (run) {
                    console.log("ExportFiles var run "+ run)
                    if (run == "true") {
                        throwMessage(run, "Export done");
                    } else if(run=="formats") {
                        throwMessage(false, "No formats set");
                    } else {
                        throwMessage(run, "Export cancelled");
                    }
                    exportingFiles(false);
                });
            },100);
        });
        $("#instructions").click(function () {
            $("body").toggleClass("closed").toggleClass("open");
        });

        $("#extras h1").click(function () {
            $("body").toggleClass("closedExtras").toggleClass("openExtras");
        });
        
        $("#newbasedoc_btn").click(function () {
            getBaseDocType();
            setTimeout(function () {
                csInterface.evalScript(`newBaseDoc('${clientName}','${baseDocType}')`, function (run) {
                    if (run == "true") {
                        throwMessage(run, "Base Documented created");
                    } else if(run=="clientname") {
                        throwMessage(false, "No client name set");
                    } else if(run=="doctype") {
                        throwMessage(false, "No doc type set");
                    } else {
                        throwMessage(run, "Something went wrong");
                    }
                });
            },100);
        });
        $("#addmargins_btn").click(function () {
            getMarginValues();
            setTimeout(function () {
                csInterface.evalScript(`addMarginToArtboard('${marginVal}','${marginType}','${logoType}')`, function (run) {
                    if (run == "true") {
                        throwMessage(run, "Added Margins");
                    } else {
                        throwMessage(run, "Failed to add margins");
                    }
                });
            },100);
        });
        $("#margins").on("change", function () {
            getMarginValues();
            setTimeout(function () {
                csInterface.evalScript(`addMarginToArtboard('${marginVal}','${marginType}','${allArtboards}','${logoType}')`, function (run) {
                    if (run == "true") {
                        throwMessage(run, "Added Margins");
                    } else {
                        throwMessage(run, "Failed to add margins");
                    }
                });
            },100);
        });
        $("#cleanupLogo_btn").click(function () {
            getValues();
            setTimeout(function () {
                csInterface.evalScript(`cleanupLogos('${clientName}')`, function (run) {
                    if (run == "true") {
                        throwMessage(run, "Logo(s) cleaned");
                    } else if(run=="clientname") {
                        throwMessage(false, "No client name set");
                    // } else if(run=="cancelled") {
                    //     throwMessage(false, "Cancelled Cleanup");
                    } else if(run=="cancelled") {
                        throwMessage(false, "Color Group name needs to be same as client name");
                    } else {
                        throwMessage(false, "Something went wrong");
                    }
                    console.log(run)
                });
            },100);
        });
        $("#clearSwatches_btn").click(function () {
            setTimeout(function () {
                csInterface.evalScript(`deleteUnusedPanelItems()`, function (run) {
                    if (run == "true") {
                        throwMessage(run, "All Swatches Cleared");
                    } else {
                        throwMessage(run, "Already Cleared Swatches");
                    }
                });
            },100);
        });

        window.getMarginValues = function () {
            console.log("Getting Margin values");
            marginVal = $("#margins").val();
            marginType = $("#margintype").val();
            logoType = $("#logotype").val();
            allArtboards = $("input[name='allartboards']:checked").val();
        };
        
        window.getBaseDocType = function () {
            console.log("Getting Basedoc Type");
            clientName = $("#clientName").val();
            baseDocType = $("#baseDocType").val();
        };

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
            autoResize = $("input:checkbox[name='autoresize']:checked").val();
            subFolders = $("input:checkbox[name='subfolders']:checked").val();
            checkABhasArt = $("input:checkbox[name='checkABhasArt']:checked").val();
        };
        
        $("input[type='radio']").on("change", function () {
            getValues();
            setPNGPrintNone();
        });
        $("input[type='checkbox']").on("change", function () {
            getValues();
            setPNGPrintNone();
        });
        function setPNGPrintNone(){
            // console.log("mediaType " + mediaType)
            // mediaType = mediaType == "Print" ? $("input[name='media']:checked").val() : "";
            var pngValue = $("input:checkbox[value=\"png\"]");
            var pngLabel = $("label[for=\"png\"]");
            // console.log("mediaType " + mediaType)
            // console.log(mediaType == "Print")
            if (mediaType == "Print"){
                // console.log($("input:checkbox[value=\"png\"]:checked").val())
                pngValue.prop("disabled",true);
                pngValue.addClass("disabled");
                pngLabel.addClass("disabled");
                if ($("input:checkbox[value=\"png\"]:checked").val() == 'png'){
                    pngValue.prop("checked", false)
                    
                }
            } else {
                // $("input:checkbox[value=\"png\"]").prop("checked", false)
                pngValue.prop("disabled",false);
                pngValue.removeClass("disabled");
                pngLabel.removeClass("disabled");
            }
        }
        
        $("input[type='radio']").click(function () {
            sepaRator = sepaRator == "" ? $("input[name='separator']:checked").val() : "";
        });
        // $("input[type='radio']").click(function () {
        //     autoResize = autoResize == "" ? $("input[name='autoresize']:checked").val() : "";
        // });
        // $("input[type='radio']").click(function () {
        //     subFolders = subFolders == "" ? $("input[name='subfolders']:checked").val() : "";
        // });
        
        $("#resetJSON_btn").click(function () {
            setting.load();
            // setting.load(false,false,false);
            // setting.get(false,false,false);
            // $('#svgHolder'). document.deleteContents();
            // document.deleteContents('.svgHolder');
        });

        $("#loadJSON_btn").click(function () {
            setting.load(true,true,true);
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
            <MenuItem Id="openLog" Label="Show log file" Enabled="true" Checked="false"/> \
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
            } else if (menuId == "openLog") {
                csInterface.evalScript(`openLog()`, function (run) {
                    if (run == "true") {
                        throwMessage(run, "Opened log file");
                    } else {
                        throwMessage(false, "No logfile found");
                    }
                });
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
