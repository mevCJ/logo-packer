/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/
// #include "Logger.jsxinc";
var LOGO_INFO = "LOGO_INFO";

var destDir = '';
var dialogFolder;
var setDest;
// var forMats = [];
var run = false;

function generateLogoVariation(clientName, logotype, mediaType, sepaRator, forMats) {
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
        separator = separator == 'dash' ? '-' : '_';
        // var addDocName = 'logo_var.ai';
        var addDocName = clientName;
        var selDoc; /* use Dropzone or selection */
        var hasDoc = false;
        var initArtboardsLength = 1;
        // colors variation
        var black = new RGBColor(0, 0, 0);
        var white = new RGBColor();
        white.blue = 255;
        white.red = 255;
        white.green = 255;
        var colors = ['grayscale', black, white];
        var artboardsName = ['grayscale', 'black', 'white']
        var mediatype = mediaType == 'Print' ? 'cmyk' : 'rgb';
        // var mediaTypeFolder = mediaType;

        app.copy()
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
        } else {
            app.documents.getByName(addDocName).activate();
            app.activeDocument.artboards.add([0, 0, 288, -480.503974801259]);
            initArtboardsLength = app.activeDocument.artboards.length;
        }

        // // Set new doc as Active working
        // var docRef = app.activeDocument;

        // Set to artboard ruler
        // https://ai-scripting.docsforadobe.dev/jsobjref/scripting-constants/?highlight=CoordinateSystem
        // app.activeDocument.coordinateSystem = CoordinateSystem.ARTBOARDCOORDINATESYSTEM;
        app.activeDocument.coordinateSystem = CoordinateSystem.DOCUMENTCOORDINATESYSTEM;
        app.activeDocument.rulerOrigin = [0, 0];
        app.activeDocument.pageOrigin = [0, 0];

        app.activeDocument.artboards[initArtboardsLength - 1].name = logotype + separator + 'fullcolor' + separator + mediatype

        //paste and group
        app.paste();
        app.executeMenuCommand('group');


        if (hasDoc) {
            var prevArtboard = app.activeDocument.artboards[initArtboardsLength - 5]
            var initialObjHeight = Math.abs(prevArtboard.artboardRect[1] - prevArtboard.artboardRect[3]);

            //move copied items to previouse item's position
            app.executeMenuCommand('selectall')

            var xDif = app.selection[0].position[0] - app.selection[1].position[0]
            var yDif = app.selection[0].position[1] - app.selection[1].position[1]

            app.selection[0].translate(-xDif, -yDif - initialObjHeight - 100)

            //select the copied items
            app.activeDocument.artboards.setActiveArtboardIndex(initArtboardsLength - 1);
            for (var j = 0; j < app.activeDocument.artboards.length; j++) {
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
                app.activeDocument.fitArtboardToSelectedArt(curFirstBoard);

            //duplicate artboard
            mainArtboard = app.activeDocument.artboards[curFirstBoard];

            // Artboard L T R B = 0 1 2 3
            var abL = mainArtboard.artboardRect[0];
            var abT = mainArtboard.artboardRect[1];
            var abR = mainArtboard.artboardRect[2];
            var abB = mainArtboard.artboardRect[3];
            // alert(abT+" "+abL+' '+abR+' '+abB)

            app.activeDocument.artboards.add([abR + 100, abT, abR + 100 + (abR - abL), abB]);
            app.activeDocument.artboards[initArtboardsLength + i].name = logotype + separator + artboardsName[i] + separator + mediatype

            firstObj.duplicate();
            firstObj.translate(firstObj.width + 100, 0);

            // Add logo info
            // addLogoInfo(app.activeDocument, artboardsName[i], posX);

            fillColor(firstObj, colors[i]);

            //select the latest object
            app.activeDocument.artboards.setActiveArtboardIndex(app.activeDocument.artboards.length - 1);
            app.activeDocument.selectObjectsOnActiveArtboard();
        }

        // Add logo info
        app.activeDocument.artboards.setActiveArtboardIndex(0);
        app.activeDocument.selectObjectsOnActiveArtboard();

        // Add logo info: Logo type & Media type
        var ab = app.activeDocument.artboards[app.activeDocument.artboards.length - 4];
        posX = ab.artboardRect[0]; // Left
        posY = ab.artboardRect[1]; // Top
        addLogoInfo(app.activeDocument, logotype, posX - 15, posY - 8, 'right');
        addLogoInfo(app.activeDocument, "fullcolor", posX, posY + 20, 'left');
        // Loop of 3 needs work if users adds custom variations like single color or different colored versions
        // Variations like full-color + white text and full-color with black text are very common
        for (var i = 0; i < 3; i++) {
            var ab = app.activeDocument.artboards[(initArtboardsLength + i)];
            posX = ab.artboardRect[0]; // Left
            posY = ab.artboardRect[1]; // Top
            addLogoInfo(app.activeDocument, artboardsName[i], posX, posY + 20, 'left');
        }
        // Deselect all
        app.selection = null;
        // exportFiles(mediaTypeFolder, mediatype)
        run = true;
    }
    // alert(run)
    return run
}

//change object colors
function fillColor(obj, color) {
    app.activeDocument.layers[0].hasSelectedArtwork = false;
    app.activeDocument.artboards.setActiveArtboardIndex(app.activeDocument.artboards.length - 1);
    app.executeMenuCommand('selectallinartboard');

    if (color == 'grayscale') {
        app.executeMenuCommand('Colors7');
        return;
    }
    var aDoc = app.activeDocument;
    aDoc.defaultFillColor = color;
    app.executeMenuCommand("Find Fill Color menu item");
}

// function exportFiles(mediaTypeFolder, mediatype) {
function exportFiles(mediaType, forMats) {
    var run = false;
    var cancel = false;
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
        // var app.activeDocument = app.activeDocument;
        var artboardsNum = app.activeDocument.artboards.length;
        var artboardName = '';
        var afile = app.activeDocument.fullName;
        var options = {};
        var destFile = '';

        var mediaType = mediaType;
        var mediatype = mediaType == 'Print' ? 'cmyk' : 'rgb';
        // var mediaTypeFolder = mediaType;
        // alert(mediaTypeFolder)

        // setDest = new Folder(destDir + '/' + mediaTypeFolder);
        destPath = new Folder(setDest + '/' + mediaType);
        // alert(destPath)
        // alert(destPath.exists)
        if (!destPath.exists) {
            destPath.create();
        }

        // var filename = new File(destPath + '/' + app.activeDocument.name);
        // app.activeDocument.saveAs(filename);

        // Export file formats
        exportFormats(destPath, mediatype);

        // //save pdf
        // options = new PDFSaveOptions();
        // options.compatibility = PDFCompatibility.ACROBAT5;
        // options.generateThumbnails = true;
        // options.preserveEditability = true;

        // destFile = new File(destPath + '/' + app.activeDocument.name.split('.')[0] + ".pdf");
        // app.activeDocument.saveAs(destFile, options)

        // alert("EPS step")
        // reopenDocument(document, afile);
        // alert("EPS step")

        //save eps
        // options = new EPSSaveOptions();
        // // alert(options)
        // options.embedLinkedFiles = true;
        // options.includeDocumentThumbnails = true;
        // options.saveMultipleArtboards = false;
        // options.cmykPostScript = true;
        // options.compatibility = EPSCompatibility.ILLUSTRATOR1719;

        // destFile = new File(destDir + '/' + app.activeDocument.name.split('.')[0] + ".eps");
        // app.activeDocument.saveAs(destFile, options)

        // reopenDocument(document, afile);

        run = true
        return run
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

    function exportFormats(destPath, mediatype) {
        var ai = forMats.indexOf("ai")
        var pdf = forMats.indexOf("pdf");
        var svg = forMats.indexOf("svg");
        var jpg = forMats.indexOf("jpg");
        var png = forMats.indexOf("png");
        var scaleArtwork = null;
        // alert(forMats)
        // alert("AI " + ai);
        // alert("PDF " + pdf);
        // alert("SVG " + svg);
        // alert("JPG " + jpg);
        // alert("PNG " + png);

        // var app.activeDocument = app.activeDocument;
        var afile = app.activeDocument.fullName;
        var fileNamePrefix = app.activeDocument.name.split('.')[0] + "_";
        // alert(fileNamePrefix)
        var whatToExport = new ExportForScreensItemToExport();
        whatToExport.assets = [];

        // whatToExport.artboards = '1-' + app.activeDocument.artboards.length;

        // Only export if we have art on artboard
        var expArtboards = [];
        for (var i = 0; i < app.activeDocument.artboards.length; i++) {
            app.activeDocument.selection = null;
            app.activeDocument.artboards.setActiveArtboardIndex(i);
            app.activeDocument.selectObjectsOnActiveArtboard();
            // selItem = activeDocument.selection[i];
			// // 	//get top and left width and height values
			// // 	center_point = [item.top-(item.height/
            // alert((selItem.height <= 69)||(selItem.width <= 69))
            // if((selItem.height <= 69)||(selItem.width <= 69)){
            //     scaleArtwork = confirm("This logo variant needs to be scaled for JPG export",true,"Logo variation for export")
            // } 
                
            if (app.activeDocument.selection.length === 0) {
                // alert('AB '+i+' empty')
            } else {
                // alert('AB '+i+' has art')
                // alert(i % 4)
                // alert(i % 4 !== 0)
                // if (i % 4 !== 0) {
                // alert(app.activeDocument.artboards[i].name)
                // expArtboards += i;
                // alert(typeof i)
                expArtboards = expArtboards + (i + 1).toString();
                if (i !== app.activeDocument.artboards.length - 1)
                    expArtboards += ','
                // }
            }
        }

        // Fix if not last artboard string traling comma
        whatToExport.artboards = expArtboards.toString();
        // whatToExport.artboards = '1,2,4';

        // alert(expArtboards)
        // alert(expArtboards.length)
        // var split = expArtboards.length
        // for(i=0;1<i <= (expArtboards.length*2);i++){
        //     alert(expArtboards[i])
        // } 
        // alert("DO we have comma " + (whatToExport.artboards.split(',')[split] == ','))
        // alert(whatToExport.artboards.split(',')[split])
        // Sizes
        // var sizes = [1024, 512, 300, 256, 150, 100, 64, 50, 32, 16];
        var sizes = [1024, 256, 64, 32, 16];
        var targetResolutions = [1000]; /* [1000, 500]; */
        var baseFileSize = app.activeDocument.width;
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
                options.artboardRange = expArtboards;
                // options.artboards = whatToExport;
                // options.artboards = '1-2,4';
                // whatToExport.artboards = '1-2,4';
                // whatToExport.artboardRange = 1+','+2+','+4; // doesnt work?

                // var newArtboards = ''
                // whatToExport.artboards = getArtboards(document,newArtboards);

                ///////////////////////////////
                // FIND METHOD SAVING AB ai format
                app.activeDocument.saveAs(aiFolder, options, whatToExport);
                // var saveFile = File(aiFolder + "/" + app.activeDocument.name + ".ai");
                // Remove multiartboard ai file
                // https://stackoverflow.com/questions/44625594/remove-is-not-a-function-error-in-photoshop-cc-2017-extendscript-tool-kit
                var docPath = new Folder(app.activeDocument.path);
                var saveFile = new File(docPath + "/" + app.activeDocument.name);
                if (afile.exists) {
                    saveFile.remove();
                }
            }
        }

        if (pdf !== -1) {
            if (pdfFolder != null) {
                var options = new ExportForScreensPDFOptions();
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
                var pdfProfileAI = "[PDF/X-4:2008]";
                // checkPresets( true, pdfProfileAI );


                // var options = new PDFSaveOptions();
                // var options = new ExportForScreensOptionsPDF();
                // Setting PDFSaveOptions properties. Please see the JavaScript Reference
                // for a description of these properties.
                // Add more properties here if you like
                // options.compatibility = PDFCompatibility.ACROBAT5;
                // options.generateThumbnails = true;
                // options.preserveEditability = false;
                // options.compatibility = PDFCompatibility.ACROBAT8;
                // options.layers = false;
                // options.spotColors = true;
                // options.embedColorProfile = true;
                // options.colorProfileID = ColorProfile.INCLUDEDESTPROFILE;
                // options.colorConversionID = ColorConversion.COLORCONVERSIONTODEST; 
                // options.colorDestinationID = ColorDestination.COLORDESTINATIONWORKINGCMYK;
                // options.pDFPreset = "[High Quality Print]";
                // options.preserveEditability = true; //false
                // options.saveMultipleArtboards = false; //false

                // options.acrobatLayers = true;
                // options.colorBars = true;
                // options.colorCompression = CompressionQuality.AUTOMATICJPEGHIGH;
                // options.compressArt = true; //default
                // options.embedICCProfile = true;
                // options.enablePlainText = true;
                // options.generateThumbnails = true; // default
                // options.optimization = true;
                // options.pageInformation = true;

                // var newArtboards = ''
                // whatToExport.artboards = getArtboards(document,newArtboards);
                app.activeDocument.exportForScreens(pdfFolder, ExportForScreensType.SE_PDF, options, whatToExport, fileNamePrefix);
                // for (var i = 0; i <= app.activeDocument.artboards.length; i++) {
                //     if (i % 4 !== 0) {
                //         newArtboards += i;
                //         if (i !== app.activeDocument.artboards.length - 1)
                //             whatToExport.artboardRange = (i + 1).toString();
                //             // app.activeDocument.saveAs(pdfFolder, options, whatToExport, fileNamePrefix);
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
            // https://community.adobe.com/t5/illustrator/what-s-new-in-illustrator-scripting-cc2018/td-p/9422236/page/2?page=1
            // options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
            options.scaleType = ExportForScreensScaleType.SCALEBYWIDTH;
            // options.scaleType = ExportForScreensScaleType.SCALEBYHEIGHT;
            // options.scaleType = ExportForScreensScaleType.SCALEBYFACTOR;

            // scaletype causes issues with small docs
            // alert(expResolution)
            options.scaleTypeValue = 1000;
            // options.scaleTypeValue = expResolution;
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
        var presetLog = new File('C:/Users/romboutversluijs/Desktop/Export/presets.log');
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

function addLogoInfo(docRef, layerName, posX, posY, justDir) {
    // find existing layers or add new one
    var x = convertToPoints(posX);
    var y = convertToPoints(posY);
    try {
        var lyrLogoInfo = docRef.layers.getByName(LOGO_INFO);
        lyrLogoInfo.locked = false;
    } catch (e) {
        // alert(e+" Adding layer LOGOINFO")
        var lyrLogoInfo = docRef.layers.add();
        lyrLogoInfo.name = LOGO_INFO;
        lyrLogoInfo.printable = false;
        lyrLogoInfo.locked = false;
        // logoInfo.template = true;
    }
    var logoInfo = lyrLogoInfo.textFrames.add();
    // redraw();
    // count = lyrLogoInfo.textFrames.length - 1;
    // alert(count)
    // logInfoTxt = lyrLogoInfo.textFrames[count];
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
function scanSubFolders(setDest) {
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
                if (procFiles[i].fullName.search(setDest) != -1) {
                    allFiles.push(procFiles[i]); // otherwise only those that match mask
                }
            } else if (procFiles[i] instanceof Folder) {
                sFolders.push(procFiles[i]); // store the subfolder
                scanSubFolders(procFiles[i], setDest); // search the subfolder
            }
        }
    }
    return [allFiles, sFolders];
}

function setDestFolder() {
    run = false;
    setDest = [];
    setDest = Folder.selectDialog();
    if (setDest) {
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
    // var destFiles = dialogFolder.getFiles(/\.(ai|pdf|svg|jpg|png)$/i);
    // alert(delFiles[0])
    // We need to delete files first before fodler can be deleted
    if (setDest.exists) {
        // https://extendscript.docsforadobe.dev/user-interface-tools/window-class.html?highlight=confirm
        var clearFolder = confirm("Do you really want to clear all content of folder " + setDest + "?", true, "Clear Project Folder"); //Window.confirm(message[,noAsDflt ,title ]);
        if (clearFolder) {
            var delFiles = scanSubFolders(setDest);
            for (var f = 0; f < delFiles[1].length; f++) {
                for (var m = 0; m < delFiles[0].length; m++) {
                    delFiles[0][m].remove()
                }
                // delFiles[1][f].remove()
            }
            var delFolders = scanSubFolders(setDest);
            var folders = delFolders[1].length;
            for (var l = folders; l > 1; l--) {
                delFolders[1][l - 1].remove()
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
    setDest = Folder(setDest);
    if (setDest.exists) {
        //https://extendscript.docsforadobe.dev/file-system-access/folder-object.html?highlight=open%20folder
        setDest.execute();
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