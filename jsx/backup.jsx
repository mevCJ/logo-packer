/*jslint vars: true, plusplus: true, devel: true, nomen: true, regexp: true, indent: 4, maxerr: 50 */
/*global $, Folder*/

function generateLogoVariation(logotype) {
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

	app.activeDocument.artboards[initArtboardsLength - 1].name = logotype + '_color'

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
		app.activeDocument.artboards[initArtboardsLength + i].name = logotype + '_' + artboardsName[i]

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

	// Export dialog
	var dlg = new Window('dialog', 'Export Artboards',undefined,{independent: true});
	var dir = ''

	// PANEL to hold options
	var msgPnl = dlg.add('panel', undefined, 'Export Artboards and/or Layers');
	var btnPnl = dlg.add('group', undefined, '');

	var dirGrp = msgPnl.add( 'group', undefined, '') ;
	var dirEt = dirGrp.add('edittext', undefined, dir); 
	dirEt.size = [ 300,20 ];

	var chooseBtn = dirGrp.add('button', undefined, 'Choose ...' );
	chooseBtn.onClick = function() { dirEt.text = Folder.selectDialog(); }

	var progBar = msgPnl.add( 'progressbar', undefined, 0, 100 );
	progBar.size = [400,10]

	btnPnl.cancelBtn = btnPnl.add('button', undefined, 'Cancel', { name: 'cancel' });
	btnPnl.cancelBtn.onClick = function () { dlg.close() };
	btnPnl.okBtn = btnPnl.add('button', undefined, 'Export', {name:'ok'});
	btnPnl.okBtn.onClick = function() {  exportMain() };

	dlg.show();

	function exportMain (){
		if (app.documents.length > 0) {
			var artboardsNum = app.activeDocument.artboards.length;
			var artboardName = '';
			var document = app.activeDocument;
			var afile = document.fullName;
			var options = {};
			var destFile = '';
			dir = dirEt.text;

			var filename = new File(dirEt.text + '/' + document.name.split('.')[0]);
			options = new IllustratorSaveOptions();
			document.saveAs(filename,options);

			// Window.alert("Please wait until the success message is shown. This may take a few minutes...");

			for (var i = 0; i < artboardsNum; i++) {
				app.activeDocument.artboards.setActiveArtboardIndex(i);
				artboardName = app.activeDocument.artboards[i].name;
				main(artboardName, i);
				dlg.progBar.value = i / artboardsNum * 100;
			}

			//save pdf
			options = new PDFSaveOptions();
			options.compatibility = PDFCompatibility.ACROBAT5;
			options.generateThumbnails = true;
            options.preserveEditability = true;
            options.artboardRage = '0-3'; //ignore white artboard

			destFile = new File(afile.parent.fsName + '/' + document.name.split('.')[0] + ".pdf");
			document.saveAs(destFile, options)

			reopenDocument(document, afile);
			document = app.activeDocument;

			//save epf
			options = new EPSSaveOptions();
			options.embedLinkedFiles = true;
			options.includeDocumentThumbnails = true;
			options.saveMultipleArtboards = false;

			destFile = new File(afile.parent.fsName + '/' + document.name.split('.')[0] + ".epf");
			document.saveAs(destFile, options)

			reopenDocument(document, afile);

			Window.alert("Images have been exported!");

		} else {
			Window.alert("Cancelled export.");
		}
	}

	function main(artboardName, curloop) {
		// var sizes = [1024, 512, 300, 256, 150, 100, 64, 50, 32, 16];
		var sizes = [1024, 256, 64, 32, 16];
		var document = app.activeDocument;
		var afile = document.fullName;
		var filename = artboardName;

		var svgFolder = new Folder(afile.parent.fsName + "/SVG");
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
			var options = new ExportOptionsSVG();
			options.cssProperties = SVGCSSPropertyLocation.PRESENTATIONATTRIBUTES;
			options.documentEncoding = SVGDocumentEncoding.UTF8;
			options.fontType = SVGFontType.OUTLINEFONT;
			options.fontSubsetting = SVGFontSubsetting.None;
			options.preserveEditability = true;
			options.embedRasterImages = true;

			file = new File(svgFolder.fsName + '/' + filename + ".svg");

			document.exportFile(file, ExportType.SVG, options);
		}

		if (pngFolder != null) {
			var options = new ExportOptionsPNG24();
			options.antiAliasing = false;
			options.transparency = true;
			options.artBoardClipping = true;

			for (var i = 0; i < sizes.length; i++) {
				size = sizes[i];

				file = new File(pngFolder.fsName + '/' + filename + "-" + size + "px.png");

				var scale = size / document.height;

				if (scale <= 7.76) {
					options.verticalScale = 100 * scale;
					options.horizontalScale = 100 * scale;

					document.exportFile(file, ExportType.PNG24, options);
				} else {
					Window.alert("Cannot scale to required size. Artboard too small.");
					reopenDocument(document, afile);
					return;
				}
			}
		}

        //ignore white image
		if (jpgFolder != null && curloop != 3) {
			var options = new ExportOptionsJPEG();
			options.antiAliasing = false;
			options.qualitySetting = 100;
			options.optimization = true;
			options.artBoardClipping = true;

			for (var i = 0; i < sizes.length; i++) {
				size = sizes[i];

				file = new File(jpgFolder.fsName + '/' + filename + "-" + size + "px.jpg");

				var scale = size / document.height;

				if (scale <= 7.76) {
					options.verticalScale = 100 * scale;
					options.horizontalScale = 100 * scale;

					document.exportFile(file, ExportType.JPEG, options);
				} else {
					Window.alert("Cannot scale to required size. Artboard too small.");
					reopenDocument(document, afile);
					return;
				}
			}
		}

		reopenDocument(document, afile);
	}

	function reopenDocument(document, afile) {
		document.close(SaveOptions.DONOTSAVECHANGES);
		app.open(afile);
	}
}