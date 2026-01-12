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
    function loadJSX(pPath, callBack) {
        var scriptPath = csInterface.getSystemPath(SystemPath.EXTENSION) + pPath;
        // console.log("Run script "+scriptPath)
        csInterface.evalScript('$.evalFile("' + scriptPath + '")');
        // csInterface.evalScript('$.evalFile("' + scriptPath + '" , "' + callBack + '")');

        // var exportJSX = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/export.jsx";
        // var script = '$.evalFile("' + exportJSX + '");';
        // csInterface.evalScript(script);
    }
    window.clientName = $("#clientName").val();
    window.logoType = $("#logotype").val();
    window.colors = [];
    window.inverted = [];
    window.mediaType = "";
    window.forMats = [];
    window.sepaRator = "";
    window.marginVal = $("#margins").val().replace(/[^0-9\s]/ig,'').trim().replace(/\s+/g, '');
    window.marginType = $("#margintype").val();
    window.allArtboards = $("input[name='allartboards']:checked").val();
    window.baseDocType = $("#baseDocType").val();
    window.autoResize = "";
    window.subFolders = "";
    window.checkABhasArt = "";
    window.inverted = [];
    window.exportsettingsJSON = [];
    window.colorsettingsJSON = [];
    // window.exportInfo = [];
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
        console.log("throwMessage "+run)
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
        } else if (run == "colors") {
            throwMessage(false, "No color outputs set");
        } else if (run == "inverted") {
            throwMessage(false, "No inverted color set");
        } else if (run == "invertedColor") {
            throwMessage(false, "No inverted color set");
        } else if (run == "logotype") {
            throwMessage(false, "No logo type set");
        } else if (run == "mediatype") {
            throwMessage(false, "No media type set");
        } else if (run == "separator") {
            throwMessage(false, "No separator type set");
        } else if (run == "canceled") {
            throwMessage(false, "Canceled Generation");
        } else if (run == "true") {
            throwMessage(run, "Generation done");
        } else if (run == "false") {
            throwMessage(run, "Generation cancelled");
        }
    };
    function init() {

        window.getValues = function () {
            console.log("Getting values");
            clientName = $("#clientName").val();
            logoType = $("#logotype").val();
            colors = [];
            $("input:checkbox[name=colors]:checked").each(function () {
                colors.push($(this).val());
            });
            inverted = [];
            // inverted.push($("input:checkbox[name='inverted']:checked").val());
            // inverted.push($("input[name='inverted']").is(':checked'));
            inverted.push($("input[name='invertedName']").val());
            inverted.push($("input[name='invertedType']").val());
            inverted.push($("#invertedColor").val());
            mediaType = $("input[name='media']:checked").val();
            sepaRator = $("input[name='separator']:checked").val();
            forMats = [];
            $("input:checkbox[name=formats]:checked").each(function () {
                forMats.push($(this).val());
            });
            autoResize = $("input:checkbox[name='autoresize']:checked").val();
            subFolders = $("input:checkbox[name='subfolders']:checked").val();
            checkABhasArt = $("input:checkbox[name='checkABhasArt']:checked").val();
            
            // Turn generate button blue
            var genPass = true;
            var genValues = [clientName,logoType,colors,mediaType,sepaRator];
            for (var val=0; val < genValues.length; val++){
                // console.log(genValues[val])
                if(genValues[val]== "" || genValues[val]== "select" || genValues[val]== undefined){
                    genPass = false;
                }
            }
            if(genPass){
                $("#generate_btn").addClass("active");
            } else {
                $("#generate_btn").removeClass("active");
            }
            // Turn generate button blue
            var exportPass = true;
            var exportValues = [expPath,forMats];
            for (var val=0; val < exportValues.length; val++){
                // console.log(exportValues[val])
                if(exportValues[val]== "" || exportValues[val]== "select" || exportValues[val]== undefined){
                    exportPass = false;
                }
            }
            if(exportPass){
                $("#export_btn").addClass("active");
            } else {
                $("#export_btn").removeClass("active");
            }
        };
        
        ///////////////////////////////////////////////////////////////////////////////
        // Function: ExportSettingsJSON
        // Usage: return settings read from settings.json
        // Input: filepath
        // Return: list of parsed json settings
        ///////////////////////////////////////////////////////////////////////////////
        window.ExportSettingsJSON = function() {
            // var settingsFilePath = extensionRoot + settingsFile;
            
            var scriptFile = csInterface.getSystemPath(SystemPath.EXTENSION) + "/settings/settings.json";
            console.log("Read Settings file: "+scriptFile)
            $.getJSON(scriptFile, function(exportInfo) {
                console.log("Reading settings.json" + exportInfo)
                // var exportsettingsJSON = {
                //     // ai: {
                //     //     VersionAI: VersionAIDropdown.selection.index,
                //     //     compatiblepdfAI: compatibelPDFAICheckbox.value,
                //     //     includeLinkedAI: includeLinkedAICheckbox.value,
                //     //     embedICCAI: embedICCProfilesAICheckbox.value,
                //     //     includeCmykinRGBEPS: includeCmykinRGBEPSCheckbox.value,
                //     //     usecompressionAI: useCompressionAICheckbox.value,
                //     // },
                //     // pdf: {
                //     //     adobepresetPDF: pdfPresetsPDFDropdown.selection.index,
                //     //     preserveEditabilityPDF: preserveEditingPDFCheckbox.value,
                //     //     embedPageThumbnailsPDF: embedPageThumbnailsPDFCheckbox.value,
                //     //     optimizeviewPDF: optimizeFastWebPDFCheckbox.value,
                //     //     createlayersPDF: createAcrobatLayerPDFCheckbox.value,
                //     // },
                //     // eps: {
                //     //     VersionEPS: VersionEPSDropdown.selection.index,
                //     //     embedFontsEPS: embedFontsEPSCheckbox.value,
                //     //     includeLinkedEPS: includeLinkedEPSCheckbox.value,
                //     //     includeThumbsEPS: includeThumbsEPSCheckbox.value,
                //     //     includeCmykinRGBEPS: includeCmykinRGBEPSCheckbox.value,
                //     //     compatiblePrintingEPS: compatiblePrintingEPSCHeckbox.value,
                //     //     adobeposttscriptEPS: adobePostscriptEPSDropdown.selection.index,
                //     // },
                //     svg: {
                //         StylingSVG: exportInfo.svg.StylingSVG,
                //         FontSVG: exportInfo.svg.FontSVG,
                //         imagesSVG: exportInfo.svg.imagesSVG,
                //         decimalSVG: exportInfo.svg.decimalSVG,
                //         minimizeSVG: exportInfo.svg.minimizeSVG,
                //         responsiveSVG: exportInfo.svg.responsiveSVG,
                //     },
                //     // jpg: {
                //     //     compressionmethodJPG: compressionPresetsJPGDropdown.selection.index,
                //     //     antialiasingJPG: antialiasingJPGDropdown.selection.index,
                //     //     embedICCJPG: embedICCProfilesJPGCheckbox.value,
                //     // },
                //     // png: {
                //     //     antialiasingPNG: antialiasingPNGDropdown.selection.index,
                //     //     interlacedPNG: interlacedPNGCheckbox.value,
                //     //     backgroundColorPNG: backgroundcolorPNGDropdown.selection.index,
                //     // },
                //     // activeTab: fileFormatsPanel_nav.selection.index,
                // }

                

                // }
                exportsettingsJSON = [
                    exportInfo.ai.VersionAI,
                    exportInfo.ai.compatiblepdfAI,
                    exportInfo.ai.includeLinkedAI,
                    exportInfo.ai.embedICCAI,
                    exportInfo.ai.usecompressionAI,
                    exportInfo.pdf.adobepresetPDF,
                    exportInfo.pdf.preserveEditabilityPDF,
                    exportInfo.pdf.embedPageThumbnailsPDF,
                    exportInfo.pdf.optimizeviewPDF,
                    exportInfo.pdf.createlayersPDF,
                    exportInfo.eps.VersionEPS,
                    exportInfo.eps.embedFontsEPS,
                    exportInfo.eps.includeLinkedEPS,
                    exportInfo.eps.includeThumbsEPS,
                    exportInfo.eps.includeCmykinRGBEPS,
                    exportInfo.eps.compatiblePrintingEPS,
                    exportInfo.eps.adobeposttscriptEPS,
                    exportInfo.svg.StylingSVG,
                    exportInfo.svg.FontSVG,
                    exportInfo.svg.imagesSVG,
                    exportInfo.svg.objectidSVG,
                    exportInfo.svg.decimalSVG,
                    exportInfo.svg.minimizeSVG,
                    exportInfo.svg.responsiveSVG,
                    exportInfo.jpg.compressionmethodJPG,
                    exportInfo.jpg.progressivescansJPG,
                    exportInfo.jpg.antialiasingJPG,
                    exportInfo.jpg.embedICCJPG,
                    exportInfo.png.antialiasingPNG,
                    exportInfo.png.interlacedPNG,
                    exportInfo.png.backgroundColorPNG,
                    exportInfo.scale.customScale,
                    exportInfo.scale.scaleSizes,
                    exportInfo.scale.scaleType,
                    exportInfo.scale.suffix,
                    // exportInfo.options.customGray,
                    // exportInfo.options.cmykBlack,
                    // exportInfo.options.rgbBlack,
                ]
                // console.log(exportInfo)
                // console.log(exportsettingsJSON)
            });
            return exportsettingsJSON
            // console.log(exportInfo.svg)
            // return exportInfo
            // var script = '$.evalFile("' + settingsFile + '");';

            // load file with JSX
            // source: https://community.adobe.com/t5/photoshop-ecosystem-discussions/open-json-file-and-parse-it-extendscript/m-p/8599620
            // var scriptFile = File(scriptFile);
            // scriptFile.open('r');
            // var d = scriptFile.read();
            // scriptFile.close();
            // var d = JSON.parse(d);
            // alert(settingsFile)
            // return d
        };

        ///////////////////////////////////////////////////////////////////////////////
        // Function: ColorSettingsJSON
        // Usage: return settings read from colorsettings.json
        // Input: filepath
        // Return: list of parsed json settings
        ///////////////////////////////////////////////////////////////////////////////
        window.ColorSettingsJSON = function() {
            // var settingsFilePath = extensionRoot + settingsFile;
            
            var scriptFile = csInterface.getSystemPath(SystemPath.EXTENSION) + "/settings/colorsettings.json";
            console.log("Read Settings file: "+scriptFile)
            $.getJSON(scriptFile, function(exportInfo) {
                console.log("Reading colorsettings.json" + exportInfo)
                
                colorsettingsJSON = [
                    exportInfo.options.customGray,
                    exportInfo.options.customBlackPrint,
                    exportInfo.options.customPrintColor,
                    exportInfo.options.customBlackDigital,
                    exportInfo.options.customDigitalColor,
                    // exportInfo.options.cmykBlack,
                    // exportInfo.options.rgbBlack,
                ]
            });
            return colorsettingsJSON
            // console.log(exportInfo.svg)
            // return exportInfo
            // var script = '$.evalFile("' + settingsFile + '");';

            // load file with JSX
            // source: https://community.adobe.com/t5/photoshop-ecosystem-discussions/open-json-file-and-parse-it-extendscript/m-p/8599620
            // var scriptFile = File(scriptFile);
            // scriptFile.open('r');
            // var d = scriptFile.read();
            // scriptFile.close();
            // var d = JSON.parse(d);
            // alert(settingsFile)
            // return d
        };
        themeManager.init();
        monitorCheck(); // check monitor resolution add extra CSS accordingly
        // loadJSX('/jsx/main.jsx');
        // var exportJSX = csInterface.getSystemPath(SystemPath.EXTENSION) + "/jsx/export.jsx";
        // var script = '$.evalFile("' + exportJSX + '");';
        // csInterface.evalScript(script);

        $("#generate_btn").click(function () {
            // mediaType=''; // reset so we dont get double folders
            ExportSettingsJSON();
            ColorSettingsJSON();
            getValues();
            console.log(inverted)
            console.log("$path.extension "+$path.extension)
            setTimeout(function () {
                csInterface.evalScript(`generateLogoVariation('${clientName}','${logoType}','${colors}','${inverted}','${mediaType}','${sepaRator}','${forMats}','${autoResize}', '${$path.extension}', '${exportsettingsJSON}', '${colorsettingsJSON}')`, function (run) {
                    outputRun(run);
                });
            },150);
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
        $("#clientName").on("change", function () {
            var clientName = $("#clientName").val().replace(/[^a-zA-Z0-9-_]/g, '').trim().replace(/\s+/g, '');
            $("#clientName").val(clientName);
        });
        $("#logotype").on("change", function () {
            checkDropzone();
        });
        window.checkDropzone = function (){
            getValues();
            if (logoType=="alltypes") {
                $("#dropzone").addClass("hidden");
            } else {
                $("#dropzone").removeClass("hidden");
            }
        }
        $("#export_btn").click(function () {
            // console.log("load JSON from json.js" + setting.loadExportSettings());
            // var exportInfo = setting.loadExportSettings();
            // console.log(exportInfo)
            // console.log(exportInfo.svg.minimizeSVG)
            
            // does not work :)
            // var exportInfo = setting.loadExportSettings(); 
            // var exportInfo = JSON.stringify(setting.loadExportSettings()); 
            // var exportInfo = ExportSettingsJSON();
            // console.log("exportInfo "+ExportSettingsJSON())
            // console.log("exportFiles call "+exportInfo)
            // console.log(exportInfo.svg.minimizeSVG)
            ExportSettingsJSON();
            exportingFiles(true);
            getValues();
            // compensate slower CS versions 
            // panel wont show export animation otherwise
            setTimeout(function () {
                csInterface.evalScript(`exportFiles('${mediaType}','${logoType}','${forMats}','${subFolders}','${checkABhasArt}', '${exportsettingsJSON}','${sepaRator}')`, function (run) {
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

        // Reset logo color info
        $("#resetlogoinfo_btn").on("click", function () {
            ColorSettingsJSON();
            getMarginValues();
            setTimeout(function () {
                csInterface.evalScript(`resetLogoInfo('${colors}','${mediaType}','${colorsettingsJSON}')`, function (run) {
                    if (run == "true") {
                        throwMessage(run, "Logo info reset");
                    } else {
                        throwMessage(run, "Failed to reset logo info");
                    }
                });
            },100);
        });
        // Clear logo color info
        $("#clearlogoinfo_btn").on("click", function () {
            setTimeout(function () {
                csInterface.evalScript(`clearLogoInfo()`, function (run) {
                    if (run == "true") {
                        throwMessage(run, "Logo info cleared");
                    } else {
                        throwMessage(run, "Failed to clear logo info");
                    }
                });
            },100);
        });

        // $("#addmargins_btn").click(function () {
        //     getMarginValues();
        //     setTimeout(function () {
        //         csInterface.evalScript(`addMarginToArtboard('${marginVal}','${marginType}','${logoType}','${colors}')`, function (run) {
        //             if (run == "true") {
        //                 throwMessage(run, "Added Margins");
        //             } else {
        //                 throwMessage(run, "Failed to add margins");
        //             }
        //         });
        //     },100);
        // });
        
        // change is not good > only changes after a real change
        // onchanging can cause issues as you type as well
        $("#margins").on("change", function () {
        // $("#margins").on("submit", function () {
            ColorSettingsJSON();
            getMarginValues();
            setTimeout(function () {
                csInterface.evalScript(`addMarginToArtboard('${marginVal}','${marginType}','${allArtboards}','${logoType}','${colors}','${mediaType}','${colorsettingsJSON}')`, function (run) {
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
                    } else if (run=="noDoc") {
                        throwMessage(false, "No document available");
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
                    } else if (run == "noDoc"){
                        throwMessage(run, "No document available");
                    } else {
                        throwMessage(run, "Already Cleared Swatches");
                    }
                });
            },100);
        });

        window.getMarginValues = function () {
            console.log("Getting Margin values");
            marginVal = Number($("#margins").val().replace(/[^0-9\s]/ig,'').trim().replace(/\s+/g, ''));
            $("#margins").val(marginVal);
            // console.log("isNaN "+isNaN(marginVal));
            // console.log("type "+typeof(marginVal));
            // console.log("margin value "+marginVal);
            marginType = $("#margintype").val();
            // console.log("marginType "+marginType);
            logoType = $("#logotype").val();
            colors = [];
            $("input:checkbox[name=colors]:checked").each(function () {
                colors.push($(this).val());
            });
            mediaType = $("input[name='media']:checked").val();
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
                    throwMessage(false, "Destination is not set or can't be found");
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
        
        $("input[type='radio']").on("change", function () {
            getValues();
            exportSettingsToNone();
        });
        $("input[type='checkbox']").on("change", function () {
            getValues();
            exportSettingsToNone();
        });
        var invertedColorType = $("input:checkbox[value=\"inverted\"]");
        var invertedType = $("input[name='invertedType']");
        var invertedColor = $("#invertedColor");
        var setInverted = $("#setInverted");
        setInverted.on('click',function () {
            // console.log("load invertlogotype jsx");
            // var settings = getSettingsFilepath();
            setTimeout(function () {
                csInterface.evalScript(`getColorNameValue()`, function (run) {
                    var result = run.split(",");
                    if (result[0]=="true"){
                        throwMessage(result[0], "Inverse Color Set");
                        $("input[name='invertedName']").val(result[1]);
                        invertedColor.attr('value',result[2]);
                        invertedType.attr('value',result[3]);
                        // setInverted.css('background', "#086223");// <- working
                        var color = '#e3e3e3';
                        color = result[4];
                        console.log(color)
                        setInverted.css('background', '#'+color);
                    } else if (run == "gradient"){
                        throwMessage(false, "Gradient not supoort yet!");
                        console.log(run);
                    } else if (run == "nocolor"){
                        throwMessage(false, "No Invert Color Set");
                        console.log(run);
                    } else {
                        throwMessage(result[0], "Could not get color");
                        console.log(run);
                    }
                });
            },100);
        });
        invertedColorType.on('click',function () {
            if(invertedColorType.prop('checked')==false){
                $("input[name='invertedName']").val("");
                invertedType.attr('value','');
                invertedColor.attr('value','');
                setInverted.css('background','none');
            }
        });
        
        window.exportSettingsToNone = function() {
            // console.log("Set export formats to none depending on print type")
            var pmsValue = $("input:checkbox[value=\"pms\"]");
            var pmsLabel = $("label[for=\"pms\"]");
            var pngValue = $("input:checkbox[value=\"png\"]");
            var pngLabel = $("label[for=\"png\"]");
            var svgValue = $("input:checkbox[value=\"svg\"]");
            var svgLabel = $("label[for=\"svg\"]");
            if (mediaType == "Print"){
                // console.log($("input:checkbox[value=\"png\"]:checked").val())
                pmsValue.prop("disabled",false);
                pmsValue.removeClass("disabled");
                pmsLabel.removeClass("disabled");
                pngValue.prop("disabled",true);
                pngValue.addClass("disabled");
                pngLabel.addClass("disabled");
                svgValue.addClass("disabled");
                svgValue.prop("disabled",true);
                svgLabel.addClass("disabled");
                if (($("input:checkbox[value=\"png\"]:checked").val() == 'png') || ($("input:checkbox[value=\"svg\"]:checked").val() == 'svg')){
                    pngValue.prop("checked", false)
                    svgValue.prop("checked", false)
                }
            } else {
                // $("input:checkbox[value=\"png\"]").prop("checked", false)
                pngValue.prop("disabled",false);
                pngValue.removeClass("disabled");
                pngLabel.removeClass("disabled");
                svgValue.prop("disabled",false);
                svgValue.removeClass("disabled");
                svgLabel.removeClass("disabled");
            }
            if (mediaType == "Digital"){
                pmsValue.prop("disabled",true);
                pmsValue.addClass("disabled");
                pmsLabel.addClass("disabled");
                if ($("input:checkbox[value=\"pms\"]:checked").val() == 'pms'){
                    pmsValue.prop("checked", false)
                }
            }
        }
        window.checkTooltips = function(){
            if (($("input:checkbox[value=\"toolTips\"]:checked").val()=='toolTips')) {
                $( document ).tooltip({shadow:true, show: {delay: 1000,duration: 0}}); //track: true
                $( document ).tooltip("enable");
                $( document ).click(function() {
                    $('.ui-tooltip').remove();
                });
            } else {
                $( document ).tooltip("disable");
            }
        }
        $("#toolTips").click(function () {
            checkTooltips();
        });
        
        
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
        $("#settingsIcon_btn").click(function () {
            console.log("Export Settings Button click");
            loadJSX('/jsx/settings-dialog.jsx');
            // var settings = getSettingsFilepath();
            // var settings = $path.extension + '/settings/settings.json';
            // console.log(readFile(settings, !0));
        });
        $("#colorSettingsIcon_btn").click(function () {
            console.log("Color Settings Button click");
            loadJSX('/jsx/colorsettings-dialog.jsx');
        });
    
    function buymeacoffee(){
        csInterface.openURLInDefaultBrowser("https://www.buymeacoffee.com/doingdesign");
    }    
    $("#donate").click(()=>{
        buymeacoffee()
    })
    
        // $("input[type='radio']").on("change", function () {
        
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
            <MenuItem Label="Logo Packer v1.4.4" Enabled="true" Checked="false"/> \
            <MenuItem Id="info" Label="Go to info web page" Enabled="true" Checked="false"/> \
            <MenuItem Id="donate" Label="Buy Me A Coffee" Enabled="true" Checked="false"/> \
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
            } else if (menuId == "donate") {
                buymeacoffee()
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
