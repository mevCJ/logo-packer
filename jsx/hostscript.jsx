/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

function generateLogoVariation(label) {
	var addDocName = 'logo_var.ai';

	var hasDoc = false;
	var initArtboardsLength = 1;

	//colors variation
	var black = new RGBColor(0, 0, 0);
	var white = new RGBColor();
	white.blue = 255;
	white.red = 255;
	white.green = 255;
	var colors = ['grayscale', black, white];
	var artboardsName = ['grayscale', 'black', 'white']

	app.copy();
	//using for because null in getByName return error
	for (var i = 0; i < app.documents.length; i++) {
		if (app.documents[i].name == addDocName)
			hasDoc = true;
	}

	//create if doesn't exist
	if (!hasDoc) {
		var docPreset = new DocumentPreset();
		docPreset.title = addDocName;
		app.documents.addDocument("", docPreset);
	} else {
		app.documents.getByName(addDocName).activate();
		app.activeDocument.artboards.add([0, 0, 288, -480.503974801259]);
		initArtboardsLength = app.activeDocument.artboards.length;
	}

	app.activeDocument.artboards[initArtboardsLength - 1].name = label + '_color'

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

	for (var i = 0; i < colors.length; i++) {
		var firstObj = app.selection[0];

		var curFirstBoard = hasDoc ? (initArtboardsLength - 1 + i) : i;
		var mainArtboard;

		if (i == 0)
			app.activeDocument.fitArtboardToSelectedArt(curFirstBoard);

		//duplicate artboard
		mainArtboard = app.activeDocument.artboards[curFirstBoard];

		var x1 = mainArtboard.artboardRect[0];
		var y1 = mainArtboard.artboardRect[1];
		var x2 = mainArtboard.artboardRect[2];
		var y2 = mainArtboard.artboardRect[3];

		app.activeDocument.artboards.add([x2 + 100, y1, x2 + 100 + (x2 - x1), y2]);
		app.activeDocument.artboards[initArtboardsLength + i].name = label + '_' + artboardsName[i]

		firstObj.duplicate();
		firstObj.translate(firstObj.width + 100, 0);

		fillColor(firstObj, colors[i]);

		//select the latest object
		app.activeDocument.artboards.setActiveArtboardIndex(app.activeDocument.artboards.length - 1);
		app.activeDocument.selectObjectsOnActiveArtboard();
	}

	alert('Completed! You may now select other component');
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

function exportFiles() {
	var cancel = false;
	var dlg = new Window('dialog', 'Export Artboards', undefined, { independent: true });
	var dir = ''

	// PANEL to hold options
	var msgPnl = dlg.add('panel', undefined, 'Select your folder');
	var btnPnl = dlg.add('group', undefined, '');

	var dirGrp = msgPnl.add('group', undefined, '');
	var dirEt = dirGrp.add('edittext', undefined, dir);
	dirEt.size = [300, 20];

	var chooseBtn = dirGrp.add('button', undefined, 'Choose ...');
	chooseBtn.onClick = function () { dirEt.text = Folder.selectDialog(); }

	btnPnl.okBtn = btnPnl.add('button', undefined, 'Ok', { name: 'ok' });
	btnPnl.okBtn.onClick = function () { dir = dirEt.text; dlg.close(); };
	btnPnl.cancelBtn = btnPnl.add('button', undefined, 'Cancel', { name: 'cancel' });
	btnPnl.cancelBtn.onClick = function () { cancel = true; dlg.close(); };

	dlg.show();

	if (app.documents.length > 0 && !cancel) {
		var artboardsNum = app.activeDocument.artboards.length;
		var artboardName = '';
		var document = app.activeDocument;
		var afile = document.fullName;
		var options = {};
		var destFile = '';


		var filename = new File(dir + '/' + document.name);
		document.saveAs(filename);


		Window.alert("Please wait until the success message is shown. This may take a few minutes...");

		main();


		document = app.activeDocument;
		//save pdf
		options = new PDFSaveOptions();
		options.compatibility = PDFCompatibility.ACROBAT5;
		options.generateThumbnails = true;
		options.preserveEditability = true;

		destFile = new File(dir + '/' + document.name.split('.')[0] + ".pdf");
		document.saveAs(destFile, options)

		reopenDocument(document, afile);
		document = app.activeDocument;

		//save epf
		options = new EPSSaveOptions();
		options.embedLinkedFiles = true;
		options.includeDocumentThumbnails = true;
		options.saveMultipleArtboards = false;

		destFile = new File(dir + '/' + document.name.split('.')[0] + ".epf");
		document.saveAs(destFile, options)

		reopenDocument(document, afile);

		Window.alert("Images have been exported!");

	} else {
		Window.alert("Cancelled export.");
	}


	function main() {
		// var sizes = [1024, 512, 300, 256, 150, 100, 64, 50, 32, 16];
		var sizes = [1024, 256, 64, 32, 16];
		var document = app.activeDocument;
		var afile = document.fullName;
		var whatToExport = new ExportForScreensItemToExport();
		whatToExport.assets = [];
		whatToExport.artboards = '1-' + document.artboards.length;

		var svgFolder = new Folder(afile.parent.fsName);
		if (!svgFolder.exists) {
			svgFolder.create();
		}

		var pngFolder = new Folder(afile.parent.fsName + "/PNG");
		if (!pngFolder.exists) {
			pngFolder.create();
		}

		var jpgFolder = new Folder(afile.parent.fsName + "/JPG");
		if (!jpgFolder.exists) {
			jpgFolder.create();
		}

		var size, file;

		if (svgFolder != null) {
			var options = new ExportForScreensOptionsWebOptimizedSVG();
			options.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
			options.fontType = SVGFontType.OUTLINEFONT;

			document.exportForScreens(svgFolder, ExportForScreensType.SE_SVG, options, whatToExport);
		}

		if (pngFolder != null) {
			var options = new ExportForScreensOptionsPNG24();
			options.antiAliasing = AntiAliasingMethod.ARTOPTIMIZED;
			options.transparency = true;
			options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
			options.scaleTypeValue = 300;

			document.exportForScreens(pngFolder, ExportForScreensType.SE_PNG24, options, whatToExport);
		}

		//ignore white object
		if (jpgFolder != null) {
			var options = new ExportForScreensOptionsJPEG();
			options.antiAliasing = AntiAliasingMethod.ARTOPTIMIZED;
			options.scaleType = ExportForScreensScaleType.SCALEBYRESOLUTION;
			options.scaleTypeValue = 300;

			var newArtboards = ''

			for (var i = 0; i <= document.artboards.length; i++) {
				if (i % 4 !== 0) {
					newArtboards += i;
					if (i !== document.artboards.length-1)
						newArtboards += ', '
				}
			}

			whatToExport.artboards = newArtboards;

			// file = new File(jpgFolder.fsName + '/' + filename + "-" + size + "px.jpg");
			document.exportForScreens(jpgFolder, ExportForScreensType.SE_JPEG100, options, whatToExport);
		}

		// reopenDocument(document, afile);
	}

	function reopenDocument(document, afile) {
		document.close(SaveOptions.DONOTSAVECHANGES);
		app.open(afile);
	}
}