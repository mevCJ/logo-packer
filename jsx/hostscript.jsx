/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/
// #include "Logger.jsxinc";
// #includepath "/";
// #include "json2.js";
// #include "/cmyktopms.jsx"
// test using json in hostcript
// source: https://stackoverflow.com/a/55577307
// #include "json.jsx";

var obj = {
	myNumber: 12345678,
	myBool: true,
	myString: "Hello\tWorld\u00a0: This is fine!",
	myRegex: /[a-z\d]+/,
	myArray: [ ['this', 'is'], [1], ['array', 'of', 'arrays'] ],
	myObject: {a:1,b:2,c:3},
	myUnit: UnitValue(5,'mm'),
	myXML: <root><aaa xxx='yyy'>hello</aaa></root>,
	myDate: new Date,
	myFile: File("c:/test.txt"),
	myNativeObj: $.global,
};
// var data = JSON(obj);
// alert(typeof(data))
// alert( JSON(obj,1) );

///////////////////////////////////////////////////
// Logging & Timer
// var PATH = require("path"),
// CS = new CSInterface();
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
var sourceProfile;
var destinationProfile;
// var logotypes = ['logo', 'logotype', 'logomark', 'payoff'];
var logotypes = new Array();
var destDir = '';
var allTypes;
var dialogFolder;
var setDest = new Folder();
var addDocName;
var colors = [];
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
var extensionRoot = '';

function getColorProfile(activeDocument){
    return activeDocument.colorProfileName;
}

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

// Get logo colors list, return names and color object for black and white
function getLogoColorList(colors, mediaType){
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
    // var colors = ['grayscale', black, white];
    // var artboardsNames = ['grayscale', 'black', 'white'];

    // make string list of colors
    // Make array of stringlist from HTML
    // colors = colors.split(',');
    var artboardsNames = colors.split(',');
    var colors = colors.split(','); // convert stringlist to objectlist
    
    abLength = docRef.artboards.length;
    // alert(abLength)
    // alert(colors.length)
    // alert(typeof(colors))
    // for (var i = 0; i < colors.length; i++) {
    //     alert(colors[i])
    // }
    

    // source https://www.geeksforgeeks.org/remove-elements-from-a-javascript-array/#:~:text=pop()%20function%3A%20This%20method,specific%20index%20of%20an%20array.
    for (var i = 0; i < colors.length; i++) {
        if (colors[i] === "fullcolor") {
            colors.splice(i, 1);
            artboardsNames.splice(i, 1);
        }
        if (colors[i] === "black") {
            colors.splice(i, 1);
            colors.push(black);
            // artboardsNames.push("black");
        }
        if (colors[i] === "white") {
            colors.splice(i, 1);
            colors.push(white);
            // artboardsNames.push("white");
        }
        // alert(colors[i])
    }
    // alert("colors.length "+colors.length)
    // alert(artboardsNames)

    return [colors, artboardsNames]
}

function generateLogoVariation(clientName, logotype, colors, mediaType, sepaRator, forMats, autoResize, extensionRoot, exportInfo) {
    docRef = app.activeDocument;
    logotypes = getArtboardLogoTypes(docRef, false);
    clearedItemsDocs = ['']; // clear list of doc with cleared swatches
    sourceProfile = getColorProfile(docRef);
    if (logotype == "alltypes") {
        abLength = docRef.artboards.length;
        for (ab = 0; ab < abLength; ab++) {
            app.selection = null;
            docRef.artboards.setActiveArtboardIndex(ab);
            docRef.selectObjectsOnActiveArtboard();
            createLogoTypes(docRef, clientName, colors, logotypes[ab], mediaType, sepaRator, forMats, autoResize, extensionRoot, sourceProfile, exportInfo)
            // switch to generated logo
            if (run==true) app.documents.getByName(docRef.name).activate();
        }
        if (run==true) app.documents.getByName(clientName).activate();
    } else {
        createLogoTypes(docRef, clientName, colors, logotype, mediaType, sepaRator, forMats, autoResize, extensionRoot, sourceProfile, exportInfo);
    }
    app.executeMenuCommand('fitall')
    return run
}

function createLogoTypes(docRef, clientName, colors, logotype, mediaType, sepaRator, forMats, autoResize, extensionRoot, sourceProfile, exportInfo) {
    logotype = logotype;
    // var run = false;
    separator = sepaRator;
    if (app.selection.length == 0) {
        return run = "selection"
    } else if (clientName == "") {
        return run = "clientname"
    } else if (colors == "") {
        return run = "colors"
    } else if (logotype == "select" || logotype == "") {
        return run = "logotype"
    } else if (mediaType == "undefined" || mediaType == "") {
        return run = "mediatype"
    } else if (sepaRator == "undefined" || sepaRator == "") {
        return run = "separator"
    } else {
        app.copy()
        separator = separator == 'dash' ? '-' : '_';
        // var addDocName = 'logo_var.ai';
        addDocName = clientName;
        var selDoc; /* use Dropzone or selection */
        var hasDoc = false;
        initArtboardsLength = 1; // Reset always to 1 other we have generation error
        
        // get list of colors
        var colorList = getLogoColorList(colors, mediaType);
        var colors = colorList[0];
        var artboardsNames = colorList[1];
        // alert("returned colors length list" +colors.length)
        // alert("returned colors " +colors)
        // alert("returned ABnames " +artboardsNames)

        // Filter function 
        // Source https://stackoverflow.com/a/20690490
        // let forDeletion = ["black". "white"]
        // colors = colors.filter(item => !forDeletion.includes(item))
        

        
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

            // Warn if source Document Color Profiles mismatches workign Color Profile Settings
            destinationProfile = getColorProfile(app.activeDocument);
            if (sourceProfile != destinationProfile){
                // app.redraw();
                // app.redraw();
                // $.sleep(1000);
                // $.evalFile(new File(extensionRoot+'/jsx/alert-dialog.jsx'));

                var title = "Warning!  Document Color Mismatch";
                var msg1 = "Source: "+sourceProfile+"\nWorking: "+destinationProfile;
                var msg2 = "The source logo has a diffirent Color Profile then the Color Management Settings. Do you want to assign the same Color Profile to the new document?";
                var okStr = "Yes";
                var cancelStr = "No";
                scriptAlert(title, msg1, msg2, true, true, okStr, cancelStr, cpIcon64);
                assignProfile = scriptAlertResult;
            
                if (assignProfile) app.executeMenuCommand('assignprofile')
            }

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
        // Cleans doc of all items; swatches, brushes, styles etc etc
        if (swatchesCleaned == false) deleteUnusedPanelItems();

        //paste and group
        app.paste();
        //force group item to fix bugs cmyktopms bug
        app.executeMenuCommand('group');

        item = docRef.selection[0];

        // Only group if not alreadt a group
        if (item.typename != "GroupItem") app.executeMenuCommand('group');

        // Give groupname Client name and logotype as name, Looks clean in layers :)
        item.name = clientName+"-"+logotype;
        
        // check logo size
        if (item.width <= 70 || item.height <= 70) resizeLogo(item, autoResize, exportInfo)

        if (hasDoc) {
            // var prevArtboard = docRef.artboards[initArtboardsLength - 5]
            
            // works by more then 1
            // var prevArtboard = docRef.artboards[initArtboardsLength - (colors.length +1)]
            var prevArtboard = docRef.artboards[initArtboardsLength - colors.length]
            // alert(prevArtboard)
            // alert("initArtboardsLength " + initArtboardsLength)
            // alert("colors.length "+ colors.length)
            // alert("initArtboardsLength - colors.length " + (initArtboardsLength - colors.length))
            var initialObjHeight = Math.abs(prevArtboard.artboardRect[1] - prevArtboard.artboardRect[3]);

            //move copied items to previouse item's position
            app.executeMenuCommand('selectall')

            var xDif = app.selection[0].position[0] - app.selection[1].position[0]
            var yDif = app.selection[0].position[1] - app.selection[1].position[1]
            // var xDif = app.selection[0].position[0] - app.selection[1].position[0]
            // var yDif = app.selection[0].position[1] - app.selection[1].position[1]

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
        
        // Fix for when single color is used
        if (colors.length == 0) docRef.fitArtboardToSelectedArt(0);    

        // Add grayscale, black & white version
        for (var i = 0; i < colors.length; i++) {
            var firstObj = app.selection[0];
            var orgObj = app.selection[0];
        
            var curFirstBoard = hasDoc ? (initArtboardsLength - 1 + i) : i;
            var mainArtboard;

            if (i == 0) docRef.fitArtboardToSelectedArt(curFirstBoard);

            //duplicate artboard
            mainArtboard = docRef.artboards[curFirstBoard];

            // Artboard L T R B = 0 1 2 3
            var abL = mainArtboard.artboardRect[0];
            var abT = mainArtboard.artboardRect[1];
            var abR = mainArtboard.artboardRect[2];
            var abB = mainArtboard.artboardRect[3];

            docRef.artboards.add([abR + 100, abT, abR + 100 + (abR - abL), abB]);
            docRef.artboards[initArtboardsLength + i].name = logotype + separator + artboardsNames[i] + separator + mediatype


            // Fixed for very light grayscale due to PMS version was used now
            if (colors[i] != 'pms'){
                orgObj.duplicate();
                orgObj.translate(orgObj.width + 100, 0);
                firstObj = orgObj;
            } else {
                firstObj.duplicate();
                firstObj.translate(firstObj.width + 100, 0);
            }

            // Make color logo versions
            fillColor(firstObj, colors[i], extensionRoot);

            //select the latest object
            docRef.artboards.setActiveArtboardIndex(docRef.artboards.length - 1);
            docRef.selectObjectsOnActiveArtboard();
        }

        // Add logo type & color version info
        logotype = logotype;
        run = setLogoInfo(docRef, logotype, artboardsNames, initArtboardsLength, false);
    }
    // alert(run)
    return run
}

//change object colors
function fillColor(obj, color, extensionRoot) {
    var docRef = app.activeDocument;
    docRef.layers[0].hasSelectedArtwork = false;
    docRef.artboards.setActiveArtboardIndex(docRef.artboards.length - 1);
    app.executeMenuCommand('selectallinartboard');

    if (color == 'grayscale') {
        app.executeMenuCommand('Colors7');
        return;
    }
    if (color == 'pms') {
        // Cant find other method for this
        $.evalFile(new File(extensionRoot+'/jsx/cmyktopms.jsxbin'));
        return;
    }
    var aDoc = docRef;
    aDoc.defaultFillColor = color;
    app.executeMenuCommand("Find Fill Color menu item");
}


function exportFiles(mediaType, logotype, forMats, subFolders, checkABhasArt, exportInfo, separator) {
    // convert string list of josn settings back to object
    exportInfo = exportInfo.split(',')

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

                if (!destPath.exists) destPath.create();

                if (logotype == 'alltypes') {
                    for (i = 0; i < logoType.length; i++) {
                        destPath = new Folder(setDest + '/' + mediaType);

                        if (!destPath.exists) destPath.create();

                        logoTypeExp = logoType[i].substr(3, logoType[i].length).toLowerCase().split('-').pop(); //[0];
                        expArtboards = getExpArtboards(logoTypeExp, true, checkABhasArt);
                        
                        if (expArtboards != '') exportFormats(destPath, mediatype, logoTypeExp, expArtboards, exportInfo, separator);
                    }
                } else {
                    logoTypeExp = logoType.substr(3, logoType.length).toLowerCase().split('-').pop(); //[0];
                    expArtboards = getExpArtboards(logoTypeExp, true, checkABhasArt);
                    exportFormats(destPath, mediatype, logoTypeExp, expArtboards, exportInfo, separator);
                }

            // Use subfolders by logotype    
            } else {
                if (logotype == 'alltypes') {
                    for (i = 0; i < logoType.length; i++) {
                        logoTypeExp = logoType[i].substr(3, logoType[i].length).toLowerCase().split('-').pop(); //[0];
                        expArtboards = getExpArtboards(logoTypeExp, false, checkABhasArt);
                        if (expArtboards != '') {
                            if (logoTypeExp == docRef.artboards[expArtboards[0]].name.split('-')[0]) {
                                destPath = new Folder(setDest + '/' + logoType[i] + '/' + mediaType);
                                
                                if (!destPath.exists) destPath.create();

                                expArtboards = getExpArtboards(logoTypeExp, true, checkABhasArt);
                                exportFormats(destPath, mediatype, logoTypeExp, expArtboards, exportInfo, separator);
                            }
                        }
                    }
                } else {
                    destPath = new Folder(setDest + '/' + logoType + '/' + mediaType);
                    
                    if (!destPath.exists) destPath.create();

                    logoTypeExp = logoType.substr(3, logoType.length).toLowerCase().split('-').pop(); //[0];
                    expArtboards = getExpArtboards(logoTypeExp, true, checkABhasArt);
                    exportFormats(destPath, mediatype, logoTypeExp, expArtboards, exportInfo, separator);
                }
            }

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

                // Turned of Canceling with empty artboards
                if (docRef.selection.length === 0) {
                    var title = "Warning!";
                    // var msg1 = "All artboards are empty, export will be canceled";
                    var msg1 = "On or more artboards are empty, result will have an empty file.";
                    var msg2 = false;
                    var okStr = "Exit";
                    var cancelStr = "Exit";
                    scriptAlert(title, msg1, msg2, false, true, okStr, cancelStr, aiIcon64);
                    // run = scriptAlertResult;
                    // return run
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
        abName = docRef.artboards[i].name.split('-')[0];
        if ((abName == logotypePrefix) || (logotype != "alltypes")) {
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


    function exportFormats(destPath, mediatype, logotypePrefix, expArtboards, exportInfo, separator) {
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
        var whatToExport = new ExportForScreensItemToExport();
        whatToExport.assets = [];
        
        // Fix if not last artboard string traling comma
        whatToExport.artboards = expArtboards.toString();
        
        // whatToExport.artboards = '1,2,4';

        // Sizes
        // var sizes = [1024, 512, 300, 256, 150, 100, 64, 50, 32, 16];
        // var sizes = [1024, 256, 64, 32, 16];
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

        // turn off subfolder creation exportforscreens
        var creatSubFolders = app.preferences.getIntegerPreference ('plugin/SmartExportUI/CreateFoldersPreference')
        app.preferences.setIntegerPreference ('plugin/SmartExportUI/CreateFoldersPreference', 0);

        if (ai !== -1) {
            if (aiFolder != null) {
                var options = new IllustratorSaveOptions();
                options.compatibility = aiCompatibility(exportInfo[0])//Compatibility.ILLUSTRATOR17;
                // options.flattenOutput = aiFlattening()exportInfo[1]; Illustrator 8 feature // OutputFlattening.PRESERVEAPPEARANCE;
                options.PDFCompatibility = stringToBoolean(exportInfo[1]); //true
                options.embedLinkedFiles = stringToBoolean(exportInfo[2]); //true;
                options.embedICCProfile = stringToBoolean(exportInfo[3]); //true;
                options.compressed = stringToBoolean(exportInfo[4]); //true;

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
                    // If this option is true, opening the PDF in illustrator will show all other arboards
                    options.preserveEditability = stringToBoolean(exportInfo[6]); //false
                    options.generateThumbnails = stringToBoolean(exportInfo[7]); //true;
                    options.optimization = stringToBoolean(exportInfo[8]); //true;
                    options.layers = stringToBoolean(exportInfo[9]); //false;

                    // options.saveMultipleArtboards = false;
                    if (expArtboards.slice(-1) == ',') {
                        expArtboards = expArtboards.substr(0, expArtboards.length - 1);
                    }
                    ABs = expArtboards.split(','); //replace(/^\s+|\s+$/gm,'')
                    for (var i = 0; i < ABs.length; i++) {
                        options.artboardRange = ABs[i];
                        ABnr = ABs[i];
                        abName = docRef.artboards[ABnr - 1].name;
                        fileName = File(pdfFolder + '/' + addDocName + '_' + abName)
                        docRef.saveAs(fileName, options);
                        // docRef.saveAs(fileName, options, fileNamePrefix);
                    }
                } else if (mediaType == 'Digital') {
                    var options = new ExportForScreensPDFOptions();
                    options.pDFPreset = pdfProfileAI ? checkPresets(true, pdfProfileAI) : "[High Quality Print]";
                    options.preserveEditability = stringToBoolean(exportInfo[6]); //false
                    options.generateThumbnails = stringToBoolean(exportInfo[7]); //true;
                    options.optimization = stringToBoolean(exportInfo[8]); //true;
                    options.layers = stringToBoolean(exportInfo[9]); //false;
                    // var options = new PDFSaveOptions();
                    // options.compatibility = PDFCompatibility.ACROBAT5;
                    // options.compatibility = PDFCompatibility.ACROBAT8;
                    // options.preserveEditability = false;
                    // options.generateThumbnails = true;
                    // options.layers = false;
                    // options.spotColors = false;
                    // options.colorProfileID = ColorProfi.IleNCLUDEDESTPROFILE;
                    // options.colorConversionID = ColorConversion.COLORCONVERSIONTODEST; 
                    // options.colorDestinationID = ColorDestination.COLORDESTINATIONWORKINGCMYK;
                    // options.pDFPreset = "[High Quality Print]";

                    // options.acrobatLayers = true;
                    // options.colorBars = true;
                    // options.colorCompression = CompressionQuality.AUTOMATICJPEGHIGH;
                    // options.compressArt = true; //default
                    // options.embedICCProfile = true;
                    // options.enablePlainText = true;
                    // options.optimization = true;
                    // options.pageInformation = false;
                    // whatToExport.artboards = getArtboards(document,newArtboards);
                    options.saveMultipleArtboards = false; //false
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
        
        if (eps !== -1) {
            if (epsFolder != null) {
                var options = new EPSSaveOptions();
                options.compatibility = epsCompatibility(exportInfo[10]); // Compatibility.ILLUSTRATOR17 ; //ILLUSTRATOR24;
                options.embedAllFonts = stringToBoolean(exportInfo[11]); // true;
                options.embedLinkedFiles = stringToBoolean(exportInfo[12]); // true;
                options.includeDocumentThumbnails = stringToBoolean(exportInfo[13]); // true;
                options.preview = EPSPreview.BWTIFF;
                options.cmykPostScript = stringToBoolean(exportInfo[14]); // true;
                options.compatibleGradientPrinting = stringToBoolean(exportInfo[15]); // true;
                options.postScript = epsPostscript(exportInfo[16]); // EPSPostScriptLevelEnum.LEVEL2;
                options.saveMultipleArtboards = true; // otherwise saves all artboards to each folder.

                options.artboardRange = expArtboards.toString();

                docRef.saveAs(epsFolder, options);
                // Remove multiartboard EPS file
                // https://stackoverflow.com/questions/44625594/remove-is-not-a-function-error-in-photoshop-cc-2017-extendscript-tool-kit
                // var docPath = new Folder(docRef.path);
                // var saveFile = new File(docPath + "/" + docRef.name);
                epsFile = docRef.fullName
                if (epsFile.exists) {
                    epsFile.remove();
                }
            }
        }

        if (svg !== -1) {
            if (svgFolder != null) {
                var options = new ExportForScreensOptionsWebOptimizedSVG();
                options.cssProperties = svgCSSproperty(exportInfo[17]); //SVGCSSPropertyLocation.STYLEELEMENTS; // STYLEATTRIBUTES  PRESENTATIONATTRIBUTES
                options.fontType = svgFontType(exportInfo[18]); //SVGFontType.OUTLINEFONT; // SVGFONT
                options.rasterImageLocation = svgRasterImageLocation(exportInfo[19]);//RasterImageLocation.EMBED;
                options.svgId = svgObjectID(exportInfo[20])//SVGIdType.SVGIDUNIQUE; // SVGIDMINIMAL  SVGIDREGULAR
                options.coordinatePrecision = stringToNumber(exportInfo[21]); //5;
                options.svgMinify = stringToBoolean(exportInfo[22]);//false;
                options.svgResponsive = stringToBoolean(exportInfo[23]); //false;
                // options.fontSubsetting = SVGFontSubsetting.None;
                // options.compressed = true;
                app.activeDocument.exportForScreens(svgFolder, ExportForScreensType.SE_SVG, options, whatToExport, fileNamePrefix);
            }
        }

        //ignore white object
        // if (jpg!==-1) {
        // var imageScales = [1000,500,250];
        // alert(exportInfo[32])
        // alert(exportInfo[33])
        // alert(exportInfo[34])
        var imageScales = exportInfo[32].split('-');
        // alert(typeof(imageScales))
        // alert(typeof(imageScales))
        if (jpgFolder != null) {
            for(var size = 0; size < imageScales.length; size++){

                // var options = new ExportForScreensOptionsJPEG();
                // options.antiAliasing = AntiAliasingMethod.ARTOPTIMIZED;
                // options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
                // options.scaleTypeValue = 300;
                // options.horizontalScale  = expResolution;
                // options.verticalScale    = expResolution;
                // options.qualitySetting = 0;
                // var options = new exportOptionsJPEG();
                var options = new ExportForScreensOptionsJPEG();
                options.compressionMethod = jpgCompressionMethod(exportInfo[24]);
                options.progressiveScan = stringToNumber(exportInfo[25]) + 3; // compensate for 3,4,5 by adding 3 as start value
                options.antiAliasing = jpgAntiAliasing(exportInfo[26]); // AntiAliasingMethod.TYPEOPTIMIZED;
                options.embedICCProfile = stringToBoolean(exportInfo[27]); // true

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
                // ExportForScreensScaleType.SCALEBYRESOLUTION
                options.scaleType = scaleTypeMethod(exportInfo[33])//ExportForScreensScaleType.SCALEBYWIDTH;
                // alert(Number(imageScales[size]))
                options.scaleTypeValue = Number(imageScales[size]);//1000;
                // options.scaleType = ExportForScreensScaleType.SCALEBYHEIGHT;
                // options.scaleType = ExportForScreensScaleType.SCALEBYFACTOR;

                // JPG Options
                // scaletype causes issues with small docs
                // alert(expResolution)
                // options.scaleTypeValue = 1000;
                // alert("expResolution "+expResolution)
                // options.scaleTypeValue = 1000;
                // options.horizontalScale = expResolution;
                // options.horizontalScale = expResolution;
                // options.verticalScale = expResolution;
                // options.scaleTypeValue = 72;
                // options.artBoardClipping = true;
                // options.saveMultipleArtboards = true;
                // options.qualitySetting = 100;
                // app.activeDocument.exportFile(jpgFolder, ExportForScreensType.SE_JPEG100, options, whatToExport, fileNamePrefix);

                // whatToExport.artboards = getArtboards(document, newArtboards);
                // whatToExport.artboards = expArtboards;
            
                // var newArtboards = '';
                // alert('JPG ab '+getArtboards(document, newArtboards))
                // whatToExport.artboards = getArtboards(document, newArtboards);

                // https://community.adobe.com/t5/illustrator-discussions/export-selected-artboards-png24-javascript/m-p/12894621#M319113
                // file = new File(jpgFolder.fsName + '/' + filename + "-" + size + "px.jpg");
                // for (var i = 0; i < list.length; i++) {
                // docRef.artboards.setActiveArtboardIndex(list[i] - 1);
                // var itemToExport = new ExportForScreensItemToExport() ; 
                // var whatToExport = new ExportForScreensItemToExport();
                // // Fix if not last artboard string traling comma
                // whatToExport.artboards = expArtboards.toString();
                // var activeAB = docRef.artboards[docRef.artboards.getActiveArtboardIndex()]; // get active AB
                // var ABname = activeAB.name.replace(/\//g, "_") 
                // var jpgFile = new File(jpgFolder+'/'+ ABname + "-"+imageScales[size] + '.jpg');
                // var jpgFile = new File(fileNamePrefix + ABname + "-"+imageScales[size]);// + '.jpg');
                // alert(separator)
                // alert(separator.toString())
                // alert(separator.toString() == '-')
                // var sep = separator == "dash" ? '-' : '_';
                // var jpgFile = fileNamePrefix +imageScales[size] + sep;
                // alert(jpgFile)
                app.activeDocument.exportForScreens(jpgFolder, ExportForScreensType.SE_JPEG100, options, whatToExport, fileNamePrefix);
                if (stringToBoolean(exportInfo[31])==true){
                    for(i=0;i<docRef.artboards.length;i++){
                    // var ABname = activeAB.name.replace(/\//g, "_") 
                        var activeAB = docRef.artboards[i]; // get active AB
                        var saveFile = File(jpgFolder + "/" + docRef.name+'_' + activeAB.name+'.jpg');
                        if(saveFile.exists){
                            var sep = separator == "dash" ? '-' : '_';
                            var imageSuffix = imageScales[size].toString()+exportInfo[34].toString();
                            saveFile.rename(docRef.name+'_' + activeAB.name + sep + imageSuffix+'.jpg');
                            // alert(jpgFolder + "/" + docRef.name+'_' + activeAB.name + sep + imageSuffix+'.jpg')
                            // saveFile.rename(jpgFolder + "/" + docRef.name+'_' + activeAB.name + sep + imageSuffix+'.jpg');
                            // saveFile.rename(jpgFolder + "/" + docRef.name+'_' + activeAB.name + sep + imageSuffix+'px.jpg');
                            // var jpgFile = fileNamePrefix +imageScales[size] + sep;
                            // var jpgFile = sep +imageScales[size];
                        }
                    }
                }
            }

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
        if (png !== -1) {
            if (pngFolder != null) {
                for(var size = 0; size < imageScales.length; size++){
                    var options = new ExportForScreensOptionsPNG24();
                    options.antiAliasing = pngAntiAliasing(exportInfo[28]); // AntiAliasingMethod.ARTOPTIMIZED;
                    options.interlaced = stringToBoolean(exportInfo[29]); // true;
                    if (stringToNumber(exportInfo[30])==0) {
                        options.transparency = true; //stringToNumber(exportInfo[30]); // true;
                    } else {
                        options.transparency = false;
                    }
                    // https://www.indesignjs.de/extendscriptAPI/illustrator-latest/#ExportForScreensOptionsPNG24.html
                    if (stringToNumber(exportInfo[30])==1) {
                        options.backgroundBlack = true; // Black
                    } else {
                        options.backgroundBlack = false; // white
                    }
                    options.scaleType = options.scaleType = scaleTypeMethod(exportInfo[33]); //ExportForScreensScaleType.SCALEBYWIDTH; // ExportForScreensScaleType.SCALEBYRESOLUTION;
                    // options.scaleTypeValue = expResolution;
                    // 2023-05-17 set it fixed value for now. need to extend export sizes
                    options.scaleTypeValue = Number(imageScales[size]);//1000;


                    // options.scaleType = ExportForScreensScaleType.SCALEBYFACTOR;
                    // options.horizontalScale = expResolution;
                    // options.verticalScale = expResolution;
                    // options.scaleTypeValue = 72;

                    app.activeDocument.exportForScreens(pngFolder, ExportForScreensType.SE_PNG24, options, whatToExport, fileNamePrefix);
                    if (stringToBoolean(exportInfo[31])==true){
                        for(i=0;i<docRef.artboards.length;i++){
                            var activeAB = docRef.artboards[i]; // get active AB
                            var saveFile = File(pngFolder + "/" + docRef.name+'_'  + activeAB.name+'.png');
                            if(saveFile.exists){
                                var sep = separator == "dash" ? '-' : '_';
                                var imageSuffix = imageScales[size].toString()+exportInfo[34].toString();
                                saveFile.rename(docRef.name+'_' + activeAB.name + sep + imageSuffix+'.png')
                                // saveFile.rename(docRef.name+'_' + activeAB.name + sep + imageScales[size]+'px.png')
                                // saveFile.rename(pngFolder + "/" + docRef.name+'_' + activeAB.name + sep + imageScales[size]+'px.png')
                                // saveFile.rename(pngFolder + "/" + docRef.name+'_' + activeAB.name+sep +Number(imageScales[size])+exportInfo[34]+'.png')
                                // saveFile.rename(pngFolder + "/" + docRef.name+'_' + activeAB.name + sep + imageSuffix + '.png')
                            }
                        }
                    }
                }

            }
        }
        // }

        // reopenDocument(document, afile);
        lyrLogoInfo.visible = true;

        // Set create subfolders for exportforscreens back to its setting
        app.preferences.setIntegerPreference ('plugin/SmartExportUI/CreateFoldersPreference', creatSubFolders);
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


///////////////////////////////////////////////////////////////////////////
//
// files export settings from JSON 
//
///////////////////////////////////////////////////////////////////////////


function stringToBoolean(string){
    try{
        if (string=="true") return true
        if (string=="false") return false
    } catch (e) {
        alert("stringToBoolean() error: "+e)
    }
}

function stringToNumber(string){
    try {
        // alert(parseInt(string)+" "+string)
        return parseInt(string)
    } catch (e) {
        alert("stringToNumber() error: "+e)
    }
}

///////////////////////////////////////////////////////////////////////////
// AI SETTINGS
///////////////////////////////////////////////////////////////////////////
function aiCompatibility(index){
    switch (stringToNumber(index)) {
        case 0:
            index = Compatibility.ILLUSTRATOR17;
            break;
        case 3:
            index = Compatibility.ILLUSTRATOR16;
            break;
        case 4:
            index = Compatibility.ILLUSTRATOR15;
            break;
        case 5:
            index = Compatibility.ILLUSTRATOR14;
            break;
        case 6:
            index = Compatibility.ILLUSTRATOR13;
        case 7:
            index = Compatibility.ILLUSTRATOR12;
        case 8:
            index = Compatibility.ILLUSTRATOR11;
        case 9:
            index = Compatibility.ILLUSTRATOR10;
        case 10:
            index = Compatibility.ILLUSTRATOR9;
        case 11:
            index = Compatibility.ILLUSTRATOR8;
        default:
            index = Compatibility.ILLUSTRATOR17;
    }
    return index;
}
// Not used, illustrator 8 feature
function aiFlattening(index){
    switch (stringToNumber(index)) {
        case 0:
            index = OutputFlattening.PRESERVEAPPEARANCE;
            break;
        case 1:
            index = Compatibility.PRESERVEPATHS;
            break;
        default:
            index = Compatibility.PRESERVEAPPEARANCE;
    }
    return index;
}

///////////////////////////////////////////////////////////////////////////
// EPS SETTINGS
///////////////////////////////////////////////////////////////////////////
function epsCompatibility(index){
    switch (stringToNumber(index)) {
        case 0:
            index = Compatibility.ILLUSTRATOR17;
            break;
        case 3:
            index = Compatibility.ILLUSTRATOR16;
            break;
        case 4:
            index = Compatibility.ILLUSTRATOR15;
            break;
        case 5:
            index = Compatibility.ILLUSTRATOR14;
            break;
        case 6:
            index = Compatibility.ILLUSTRATOR13;
        case 7:
            index = Compatibility.ILLUSTRATOR12;
        case 8:
            index = Compatibility.ILLUSTRATOR11;
        case 9:
            index = Compatibility.ILLUSTRATOR10;
        case 10:
            index = Compatibility.ILLUSTRATOR9;
        case 11:
            index = Compatibility.ILLUSTRATOR8;
        default:
            index = Compatibility.ILLUSTRATOR17;
    }
    return index;
}
function epsPostscript(index){
    switch (stringToNumber(index)) {
        case 0:
            index = EPSPostScriptLevelEnum.LEVEL2;
            break;
        case 3:
            index = EPSPostScriptLevelEnum.LEVEL3;
            break;
        default:
            index = EPSPostScriptLevelEnum.LEVEL2;
    }
    return index;
}

///////////////////////////////////////////////////////////////////////////
// SVG SETTINGS
///////////////////////////////////////////////////////////////////////////
function svgCSSproperty(index){
    switch (stringToNumber(index)) {
        case 0:
            index = SVGCSSPropertyLocation.STYLEELEMENTS;
            break;
        case 1:
            index = SVGCSSPropertyLocation.STYLEATTRIBUTES;
            break;
        case 2:
            index = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
            break;
        case 3:
            index = SVGCSSPropertyLocation.ENTITIES;
            break;
        default:
            index = SVGCSSPropertyLocation.STYLEELEMENTS // STYLEATTRIBUTES  PRESENTATIONATTRIBUTES
    }
    return index;
}

function svgFontType(index){
    switch (stringToNumber(index)) {
        case 0:
            index = SVGFontType.OUTLINEFONT; // SVGFONT;
            break;
        case 1:
            index = SVGFontType.SVGFONT;
            break;
        default:
            index = SVGFontType.SVGFONT;
    }
    return index;
}

function svgRasterImageLocation(index){
    switch (stringToNumber(index)) {
        case 0:
            index = RasterImageLocation.PRESERVE;
            break;
        case 1:
            index = RasterImageLocation.EMBED;
            break;
        case 2:
            index = RasterImageLocation.LINK;
            break;
        default:
            index = RasterImageLocation.PRESERVE;
    }
    return index;
}

function svgObjectID(index){
    switch (stringToNumber(index)) {
        case 0:
            index = SVGIdType.SVGIDUNIQUE;
            break;
        case 1:
            index = SVGIdType.SVGIDMINIMAL;
            break;
        case 2:
            index = SVGIdType.SVGIDREGULAR;
            break;
        default:
            index = SVGIdType.SVGIDUNIQUE; // SVGIDMINIMAL  SVGIDREGULAR
    }
    return index;
}

///////////////////////////////////////////////////////////////////////////
// PNG SETTINGS
///////////////////////////////////////////////////////////////////////////
function pngAntiAliasing(index){
    switch (stringToNumber(index)) {
        case 0:
            index = AntiAliasingMethod.ARTOPTIMIZED;
            break;
        case 1:
            index = AntiAliasingMethod.TYPEOPTIMIZED;
            break;
        case 2:
            index = AntiAliasingMethod.None;
            break;
        default:
            index = AntiAliasingMethod.ARTOPTIMIZED;
    }
    return index;
}

///////////////////////////////////////////////////////////////////////////
// JPG SETTINGS
///////////////////////////////////////////////////////////////////////////

function jpgCompressionMethod(index){
    switch (stringToNumber(index)) {
        case 0:
            index = JPEGCompressionMethodType.BASELINESTANDARD;
            break;
        case 1:
            index = JPEGCompressionMethodType.BASELINEOPTIMIZED;
            break;
        case 2:
            index = JPEGCompressionMethodType.PROGRESSIVE;
            break;
        default:
            index = JPEGCompressionMethodType.BASELINESTANDARD;
    }
    return index;
}

function jpgAntiAliasing(index){
    switch (stringToNumber(index)) {
        case 0:
            index = AntiAliasingMethod.ARTOPTIMIZED;
            break;
        case 1:
            index = AntiAliasingMethod.TYPEOPTIMIZED;
            break;
        case 2:
            index = AntiAliasingMethod.None;
            break;
        default:
            index = AntiAliasingMethod.ARTOPTIMIZED;
    }
    return index;
}


///////////////////////////////////////////////////////////////////////////
// SCALE SETTINGS
///////////////////////////////////////////////////////////////////////////

function scaleTypeMethod(index){
    switch (stringToNumber(index)) {
        case 0:
            index = ExportForScreensScaleType.SCALEBYWIDTH;
            break;
        case 1:
            index = ExportForScreensScaleType.SCALEBYHEIGHT;
            break;
        case 2:
            index = ExportForScreensScaleType.SCALEBYRESOLUTION;
            break;
        case 3:
            index = ExportForScreensScaleType.SCALEBYFACTOR;
            break;
        default:
            index = ExportForScreensScaleType.SCALEBYWIDTH;
    }
    return index;
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

function setLogoInfo(docRef, logotype, colors, initArtboardsLength, steps) {
    appendLog('setLogoInfo()', logFile);
    appendLog(initArtboardsLength, logFile);
    // Add logo info
    // initArtboardsLength = app.activeDocument.artboards.length;
    // var artboardsNames = ['grayscale', 'black', 'white'];
    docRef.artboards.setActiveArtboardIndex(0);
    docRef.selectObjectsOnActiveArtboard();

    // If extra artboards are added later, add them to color list
    abLength = docRef.artboards.length;
    // Add extra colors names for colorinfo
    if (colors.length != abLength) {
        for (abindex = colors.length+1; abindex < abLength; abindex++) {
            color = docRef.artboards[abindex].name.split('-');
            // only add extra added colors here
            // alert(color[i].toString())
            // alert(color[i].toString() != "fullcolor")
            // alert(colors.indexOf(color[1]))
            // alert(colors.indexOf(color[1])==-1)
            if ((colors.indexOf(color[1])==-1) && (color[1]!= "fullcolor")){
                // alert(colors)
                // alert(color[1])
            // if (color not in colors){ doesnt work in extendscript
                colors.push(color[1]);
            }
        }
    }
    // Add logo info: Logo type & Media type
    if (steps != false){
        var ab = docRef.artboards[steps-1]; // correct with subtracting -1 for index starts at 0
    } else{
        // var ab = docRef.artboards[docRef.artboards.length - 4];
        if ((docRef.artboards.length - (colors.length+1)) == -1){
            var ab = docRef.artboards[0];
        } else {
            var ab = docRef.artboards[docRef.artboards.length - (colors.length+1)]; // Step backwards according to number of colors
            // var ab = docRef.artboards[initArtboardsLength - colors.length+1];
        }
    }
    
    posX = ab.artboardRect[0]; // Left
    posY = ab.artboardRect[1]; // Top
    addLogoInfo(docRef, logotype, posX - 15, posY - 8, 'right');
    addLogoInfo(docRef, "fullcolor", posX, posY + 20, 'left');
    // Loop of 3 needs work if users adds custom variations like single color or different colored versions
    // Variations like full-color + white text and full-color with black text are very common
    // for (var i = 0; i < 3; i++) {
    for (var i = 0; i < colors.length; i++) {
        if (steps != false){
            var ab = docRef.artboards[(steps+i)];
        } else {
            var ab = docRef.artboards[(initArtboardsLength + i)];
        }
        // changed this to 1, otherise wont work?!
        // var ab = docRef.artboards[(1 + i)];
        posX = ab.artboardRect[0]; // Left
        posY = ab.artboardRect[1]; // Top
        addLogoInfo(docRef, colors[i], posX, posY + 20, 'left');
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
        // setDest.changePath("c:/users/romboutversluijs/desktop/");
        // setDest = new Folder("c:/users/romboutversluijs/desktop/export/logo packer")
        // setDest = new File("c:/users/romboutversluijs/desktop/export/logo packer")
        setDest = Folder(setDestFromJson)
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
        // setDest = decodeURI(setDest);
        run = true;
    }
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
        var title = "Clear Project Folder";
        var msg1 = "Do you really want to clear all content of folder?";
        var msg2 = setDest;
        var okStr = "Yes";
        var cancelStr = "No";
        scriptAlert(title, msg1, msg2, true, true, okStr, cancelStr, aiIcon64);
        clearFolder = scriptAlertResult;
        // https://extendscript.docsforadobe.dev/user-interface-tools/window-class.html?highlight=confirm
        // var clearFolder = confirm('Do you really want to clear all content of folder ' + setDest + '?', true, "Clear Project Folder"); //Window.confirm(message[,noAsDflt ,title ]);
        if (clearFolder) {
            var delFiles = scanSubFolders(setDest, filter_files);
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
    run = false;
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

///////////////////////////////////////////////////////////////////////////////
// Function: resizeLogo
// item = docRef.selection[x];
///////////////////////////////////////////////////////////////////////////////
function resizeLogo(item, autoResize, exportInfo) {
    var docRef = app.activeDocument;
    var board = docRef.artboards[docRef.artboards.getActiveArtboardIndex()];
    var right = board.artboardRect[2];
    var bottom = board.artboardRect[3];
    
    // convert string list of josn settings back to object
    exportInfo = exportInfo.split(',')
    var scaleSize = exportInfo[32].split('-');
    var widthHeight = exportInfo[33];
    // alert(Math.max(scaleSize))
    // Get largest export size and use for AutoResize
    var largest = Number(scaleSize[0]);
    for (i=0; i<scaleSize.length; i++){
        if (Number(scaleSize[i])>largest) {
            largest=Number(scaleSize[i]);
        }
    }
    // alert(largest)
    // if (item.width <= 70 || item.height <= 70){
    // _scaleW = 70 / docRef.selection[x].width;
    // _scaleH = 70 / docRef.selection[x].height;
    // resize(docRef.selection[x], (100+_scaleW));
    // alert(board.name+" design is to small for export, minimal req. 70 x 70px "+ docRef.selection[x].width+" "+docRef.selection[x].height)
    if (autoResize != "autoresize") {
        // scaleItems = confirm("For this workflow, logo's need to have a minimal of 70px widht or height. Do you want to upscale it?");
        var title = "Logo size warning";
        var msg1 = "For this workflow, logo's need to have a minimal width or height of 70px. Do you want it to be to upscaled?";
        var msg2 = false;
        var okStr = "Yes";
        var cancelStr = "No";
        scriptAlert(title, msg1, msg2, true, true, okStr, cancelStr, aiIcon64);
        scaleItems = scriptAlertResult;
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
        if (widthHeight!=1) var max = Math.max(sel.width, sel.height);
        if (widthHeight==1) var max = Math.min(sel.width, sel.height);
        
        // var targetSize = 50*72/25.4; // to mm
        // var targetSize = 70; // to px
        var targetSize = largest / 10 + 200;// 200; // to px
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

///////////////////////////////////////////////////////////////////////////////
// Function: resizeArtboards
// Fit-artboards-to-selected
// https://twitter.com/kamise
// http://556.sub.jp/scriptclip/highlight/135
///////////////////////////////////////////////////////////////////////////////
function resizeArtboard(sel) {

    var boundssel = 1; // 0: geometricBounds, 1: visibleBounds
    var modesel = 0; // 0: Fit active artboat, 1: Make a new artboard.

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

///////////////////////////////////////////////////////////////////////////////
// Function: AddMarginToArtboard
// Add margins to Artboards
// 
///////////////////////////////////////////////////////////////////////////////
function addMarginToArtboard(marginVal, margintype, allArtboards, logotype, colors, mediaType) {
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
        
        // ToDo check if margins in print docuemnt works the same. Think we need to check if print or difgital
        // When adding big margins, artboards still get overlapping
        
        // var margins = 30*72/25.4;
        // var margins = 30*72;
        var margins = []
        // Replace all none numberical characters
        marginVal = marginVal.replace(/[^\d]/g, '');
        margins.pt = Number(marginVal); //pt
        // margins.pt = 30*72; //pt
        margins.in = margins.pt * 72;
        margins.cm = margins.in / 2.54;
        margins.mm = margins.cm / 10;
        // margins.pt = area; //result.mm * 28.346438836889; // 1cm > 28.3465 pt; 
        margins.pc = margins.cm / 4, 233;
        // margins.px = margins.mm / 16; // 1cm > 28.3
        margins.px = margins.pt; // same as points
        // 2.834645669 
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
        
         // get list of colors
        var colorList = getLogoColorList(colors, mediaType);
        var colors = colorList[0];
        var artboardsNames = colorList[1];

        // Update logo info around the artboards
        logotypes = getArtboardLogoTypes(docRef, true);

        try{
            lyrLogoInfo = docRef.layers.getByName(LOGO_INFO);
            lyrLogoInfo.locked = false;
            lyrLogoInfo.remove();
        } catch(e){
            // do nothing
        }
        if (logotype == "alltypes") {
            // abLength = docRef.artboards.length / 4;
            // for (ab = 1; ab < docRef.artboards.length; ab+=4) {
            abLength = docRef.artboards.length / (artboardsNames.length+1);
            for (ab = 1; ab < docRef.artboards.length; ab+=(artboardsNames.length+1)) {
                // ab = ab == 0 ? 0 : ab+4;
                app.selection = null;
                docRef.artboards.setActiveArtboardIndex(ab-1); // correct -1 idnex starts at 0
                run = setLogoInfo(docRef, logotypes[ab], artboardsNames, ab, ab);
            }
        } else {
            var oldABindex = docRef.artboards.getActiveArtboardIndex();
            run = setLogoInfo(docRef, logotype, artboardsNames, initArtboardsLength, false);
            docRef.artboards.setActiveArtboardIndex(oldABindex)
        }
        return run
    }
}

///////////////////////////////////////////////////////////////////////////////
//
// Function: addMargins
// Needs work, when margin is to big it keepos overlapping
//
///////////////////////////////////////////////////////////////////////////////
function addMargins(docRef, activeAB, margins, margintype, count) {
    var abBounds = activeAB.artboardRect; // get bounds [left, top, right, bottom]
    // var selObjBounds = docRef.pageItems[i].visibleBounds;
    docRef.selectObjectsOnActiveArtboard();
    var selObjBounds = docRef.selection[0].visibleBounds;
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

///////////////////////////////////////////////////////////////////////////////
//
// Function: deleteUnusedPanelItems
// Delete Unsed Panel Items action
// https://community.adobe.com/t5/illustrator-discussions/is-it-possible-to-run-an-action-from-a-script/m-p/9832063#M93914
//
///////////////////////////////////////////////////////////////////////////////
function deleteUnusedPanelItems() {
    swatchesCleaned = false;
    try {
        docName = app.activeDocument.name;

    } catch (e) {
        run = "noDoc";
        return run
    }
    for (i = 0; i < clearedItemsDocs.length; i++) {
        if (clearedItemsDocs.toString().indexOf(docName) === -1) {
            app.doScript("Delete Unused Panel Items", "Default Actions")
            swatchesCleaned = true;
            clearedItemsDocs.push(docName)
        }
    }
    return swatchesCleaned
}
///////////////////////////////////////////////////////////////////////////////
//
// Function: deleteUnsedSwatches
// VERY SLOW!!!! menu command deleteunsed much faster
// Delete all UnUsedColorSwatches
// http://www.wundes.com/JS4AI/delete_fluff.js
//
///////////////////////////////////////////////////////////////////////////////
function deleteUnusedSwatches() {
    try {
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
    } catch (e) {
        var title = "Error clear swatches";
        var msg1 = "Open a document before running this script?";
        var msg2 = false;
        var okStr = "Exit";
        var cancelStr = "No";
        scriptAlert(title, msg1, msg2, true, false, okStr, cancelStr, aiIcon64);
        donothing = scriptAlertResult;
        swatchesCleaned = "noDoc";
    }
    return swatchesCleaned
}

///////////////////////////////////////////////////////////////////////////////
//
// Function: Clean logo
// Simplifies logo
//
///////////////////////////////////////////////////////////////////////////////
function cleanupLogos(clientName) {
    var colorgroup = "";
    try {
        docRef = app.activeDocument;
    } catch (e) {
        var title = "Error running clean logos";
        var msg1 = "Open a document before running this script?";
        var msg2 = false;
        var okStr = "Exit";
        var cancelStr = "No";
        scriptAlert(title, msg1, msg2, true, false, okStr, cancelStr, aiIcon64);
        donothing = scriptAlertResult;
        run = "noDoc";
        return run
    }
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
            var title = "Apply to all artboards";
            var msg1 = "Would you like to clean all the artboards at once?"; //"Yes - All Artboards \nNo - Active Artboard";
            var msg2 = false;
            var okStr = "Yes";
            var cancelStr = "No";
            scriptAlert(title, msg1, msg2, true, true, okStr, cancelStr, aiIcon64);
            allArtboards = scriptAlertResult;
            // var allArtboards = Window.confirm("Yes - All Artboards \nNo - Active Artboard", false, title);
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
            var title = "Error running clean logos";
            var msg1 = "Open a document before running this script?";
            var msg2 = false;
            var okStr = "Exit";
            var cancelStr = "No";
            scriptAlert(title, msg1, msg2, true, false, okStr, cancelStr, aiIcon64);
            donothing = scriptAlertResult;
            // alert('Open a document before running this script', 'Error running clean logos');
            run = false
        }
    }
    return run
}

///////////////////////////////////////////////////////////////////////////////
//
// Function: cleanLogoItem
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

///////////////////////////////////////////////////////////////////////////////
//
// Function: moveSelectionToLayer
// Move selection to layer
// https://graphicdesign.stackexchange.com/a/140087
// adjusted so we use artboardnames according to logo types
//
///////////////////////////////////////////////////////////////////////////////
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


///////////////////////////////////////////////////////////////////////////////
//
// Function: act_MakeColorGroup
// Dynamic Action, is called then deleted
//
///////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////
//
// Function: act_EnterIsolationMode
// Dynamic Action
//
///////////////////////////////////////////////////////////////////////////////
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

///////////////////////////////////////////////////////////////////////////////
//
// Function: act_ExtIsolateMode
// Exit Isolate Mode
// Dynamic Action
//
///////////////////////////////////////////////////////////////////////////////
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


///////////////////////////////////////////////////////////////////////////////
//
// Function: deleteEmptyLayers,jsx
// deletes empty layers and sublayers. If a sublayer is not empty, its parent empty layer will not be removed.
// an open illustrator
// CarlosCanto // 10/14/2017
// canto29@yahoo.com;
// usage - open Illustrator before running the script
//
///////////////////////////////////////////////////////////////////////////////
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


///////////////////////////////////////////////////////////////////////////////
//
// Object: New Base doc
// Usage: Starts a new file Print or DIgital from where we can start logo packer
// Input: cmyk or rgb type docuemnt
// Return: New document with 4 artboards accordg to logotypes
// Autohor: Rombout 2022.
//
///////////////////////////////////////////////////////////////////////////////
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
            var artboardsNames = ['logo', 'logotype', 'logomark', 'payoff'];
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

            docRef.artboards[initArtboardsLength - 1].name = artboardsNames[0];
            // docRef.artboards[initArtboardsLength].name = artboardsNames[0];

            // Delete all unused color swatches, only first gen logos
            if (swatchesCleaned == false) {
                // Cleans doc of all items; swatches, brushes, styles etc etc
                deleteUnusedPanelItems();
            }

            // Add artboards
            for (var i = 0; i < artboardsNames.length-1; i++) {
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
                // docRef.artboards[initArtboardsLength + i].name = artboardsNames[i];
                docRef.artboards[initArtboardsLength+i].name = artboardsNames[initArtboardsLength+i];

            }
            run = true;
        }
        return run
    } catch (e) {
        appendLog('### ERROR ' + e, logFile);
    }
}


///////////////////////////////////////////////////////////////////////////////
//
// Function: getExtensionRootPath
// Usage: return list of file names
// Input: folder
// Return: list of filenames
//
///////////////////////////////////////////////////////////////////////////////
function getExtensionRootPath() {
    extensionRoot = $.fileName.split('/').slice(0, -2).join('/') + '/';
    var folderPath = extensionRoot;
    if (!Folder(folderPath).exists) {
        alert("There is no Root folder with that name", "Warning")
    } else {
        return folderPath
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: custom ALert DIalog
// Usage: returns value if OK Cancel buttons
// Input: value
// Return: Boolean
///////////////////////////////////////////////////////////////////////////////


//  Placement images
//  https://community.adobe.com/t5/photoshop/adding-images-to-script-ui-for-photoshop/td-p/10328043?page=1
// if (File.fs == "Macintosh"){
//     var psIcon64 = new File (app.path + '/Presets/Scripts/ps-icon.png');
// }
// var psIcon64 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00\x14\x00\x00\x00\x14\b\x06\x00\x00\x00\u008D\u0089\x1D\r\x00\x00\x00\x19tEXtSoftware\x00Adob"+
//         "e ImageReadyq\u00C9e<\x00\x00\x00\x18IDATx\u00DAb`\x18\x05\u00A3`\x14\u008C\u0082Q0\n\u00A8\x03\x00\x02\f\x00\x06T\x00\x01\u008B\u00CCR\u00FF"+
//         "\x00\x00\x00\x00IEND\u00AEB`\u0082";

// Color Profile icon
var cpIcon64 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00@\x00\x00\x00@\b\x06\x00\x00\x00\u00AAiq\u00DE\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x05OIDATx\u00DA\u00EC[Mn\u00DAP\x106(+6%7\u0080\x03D\u0081\x13\u00C4(\x07\u0088\u0091\u00BA\x07o\u00ABJMN\x00\u009C\x00\"E\u00DD\u00E2\u00EC#\u0085\x1C\u00A0\u0082\u009C \u00A0\x1E\x00z\x03\u00AF\u00B2Mg\u00ECy\u00E1\u0089\x18<\u00F3\u00FC\u00CCO\u00C8HS\u00A9-\u00D8\u009E\u00EF}3\u00F3\u00CD{\u00C6q\u00BE\u00EC\u00B8\u00AD\u00B0o\x0F\u00F4\u00F6\u00E3\u00E7X\u00FB\u00EB3\u00F8\x02|Z\u00F8}7=\x16\x00\u00DE\u00D6\u00FC\x17\x021\x01\u00BF\x070&\u00C7\b\u00C0*\x18\u00B7\u00E0\x01\u0080\x11f\u00B9_\u00F1@S\u00B7\x02\u00DE\x07\u009F\x03`\u00EDcd\u00C0\u00AAa}\u00F0M\u00EA\u00C4\u00A12`\u00D5j\u00E0/\x00\u00DE\u00F5~1`\u00F8Z#\u00BA\u00D6\u00E8_.\x1C\u00BF\u00D4\u00C8\u0081\x01\u00BAa]\u00F0\u00B9\x1F>\u00B1\x1Cp\x19\u00FE\u00F4\u00C0\u00AF\u00C0]\u00F0\u00F2\x0E\u00D8\u00D0\x06\x10\x11\u00F4&\u00A7@\u009EX\n\x1C\u0083m\u00E1\u00CD-\\\u00AD\x171%fN\u00C5\u00F0\x1A\u00F8<\u00A8'\u00EA\u00F9\u00A6@L\u00F1>\u00DD\u0090g~\u0089}OXI\u009DQ^\x1E\u00E9P\u00C8@\u00F5\x0E\u00B8\u00B8\u00E8\u00A4\x01\x00A\u00BBIB\u0087h\u00DD1`Y\x0F\u00AE\u00D7\u00B5\x07@\u00BC\u00EA\u008F\u00C6\u00F4L\x07@\x15\u00C1\u0090\u0094\u00DF\x13\u00F8H\u00E53\x011\x14\u00B1\u00CEq\x1A\u00EB\u00D4cA\x18|\u009Bnnn|\x00t\x0BI\u00F9\r4 \u00BA\u00C4\b\u008E\u00A1r\u00AC'\x15\u00C5\u00A2 \u00F8~\u00E6\u00E0\u00CDM\u00A5\x1C*\u00BF\u00A8\x16\x10\u00AD\u00B9\u00ED\u00AE\u00B2.]\u008B\u00CC\u00E0\u0087F\u00F9\u00FEq\x15'\x16\u0080x\x04\x10\u0086\x04B \x00\u00E1\x17\u00A5\u008F\x10\u0080\u00E1\u00EB\u00B5a{C\u00DA\r\u00B0\x1F\u0083\u009F\x02\u00F5O\u00D3D\u0090\u00B0\u00D7\u00EB \u00DC\bX$\u00A8\x01\u00C3W\u008F\n\u009E\u00C4&Q\u00BE\u00FA\u00A5\u00D1\x16f\u0081\u00F76\x07\u00DF{d\u00B4JdaU\u00AF\x05'\x1B\u0082\u00AF\bs>\u008C\u00E8\u00A8\x05\u00FE\u00F6\u00F7{\u0085\x1EJ\t\u009BZ\u00E1\u00EC\u00C1\u00A6\u00FCF&\u00CC \u00A0\x01\u00A5B\u009A\u00FAT\u00BA\"\u00E0\u00A4\u00C0P e1\u00E8\u00AA\n\x1E\x02w\u00C1Q\u0089\u00CDI(y\u00DA<`\u00DB:\u0098\u00DB\u00B4\u00AA\u00B7\u009CZ\u0090^\x03\u00E2v\u00C7\u00ED\u00B3\x01\x04\u00DE\x04\x0Fq\u00C5)\u00F0\u00B1\u00B0O\u00DB\u00E8\x10\x0E\u00D5\u009C4\u00FD_#\u0085\u00B9\x06\u0080X\u00E5\u00F5\x05\u00C1\u00FB\u00B4\u00EA\b\u00DA\u00CB\x16\x03\u00FF0\x00\x11\x0B\x02\u00C6\u00E7\u00BDM\f\u00B8fR\x7F5xI\u00CA\u00E4a\u008A\u00DA\u00F7\u008C\u00CF\u009Eo\x02\u00A0\u00C5\u00DA\u0081\u00F9\x18\u00FC\u00AEM\t\u00A4)\u00B5\u00E0\u00B4\r\u0094\x04\x00\u00E2\u00DC\u00E7h|\x15\u00BC\u00BB'\u00C1GjO\x13:S3\x00\u00E2\u00B13\u00CD\x06\u00B0\u00FAS\b\u00BE\u00BCG\u00C1\u00EB\u0092\x17m\u00C6(\u009C\u0089\x00pf\u00EE\u009EV+*{\x06\u0080\u00CBd@\u0082\x12\u00E4\u00A9\u00BE\u00A8\u00F0\u00D1\u00EA\u00CFM\u008A\u009Ee!\u0094\u00D9\u008AIy\u00B1\u00C1\u009ET\u00DB\u00D9q\u00C5\u00CF\x05\u0080\u008BT\u00A9\u00BB\u0094\u00B9-\u00E7\u0093X1\u00A1\u0080\u00ACo}q\u00E5/\u00E7(k\u00F7\x1A\u0080gA\u00AA\x1C$\x00\u009C\u00F9\u009E\x03\u00D4A\u0099>\x0E78)@\u00F3~\u00C3\u00F9\u00B2\u00CFa\u00EF=\u00B9\u00F0\u00A7=N\u00F9\u00EC\u00CD\u00DBe0\u00A5\u00E3h\u00E3.\x00Z\u00BD\u00A1\x1D\u00A8\u0098\u00DA\r\u00A9\u00D1\u00D4g\x01\u00DD\u00D1\u00E0\u00A6@\u00DA\x18\u00EBQ\x1A\u0084\x16F\u00DEr\u00C6k\u0084Z\u00EBv\x19ik\u00A5\b~[)\u0086\u00BB3\u00BF\u00C4-\u00C8\u00A1\x04\x00\u00D6\x04E\u00E3f\u00B8\u00C3\u00F0'\x02\u00D6.$\x00\u00A4}\u00D8\u0085:QNx\u0088m\u00DB\u00936\u008A\u00A7\u00D9?\t\x003\u00C6\x05=\u00C1\u00AEK^6\x12\u008C\u00EE\x13\t\x00\u009C}\u00FC\x16\u00A5\u00C1hG\u00B5 \u00D0\u00F2\u00BF\u00CD\u0098<\u00F9\x00`\u008Bc\u00E46\u00A6\u0081\u00BB\u00B2/\u00B0M\u00EB\x11\u00FD9\u00D3(\u00EB`\u00A6h\u00F0\u00A5\x0E\u00B1 \u00D8r-\u00E8\u00E1\u00EA\u00D30\u00D6\u00E1\u00D6\n)\x00\u009C\u0083\x05d\u0081\u00AA\x05\u00CD-u\x04\u00DC\u0084\u00EDj\x0B\u00C0i\x7Fr\x06P\x1ApVu\b \u00A8}\u00F8F\u00CE L\u00D5\u00ECA\u0095\u009FsJ=\u0082\u00FC\x0FM\x18\u00C0\u00AD\u00F0\u00D115\u00B6E\u00D2\x05y\u0081\x10_;>uRo\u00A6\u00B0k\u0085\x11\x00\u00C0\x02nn\u00E3\x03\u008D5\x10\u00EA\u008E`3\u0092\u00D9\u00EET\u00F0\x15\n\u009E\u00B3\r7\u0080\u00D5_\x18\x03 DP\x07a\x01^\u00A7\u00EFfa\u00C3\"\u00AA-\u00CB\u00F3\u00C6\u00E8-P\u00E6>D(\u00EDN\u0089\x00\x00\x0B\u0090\x01\x03\x01\bs\u00D5\x1E\u00E9\u00D5\u0095*=\u00C8BHw<^\u00D7O\u00991\u00DF\u00C7\x0E\x7F\x03\u00D6\u00E7\u00E6~\u00D24\u0098\u00C4\x02\u00D7\u00E1m\u0081\u0095\u0089\t\u0098>\u00BD\u00C2\u00E5\x1D\x06\u008E@ta|\u00AE\u00D15*\u00CEr\u00E3UU\u00E9\u0099\u00A3~\x07\u00B0\x148\x0E\u00AD\u00BA\u00EC\u00FDC|Y\u00E2\u00ECA\u00FCR\u00C6\u00C6=z\b\u00A8&\\\u0081\u00A5b\u0083\u0096J]\u0085m\x10\u00B8Gj\u00D33)\u0096\u00D2\u00D5O\x05@\x03\u00E1%C>\u00BF\u00AF4\u00A5\u0096\nV\u00ED.\u00A3\u009FS\u00D0&g\r\x18t]R\u00F8D\x00\x10\b(=\u00AD\u009C\x03\x02\b\x05\u00EA\u00E7c\x0B\u0097\x0Bi\u00E5\u008D\u00BBO\u0091\u00F9\u00D0\u00C1\x16\x04\u008F\t\u00BB2\x05/\u00DA\x11\"\u00FA6\u00F6bG(\u00D6)\u00F5\u00AC\u00C1\u008B\x00\u00D0\u00A4r\u009D\u00AB\u00B3\u00F3\x1A\u008Ap\u00A3\u00D3\u00A4\u00E0e\x06\u0080@\b\u00C1\u009B4\b-v\u00B0\u00EA]\u009B\x175\u00FE\u00CD\x10\u00800\x027\x11<&\u00B9\u00EE\u00D3\u00AA[\u00FF\u00F1d\u00E6\x1FM\x01\b]\x02\u00C2\u00B7\u00BC?0\u00A2\"W\x05\x0F\u00F2B\u00D7\u00DAo\u0086\u00A8S\x048&\u0093\u0082\u00BB\u00D2\x14 W\u00CC\u00A0?K\u00C6\u00D9\u00AC\u00B6\u0095\u00B75\u00B4m\u00B4\u00A8\u009B\u00AC\x1C\u00B1\u0087yP\u00FB\u00CB\u0098\u00F6_\u0080\x01\x00\x00M\x19K\u00A1:Pb\x00\x00\x00\x00IEND\u00AEB`\u0082"

var cpIcon32 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x06\x00\x00\x00szz\u00F4\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\u00B4IDATx\u00DA\u00C4WMn\u00D3@\x14\u00B6#V\u0088\u0085\u00D9 \u00D4\x05\u00CD\x16$D*\u00C1\u009AD\x1C\u00A0\u0089`\r\u00C9\u00B6Brr\x02\u00DB[64\x12\u0082e|\x00\u0090\u00C3\x01\x10\u00F6\t\u00DA\u008A\x03\u00D47\u00C0HU\x16]\u00D4|\u00AF~V\u00DD\u00E1\u008D\u00EDI\u00822\u00D2S\x14{f\u00BEo\u00BE\u00F77\u00B6\u00AC\x1D\x0F{[\x1B\u00E5G\u00EF}\u00FC\u00A4d\u00F6\u00E7O\u00F1.\b\u00E4\u0095\u00BF\x19l\t\u009B\u0083\u00CC\u00E9.\bTG\b\u009B\u0081H&\u00BD\u00EC\x18\u00A1,V]X\x1F66XEs\u00CFA\u00B0\u00B7\x1E\u0081\x02\u00D4\u0087\u009D\u00D3F\u00B0\u009F\u00F4T\u0098\u0099\u00D6\u00EC\u00E2\u00C0N@b\u00D8\u009E\u00C0b\u00E5\\\x03\x17\u00A0\x1E\u00AC\u00DB@u\x00\u00BB\x0F\u009B\u00C0tA\u00B8P\u0095\u00E8h\u00C0{|R\u00CF@j\"\u00FA\x1Bv\b\x0B`#\x0EFU\u0089\b$\x1C=\u0081\x1B\u00F0\u00DE\u009A\u00F18\u00E4\u00F5/Y\x15\u0095\x04)9\u0095\t\u0090\u00BF\u008B\u00C5\u008E\u00C6\u00C73\u00D8\u00815\u00B9\u00DB&{\b\u00C4\u00D5\u0090pK\x15T\x05\"\x01\u009C\x16\u00CF\u00F2\u00E7o\x07\u00B0}X\u0094\u00FFz\u0093\x1Bd\x00)2\x17\\1\u00BCM`\u00B1\u009A\n\u00B2\x138\x01;\u00EC\u00E3i\u008B`T\u0087\u00CB\u00B5@U\u00E1PU@\n8\x02w\r\u0083\u00D1\u00D2\u009Cv\u00A9<\u00EF\u00DF\x10(\n\u008B*}\x00\u00F0>\u00CB\u00B8\u00E9\u00A0\u0080L\x04b\u00D6\u009D\u00CA\u0084[\u00D2\u00FB{\x11\u00C9vb\x00\x12\u00D4\u00BCK\u00B96\x04r/(\u00AA\\\u00D5\u00B7!N\u009Fh*^\u00B1\u00F0\u00E9\u00D7\u00AD\u00F4\u0091N%7\u00AB#)\u0083\u00E4\x7F\u008F\u00D2\x05j\u00E9\u00A4\x16\u00FA\u00AC\u00A6\u00A4n\u0097\u0080\u00FD\u00E8(\u00F9'\u00FD\u00BE<<\u00C3\u00EF\u009F\u00DA&U\x1F\u00A0)\u00DC\x18\u00ABs\u00E0:_R\u00C0\x13\x14xW\u00A6\u008Af\u00C4\r\u00E9y\u00CC\u0091\u00AE\u00CE\u00F1\u00DBtC)mL\u00C7\x19\u00BBQ=\u0098\x18\u0084\u00B1\u00D0P\u00C2\r\u00C0\u00CB+\u00D9\u00B0-\u0081\u00EFj\u00C7\u00EA\u00BC\u00BE\u00E8o@b\x0E\u00FFK\u00C5-\u00D1\x11X\n\u009Bx\u00C1\u0093\u00CB@b\u00DD0N\x01\x1E\n\u00BE\u00CF$\u009Ck\x02\u00F9\u00AB0\x15N\u00DB\r\x1E_F 12 \x11\u00A3\u0082\u008E4]u\u008E\f\u00C8\u00EA\u00AEd\u0081\u00D0\u00B1zD\x02\u00EE\x18i\u00DEWK\u00ED\x04'\u009Fy{Q$t\u00D5\u0094\u00B3\u00A2\u00FEZn\u00FF\x18\u008F5\u00E57\u00E3\u009E\x1E^}\u00BBG\u00F9\u00DF\u00B5_|\u00889MI\u00F2\u008C\u00DB\u00EETw_\u00C4\u00E9\u00E3V\u00DF\x05 \u00E17\u00E47\u00B9#\u00BDzpA\u00B7\u00A3\u008F\\\u00C6\u00EB\u00AEo\x13\u0080\u0087F\x1F& 1\u00E5\u00CD\u00B5\x03\x04\x06|}\u00B3\u00D6\x05\u00D7\x16\"\x04\u00E51\u00DF\u00E5\u00D25\u00D3\u0090T:h\x02o\u00F5i\u00C6j\u00B8j\u00C7\u00D4(@\u0084\u00836\u00C0\u00C6\u00DF\u0086 \u00D2\u00E3\u00CA\u00B6Od*1\u0090r\u00D9\u008D\x01lZ3\u00AC\u00BF\x02\f\x00\u00D1\u00C1\u00F3\x07\u0099\u00D0\u009D&\x00\x00\x00\x00IEND\u00AEB`\u0082"

// Illustrator icon 64x64
var aiIcon64 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00@\x00\x00\x00@\b\x02\x00\x00\x00%\x0B\u00E6\u0089\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x02\u00C9IDATx\u00DA\u00ECZ=K\x03A\x105kL\x04\u0089(~\x14\u00DAh\u00A5\u00F6ba'Z\x07\u00FC\x03\x16V\x16vV\u00F9\x03\u00FA\x17l\rX\x07\u00AC\x15+-b\u00A7\u0085\u00A6\u00D2\u00C6\x14\u00A2(\x1A\u00FC\u0096\u00F8$\u00B0.\u00B3\u0097\u00BB\u00DD\u00CD\u00EE]\x0Ev\u008A\u0090\u0084\u00BD\u00BB}3o\u00DE\u00CCN\u0092in\u008D\u00F7\u00A4\u00D9XO\u00CA-\u00F5\x00\u00B2\u00FC\u00DD\u00DA\u00C1S\u008A\u00F6].\x0EQ\x00\u00D5\u00FA\u00A7\u00A7\u0090\x07\u00E0\x01x\x00\x1E\u0080\x07\u00E0\x01x\x00\u00A6\u00BDPR6\u0098\u00CF\u0094\x16\x0B\u00AB3\u00FDx\x7F\u00F5\u00F0]:~\u00BE\u00BC\u00FFNS\x04\u00F8\u00EEa\u00B3#\u00D9rq\x18\u0090b\u008D\u00C0\u00D9\u00FAX!G\x1F\tGVj\u00EF*\u0097\u00F3\u00DD\u00B7\f\u00B7Z\u009E\u00CA+^k'\x02\u00F2\u00EEa\x0B\x139\u00E3\x1BN\x16z\u00E3\u00A3\u00D0\u00DChp\fW\u00A6\u00F3\u008Aw\u00B8}\u00F9!\u00DF\x1C\u00DD|\u00C4\x07\u00A0\u009D\u00A7\x11\x16E\f;\u00A7\r\u00F1#\u00C8\u00A3\u0095\u00C4\u009D\u00E6\x00\u00F8\u00DA\x1E[\u00DF\u00E1u\u00B4/\u00B1fy\u00FF\x01\u008B\u00C1\x1C\u00F8^k\u00F7\u009D\x02\u0080\\\u00E0\u00C1\u00FC\u00E3\u00CBgS\u00CC\x07`\u00DB>i(\u00B2\u00A8R\u00FBI\u00A0\u0090\x11\u00F7\u00EF\u009D\u00BF\u0092\\l\u0097!\u00DDR\u00C8H\x02T\u00EB_\u00A8D\u00D0rqA$%\u0080\u0093\u00C8\u008E\u00D6\u00E9\u00BC#\x00$M\u00F1`\x10Z\x04\x00\u008D'a\tH\u00E2\u00A5A\u0091\u0087\x7F\u00E5l\u00F7.\x0E\n\u0081\x1E\"\u00E3\u00E1~\u00FE\u00FA\u00BF\u0095\u0091\u00AC\u0096\u00A8\u00C7\u009A\x03\u00A4\u0082\u00B6\u00E2.G\u009Fx\u00B7\u008B\x00\u00C8\t\x10X\u0086\u00D4+Z\u00AC\x00@\f\u0091\u00EB\x10P\u00EE{\u00C2\u00A2\u0090B\u0091$\x009}C4\u00C4i\x10\u0098)\x7F\u00FA\x02\u00F9\x03\u0083n\u0092\u00F6\u00C6i\x10\f\x01\u0090=\x11\u00AF\x13\x16u]\x04\u00C8\u0086\u00E0oR\u00AD\b\x1E\u00A8\u00AD\u00BB\u0092\u00CCl\u00B8\u00FF+\u00B2\x1F&\u009A\u009Bp+A\x12\x00\u008A\u00B49?@\u00D6\x187v\u00CE\x01\u0080\f\u00A4\u00B8\x02Od\u00B5j5<\u00F2\u00D9%\x01\n\x19K\u008A\u00A3Tf\u00B1\u00ED\u00C3\u0091\u0098\u00EA\x01\u00C0\tF,\u00C0\u00BA\u0099\u00A35/q\u0092\x03\u00B2\x17e\t\x12x\u00CFH\u00B6h\u00CDK\u009C\x00 \u00FC\u00C1\u00F1e\u00ED\u00E01\u00A4\u00DB\u00E3\u00BF%\u00F2\u00CB\u00AD\x03`\u009A4\u00C8\u0091\u00F3x\u00C8b\u00943\u0088\u00A9\u00ADa\u0091\x05\x00x<\u0099aE\x0Ep\u00E4\u0092l]\u008B\u0098\x0E\x7Fr\u00A4TE\u009Ew\u00E5\x10Y?\u00DF0\u00E3\fV9z\u00CB)n]LU\x01\u00C8\u00B3\x03\u0095\u00A1\x15J/\x12\u00DD\u00E9\u00AC\u0085\u0099\u00E9O\u00B8\u0080\u0086\x07\u00CAn\x10\u0098\x19\x7F\u00E0Z\u00C5\u00C6\u00E6\u00F0\u00DA\u00ED\x01M5\u009A\u0095\u00DA\u009B\u00E8KB\u008C\u00F0\b\u00EC\u009C6D\u00F9\"\u00DAZ\u00BEx\u00AD\u00D6\u00CDI\u0095\u00E1\u00FF\u00D8\u00D2\x1A'%nW\x1B\u00E3\u009D\u008EU\u00BA\u00C4<\x00\x0F\u00C0\x03\u00F0\x00<\x00\x0F \u00D5\u00F6\u00DF\u0084\u0094\u008B\u00C3\u00E9\x06\u00E0\u00FA\u00B7 O\u00A1`\u00FB\x15`\x00\x1A\u00A2\r.v\x18\u00D5\x12\x00\x00\x00\x00IEND\u00AEB`\u0082"

var aiIcon32 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x02\x00\x00\x00\u00FC\x18\u00ED\u00A3\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u0097IDATx\u00DAb\u00FC_,\u00C6@K\u00C0\u00C4@c\u00C0\x02\u00C4\u00EBo\u00FE\x00\"\u00AA\x1B\x1D\u00A8\u00CE\x01D \x0B\u009E~\u00FE{\u00EA\u00D9/\u00AA[`&\u00C5J\u008F \x1A\u00B5\u0080\u00E6\x16\u0098I\u00B1\u009DN\x12\u00BD\u0091!\x06L08\u0093)~\x00\u00D4\fe\u00BC\u00FD\x13\u00B0\u00FA\x1DfR\u00E1ec\x04'JN\u00ACi\u009D\u0089\u00A0\x03\u00E1l\ra\x16i^f4\x05\u00C0$\x0E\u00B3\u00FE79>pQdC\u00E5\u00B2/\u00BC\u00F4\rY\x04\u00E8j\u00A0\u00CFx\u00D9\u0098p\u00E5$\u00A2|\x004\x02\u00C2uV`GS\u00C0\u00C7\u00CE\b4\x1D\u00C8\u00C0\u00F4\x1Ca\x0B\u0080z\u0080\u00C1\x02d\u00EC\u00B9\u00FF\u00F3\u00D4\u00B3\u00DF\u0090\x10\x07\u009A\u0088\u00AC&N\u0097k\u0091\u009F\x00\x10\u00E1\u008Ad&\u00BC\u00E1\x03u/\u00D0tx\b`z\u0082\u00FCd\n)L\u00C0\x16\u00FC\u0082\u00F8\x00-\u00DA)\u00B5\x00\u00E2X\u0088\u00D1@;>\u00FF\u00FA\u008F\u00EC-J-\u0080\x1B\u00B4\u00F7\u00C1O\u00B8?\u0080$0\u00D5\u0093d\x07\x0B~\u00E7C\u008Au\b[\u009A\u0097\t\x1Et\u00C0h\u00A7\u00D4\x02x\x04@\x12\x12\u009A\u00DDmG\u00BFP\x14D\u009A\",\u00B8\u00D25$\u00F9\x02\x15P\u00E4\x03x\u00F8T\u00EE\u00FF\u0084\\\u00C2\u00B4;\u00F2A\u00D2;P\u00C1\u00F57\x7F\u00C8\u00F7\x01r\x0E@\x16\u0087\u00E7\x06\u00E2\u00E3\x19\u008B\x05\u00C0\u00BC\n\tw`A\x06/\u00CB\u00D0R\x14\u00D6\u0082\u008FX\x0B\u00E0\u00E1\x037\x0E\x0E>\u00FD\u00FC\x0F/\u0097\u00E0\u00A9\u0080\u00E48\x00\x06K\u00DC\u00A6\x0F\u00C8E12\u00C8\u00DE\u00F1\x11\u00E2v\u0088,0\u0086 \u00C1\u0088U1v\x0B0C\x06\u008F,~\u00C5\u00A3\u0095\u00FE\u00A0\u00B0\u0080\u0091\u00D6\u00CDw\u0080\x00\x03\x00\u00FEg\u00A5\u00DD\x05\n\u00C8\u00CA\x00\x00\x00\x00IEND\u00AEB`\u0082"

// Photoshop icon 64x64
var psIcon32 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00 \x00\x00\x00 \b\x02\x00\x00\x00\u00FC\x18\u00ED\u00A3\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x01\u00B1IDATx\u00DAbd\u00BA\u00FA\u009F\u0081\u0096\u0080\u0089\u0081\u00C6\u0080\x05B\u00FDsR\u00A2\u0089\u00F3\u00F7\u00DD\u00A3\u00B9\x0FF-\x184\u00A9\b\x190\u00BA\x073z\u0084 \u008B\u00FC\u00FF\u00F2\u0089\u00E1\u00C2\u0089\u00FF;\u00D72\x00\x19\u0094[\u00C0 !\u00C3\u00A0o\u008Eb%\x10[\u00BB2\u00C6\u00E7\u00FF+\u008Ab\u00B8s\u008DzA\u00F4\u00E2\t\u00C3\u00C5\u0093 \x12\x02x\u00F8\u0098\u00FA\u0096\x01I\u00AAY\x00\f\u0093\x7F\u0085\u0091\u00FF\u00A2\u00EC\u00FE\x03\x1D\x0E\t\x1C\x1E>`\x00\u00A2\x07\u00A9\u0081\x05\x10\u00E1\u00B2\u0098\u00A8H\u00FE\x0F\u008C\u0080\u00A9\u00CDP\u00E3l\u00DC\u00E0\x1Eb,\u00EF\x06\u00E6U\u00C6\u00BEe@\u00C4\u00B4\u00E9\x02\u00D3\u00AC-\u00C4\u00C5\x01V\u00F0\u00F2)\u00BA\u00D3\u009Ag\u00A2E\x15\u0083\u008A\x16\x05\x16p\u00F3\u00A2\u009B\x051\u00FD\u00CB\u00A7\u00FFk\u00E7C\u0092\x06\u00A3\u00B5+\u00B9\x16\x00C#>\x1F\x1A\\\u00E0T\u00C4\b\x0Bq`<\u00FD_8\x11\u00CA&6\u0099\"\u00C5\x1E\u00C2i\x10\x13a\u00EE\x05\u00E6\fF\u0088\u009A\u00E0D\u00A8 \u008E,\u00827\u0092\u00F5\u00CD\u0081\x0E\x07%\x1B\u00B8{\u0081Q\rI\u00B5@\x7F\u00C02\x04P\r\u00D3\u00B2C\u0098\u00A9\u008B\u0094\u00A2\x02\u00E8F`\u0092\x05\u00A6W`f\u0086\x01\u0094L\x07NQ@DZ\x10\u0081\u008C\x03\x061\u00D0\x14\u00AC\u00DE\u00FF\u00F2\u00E9_\u009A\x0F\u00A8\\\x01F\x0F0\u00F3\u0083\u00CB\x18\u0090\u00FA\x0B'H\u00C8\u00C9 \u00D5x\u00CB\x1F\u0090\u00CF\u00D2|\x10^AK\u00B8\u00E4\u0097\u00A6*Z\u00A0\u00E8\u0085\u00C7<\u00B0D!\u00A1\u00B0#\x02\x00\u0093)cv-\x10\u0081\n+`\x16\u0081g1\f\u009B\u00C8\u00B4\x009\u00A5!\x07\x17Z\x04\u00E0\u00B0\x00\x18\u00A0\x10\u0087\u00E0.\u0099A1?\u00B5\x19^.\u0081*\u008C#\u00BB\u0090\u00D3\x18\u00C2\u00AF\u0090\u0086\u00D7h\u00B3e\u00D4\x02\n\x00#\u00AD\u009B\u00EF\x00\x01\x06\x005\u0096\u00B4\u00F0\u00B3\n\x1E\u00F8\x00\x00\x00\x00IEND\u00AEB`\u0082"

var psIcon64 = "\u0089PNG\r\n\x1A\n\x00\x00\x00\rIHDR\x00\x00\x00@\x00\x00\x00@\b\x02\x00\x00\x00%\x0B\u00E6\u0089\x00\x00\x00\x19tEXtSoftware\x00Adobe ImageReadyq\u00C9e<\x00\x00\x03\x1DIDATx\u00DA\u00ECZ=l\u00D3@\x18\u00BD\u00B32FY\u00A9D'\u009A\u0085,\u00ED\u00D6JE\fH-\x0B[&\u00BAT]\u00CA\u00C0P\x15\u00A90u\u00A1,\x05\u00A9\x12\x03\bX*\u0096l\u00D9XJ\u00A5\x0E\u0088J\u00EDF\x07\u00D2%0\u00B5R\u00BB\u0086\u00B0\u00FAxW\x07\u00D7\u00BE\x1F\u00F7\x12\u00DB\u00B1O\u00BAS\"\u00E5\u00C7\u00B1\u00EF\u00DD\u00F7\u00BD\u00F7\u00BD\u00EF\x1C\u00EA\u00FDd\u00C4\u00E6\u00E1\x11\u00CB\u0087\u00F5\x00*\u00E1+\u00FF\u00C1\x1D\u009B\x16\u00FE\u00E0\u00B7K!\x07\u00C0\x01p\x00\x1C\x00\x07\u00C0\x01p\x002\u00F4B\t\u00836WH\u00B5\u0096tD\u00B7\u00C3~\u009D\u0092\u008B\u00B3\u00B2\x02x\u00BAy\u00F31x^\u009C\u00B1\u00BD6k\u00EF\u0092~\u00CF\u00CE\x14\u009A\u0098\u00A4\u00CBk^\u00EB\x1B}\u00D8\u00B4\u0099\x03\u00D5\x1A}\u00F1\x06\x0F\u00BBI\u008C p\u00E6\u0094\u0084\x03\u00E2\u00B8\u00CA\u00F5\u00EB\u00B7\u00F5\x06\u009D\u009E\u0095Y\x0E\u00E6\u00B0\u00C3\u00FD\u00BC\u0099=\x12\u0080\u00CBs\u00F6\u00F9m\u00F4\x03\u0086\u00B4i\u00AE\u0080\x00\"\u0086\u00E55\u00B6\u00BDQ>\x00\u00F2\u00E8\u00F78\u00A4~O\u00D0+:\u00BFp\u00F3\u009E\x07\x02\u00F8?z\u00AC\u00DB\x19V\u00C1*\x19.\x06\x04\u0094\u00EBO\u00BD\x11#\u00F4\u00CC\x1C\u00FBq\u00A4 \u00C9\u00CC\x1CA\u00D0\u00E6\x17D-\u00C6Z\u009C\x1C\u0093\u00F6\u00AE\u00F2W\u00F9\x02\u00E0\x18\u00F6\u00DA4\n\x00c\u00EA.\x11\u00A6R\u00ADy[\x1F\th\u00A3\x131\u00A0\u00AA\u00D6\u008A\x01@P\u008F\u00A5\t\u0089\u00B3\u00DFi\x11\x01\u00A4E^\u0088\x13=\u00BB\u00D9\u00E7\x10\u0081[\u00B7e~\u00C7\u00D2C.\x0E\u00D0\u00D9\u00CB\u00F3\u00C1k]^\u008D\x0F\x00\u00A8\u00A9O**\u00CD\u008F{\u00A7\u00B8\u00CEr\x02\u00DC[\u00A4\x13\u0093E\x00\u0080 J.\u0088+c\u00E4\x00\u00F1[\u00A9J\u00F0\u00DAw\u00B8\u00CF\n\u00E0@\u00BD\u00E1=\x7F\u00AD\u0098M\u00B2\u00AE\x1B\u00AFt\u008E\x00\u00A0\u00E8\u00A8_jm\u0081\u00B5\x16\u00D2]\u00B8\u00FC\u00CB\x0F)9=R\nM\u00CF\u0086{\u00ABI5\x01\u0099\x10\u00D7rT(*\u00C7\u00ED\u00D3\x17T\u00F1\u0091\u00BB\u0088\u00DCd\x14=\u009A\u00EC\u0082\x10\x01TY\u0095\u00B6\u00F2.B\u00B2R\u00C5\x0189\u00F6\u009F-)W\u00D4\x7F\u00B7\u00A5^i(l\x00C\u00D6\u00B1\u00B1\x02\u0080\u00D3\u00DE\u00DE\u00F0\u00D7\x1Fk\u00F3\u00A1\u00DB\u00D1a\x1B\u00F4t;\u00AD\u00A1\x1A\u0089Jf\u00F3Fn|\u00FF\u00CAe\u00C7 \u00BB\u00FC\u00D5G\x1EZ6M\u00D9\n,-\x13\x04@'!\u00E1M\u00BE\u0084;4\"e\u0091\u00DF\u00EF_\rx\u0089\u00B4\x1E\u00B5e\u00E1\u00F2\x05\u00E5\u00D5(\u00A9\u00BFt?\u00E1\u00CC\u00E9\u00EE\u00D0\u00FC\u00FD\x03y\t\x1Ei\x1A.\u00FC\x1C\u00B3\u00E4\\We\u0094a\"\x15\u00BF\u00B1\x057\u00C1\x17[R'jV\x1F\u00CA\u00B13\u00D7\u00EF\u00F9\u009BO\u00C4`\u009A\x19\u00BB\u00F1\x02@\u00BA\u00EBv\u00F8\u0090E\u00A1'-m?\x00\u00AB\u0087\u00BA\u00CB\r\u009F\f\x03\u009F\u00A0w\u008B\x17\u0093\"\u00EC\u00B4A\x10\u00F8\u00B6W\u00E0\u00F3B\u00A3\u008A*&\u00A1\u008A\u00D9\u00D8\x12\x01\u0088\u00FA\u00FExG/\u0093\u00DB\x1E\x12\u00AB68\u0088Y\x04\u00CA\b\u0080\u00B7i\u00B0LYZ\tHD\u00F2\u00FD\x01\u00F3u\x05\x07\u00AEvM\u00B4\x1E\x16\u00D6\u00DA\u00C4\u008F\fe%\u00F8U#\x05?\u008D}\u00B8\u00DE\u00D5\u0082\u00E6Da\x04n\u00CA\u00F8\u00B4\u00A1\u00950\x03P\u00BE\u00E1\u00FE\u00AD\u00E2\x008\x00\x0E\u0080\x03\u00E0\x008\x00\x0E@&}\u0085\u00FB\u00F3\u00B7\x03\u0090n\u00FC\x13`\x00\u00F2\x14>Qh\u00FA\u00DB\u0093\x00\x00\x00\x00IEND\u00AEB`\u0082"

var scriptAlertResult = false;

// Custom Dialog Alert + Icon
// https://community.adobe.com/t5/photoshop/script-alert-title-alert-box/m-p/11701555#M497514
function scriptAlert(alertTitle, alertString1, alertString2, okBtn, cancelBtn, okStr, cancelStr, iconType) {
    var alertWindow = new Window("dialog", undefined, undefined, {resizeable: false});
        alertWindow.text = alertTitle;
        alertWindow.alignment = ["right", "top"];
        // alertWindow.titleLayout = ['right', 'center'];
        // alertWindow.title = alertTitle; // Not working OSX
        alertWindow.preferredSize.width = 400;
        // alertWindow.preferredSize.height = 250;
        alertWindow.orientation = "column";
        alertWindow.alignChildren = ["fill", "top"];
        alertWindow.spacing = 0;
        alertWindow.margins = 20;
   
    var alertGrp = alertWindow.add("group");
        alertGrp.preferredSize.width = 400;
        alertGrp.orientation = "row";
        alertGrp.spacing = 20;
        alertGrp.margins = 0;
        alertGrp.alignChildren = ["left", "top"];
    
    var iconImg = alertGrp.add("image", undefined, iconType); //aiIcon64
        iconImg.image = iconType; //aiIcon64
        iconImg.spacing = 0; 
        // iconImg.size = [0,0,140, 140];       

    var alertText = alertGrp.add("group");
        alertText.preferredSize.width = 375;
        alertText.orientation = "column";
        alertText.alignChildren = ["fill", "top"];
        alertText.spacing = 0; 
        alertText.margins = 0;
        // alertText.alignment = ["left", "top"];
        // alertStringSize1 = alertText.add("statictext", undefined, alertString1, {properties: {name: "alertText", multiline: true}});
        alertStringSize1 = alertText.add("statictext", undefined, alertString1, {name: "alertText", multiline: true});
        // alertStringSize1.preferredSize.width = 240;
        alertStringSize1.preferredSize.height = 40;   
        // alertStringSize1.graphics.font = "dialog:13";
        // alertStringSize1.graphics.font = ScriptUI.newFont ("dialog", "Bold", 18);
        
        // Only show second string text if added
        if (alertString2 != false){
            alertStringSize2 = alertText.add("statictext", undefined, alertString2, {name: "alertText", multiline: true});
            alertStringSize2.preferredSize.height = 45;   
        }
        // alertStringSize2.graphics.font = "dialog:13";
        // alertStringSize1.graphics.size = 60;   
        // alertStringSize2.text = "dialog:13";

    var buttonGrp = alertWindow.add("group");
        buttonGrp.preferredSize.width = 400;
        buttonGrp.orientation = "row";
        buttonGrp.alignChildren = ["fill", "top"];
        buttonGrp.spacing = 10;
        buttonGrp.margins = [0,20,0,0]; //0; //


    if (cancelBtn) {
        var cancelButton = buttonGrp.add("button", undefined, undefined, {name: "cancelButton"});
            cancelButton.text = cancelStr;
            cancelButton.alignment = ["right", "top"];
            cancelButton.graphics.font = "dialog:13";

        cancelButton.onClick = function(){
            alertWindow.close();
        }
    }
    if (okBtn) {
        var okButton = buttonGrp.add("button", undefined, undefined, {name: "okButton"});
            okButton.text = okStr;
            okButton.alignment = ["right", "top"];
            okButton.graphics.font = "dialog:13";
            okButton.active = true;

        okButton.onClick = function(){
            scriptAlertResult = true;
            alertWindow.close();
        }
    }
    alertWindow.show();
}

