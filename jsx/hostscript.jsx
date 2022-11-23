/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/
// #include "Logger.jsxinc";
// #includepath "/";
// #include "/resizeLogo.jsx";


///////////////////////////////////////////////////
// Logging & Timer
// var PATH = require("path"),
// CS = new CSInterface(),
// $path = {
//     host: CS.getSystemPath(SystemPath.HOST_APPLICATION),
//     myDocs: CS.getSystemPath(SystemPath.MY_DOCUMENTS),
//     userData: CS.getSystemPath(SystemPath.USER_DATA),
//     extension: CS.getSystemPath(SystemPath.EXTENSION),
//     commonFiles: CS.getSystemPath(SystemPath.COMMON_FILES),
//     application: CS.getSystemPath(SystemPath.APPLICATION),
//     project: {},
// };
// alert(userData)
var useLogging = true;
var useTimer = false;
// 
///////////////////////////////////////////////////


var LOGO_INFO = "LOGO_INFO";
var lyrLogoInfo;
var initArtboardsLength = 1;
// var logotypes = ['logo', 'logotype', 'logomark', 'payoff'];
var logotypes = new Array();
var destDir = '';
var allTypes;
var dialogFolder;
var setDest = new Folder();
var addDocName;
var logotype = "";
var checkABhasArt; // = true;
var autoResize;
var autoSubFolder;
// var forMats = [];
var run = false;
var logoCleaned = false;
var cleanedLogoItems = [''];
var swatchesCleaned = false;
var deletedPanelItems = false;
var clearedItemsDocs = [''];


// IndexOf update to use number as well
// DBLjan
// https://community.adobe.com/t5/indesign-discussions/indexof-is-not-a-function/m-p/9050751#M52595
Array.prototype.indexOf = function(item) {
    var index = 0,
        length = this.length;
    for (; index < length; index++) {
        if (this[index] === item)
            return index;
    }
    return -1;
};

// Get names according to artboards so we can have dynamic order
function getArtboardLogoTypes(docRef, strip) {
    var ab = docRef.artboards;
    abLogotypes = new Array();
    for (i = 0; i < ab.length; i++) {
        abPrefix = strip == true ? ab[i].name.split('-')[0] : ab[i].name; //.split('-')[0];
        abLogotypes.push(abPrefix)
    }
    return abLogotypes
}

function generateLogoVariation(clientName, logotype, mediaType, sepaRator, forMats, autoResize) {
    docRef = app.activeDocument;
    logotypes = getArtboardLogoTypes(docRef, false);
    clearedItemsDocs = ['']; // clear list of doc with cleared swatches
    if (logotype == "alltypes") {
        abLength = docRef.artboards.length;
        for (ab = 0; ab < abLength; ab++) {
            app.selection = null;
            docRef.artboards.setActiveArtboardIndex(ab);
            docRef.selectObjectsOnActiveArtboard();
            createLogoTypes(docRef, clientName, logotypes[ab], mediaType, sepaRator, forMats, autoResize)
            // switch to generated logo
            app.documents.getByName(docRef.name).activate();
        }
        app.documents.getByName(clientName).activate();
    } else {
        createLogoTypes(docRef, clientName, logotype, mediaType, sepaRator, forMats, autoResize);
    }
    app.executeMenuCommand('fitall')
    return run
}

function createLogoTypes(docRef, clientName, logotype, mediaType, sepaRator, forMats, autoResize) {
    logotype = logotype;
    // var run = false;
    separator = sepaRator;
    if (app.selection.length == 0) {
        run = "selection"
    } else if (clientName == "") {
        run = "clientname"
    } else if (logotype == "select" || logotype == "") {
        run = "logotype"
    } else if (mediaType == "undefined" || mediaType == "") {
        run = "mediatype"
    } else if (sepaRator == "undefined" || sepaRator == "") {
        run = "separator"
    } else {

        app.copy()
        separator = separator == 'dash' ? '-' : '_';
        // var addDocName = 'logo_var.ai';
        addDocName = clientName;
        var selDoc; /* use Dropzone or selection */
        var hasDoc = false;
        initArtboardsLength = 1; // Reset always to 1 other we have generation error
        // colors variation
        // Set black and white print colors
        var black = mediaType == 'Print' ? new CMYKColor() : new RGBColor();
        var white = mediaType == 'Print' ? new CMYKColor() : new RGBColor();
        if (mediaType == 'Print'){
            black.cyan = 0;
            black.magenta = 0;
            black.yellow = 0;
            black.black = 100;
            white.cyan = 0;
            white.magenta = 0;
            white.yellow = 0;
            white.black = 0;
        } else {
            black.red = 0;
            black.green = 0;
            black.blue = 0;
            white.blue = 255;
            white.red = 255;
            white.green = 255;
        }
        
        var colors = ['grayscale', black, white];
        var artboardsName = ['grayscale', 'black', 'white'];
        var mediatype = mediaType == 'Print' ? 'cmyk' : 'rgb';
        var rasterEffectSettings = mediaType == 'Print' ? '300' : '72'
        // var mediaTypeFolder = mediaType;

        // if (!selDoc) app.copy();
        // if (selDoc) app.paste();

        //using for because null in getByName return error
        for (var i = 0; i < app.documents.length; i++) {
            if (app.documents[i].name == addDocName)
                hasDoc = true;
        }

        //create if doesn't exist
        if (!hasDoc) {
            var docPreset = new DocumentPreset();
            docPreset.title = addDocName;
            // docPreset.units = RulerUnits.Pixels;
            // docPreset.units = RulerUnits.Millimeters;
            // docPreset.units = RulerUnits.Points;
            docPreset.colorMode = mediaType == 'Print' ? DocumentColorSpace.CMYK : DocumentColorSpace.RGB;
            app.documents.addDocument("", docPreset);
            // false so we clean new doc of all colors
            swatchesCleaned = false;
        } else {
            app.documents.getByName(addDocName).activate();
            app.activeDocument.artboards.add([0, 0, 288, -480.503974801259]);
            initArtboardsLength = app.activeDocument.artboards.length;
        }

        // // Set new doc as Active working
        var docRef = app.activeDocument;

        // Set to artboard ruler
        // https://ai-scripting.docsforadobe.dev/jsobjref/scripting-constants/?highlight=CoordinateSystem
        // docRef.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
        docRef.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
        docRef.rulerOrigin = [0, 0];
        docRef.pageOrigin = [0, 0];
        docRef.rasterEffectSettings.resolution = rasterEffectSettings;

        docRef.artboards[initArtboardsLength - 1].name = logotype + separator + 'fullcolor' + separator + mediatype

        // Delete all unused color swatches, only first gen logos
        if (swatchesCleaned == false) {
            // Cleans doc of all items; swatches, brushes, styles etc etc
            deleteUnusedPanelItems();
        }

        //paste and group
        app.paste();
        app.executeMenuCommand('group');

        item = docRef.selection[0];
        // alert(item.width)
        // check logo size
        if (item.width <= 70 || item.height <= 70) {
            resizeLogo(item, autoResize)
        }

        if (hasDoc) {
            var prevArtboard = docRef.artboards[initArtboardsLength - 5]
            var initialObjHeight = Math.abs(prevArtboard.artboardRect[1] - prevArtboard.artboardRect[3]);

            //move copied items to previouse item's position
            app.executeMenuCommand('selectall')

            var xDif = app.selection[0].position[0] - app.selection[1].position[0]
            var yDif = app.selection[0].position[1] - app.selection[1].position[1]

            app.selection[0].translate(-xDif, -yDif - initialObjHeight - 100)

            //select the copied items
            docRef.artboards.setActiveArtboardIndex(initArtboardsLength - 1);
            for (var j = 0; j < docRef.artboards.length; j++) {
                for (var i = 0; i < app.selection.length; i++) {
                    if (i > 0) {
                        app.selection[i].selected = false;
                    }
                }
            }

        }

        // Add grayscale, black & white version
        for (var i = 0; i < colors.length; i++) {
            var firstObj = app.selection[0];

            var curFirstBoard = hasDoc ? (initArtboardsLength - 1 + i) : i;
            var mainArtboard;

            if (i == 0)
                docRef.fitArtboardToSelectedArt(curFirstBoard);

            //duplicate artboard
            mainArtboard = docRef.artboards[curFirstBoard];

            // Artboard L T R B = 0 1 2 3
            var abL = mainArtboard.artboardRect[0];
            var abT = mainArtboard.artboardRect[1];
            var abR = mainArtboard.artboardRect[2];
            var abB = mainArtboard.artboardRect[3];
            // alert(abT+" "+abL+' '+abR+' '+abB)

            docRef.artboards.add([abR + 100, abT, abR + 100 + (abR - abL), abB]);
            docRef.artboards[initArtboardsLength + i].name = logotype + separator + artboardsName[i] + separator + mediatype

            firstObj.duplicate();
            firstObj.translate(firstObj.width + 100, 0);

            // Add logo info
            // addLogoInfo(docRef, artboardsName[i], posX);
            fillColor(firstObj, colors[i]);

            //select the latest object
            docRef.artboards.setActiveArtboardIndex(docRef.artboards.length - 1);
            docRef.selectObjectsOnActiveArtboard();
        }
        logotype = logotype;
        run = setLogoInfo(docRef, logotype, initArtboardsLength, false);
        // docRef.artboards.setActiveArtboardIndex(0);
        // docRef.selectObjectsOnActiveArtboard();

        // // alert(logotype)
        // // Add logo info: Logo type & Media type
        // var ab = docRef.artboards[docRef.artboards.length - 4];
        // posX = ab.artboardRect[0]; // Left
        // posY = ab.artboardRect[1]; // Top
        // addLogoInfo(docRef, logotype, posX - 15, posY - 8, 'right');
        // addLogoInfo(docRef, "fullcolor", posX, posY + 20, 'left');
        // // Loop of 3 needs work if users adds custom variations like single color or different colored versions
        // // Variations like full-color + white text and full-color with black text are very common
        // for (var i = 0; i < 3; i++) {
        //     var ab = docRef.artboards[(initArtboardsLength + i)];
        //     posX = ab.artboardRect[0]; // Left
        //     posY = ab.artboardRect[1]; // Top
        //     addLogoInfo(docRef, artboardsName[i], posX, posY + 20, 'left');
        // }
        // // Deselect all
        // app.selection = null;
        // run = true;
    }
    // alert(run)
    return run
}

//change object colors
function fillColor(obj, color) {
    var docRef = app.activeDocument;
    docRef.layers[0].hasSelectedArtwork = false;
    docRef.artboards.setActiveArtboardIndex(docRef.artboards.length - 1);
    app.executeMenuCommand('selectallinartboard');

    if (color == 'grayscale') {
        app.executeMenuCommand('Colors7');
        return;
    }
    var aDoc = docRef;
    aDoc.defaultFillColor = color;
    app.executeMenuCommand("Find Fill Color menu item");
}


function exportFiles(mediaType, logotype, forMats, subFolders, checkABhasArt) {

    // Timer Tom Ruark 
    // Source: Getter.jsx
    if (useTimer){
        var totalTime = new Timer();
    }

    appendLog('Starting Export ', logFile);
    // alert(subFolders)
    var run = false;
    var cancel = false;

    if (forMats == '') {
        return run = "formats"
    } else {
        var dlg = new Window('dialog', 'Choose destion folder', undefined, {
            independent: true
        });
        dlg.preferredSize.width = 250;
        dlg.orientation = "column";
        dlg.alignChildren = ["fill", "top"];
        dlg.spacing = 10;
        dlg.margins = 10;

        destDir = '';
        // PANEL to hold options
        var msgPnl = dlg.add('panel', undefined, 'Select your folder');
        var btnPnl = dlg.add('group', undefined, '');
        btnPnl.orientation = "row";
        btnPnl.alignChildren = ["right", "top"];
        btnPnl.spacing = 10;
        btnPnl.margins = 10;

        var destDirGrp = msgPnl.add('group', undefined, '');
        var destDirEt = destDirGrp.add('edittext', undefined, destDir);
        destDirEt.size = [200, 20];

        var chooseBtn = destDirGrp.add('button', undefined, 'Choose...');
        chooseBtn.onClick = function() {
            dialogFolder = Folder.selectDialog();
            destDirEt.text = dialogFolder;
        }

        btnPnl.cancelBtn = btnPnl.add('button', undefined, 'Cancel', {
            name: 'cancel'
        });
        btnPnl.cancelBtn.onClick = function() {
            cancel = true;
            dlg.close();
        };
        btnPnl.okBtn = btnPnl.add('button', undefined, 'Ok', {
            name: 'ok'
        });
        btnPnl.okBtn.onClick = function() {
            destDir = destDirEt.text;
            dlg.close();
        };

        // dlg.show();

        if (app.documents.length > 0 && !cancel) {
            var docRef = app.activeDocument;
            var artboardsNum = docRef.artboards.length;
            var artboardName = '';
            var afile = docRef.fullName;
            var options = {};
            var destFile = '';

            var mediaType = mediaType;
            var mediatype = mediaType == 'Print' ? 'cmyk' : 'rgb';

            // check logotype all or single
            if (logotype == 'alltypes') {
                logoType = ['01 Logo', '02 Logotype', '03 Logomark', '04 Payoff'];
            } else if (logotype == 'logo') {
                logoType = '01 Logo';
            } else if (logotype == 'logotype') {
                logoType = '02 Logotype';
            } else if (logotype == 'logomark') {
                logoType = '03 Logomark';
            } else if (logotype == 'payoff') {
                logoType = '04 Payoff';
            }

            // No subfolders by logotype
            if (subFolders != "subfolders") {
                destPath = new Folder(setDest + '/' + mediaType);
                if (!destPath.exists) {
                    destPath.create();
                }
                // if (logotype == 'alltypes') {
                //     logoType = ['01 Logo', '02 Logotype', '03 Logomark', '04 Payoff'];
                // } else if (logotype == 'logo') {
                //     logoType = '01 Logo';
                // } else if (logotype == 'logotype') {
                //     logoType = '02 Logotype';
                // } else if (logotype == 'logomark') {
                //     logoType = '03 Logomark';
                // } else if (logotype == 'payoff') {
                //     logoType = '04 Logo-payoff';
                // }
                if (logotype == 'alltypes') {
                    for (i = 0; i < logoType.length; i++) {
                        destPath = new Folder(setDest + '/' + mediaType);
                        if (!destPath.exists) {
                            destPath.create();
                        }
                        logoTypeExp = logoType[i].substr(3, logoType[i].length).toLowerCase().split('-').pop(); //[0];
                        expArtboards = getExpArtboards(logoTypeExp, true, checkABhasArt);
                        if (expArtboards != '') {
                            exportFormats(destPath, mediatype, logoTypeExp, expArtboards);
                        }
                    }
                } else {
                    logoTypeExp = logoType.substr(3, logoType.length).toLowerCase().split('-').pop(); //[0];
                    expArtboards = getExpArtboards(logoTypeExp, true, checkABhasArt);
                    exportFormats(destPath, mediatype, logoTypeExp, expArtboards);
                }

                // Use subfolders by logotype    
            } else {
                // if (logotype == 'alltypes') {
                //     logoType = ['01 Logo', '02 Logotype', '03 Logomark', '04 Payoff'];
                // } else if (logotype == 'logo') {
                //     logoType = '01 Logo';
                // } else if (logotype == 'logotype') {
                //     logoType = '02 Logotype';
                // } else if (logotype == 'logomark') {
                //     logoType = '03 Logomark';
                // } else if (logotype == 'payoff') {
                //     logoType = '04 Payoff';
                // }
                if (logotype == 'alltypes') {
                    for (i = 0; i < logoType.length; i++) {
                        logoTypeExp = logoType[i].substr(3, logoType[i].length).toLowerCase().split('-').pop(); //[0];
                        expArtboards = getExpArtboards(logoTypeExp, false, checkABhasArt);
                        if (expArtboards != '') {
                            if (logoTypeExp == docRef.artboards[expArtboards[0]].name.split('-')[0]) {
                                destPath = new Folder(setDest + '/' + logoType[i] + '/' + mediaType);
                                if (!destPath.exists) {
                                    destPath.create();
                                }
                                expArtboards = getExpArtboards(logoTypeExp, true, checkABhasArt);
                                exportFormats(destPath, mediatype, logoTypeExp, expArtboards);
                            }
                        }
                    }
                } else {
                    destPath = new Folder(setDest + '/' + logoType + '/' + mediaType);
                    if (!destPath.exists) {
                        destPath.create();
                    }

                    logoTypeExp = logoType.substr(3, logoType.length).toLowerCase().split('-').pop(); //[0];
                    expArtboards = getExpArtboards(logoTypeExp, true, checkABhasArt);
                    exportFormats(destPath, mediatype, logoTypeExp, expArtboards);
                }
            }


            // var filename = new File(destPath + '/' + docRef.name);
            // docRef.saveAs(filename);

            // // Export file formats
            // exportFormats(destPath, mediatype);

            // return timeElapsed
            appendLog('Export Done', logFile);
            // logFile.close()
            if (useTimer){
                alert("Script Time: " + totalTime.getElapsed())
            }

            run = true
            return run
        }
    }
    if (cancel) {
        return run
    }

    function setResolution(targetResolutions, baseFileSize) {
        for (x = 0; x < targetResolutions.length; x++) {
            var targetResolution = targetResolutions[x];
            // var expResolution = targetResolution;
            // var expResolution = 100 * (targetResolution / baseFileSize);
            // var expResolution = targetResolution * 100 / 72;
            // 100 * (targetResolution / baseFileSize)
            // alert(expResolution)
            // return Math.round(expResolution - baseFileSize)
            return targetResolution * 100 / 72;
        }
    }

    function setResolutionScale(targetResolutions, baseFileSize) {
        for (x = 0; x < targetResolutions.length; x++) {
            var targetResolution = targetResolutions[x];
            return targetResolution * 100 / 72;
        }
    }

    // Should we make artboard actually active > slows down application
    // function getExpArtboards(logotypePrefix, string) {
    //     // Only export if we have art on artboard
    //     var expArtboards = new Array();
    //     for (var i = 0; i < docRef.artboards.length; i++) {
    //         docRef.selection = null;
    //         // Makes script slower, but prevents empty artboards being saved out
    //         // docRef.artboards.setActiveArtboardIndex(i);
    //         // docRef.selectObjectsOnActiveArtboard();

    //         // if (docRef.selection.length === 0) {
    //         //     // alert('AB '+i+' empty')
    //         // } // alert('AB '+i+' has art')
    //         abName = docRef.artboards[i].name.split('-')[0];
    //         if ((abName == logotypePrefix) || (logotype != "alltypes")) {
    //             // scriptAlert(docRef.name,i+" "+abName, logotypePrefix)
    //             if(string==true){
    //                 expArtboards = expArtboards + (i + 1).toString();
    //                 if (i !== docRef.artboards.length - 1)
    //                     expArtboards += ',';
    //             } else {
    //                 expArtboards.push(i+1);
    //             }
    //         }
    //     }
    //     return expArtboards
    // }

    function getExpArtboards(logotypePrefix, string, checkABhasArt) {
        var expArtboards = new Array();
        for (var i = 0; i < docRef.artboards.length; i++) {
            docRef.selection = null;
            // Only export if we have art on artboard
            // Makes script slower, but prevents empty artboards being saved out
            if (checkABhasArt == "checkABhasArt") {
                docRef.artboards.setActiveArtboardIndex(i);
                docRef.selectObjectsOnActiveArtboard();

                if (docRef.selection.length === 0) {
                    // alert('AB '+i+' empty')
                } else {
                    expArtboards = getABlist(i, logotypePrefix, string, expArtboards);
                }
            } else {
                expArtboards = getABlist(i, logotypePrefix, string, expArtboards);
            }
        }
        return expArtboards
    }

    function getABlist(i, logotypePrefix, string, expArtboards) {
        // alert('AB '+i+' has art')
        abName = docRef.artboards[i].name.split('-')[0];
        if ((abName == logotypePrefix) || (logotype != "alltypes")) {
            // scriptAlert(docRef.name,i+" "+abName, logotypePrefix)
            if (string == true) {
                expArtboards = expArtboards + (i + 1).toString();
                if (i !== docRef.artboards.length - 1)
                    expArtboards += ','
            } else {
                expArtboards.push(i + 1);
            }
        }
        return expArtboards
    }


    function exportFormats(destPath, mediatype, logotypePrefix, expArtboards) {
        lyrLogoInfo = app.activeDocument.layers.getByName(LOGO_INFO);
        lyrLogoInfo.visible = false;

        var ai = forMats.indexOf("ai")
        var pdf = forMats.indexOf("pdf");
        var svg = forMats.indexOf("svg");
        var eps = forMats.indexOf("eps");
        var jpg = forMats.indexOf("jpg");
        var png = forMats.indexOf("png");
        var scaleArtwork = null;

        var docRef = app.activeDocument;
        var afile = docRef.fullName;
        var fileNamePrefix = docRef.name.split('.')[0] + "_";
        // alert(fileNamePrefix)
        var whatToExport = new ExportForScreensItemToExport();
        whatToExport.assets = [];

        // Fix if not last artboard string traling comma
        whatToExport.artboards = expArtboards.toString();

        // whatToExport.artboards = '1,2,4';

        // Sizes
        // var sizes = [1024, 512, 300, 256, 150, 100, 64, 50, 32, 16];
        var sizes = [1024, 256, 64, 32, 16];
        var targetResolutions = [1000]; /* [1000, 500]; */
        var baseFileSize = docRef.width;
        // var expResolution = setResolution(targetResolutions, baseFileSize);
        var expResolution = setResolutionScale(targetResolutions, baseFileSize);
        // alert(expResolution)

        if (ai !== -1) {
            var aiFolder = new Folder(destPath + "/AI");
            if (!aiFolder.exists) {
                aiFolder.create();
            }
        }

        if (pdf !== -1) {
            var pdfFolder = new Folder(destPath + "/PDF");
            if (!pdfFolder.exists) {
                pdfFolder.create();
            }
        }

        if (svg !== -1) {
            var svgFolder = new Folder(destPath + "/SVG");
            if (!svgFolder.exists) {
                svgFolder.create();
            }
        }
        
        if (eps !== -1) {
            var epsFolder = new Folder(destPath + "/EPS");
            if (!epsFolder.exists) {
                epsFolder.create();
            }
        }

        if (png !== -1) {
            var pngFolder = new Folder(destPath + "/PNG");
            if (!pngFolder.exists) {
                pngFolder.create();
            }
        }
        if (jpg !== -1) {
            var jpgFolder = new Folder(destPath + "/JPG");
            if (!jpgFolder.exists) {
                jpgFolder.create();
            }
        }

        var size, file;

        if (ai !== -1) {
            if (aiFolder != null) {
                var options = new IllustratorSaveOptions();
                options.compatibility = Compatibility.ILLUSTRATOR17;
                options.flattenOutput = OutputFlattening.PRESERVEAPPEARANCE;
                options.compressed = true;
                options.PDFCompatibility = true;
                options.embedICCProfile = true;
                options.saveMultipleArtboards = true;
                // options.artboardRange = 1+','+2+','+4; // Works
                options.artboardRange = expArtboards.toString();
                // options.artboards = whatToExport;
                // options.artboards = '1-2,4';
                // whatToExport.artboards = '1-2,4';
                // whatToExport.artboardRange = 1+','+2+','+4; // doesnt work?

                // var newArtboards = ''
                // whatToExport.artboards = getArtboards(document,newArtboards);

                ///////////////////////////////
                // FIND METHOD SAVING AB ai format
                docRef.saveAs(aiFolder, options);
                // docRef.saveAs(aiFolder, options, whatToExport);
                // var saveFile = File(aiFolder + "/" + docRef.name + ".ai");
                // Remove multiartboard ai file
                // https://stackoverflow.com/questions/44625594/remove-is-not-a-function-error-in-photoshop-cc-2017-extendscript-tool-kit
                var docPath = new Folder(docRef.path);
                var saveFile = new File(docPath + "/" + docRef.name);

                if (afile.exists) {
                    saveFile.remove();
                }
            }
        }

        if (pdf !== -1) {
            if (pdfFolder != null) {
                // var options = new ExportForScreensPDFOptions();
                /*
                [Smallest File Size]
                [Smallest File Size (PDF 1.6)]
                [Press Quality]
                [PDF/X-4:2008]
                [PDF/X-3:2002]
                [PDF/X-1a:2001]
                [High Quality Print]
                [Illustrator Default]
                */

                if (mediaType == 'Print') {
                    var options = new PDFSaveOptions();
                    var pdfProfileAI = "[PDF/X-4:2008]";
                    options.pDFPreset = pdfProfileAI ? checkPresets(true, pdfProfileAI) : "[High Quality Print]";
                    options.preserveEditability = false; //false
                    options.saveMultipleArtboards = false; //false
                    // if(expArtboards.length)
                    // alert(expArtboards.substring(expArtboards.length-1))
                    // alert(expArtboards.slice(-1))
                    // alert(expArtboards.slice(-1)==',')
                    if (expArtboards.slice(-1) == ',') {
                        expArtboards = expArtboards.substr(0, expArtboards.length - 1);
                    }
                    // alert(expArtboards)
                    ABs = expArtboards.split(','); //replace(/^\s+|\s+$/gm,'')
                    // alert(ABs)
                    // alert(ABs.length)
                    for (var i = 0; i < ABs.length; i++) {
                        options.artboardRange = ABs[i];
                        // alert(ABs[i])
                        ABnr = ABs[i];
                        abName = docRef.artboards[ABnr - 1].name;
                        // alert(abName)
                        // alert(docRef.artboards[i])
                        // alert(docRef.artboards[ABs[i]].name;)
                        // alert(pdfFolder+'/'+addDocName+'_'+abName)
                        fileName = File(pdfFolder + '/' + addDocName + '_' + abName)
                        docRef.saveAs(fileName, options);
                        // docRef.saveAs(fileName, options, fileNamePrefix);
                    }
                } else if (mediaType == 'Digital') {
                    var options = new ExportForScreensPDFOptions();
                    // var options = new PDFSaveOptions();
                    // options.compatibility = PDFCompatibility.ACROBAT5;
                    options.compatibility = PDFCompatibility.ACROBAT8;
                    options.generateThumbnails = true;
                    options.preserveEditability = false;
                    options.layers = false;
                    options.spotColors = false;
                    options.embedColorProfile = true;
                    // options.colorProfileID = ColorProfi.IleNCLUDEDESTPROFILE;
                    // options.colorConversionID = ColorConversion.COLORCONVERSIONTODEST; 
                    // options.colorDestinationID = ColorDestination.COLORDESTINATIONWORKINGCMYK;
                    // options.pDFPreset = "[High Quality Print]";
                    options.saveMultipleArtboards = false; //false

                    // options.acrobatLayers = true;
                    // options.colorBars = true;
                    options.colorCompression = CompressionQuality.AUTOMATICJPEGHIGH;
                    options.compressArt = true; //default
                    options.embedICCProfile = true;
                    // options.enablePlainText = true;
                    options.optimization = true;
                    options.pageInformation = false;
                    // whatToExport.artboards = getArtboards(document,newArtboards);
                    docRef.exportForScreens(pdfFolder, ExportForScreensType.SE_PDF, options, whatToExport, fileNamePrefix);
                }

                // var options = new PDFSaveOptions();
                // var pdfProfileAI = "[PDF/X-4:2008]";
                // // alert(checkPresets( true, pdfProfileAI ));

                // // options.pDFPreset = pdfProfileAI ? checkPresets( true, pdfPresetAI ) : "[High Quality Print]";
                // options.pDFPreset = pdfProfileAI ? checkPresets( true, pdfProfileAI ) : "[High Quality Print]";
                // // options.artboardRange = expArtboards;
                // // var options = new PDFSaveOptions();
                // // var options = new ExportForScreensOptionsPDF();
                // // Setting PDFSaveOptions properties. Please see the JavaScript Reference
                // // for a description of these properties.
                // // Add more properties here if you like
                // // options.compatibility = PDFCompatibility.ACROBAT5;
                // // options.generateThumbnails = true;
                // // options.preserveEditability = false;
                // // options.compatibility = PDFCompatibility.ACROBAT8;
                // // options.layers = false;
                // // options.spotColors = true;
                // // options.embedColorProfile = true;
                // // options.colorProfileID = ColorProfi.IleNCLUDEDESTPROFILE;
                // // options.colorConversionID = ColorConversion.COLORCONVERSIONTODEST; 
                // // options.colorDestinationID = ColorDestination.COLORDESTINATIONWORKINGCMYK;
                // // options.pDFPreset = "[High Quality Print]";
                // options.preserveEditability = false; //false
                // options.saveMultipleArtboards = false; //false

                // // options.acrobatLayers = true;
                // // options.colorBars = true;
                // // options.colorCompression = CompressionQuality.AUTOMATICJPEGHIGH;
                // // options.compressArt = true; //default
                // // options.embedICCProfile = true;
                // // options.enablePlainText = true;
                // // options.generateThumbnails = true; // default
                // // options.optimization = true;
                // // options.pageInformation = true;
                // ABs = expArtboards.split(',');
                // // alert(expArtboards.length)
                // // alert(ABs)
                // for (var i = 0; i < ABs.length; i++) {
                //     // alert(ABs[i+1])
                //     // alert(pdfFolder)
                //     // alert(docRef.artboards[i].name)
                //     options.artboardRange = ABs[i];
                //     abName = docRef.artboards[i].name;
                //     // alert(pdfFolder+'/'+addDocName+'_'+abName)
                //     fileName = File(pdfFolder+'/'+addDocName+'_'+abName)
                //     docRef.saveAs(fileName, options, fileNamePrefix);
                // }

                // var newArtboards = ''
                // whatToExport.artboards = getArtboards(document,newArtboards);
                // docRef.exportForScreens(pdfFolder, ExportForScreensType.SE_PDF, options, whatToExport, fileNamePrefix);
                // saveAs( destFile, options )
                // for (var i = 0; i <= docRef.artboards.length; i++) {
                //     if (i % 4 !== 0) {
                //         newArtboards += i;
                //         if (i !== docRef.artboards.length - 1)
                //             whatToExport.artboardRange = (i + 1).toString();
                //             // docRef.saveAs(pdfFolder, options, whatToExport, fileNamePrefix);
                //     }
                // }

            }
        }

        if (svg !== -1) {
            if (svgFolder != null) {
                var options = new ExportForScreensOptionsWebOptimizedSVG();
                options.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
                options.coordinatePrecision = 5;
                options.fontType = SVGFontType.OUTLINEFONT;

                app.activeDocument.exportForScreens(svgFolder, ExportForScreensType.SE_SVG, options, whatToExport, fileNamePrefix);
            }
        }
        
        if (eps !== -1) {
            if (epsFolder != null) {
                // var options = new ExportForScreensOptionsWebOptimizedSVG();
                // options.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
                // options.coordinatePrecision = 5;
                // options.fontType = SVGFontType.OUTLINEFONT;

                // app.activeDocument.exportForScreens(svgFolder, ExportForScreensType.SE_SVG, options, whatToExport, fileNamePrefix);
                //save eps
                options = new EPSSaveOptions();
                options.embedLinkedFiles = true;
                options.includeDocumentThumbnails = true;
                options.saveMultipleArtboards = true;

                docRef.saveAs(epsFolder, options);
                // Remove multiartboard EPS file
                // https://stackoverflow.com/questions/44625594/remove-is-not-a-function-error-in-photoshop-cc-2017-extendscript-tool-kit
                var docPath = new Folder(docRef.path);
                var saveFile = new File(docPath + "/" + docRef.name);
                epsFile = docRef.fullName
                if (epsFile.exists) {
                    epsFile.remove();
                }
            }
        }


        if (png !== -1) {
            if (pngFolder != null) {
                var options = new ExportForScreensOptionsPNG24();
                options.antiAliasing = AntiAliasingMethod.ARTOPTIMIZED;
                options.transparency = true;
                // options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
                options.scaleType = ExportForScreensScaleType.SCALEBYWIDTH;
                options.scaleTypeValue = expResolution;
                // Jpg options doesnt work
                options.embedICCProfile = true;
                options.embedColorProfile = true;
                // options.scaleType = ExportForScreensScaleType.SCALEBYFACTOR;
                // options.horizontalScale = expResolution;
                // options.verticalScale = expResolution;
                // options.scaleTypeValue = 72;

                app.activeDocument.exportForScreens(pngFolder, ExportForScreensType.SE_PNG24, options, whatToExport, fileNamePrefix);
            }
        }

        //ignore white object
        // if (jpg!==-1) {
        if (jpgFolder != null) {
            // var options = new ExportForScreensOptionsJPEG();
            // options.antiAliasing = AntiAliasingMethod.ARTOPTIMIZED;
            // options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
            // options.scaleTypeValue = 300;
            // options.horizontalScale  = expResolution;
            // options.verticalScale    = expResolution;
            // options.qualitySetting = 0;

            // var options = new exportOptionsJPEG();
            var options = new ExportForScreensOptionsJPEG();
            // options.antiAliasing = AntiAliasingMethod.ARTOPTIMIZED;
            // options.antiAliasing = AntiAliasingMethod.None;
            options.antiAliasing = AntiAliasingMethod.TYPEOPTIMIZED;
            options.compressionMethod = JPEGCompressionMethodType.PROGRESSIVE;
            options.progressiveScan = 4;
            options.embedICCProfile = true;

            /** source: https://gist.github.com/haysclark/9d143284b0791faa90517acb32d1855e
            SCALEBYFACTOR = 0,
            * Scale artwork by factors like 1x, 2x, 3x and so on, where 1x means 72 ppi.
            SCALEBYHEIGHT = 2,
            * Scale artwork by specifying artwork height in pixels like 100px, 124px etc. Width of the artwork is adjusted automatically to maintain the aspect ratio.
            SCALEBYRESOLUTION = 3,
            * Scale artwork by specifying resolution in ppi like 72 ppi, 100 ppi, 144 ppi etc.
            //SCALEBYWIDTH = 1,
            * Scale artwork by specifying artwork width in pixels like 100px, 124px etc. Height of the artwork is adjusted automatically to maintain the aspect ratio.
            */
            // https://community.adobe.com/t5/illustrator/what-s-new-in-illustrator-scripting-cc2018/td-p/9422236/page/2?page=1
            // options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
            options.scaleType = ExportForScreensScaleType.SCALEBYWIDTH;
            options.scaleTypeValue = 1000;
            // options.scaleType = ExportForScreensScaleType.SCALEBYHEIGHT;
            // options.scaleType = ExportForScreensScaleType.SCALEBYFACTOR;

            // scaletype causes issues with small docs
            // alert(expResolution)
            // options.scaleTypeValue = 1000;
            // alert("expResolution "+expResolution)
            // options.scaleTypeValue = 1000;
            // options.horizontalScale = expResolution;
            // options.horizontalScale = expResolution;
            // options.verticalScale = expResolution;
            // options.scaleTypeValue = 72;
            options.artBoardClipping = true;
            options.saveMultipleArtboards = true;
            options.artboardRange = expArtboards;
            options.qualitySetting = 100;
            // app.activeDocument.exportFile(jpgFolder, ExportForScreensType.SE_JPEG100, options, whatToExport, fileNamePrefix);

            // whatToExport.artboards = getArtboards(document, newArtboards);
            // whatToExport.artboards = expArtboards;
            // alert(expArtboards)
            // alert(jpgFolder)
            // alert(fileNamePrefix)
            // var newArtboards = '';
            // alert('JPG ab '+getArtboards(document, newArtboards))
            // whatToExport.artboards = getArtboards(document, newArtboards);

            // file = new File(jpgFolder.fsName + '/' + filename + "-" + size + "px.jpg");
            app.activeDocument.exportForScreens(jpgFolder, ExportForScreensType.SE_JPEG100, options, whatToExport, fileNamePrefix);

            // Workaround resolution issues
            // https://community.adobe.com/t5/illustrator/exporting-to-jpeg/m-p/9412616
            // fileSpec = jpgFolder;
            // var captureOptions = new ImageCaptureOptions();
            // captureOptions.resolution = 300;
            // captureOptions.antiAliasing = true;
            // var captureClip = this.curBoard.artboardRect
            // // aiApp.imageCapture(fileSpec, captureClip,captureOptions)
            // app.activeDocument.imageCapture(fileSpec, captureClip,captureOptions)
        }
        // }

        // reopenDocument(document, afile);
        lyrLogoInfo.visible = true;
    }

    function getArtboards(document, newArtboards) {
        for (var i = 0; i <= app.activeDocument.artboards.length; i++) {
            if (i % 4 !== 0) {
                newArtboards += i;
                alert(newArtboards)
                if (i !== app.activeDocument.artboards.length - 1)
                    newArtboards += ', '
            }
        }
        return newArtboards
    }

    function reopenDocument(document, afile) {
        app.activeDocument.close(SaveOptions.DONOTSAVECHANGES);
        app.open(afile);
    }

    // https://github.com/iconifyit/jsx-common


    // Jonas Spaakko
    // https://gist.github.com/joonaspaakko/b878d993b038b98b8ca78cc859916af4
    function checkPresets(list, testPreset) {
        var pdfPresets = app.PDFPresetsList;
        // var logger = new Logger('pdfpresets.log', 'C:/Users/romboutversluijs/Desktop/Exports');
        // var presetLog = new File('C:/Users/romboutversluijs/Desktop/Export/presets.log');
        var presetLog = new File('~/Desktop/Export/Logo Packer/presets.log');
        presetLog.open('w');
        if (list === false) {
            alert("\n" + pdfPresets.join('\n'));
        } else {
            var preset = null;
            for (var i = pdfPresets.length; i--;) {
                // alert(pdfPresets[i])
                // alert(typeof Logger)
                presetLog.write(pdfPresets[i] + '\n');
                // Logger.info(pdfPresets[i]);
                // Logger.info("preset");
                if (pdfPresets[i] === testPreset) {
                    preset = testPreset;
                }
            }
            presetLog.close();
            pdfPresetNoMatch = (preset === null);
            return (pdfPresetNoMatch ? pdfPresets[0] : preset);
        }
    }

    /*********************************************************

    getPDFOptions: Function to set the PDF saving options of the 
    files using the PDFSaveOptions object.

    **********************************************************/

    function getPDFOptions() {
        // Create the PDFSaveOptions object to set the PDF options
        var pdfSaveOpts = new PDFSaveOptions();

        // Setting PDFSaveOptions properties. Please see the JavaScript Reference
        // for a description of these properties.
        // Add more properties here if you like
        pdfSaveOpts.acrobatLayers = true;
        pdfSaveOpts.colorBars = true;
        pdfSaveOpts.colorCompression = CompressionQuality.AUTOMATICJPEGHIGH;
        pdfSaveOpts.compressArt = true; //default
        pdfSaveOpts.embedICCProfile = true;
        pdfSaveOpts.enablePlainText = true;
        pdfSaveOpts.generateThumbnails = true; // default
        pdfSaveOpts.optimization = true;
        pdfSaveOpts.pageInformation = true;

        // uncomment to view the pdfs after conversion.
        // pdfSaveOpts.viewAfterSaving = true;
        return pdfSaveOpts;
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: addLogoInfo
// Usage: add logo info per artboard describing logo type & media
// Input: logo variant > string
// Return: 
// Source: multiexporter.jsx > adding layers with data
///////////////////////////////////////////////////////////////////////////////   
var count = null;
var infoColorRGB = new RGBColor();
if (!infoColorRGB.exists) {
    infoColorRGB.red = 255;
    infoColorRGB.green = 0;
    infoColorRGB.blue = 255;
}

function setLogoInfo(docRef, logotype, initArtboardsLength, steps) {
    appendLog('setLogoInfo()', logFile);
    appendLog(initArtboardsLength, logFile);
    // alert(logotype)
    // Add logo info
    // initArtboardsLength = app.activeDocument.artboards.length;
    var artboardsName = ['grayscale', 'black', 'white'];
    docRef.artboards.setActiveArtboardIndex(0);
    docRef.selectObjectsOnActiveArtboard();

    // Add logo info: Logo type & Media type
    if (steps != false){
        var ab = docRef.artboards[steps-1]; // correct with subtracting -1 for index starts at 0
    } else{
        var ab = docRef.artboards[docRef.artboards.length - 4];
    }
    posX = ab.artboardRect[0]; // Left
    posY = ab.artboardRect[1]; // Top
    addLogoInfo(docRef, logotype, posX - 15, posY - 8, 'right');
    addLogoInfo(docRef, "fullcolor", posX, posY + 20, 'left');
    // Loop of 3 needs work if users adds custom variations like single color or different colored versions
    // Variations like full-color + white text and full-color with black text are very common
    for (var i = 0; i < 3; i++) {
        if (steps != false){
            var ab = docRef.artboards[(steps+i)];
        } else{
            var ab = docRef.artboards[(initArtboardsLength + i)];
        }
        // changed this to 1, otherise wont work?!
        // var ab = docRef.artboards[(1 + i)];
        posX = ab.artboardRect[0]; // Left
        posY = ab.artboardRect[1]; // Top
        addLogoInfo(docRef, artboardsName[i], posX, posY + 20, 'left');
    }
    // Deselect all
    app.selection = null;
    run = true;
    return run
}

function addLogoInfo(docRef, layerName, posX, posY, justDir) {
    // find existing layers or add new one
    var x = convertToPoints(posX);
    var y = convertToPoints(posY);

    try {
        lyrLogoInfo = docRef.layers.getByName(LOGO_INFO);
        lyrLogoInfo.locked = false;
    } catch (e) {
        appendLog('Add logo info ' + e, logFile);
        // alert(e+" Adding layer LOGOINFO")
        lyrLogoInfo = docRef.layers.add();
        lyrLogoInfo.name = LOGO_INFO;
        lyrLogoInfo.printable = false;
        lyrLogoInfo.locked = false;
        // logoInfo.template = true;
    }
    var logoInfo = lyrLogoInfo.textFrames.add();
    // redraw();
    var justDir = justDir == 'left' ? Justification.LEFT : Justification.RIGHT;
    logoInfo.contents = layerName;
    // logoInfo.position = new Point(Number(posX), Number(posY)); // X > Y
    logoInfo.position = new Point(Number(x), Number(y)); // X > Y
    // logoInfo.textRange.characterAttributes.textFont = app.textFonts.getByName("Helvetica");
    logoInfo.textRange.characterAttributes.fillColor = infoColorRGB;
    logoInfo.textRange.characterAttributes.size = 10;
    logoInfo.textRange.paragraphAttributes.justification = justDir;

    lyrLogoInfo.locked = true;
}

///////////////////////////////////////////////////////////////////////////////
// Function: scanSubFolders
// Usage: create our default parameters
// Input: folder Object from dialog
// Return: loops over all folders and subfolders returning all files and folders in 2 lists
// Source: https://community.adobe.com/t5/photoshop/photoshop-javascript-open-files-in-all-subfolders/m-p/5162230
///////////////////////////////////////////////////////////////////////////////   
function scanSubFolders(setDest, mask) {
    var sFolders = [];
    var allFiles = [];
    sFolders[0] = setDest;
    for (var j = 0; j < sFolders.length; j++) { // loop through folders
        var procFiles = sFolders[j].getFiles();
        for (var i = 0; i < procFiles.length; i++) { // loop through this folder contents
            if (procFiles[i] instanceof File) {
                if (setDest == undefined) {
                    allFiles.push(procFiles); // if no search mask collect all files
                }
                if (procFiles[i].fullName.search(mask) != -1) {
                    allFiles.push(procFiles[i]); // otherwise only those that match mask
                }
            } else if (procFiles[i] instanceof Folder) {
                sFolders.push(procFiles[i]); // store the subfolder
                scanSubFolders(procFiles[i], mask); // search the subfolder
            }
        }
    }
    return [allFiles, sFolders];
}

function setDestFolder() {
    run = false;
    // setDest = [];
    setDest = Folder.selectDialog();
    // alert(setDest)
    // alert(typeof(setDest))
    if (setDest) {
        // setDest = [setDest];
        run = true;
    }
    return [run, setDest]
}

function setDestFolderFromJson(setDestFromJson) {
    run = false;
    if (setDest) {
        // setDest = Object(setDest);
        // setDest = setDest.selectDialog(Folder(setDest).fsName);\
        // setDest = Folder(setDest);
        // var path = new Folder(setDest).fsName;
        // setDest.changePath("c:/users/romboutversluijs/desktop/"); DOESNT WORK!!!
        // alert(setDest)
        // setDest.changePath("c:/users/romboutversluijs/desktop/");
        // alert(setDest)
        // setDest = new Folder("c:/users/romboutversluijs/desktop/export/logo packer")
        // setDest = new File("c:/users/romboutversluijs/desktop/export/logo packer")
        setDest = Folder(setDestFromJson)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
        // setDest = decodeURI(setDest);
        run = true;
    }
    // alert(setDest)
    // alert(setDest.toString())
    // alert(setDest.fsName)
    // alert(typeof(setDest))
    return [run, setDest]
}

///////////////////////////////////////////////////////////////////////////////
// Function: clearDestFolder
// Usage: create our default parameters
// Input: destination folder Object from dialog
// Return: cleans destination folder of all sub folders and files
///////////////////////////////////////////////////////////////////////////////   
function clearDestFolder() {
    setDest = Folder(setDest);
    // Find temp files windows, need to be deleted as well
    filter_files = /\.(jpg|psd|png|svg|ai|pdf|eps|DS_STORE)$/i;

    // We need to delete files first before fodler can be deleted
    if (setDest.exists) {
        // https://extendscript.docsforadobe.dev/user-interface-tools/window-class.html?highlight=confirm
        var clearFolder = confirm('Do you really want to clear all content of folder ' + setDest + '?', true, "Clear Project Folder"); //Window.confirm(message[,noAsDflt ,title ]);
        if (clearFolder) {
            var delFiles = scanSubFolders(setDest, filter_files);
            // alert(delFiles[0])
            // alert(delFiles[1])
            // First delete files, so we can delete folders when empty
            for (var f = 0; f < delFiles[0].length; f++) {
                var delFile = File(delFiles[0][f]);
                delFile.remove();
            }
            // Used reverse for folders
            var delFolders = scanSubFolders(setDest, filter_files);
            for (var l = delFolders[1].length; l > 0; l--) {
                var delFolder = Folder(delFolders[1][l - 1]);
                delFolder.remove();
            }
            return true
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
// Function: openDestFolder
// Usage: create our default parameters
// Input: folder Object from dialog
// Return: opens folder location in OS
///////////////////////////////////////////////////////////////////////////////   
function openDestFolder() {
    // setDest = Folder("c:/users/romboutversluijs/desktop/export/logo packer/surfscool");
    setDest = Folder(setDest);
    if (setDest.exists) {
        //https://extendscript.docsforadobe.dev/file-system-access/folder-object.html?highlight=open%20folder
        setDest.execute();
        run = true;
    }
    return run
}
///////////////////////////////////////////////////////////////////////////////
// Function: openDestFolder
// Usage: create our default parameters
// Input: folder Object from dialog
// Return: opens folder location in OS
///////////////////////////////////////////////////////////////////////////////   
function openLog() {
    // setDest = Folder("c:/users/romboutversluijs/desktop/export/logo packer/surfscool");
    logFile = Folder(logFile);
    if (logFile.exists) {
        //https://extendscript.docsforadobe.dev/file-system-access/folder-object.html?highlight=open%20folder
        logFile.execute();
        run = true;
    }
    return run
}

///////////////////////////////////////////////////////////////////////////////
// Function: openDeconvertToPointsstFolder
// Usage: input unit value convert to points (internal)
// Input: Number object
// Return: Number object in points
// Source: Specify CEP panel
///////////////////////////////////////////////////////////////////////////////   
function convertToPoints(value) {
    // alert(app.activeDocument.rulerUnits)
    switch (app.activeDocument.rulerUnits) {
        case RulerUnits.Picas:
            value = new UnitValue(value, "pc").as("pt");
            break;
        case RulerUnits.Inches:
            value = new UnitValue(value, "in").as("pt");
            break;
        case RulerUnits.Millimeters:
            value = new UnitValue(value, "mm").as("pt");
            break;
        case RulerUnits.Centimeters:
            value = new UnitValue(value, "cm").as("pt");
            break;
        case RulerUnits.Pixels:
            value = new UnitValue(value, "px").as("pt");
            break;
        default:
            value = new UnitValue(value, "pt").as("pt");
    }
    return value;
};

function convertToUnits(value) {
    switch (app.activeDocument.rulerUnits) {
        case RulerUnits.Picas:
            value = new UnitValue(value, "pt").as("pc");
            break;
        case RulerUnits.Inches:
            value = new UnitValue(value, "pt").as("in");
            break;
        case RulerUnits.Millimeters:
            value = new UnitValue(value, "pt").as("mm");
            break;
        case RulerUnits.Centimeters:
            value = new UnitValue(value, "pt").as("cm");
            break;
        case RulerUnits.Pixels:
            value = new UnitValue(value, "pt").as("px");
            break;
        default:
            value = new UnitValue(value, "pt").as("pt");
    }
    return value;
};

function getRulerUnits() {
    var rulerUnits;
    switch (app.activeDocument.rulerUnits) {
        case RulerUnits.Picas:
            rulerUnits = "pc";
            break;
        case RulerUnits.Inches:
            rulerUnits = "in";
            break;
        case RulerUnits.Millimeters:
            rulerUnits = "mm";
            break;
        case RulerUnits.Centimeters:
            rulerUnits = "cm";
            break;
        case RulerUnits.Pixels:
            rulerUnits = "px";
            break;
        default:
            rulerUnits = "pt";
    }
    return rulerUnits;
};


///////////////////////////////////////////////////////////////////////////////
// Function: minimalSize
// Usage: width, height as input returns scaled object 
// Input: String
// Return: scaled object to minimal widht and height
// Source: Wundes Scripts setAllTheThings
///////////////////////////////////////////////////////////////////////////////   
function minimalSize(v) {
    v = toPixels(v);
    // here's where we walk through all objects.
    var assign = function(i, v) {
        for (var x = 0; x < activeDocument.selection.length; x++) {

            item = activeDocument.selection[x];
            //get top and left width and height values
            center_point = [item.top - (item.height / 2), item.left + (item.width / 2)];

            item[i] = eval(v);
            //redraw();
            if (centerObjects) {
                //center_point = [item.top+(item.height/2),item.left+(item.width/2)];
                item.top = center_point[0] + (item.height / 2);
                item.left = center_point[1] - (item.width / 2);
            }
        };
    }
}

///////////////////////////////////////////////////////////////////////////////
// Function: toPixels
// Usage: takes string and converts to pixels
// Input: String
// Return: return unit in pixels
// Source: Wundes Scripts setAllTheThings
///////////////////////////////////////////////////////////////////////////////   
var toPixels = function(v) {
    var units = {
            'in': 72,
            'mm': 2.8346455078125,
            'px': 1,
            'pt': 1,
        },
        re = /(\d*[.]*\d+)(mm|in|ft|cm|px|pt)/i,
        m, u, rep;
    //derivitave
    units['cm'] = units['mm'] * 10;
    units['ft'] = units['in'] * 12;

    while (m = v.match(re)) {
        u = m[2].toLowerCase();
        if (units[u]) {
            rep = (m[1] * units[u]);
            v = v.replace(re, rep);
        }
    }
    return v;
}


// item = doc.selection[x];
function resizeLogo(item, autoResize) {
    var docRef = app.activeDocument;
    var board = docRef.artboards[docRef.artboards.getActiveArtboardIndex()];
    var right = board.artboardRect[2];
    var bottom = board.artboardRect[3];
    // if (item.width <= 70 || item.height <= 70){
    // _scaleW = 70 / docRef.selection[x].width;
    // _scaleH = 70 / docRef.selection[x].height;
    // resize(docRef.selection[x], (100+_scaleW));
    // alert(board.name+" design is to small for export, minimal req. 70 x 70px "+ docRef.selection[x].width+" "+docRef.selection[x].height)
    if (autoResize != "autoresize") {
        scaleItems = confirm("For this workflow, logo's need to have a minimal of 70px widht or height. Do you want to upscale it?");
    } else {
        scaleItems = true;
    }
    // scaleItems=confirm("The logo is smaller than minimal of 70px. Do want to scale it to the minimal requirements? For Jpg files types, this is needed using this workflow.?");
    // scaleItems=true;
    if (scaleItems) {
        // resize to 50 mm
        // carlos canto
        // https://community.adobe.com/t5/illustrator/illustrator-script-that-compares-object-width-to-length/td-p/10984755?page=1

        var idoc = app.activeDocument;
        // var sel = idoc.selection[0];
        var sel = item;
        var max = Math.max(sel.width, sel.height);
        // var targetSize = 50*72/25.4; // to mm
        var targetSize = 70; // to px
        var percent = targetSize / max * 100;
        sel.resize(percent, percent);
    }
    // Center on Artboard
    try {
        docRef.selection[0].position = [
            Math.round((right - docRef.selection[0].width) / 2),
            Math.round((bottom + docRef.selection[0].height) / 2)
        ];
    } catch (e) {
        appendLog('Resize logo Center it ' + e, logFile);
        alert(e);
    }
    resizeArtboard(item);
}


// Fit-artboards-to-selected
// https://twitter.com/kamise
// http://556.sub.jp/scriptclip/highlight/135
function resizeArtboard(sel) {
    // //
    var boundssel = 1; // 0: geometricBounds, 1: visibleBounds
    var modesel = 0; // 0: Fit active artboat, 1: Make a new artboard.

    // //
    var rulerOrigin_Original = app.activeDocument.rulerOrigin;
    app.activeDocument.rulerOrigin = [-9600, -9600];

    var bounds = ['geometricBounds', 'visibleBounds'], //
        mode = ['resize', 'new'],
        docRef = app.activeDocument,
        boad = docRef.artboards[docRef.artboards.getActiveArtboardIndex()],
        // sel = docRef.selection,
        // sel = item,
        bbox = [],
        l = sel.length;

    // //
    // alert(l < 1)
    // if (l < 1) return errorEvent(0);
    var a = sel[bounds[boundssel]],
        b = false;
    for (var i = 0; i < l; i++) {
        b = sel[i][bounds[boundssel]];
        a[0] > b[0] && a[0] = b[0];
        a[1] < b[1] && a[1] = b[1];
        a[2] < b[2] && a[2] = b[2];
        a[3] > b[3] && a[3] = b[3];
    }
    // //
    var br = boad.artboardRect;
    // if (br.toString() === a.toString()) return errorEvent(1);
    switch (mode[modesel]) {
        case 'new':
            docRef.artboards.add(a);
            break;

        default:
            boad.artboardRect = a;
    }
    docRef.rulerOrigin = rulerOrigin_Original;
}
//
// Event when an error occurs
//
function errorEvent(errorNumber) {
    switch (errorNumber) {
        case 1:
            alert("There is an artboard of the same size.");
        default:
            return false;
    }

}

// 
// Add margins to Artboards
// 
function addMarginToArtboard(marginVal, margintype, allArtboards, logotype) {
    appendLog('addMarginsToArtboard()', logFile);
    appendLog(initArtboardsLength, logFile);
    run = false;
    if (margins == "") {
        run = "margins";
    } else if (margintype == "select" || margintype == "") {
        run = "margintype";
    } else {

        var title = "Add margin to Artboard(s)";
        var docRef = app.activeDocument;
        var ABs = docRef.artboards;
        
        // var margins = 30*72/25.4;
        // var margins = 30*72;
        var margins = []
        margins.pt = Number(marginVal); //pt
        // margins.pt = 30*72; //pt
        margins.in = margins.pt * 72;
        margins.cm = margins.in / 2.54;
        margins.mm = margins.cm / 10;
        // margins.pt = area; //result.mm * 28.346438836889; // 1cm > 28.3465 pt; 
        margins.pc = margins.cm / 4, 233;
        margins.px = margins.mm / 16; // 1cm > 28.3

        if (app.documents.length > 0) {
            var allArtboards = allArtboards == "all" ? true : false;
            // var allArtboards = Window.confirm("Yes - All Artboards \nNo - Active Artboard", false, title);
            if (allArtboards) {
                // we do reverse so we dont drag other artwork around
                for (i = ABs.length; i > 0; i--) {
                    app.activeDocument.artboards.setActiveArtboardIndex(i - 1);
                    var activeAB = ABs[i - 1];
                    // var ab = docRef.artboards[0];
                    // var ab = activeAB;
                    addMargins(docRef, activeAB, margins, margintype, i - 1);
                    run = true;
                }
            } else {
                var activeAB = docRef.artboards[docRef.artboards.getActiveArtboardIndex()]; // get active AB
                addMargins(docRef, activeAB, margins, margintype, i)
                run = true;
            }
        } else {
            alert('Open a document before running this script', 'Error running FitArtboardToArt.jsx');
            run = false
        }

        // Update logo info around the artboards
        logotypes = getArtboardLogoTypes(docRef, true);
        // alert(logotypes)
        try{
            lyrLogoInfo = docRef.layers.getByName(LOGO_INFO);
            lyrLogoInfo.locked = false;
            lyrLogoInfo.remove();
        } catch(e){
            // do nothing
        }
        if (logotype == "alltypes") {
            abLength = docRef.artboards.length / 4;
            for (ab = 1; ab < docRef.artboards.length; ab+=4) {
                // ab = ab == 0 ? 0 : ab+4;
                app.selection = null;
                docRef.artboards.setActiveArtboardIndex(ab-1); // correct -1 idnex starts at 0
                run = setLogoInfo(docRef, logotypes[ab], ab, ab);
            }
        } else {
            run = setLogoInfo(docRef, logotype, initArtboardsLength, false);
        }
        return run
    }
}

// Needs work, when margin is to big it keepos overlapping
function addMargins(docRef, activeAB, margins, margintype, count) {
    var abBounds = activeAB.artboardRect; // get bounds [left, top, right, bottom]
    // var selObjBounds = docRef.pageItems[i].visibleBounds;
    docRef.selectObjectsOnActiveArtboard();
    var selObjBounds = docRef.selection[0].visibleBounds;
    // alert(selObjBounds)
    // We have our maximum bounds, so use it to set the document's (only) artboard
    abBounds = selObjBounds;
    // docRef.artboards[0].artboardRect = selObjBounds;

    // Add margins
    // https://github.com/andrewcockerham/Adobe-Illustrator-Scripts/blob/master/fitObjectToArtboard_v2.jsx
    marg = margins[margintype];
    var ableft = count == 0 ? abBounds[0] - marg - marg : abBounds[0]; //subtract if 1 ab or last is being set, this is for offsetting ab's;
    // var ableft = count == 0 ? abBounds[0]-marg-marg-(count*marg) : abBounds[0]+(count*2*marg); //subtract if 1 ab or last is being set, this is for offsetting ab's;
    var abtop = abBounds[1] + marg;
    var abright = count == 0 ? abBounds[2] : abBounds[2] + marg + marg; // twice shift it to the right
    // var abright = count == 0 ? abBounds[2]-(count*marg) : abBounds[2]+marg+marg+(count*2*marg); // twice shift it to the right
    var abbottom = abBounds[3] - marg;
    activeAB.artboardRect = [ableft, abtop, abright, abbottom];

    // center again > we margin to move it to the right. we add 2x margin to artboard
    docRef.selectObjectsOnActiveArtboard();
    move = count == 0 ? marg * -1 : marg;
    docRef.selection[0].translate(move, 0);
}

// 
// Delete Unsed Panel Items action
// https://community.adobe.com/t5/illustrator-discussions/is-it-possible-to-run-an-action-from-a-script/m-p/9832063#M93914
function deleteUnusedPanelItems() {
    swatchesCleaned = false;
    docName = app.activeDocument.name;
    for (i = 0; i < clearedItemsDocs.length; i++) {
        if (clearedItemsDocs.toString().indexOf(docName) === -1) {
            app.doScript("Delete Unused Panel Items", "Default Actions")
            swatchesCleaned = true;
            clearedItemsDocs.push(docName)
        }
    }
    return swatchesCleaned
}

// VERY SLOW!!!! menu command deleteunsed much faster
// Delete all UnUsedColorSwatches
//http://www.wundes.com/JS4AI/delete_fluff.js

function deleteUnusedSwatches() {
    var docRef = app.activeDocument;
    var items = docRef.pageItems,
        len = items.length,
        sw = docRef.swatches,
        slen = sw.length,
        arr = [],
        str = null,
        i = 0,
        j,
        temp = [],
        p,
        path,
        isFill = (function() {
            p = docRef.pathItems.rectangle(0, 0, 100, 100);
            p.fillColor = sw[2].color;
            docRef.selection = [p];
            if (sw.getSelected()[0] == sw[2]) {
                p.remove();
                return 1
            } else {
                p.remove();
                return 0
            }
        })();
    for (; i < len; i++) {
        docRef.selection = [items[i]];
        arr.push(sw.getSelected()[0]);
        isFill ? (items[i].stroked && temp.push(items[i].strokeColor)) : (items[i].filled && temp.push(items[i].fillColor));
    }

    while (temp.length) {
        swatch = temp.pop();
        path = docRef.pathItems.rectangle(0, 0, 100, 100);
        isFill ? (path.fillColor = swatch) : (path.strokeColor = swatch);
        docRef.selection = [path];
        arr.push(sw.getSelected()[0]);
        path.remove();
    }
    // alert(len)
    str = arr.toString();
    for (j = slen - 1; j > 1; j--) {
        RegExp(sw[j].name).test(str) || sw[j].remove();
    }
    swatchesCleaned = true;
    return swatchesCleaned
}

// Custom Alert Window
// https://community.adobe.com/t5/photoshop-ecosystem-discussions/script-alert-title-alert-box/m-p/11726184

function scriptAlert(alertTitle, alertString1, alertString2) {
    // Titel, msg_line1, msg_line2
    var alertWindow = new Window("dialog", undefined, undefined, {
        resizeable: false
    });
    alertWindow.text = alertTitle;
    alertWindow.preferredSize.width = 400;
    alertWindow.preferredSize.height = 100;
    alertWindow.orientation = "column";
    alertWindow.alignChildren = ["center", "top"];
    alertWindow.spacing = 25;
    alertWindow.margins = 20;
    var alertText = alertWindow.add("group");
    alertText.orientation = "column";
    alertText.alignChildren = ["left", "center"];
    alertText.spacing = 0;
    alertText.alignment = ["left", "top"];
    alertStringSize1 = alertText.add("statictext", undefined, alertString1, {
        name: "alertText",
        multiline: true
    });
    alertStringSize1.graphics.font = ScriptUI.newFont("dialog", "BOLD", 13);
    alertStringSize2 = alertText.add("statictext", undefined, alertString2, {
        name: "alertText",
        multiline: true
    });
    alertStringSize2.graphics.font = "dialog:13";
    var okButton = alertWindow.add("button", undefined, undefined, {
        name: "okButton"
    });
    okButton.text = "OK";
    okButton.alignment = ["left", "top"];
    okButton.graphics.font = "dialog:13";

    alertWindow.show();
}

// Clean logo
// Simplifies logo
function cleanupLogos(clientName) {
    var colorgroup = "";
    docRef = app.activeDocument;
    // logoCleaned = false;
    // docName = app.activeDocument.name;
    // for (i = 0; i < cleanedLogoItems.length; i++) {
    //     if (cleanedLogoItems.toString().indexOf(docName)===-1) {
    //         app.doScript("Delete Unused Panel Items", "Default Actions")
    //         swatchesCleaned = true;
    //         cleanedLogoItems.push(docName)
    //     }
    // }
    // return logoCleaned

    if (clientName == "") {
        run = "clientname";
    } else {
        app.executeMenuCommand('lockguide');
        try {
            docRef.swatchGroups.getByName(clientName);
        } catch (e) {
            appendLog('Cleanup logo - create colorgroup ' + e, logFile);
            // Add color group
            app.executeMenuCommand("selectall");
            act_MakeColorGroup();
            try {
                var colorgroup = docRef.swatchGroups.getByName(clientName);
            } catch (e) {
                appendLog('Cleanup logo - create colorgroup ' + e, logFile);
                // does return error, do return run so we catch propr feedback to user
                // run = "cancelled"
                // return run
                if (colorgroup == "") {
                    // undo color group creations
                    app.executeMenuCommand("undo");
                    run = "cancelled";
                    return run
                }
            }
        }
        var title = "Clean logo(s)";
        var ABs = docRef.artboards;
        if (app.documents.length > 0) {
            var allArtboards = Window.confirm("Yes - All Artboards \nNo - Active Artboard", false, title);
            if (allArtboards) {
                // we do reverse
                for (i = ABs.length; i > 0; i--) {
                    app.activeDocument.artboards.setActiveArtboardIndex(i - 1);
                    cleanLogoItem(docRef, clientName);
                    groupBySwatches(docRef, clientName);
                    logoCleaned, run = true;
                }
            } else {
                cleanLogoItem(docRef, clientName);
                groupBySwatches(docRef, clientName);
                logoCleaned, run = true;
            }
            // remove Empty layers
            deleteEmptyLayers();
        } else {
            alert('Open a document before running this script', 'Error running clean logos');
            run = false
        }
    }
    return run
}

function cleanLogoItem(docRef, clientName) {
    var black = new RGBColor(0, 0, 0);
    var white = new RGBColor(255, 255, 255);
    var colors = ['grayscale', black, white];

    app.executeMenuCommand("deselectall");
    app.executeMenuCommand("selectallinartboard");

    var activeAB = docRef.artboards[docRef.artboards.getActiveArtboardIndex()];
    // check if selection is group > if not results are bad
    // alert(app.activeDocument.selection[0].typename == "GroupItem")
    // alert(!app.activeDocument.selection[0].typename == "GroupItem")
    // if(!app.activeDocument.selection[0].typename == "GroupItem")alert("Please make group of logo "+activeAB.name)return

    app.executeMenuCommand("group");
    app.executeMenuCommand('Live Pathfinder Trim');
    app.executeMenuCommand('expandStyle');
    app.executeMenuCommand('Live Pathfinder Merge');
    // app.executeMenuCommand('Live Pathfinder Divide');
    app.executeMenuCommand('expandStyle');
    // app.executeMenuCommand("deselectall");

    // move logo to its own layer
    moveSelectionToLayer(docRef, activeAB.name)
}

// Move selection to layer
// https://graphicdesign.stackexchange.com/a/140087
// adjusted so we use artboardnames according to logo types
function moveSelectionToLayer(docRef, abName) {
    var docSelected = docRef.selection;

    for (s = 0; s < docSelected.length; s++) {
        myPath = docSelected[s];
        var targetLayer = docRef.layers.add();
        // redraw()
        targetLayer.name = abName;
        // var targetLayer = app.activeDocument.layers["new_layer"];
        myPath.move(targetLayer, ElementPlacement.PLACEATBEGINNING);
    }
}

// // Silly-V}
// // https://community.adobe.com/t5/illustrator-discussions/ideas-to-group-same-color-path-items-without-a-selection/m-p/9319756#M63029

function groupBySwatches(docRef, clientName) {
    var swatchGroup = docRef.swatchGroups.getByName(clientName);
    var swatches = swatchGroup.getAllSwatches();
    //   var swatches = docRef.swatches.getSelected();
    var thisSwatch;
    app.executeMenuCommand("selectallinartboard");
    act_EnterIsolateMode();
    // app.executeMenuCommand("ungroup");
    app.executeMenuCommand("deselectall");
    for (var i = 0; i < swatches.length; i++) {
        thisSwatch = swatches[i];
        docRef.defaultFillColor = thisSwatch.color;
        app.executeMenuCommand("Find Fill Color menu item");
        app.executeMenuCommand("group");
        docRef.selection = null;
    };
    act_ExitIsolateMode();
};


// Make Color Group
// Dynamic Action
function act_MakeColorGroup() {
    var str = '/version 3' +
        '/name [ 14' +
        ' 4d616b65436f6c6f7247726f7570' +
        ']' +
        '/isOpen 1' +
        '/actionCount 1' +
        '/action-1 {' +
        ' /name [ 16' +
        '  4d616b6520436f6c6f722047726f7570' +
        ' ]' +
        ' /keyIndex 0' +
        ' /colorIndex 1' +
        ' /isOpen 0' +
        ' /eventCount 1' +
        ' /event-1 {' +
        '  /useRulersIn1stQuadrant 0' +
        '  /internalName (ai_plugin_swatches)' +
        '  /localizedName [ 8' +
        '   5377617463686573' +
        '  ]' +
        '  /isOpen 0' +
        '  /isOn 1' +
        '  /hasDialog 1' +
        '  /showDialog 1' +
        '  /parameterCount 1' +
        '  /parameter-1 {' +
        '   /key 1835363957' +
        '   /showInPalette -1' +
        '   /type (enumerated)' +
        '   /name [ 15' +
        '    4e657720436f6c6f722047726f7570' +
        '   ]' +
        '   /value 17' +
        '  }' +
        ' }' +
        '}';

    var f = new File('~/MakeColorGroup.aia');
    f.open('w');
    f.write(str);
    f.close();
    app.loadAction(f);
    f.remove();
    app.doScript("Make Color Group", "MakeColorGroup", false); // action name, set name
    app.unloadAction("MakeColorGroup", ""); // set name

}

// Enter Isolate Mode
// Dynamic Action
function act_EnterIsolateMode() {
    var str = '/version 3' +
        '/name [ 16' +
        ' 456e74657249736f6c6174654d6f6465' +
        ']' +
        '/isOpen 1' +
        '/actionCount 1' +
        '/action-1 {' +
        ' /name [ 18' +
        '  456e7465722049736f6c617465204d6f6465' +
        ' ]' +
        ' /keyIndex 0' +
        ' /colorIndex 0' +
        ' /isOpen 0' +
        ' /eventCount 1' +
        ' /event-1 {' +
        '  /useRulersIn1stQuadrant 0' +
        '  /internalName (ai_plugin_Layer)' +
        '  /localizedName [ 5' +
        '   4c61796572' +
        '  ]' +
        '  /isOpen 0' +
        '  /isOn 1' +
        '  /hasDialog 0' +
        '  /parameterCount 1' +
        '  /parameter-1 {' +
        '   /key 1836411236' +
        '   /showInPalette -1' +
        '   /type (integer)' +
        '   /value 24' +
        '  }' +
        ' }' +
        '}';

    var f = new File('~/EnterIsolateMode.aia');
    f.open('w');
    f.write(str);
    f.close();
    app.loadAction(f);
    f.remove();
    app.doScript("Enter Isolate Mode", "EnterIsolateMode", true); // action name, set name
    app.unloadAction("EnterIsolateMode", ""); // set name
}

// Exit Isolate Mode
// Dynamic Action
function act_ExitIsolateMode() {
    var str = '/version 3' +
        '/name [ 15' +
        ' 4578697449736f6c6174654d6f6465' +
        ']' +
        '/isOpen 1' +
        '/actionCount 1' +
        '/action-1 {' +
        ' /name [ 17' +
        '  457869742049736f6c617465204d6f6465' +
        ' ]' +
        ' /keyIndex 0' +
        ' /colorIndex 0' +
        ' /isOpen 0' +
        ' /eventCount 1' +
        ' /event-1 {' +
        '  /useRulersIn1stQuadrant 0' +
        '  /internalName (ai_plugin_Layer)' +
        '  /localizedName [ 5' +
        '   4c61796572' +
        '  ]' +
        '  /isOpen 0' +
        '  /isOn 1' +
        '  /hasDialog 0' +
        '  /parameterCount 1' +
        '  /parameter-1 {' +
        '   /key 1836411236' +
        '   /showInPalette -1' +
        '   /type (integer)' +
        '   /value 25' +
        '  }' +
        ' }' +
        '}';

    var f = new File('~/ExitIsolateMode.aia');
    f.open('w');
    f.write(str);
    f.close();
    app.loadAction(f);
    f.remove();
    app.doScript("Exit Isolate Mode", "ExitIsolateMode", true); // action name, set name
    app.unloadAction("ExitIsolateMode", ""); // set name
}

// deleteEmptyLayers,jsx
// deletes empty layers and sublayers. If a sublayer is not empty, its parent empty layer will not be removed.
// an open illustrator
// CarlosCanto // 10/14/2017
// canto29@yahoo.com;

// usage - open Illustrator before running the script

function deleteEmptyLayers() {
    try {
        var idoc = app.activeDocument;
    } catch (e) {
        appendLog('deleteEmptyLayers ' + e, logFile);
        alert('Open a document and try again');
        return
    };

    var emptyLayers = [];
    getEmptyLayers(idoc, emptyLayers);

    for (var a = 0; a < emptyLayers.length; a++) {
        emptyLayers[a].remove();
    }
}

// return empty layers, except the ones that have sublayers with objects
function getEmptyLayers(container, arr) {
    var layers = container.layers;

    for (var k = 0; k < layers.length; k++) {
        try {
            var ilayer = layers[k];
            ilayer.canDelete = true; // initialize all layers with deletion flag set to true

            // process sublayers first
            if (ilayer.layers.length > 0) {
                getEmptyLayers(ilayer, arr)
            }

            // then process objects in current layer
            // if layer has a sublayer with objects, deletion flag was previously set to false
            // ignore this layer and set it's parent layer (container) to false as well, otherwise add to Empty Layers array
            if (ilayer.pageItems.length == 0 && ilayer.canDelete) {
                arr.push(ilayer);
            }
            // if layer has objects, set deletion flag to false and its parent layer to false as well
            else {
                ilayer.canDelete = false;
                container.canDelete = false;
            }
        } catch (e) {
            appendLog('getEmptyLayers ' + e, logFile);
            /*$.writeln (contaner.name)*/
        }
    }
}


///////////////////////////////////////////////////
// Object: Timer
// Usage: Time how long things take or delay script execution
// Input: <none>
// Return: Timer object
// Example:
//
//   var a = new Timer();
//   for (var i = 0; i < 2; i++)
//      a.pause(3.33333);
//   a.getElapsed();
//  jeff tranberry
//
// Timer Tom Ruark // Source: Getter.jsx
///////////////////////////////////////////////////

function Timer() {
    if (useTimer) {
        // member properties
        this.startTime = new Date();
        this.endTime = new Date();
        // member methods
        // reset the start time to now
        this.start = function() {
            this.startTime = new Date();
        }
        // reset the end time to now
        this.stop = function() {
            this.endTime = new Date();
        }
        // get the difference in milliseconds between start and stop
        this.getTime = function() {
            return (this.endTime.getTime() - this.startTime.getTime()) / 1000;
        }
        // get the current elapsed time from start to now, this sets the endTime
        this.getElapsed = function() {
            this.endTime = new Date();
            return this.getTime();
        }
        // pause for this many seconds
        this.pause = function(inSeconds) {
            var t = 0;
            var s = new Date();
            while (t < inSeconds) {
                t = (new Date().getTime() - s.getTime()) / 1000;
            }
        }
    }
}


///////////////////////////////////////////////////
// Object: Logger
// Usage: Logs all outputs feed
// Input: Text file
// Return: Date - Time - Data be marked for log
// Usage: appendLog('Logitem.' + logitem, logFile);
// Autohor: Mike Voropaev, 2019.
// Source: https://www.youtube.com/channel/UCbX5bb9yeLw8V9emYE-fOXw
///////////////////////////////////////////////////
function startLog(targetPath) {
    // logpath = getSystemPath(SystemPath.EXTENSION);
    var userData = Folder.userData;
    var myDocuments = Folder.myDocuments;
    var extension = Folder.extension;
    var commonFiles = Folder.commonFiles;
    var application = Folder.application;
    if (!userData || !userData.exists) {
        userData = Folder("~");
    }
    var logopackerFolder = new Folder(userData + "/Adobe/CEP/Extensions/logo-packer-main");

    if (useLogging) {
        var logFile = File(logopackerFolder + '/.logo-packer.log');
        logFile.encoding = 'UTF8';
        // Remove > we keep log small
        // if (logFile.exists)
        // 	logFile.remove();

        logFile.open('w'); // W overwrites - A appends

        // appendLog("extension "+extension, logFile);
        // appendLog("myDocuments "+myDocuments, logFile);
        // appendLog("commonFiles "+commonFiles, logFile);
        // appendLog("application "+application, logFile);
        appendLog("", logFile);
        appendLog('____________________________', logFile);
        appendLog(logFile, logFile);
        // appendLog(logpath, logFile);
        return logFile
    }
}

function loadTextFile(relPath) {
    var script = new File($.fileName);
    var textFile = new File(script.path + '/' + relPath);
    textFile.open('r');
    var str = textFile.read();
    textFile.close();

    return str.split('\n');
}

function appendLog(message, file) {

    if (useLogging) {
        var time = new Date();
        file.write(('0' + time.getHours()).slice(-2) + ':' + ('0' + time.getMinutes()).slice(-2) + ':' + ('0' + time.getSeconds()).slice(-2));
        file.write('  |  ' + message);
        file.writeln('');
    }
}

function _zeroPad(val) {
    return (val < 10) ? '0' + val : val;
}
// logFile = startLog(Folder.desktop+'/Export/Logo Packer');//app.activeDocument.path + "/")
logFile = startLog(); // userdata folder
var date = new Date();
appendLog('New log: ' + _zeroPad(date.getDate(), 2) + '-' + _zeroPad(date.getMonth() + 1, 2) + '-' + date.getFullYear(), logFile);
appendLog("", logFile);

///////////////////////////////////////////////////
// Object: New Base doc
// Usage: Starts a new file Print or DIgital from where we can start logo packer
// Input: cmyk or rgb type docuemnt
// Return: New document with 4 artboards accordg to logotypes
// Autohor: Rombout 2022.
///////////////////////////////////////////////////

function newBaseDoc(clientName, docType) {
    appendLog('Add Basedoc*()', logFile);
    appendLog(docType, logFile);
    try {
        if (clientName == "") {
            return run = "clientname"
            // no sure why added logotype here
        // } else if (docType == "select" || logotype == "") {
        } else if (docType == "select") {
            return run = "doctype"
        } else {
            var run = false;
            var artboardsName = ['logo', 'logotype', 'logomark', 'payoff'];
            var docType = docType == 'cmyk' ? 'cmyk' : 'rgb';
            var hasDoc = false;
            var initArtboardsLength = 1;
            var addDocName = clientName;
            var docPreset = new DocumentPreset();
            docPreset.title = addDocName;
            docPreset.width = 283.465; // 1 pt > 2.83465mm
		    docPreset.height = 283.465;
            // docPreset.units = RulerUnits.Pixels;
            docPreset.units = RulerUnits.Millimeters;
            // docPreset.units = RulerUnits.Points;
            docPreset.colorMode = docType == 'cmyk' ? DocumentColorSpace.CMYK : DocumentColorSpace.RGB;
            app.documents.addDocument("", docPreset);
            // false so we clean new doc of all colors
            swatchesCleaned = false;

            // // Set new doc as Active working
            var docRef = app.activeDocument;

            // Set to artboard ruler
            // https://ai-scripting.docsforadobe.dev/jsobjref/scripting-constants/?highlight=CoordinateSystem
            // docRef.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
            docRef.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
            docRef.rulerOrigin = [0, 0];
            docRef.pageOrigin = [0, 0];

            docRef.artboards[initArtboardsLength - 1].name = artboardsName[0];
            // docRef.artboards[initArtboardsLength].name = artboardsName[0];

            // Delete all unused color swatches, only first gen logos
            if (swatchesCleaned == false) {
                // Cleans doc of all items; swatches, brushes, styles etc etc
                deleteUnusedPanelItems();
            }

            // Add artboards
            for (var i = 0; i < artboardsName.length-1; i++) {
                // var curFirstBoard = hasDoc ? (initArtboardsLength - 1 + i) : i;
                // var curFirstBoard = (initArtboardsLength - 1 + i);
                var curFirstBoard = i;
                var mainArtboard;

                //duplicate artboard
                mainArtboard = docRef.artboards[curFirstBoard];

                // Artboard L T R B = 0 1 2 3
                var abL = mainArtboard.artboardRect[0];
                var abT = mainArtboard.artboardRect[1];
                var abR = mainArtboard.artboardRect[2];
                var abB = mainArtboard.artboardRect[3];
                // alert(abT+" "+abL+' '+abR+' '+abB)

                docRef.artboards.add([abR + 100, abT, abR + 100 + (abR - abL), abB]);
                // docRef.artboards[initArtboardsLength + i].name = artboardsName[i];
                docRef.artboards[initArtboardsLength+i].name = artboardsName[initArtboardsLength+i];

            }
            run = true;
        }
        return run
    } catch (e) {
        appendLog('### ERROR ' + e, logFile);
    }
}