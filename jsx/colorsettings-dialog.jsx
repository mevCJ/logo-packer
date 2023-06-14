/*
Code for Import https://scriptui.joonas.me — (Triple click to select): 
{"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":"colorSettingsExport","windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Color Settings","preferredSize":[500,0],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-4":{"id":4,"type":"VerticalTabbedPanel","parentId":0,"style":{"enabled":true,"varName":"mainPanel","preferredSize":[0,0],"tabNavWidth":75,"margins":0,"alignment":null,"selection":6}},"item-6":{"id":6,"type":"Tab","parentId":4,"style":{"enabled":true,"varName":"optionsTab","text":"Options","orientation":"column","spacing":10,"alignChildren":["left","top"]}},"item-9":{"id":9,"type":"Group","parentId":0,"style":{"enabled":true,"varName":"dialogBtns","preferredSize":[480,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["right","center"],"alignment":null}},"item-10":{"id":10,"type":"Button","parentId":9,"style":{"enabled":true,"varName":"cancel","text":"Cancel","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-11":{"id":11,"type":"Button","parentId":9,"style":{"enabled":true,"varName":"ok","text":"Ok","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-12":{"id":12,"type":"Panel","parentId":6,"style":{"enabled":true,"varName":"optionsPanel","creationProps":{"borderStyle":"etched","su1PanelCoordinates":false},"text":"Options","preferredSize":[390,0],"margins":10,"orientation":"column","spacing":10,"alignChildren":["left","top"],"alignment":null}},"item-51":{"id":51,"type":"Group","parentId":12,"style":{"enabled":true,"varName":"versionAIGroup","preferredSize":[55,0],"margins":0,"orientation":"row","spacing":10,"alignChildren":["left","center"],"alignment":null},"hidden":true},"item-52":{"id":52,"type":"StaticText","parentId":51,"style":{"enabled":true,"varName":"versionAILabel","creationProps":{"truncate":"none","multiline":false,"scrolling":false},"softWrap":false,"text":"Version","justify":"left","preferredSize":[60,0],"alignment":null,"helpTip":null}},"item-53":{"id":53,"type":"DropDownList","parentId":51,"style":{"enabled":true,"varName":"VersionAIDropdown","text":"DropDownList","listItems":"Illustrator CC, -,Legacy Formats,Illustrator CS6 ,Illustrator CS5 ,Illustrator CS4 ,Illustrator CS3 ,Illustrator CS2 ,Illustrator CS ,Illustrator 10, ,Illustrator 9 ,Illustrator 8","preferredSize":[0,0],"alignment":null,"selection":0,"helpTip":null}},"item-54":{"id":54,"type":"Checkbox","parentId":12,"style":{"enabled":true,"varName":"customGrayCheckbox","text":"Custom Gray","preferredSize":[0,0],"alignment":null,"helpTip":"Promtps user at the end of logo types generation to edit the gray version. Some users like a darker or yet lighter gray version of the color type."}},"item-55":{"id":55,"type":"Checkbox","parentId":12,"style":{"enabled":true,"varName":"customBlackPrintCheckbox","text":"Custom Black Print","preferredSize":[0,0],"alignment":null,"helpTip":"User can set the black values (CMYK) for black logo version in Print"}},"item-56":{"id":56,"type":"Checkbox","parentId":12,"style":{"enabled":true,"varName":"useCompressionAICheckbox","text":"Use Compression","preferredSize":[0,0],"alignment":null,"helpTip":null},"hidden":true},"item-57":{"id":57,"type":"Checkbox","parentId":12,"style":{"enabled":true,"varName":"customBlackDigitalCheckbox","text":"Custom Black Digital","preferredSize":[0,0],"alignment":null,"helpTip":"User can set the black values (RGB) for black logo version in Digital"}}},"order":[0,4,6,12,51,52,53,54,55,57,56,9,10,11],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"},"activeId":57}
*/ 


// ok and cancel button
var runButtonID = 1;
var cancelButtonID = 2;
var panelSpacing = 8;
var panelMargins = 16;


if (activeDocument.documentColorSpace == "DocumentColorSpace.RGB"){
    var space = "RGB";
} else {
    var space = "CMYK";
}

var extensionRoot = getExtensionRootPath();//;"C:\\Program Files\\Common Files\\Adobe\\CEP\\extensions\\logo-packer-main\\"; 
$.evalFile(File(extensionRoot + '/js/json2.js'));
var settingsFile = 'settings/colorsettings.json';
var exportInfo = new Object();

function showDialog(exportInfo, extensionRoot) {
    try {

        // COLORSETTINGSEXPORT
        // ===================
        var colorSettingsExport = new Window("dialog"); 
            colorSettingsExport.text = "Color Settings"; 
            colorSettingsExport.preferredSize.width = 500; 
            colorSettingsExport.orientation = "column"; 
            colorSettingsExport.alignChildren = ["center","top"]; 
            colorSettingsExport.spacing = 10; 
            colorSettingsExport.margins = 16; 

        // MAINPANEL
        // =========
        var mainPanel = colorSettingsExport.add("group", undefined, undefined, {name: "mainPanel"}); 
            mainPanel.alignChildren = ["left","fill"]; 
        var mainPanel_nav = mainPanel.add ("listbox", undefined, ['Options']); 
            mainPanel_nav.preferredSize.width = 75 
        var mainPanel_innerwrap = mainPanel.add("group") 
            mainPanel_innerwrap.alignment = ["fill","fill"]; 
            mainPanel_innerwrap.orientation = ["stack"]; 

        // OPTIONSTAB
        // ==========
        var optionsTab = mainPanel_innerwrap.add("group", undefined, {name: "optionsTab"}); 
            optionsTab.text = "Options"; 
            optionsTab.orientation = "column"; 
            optionsTab.alignChildren = ["left","top"]; 
            optionsTab.spacing = 10; 
            optionsTab.margins = 0; 

        // MAINPANEL
        // =========
        mainPanel_tabs = [optionsTab]; 

        for (var i = 0; i < mainPanel_tabs.length; i++) { 
            mainPanel_tabs[i].alignment = ["fill","fill"]; 
            mainPanel_tabs[i].visible = false; 
        } 

        mainPanel_nav.onChange = showTab_mainPanel; 

        function showTab_mainPanel() { 
            if ( mainPanel_nav.selection !== null ) { 
                for (var i = mainPanel_tabs.length-1; i >= 0; i--) { 
                mainPanel_tabs[i].visible = false; 
                } 
                mainPanel_tabs[mainPanel_nav.selection.index].visible = true; 
            } 
        }
        
        mainPanel_nav.selection = exportInfo.activeTab; 
        showTab_mainPanel() 

        // OPTIONSPANEL
        // ============
        var optionsPanel = optionsTab.add("panel", undefined, undefined, {name: "optionsPanel"}); 
            optionsPanel.text = "Options"; 
            optionsPanel.preferredSize.width = 390; 
            optionsPanel.orientation = "column"; 
            optionsPanel.alignChildren = ["left","top"]; 
            optionsPanel.spacing = panelMargins; 
            optionsPanel.margins = panelMargins; 

        // VERSIONAIGROUP
        // ==============
        // var versionAIGroup = optionsPanel.add("group", undefined, {name: "versionAIGroup"}); 
            // versionAIGroup.preferredSize.width = 55; 
            // versionAIGroup.orientation = "row"; 
            // versionAIGroup.alignChildren = ["left","center"]; 
            // versionAIGroup.spacing = 10; 
            // versionAIGroup.margins = 0; 

        // var versionAILabel = versionAIGroup.add("statictext", undefined, undefined, {name: "versionAILabel"}); 
            // versionAILabel.text = "Version"; 
            // versionAILabel.preferredSize.width = 60; 

        // var VersionAIDropdown_array = ["Illustrator CC","-","Legacy Formats","Illustrator CS6","Illustrator CS5","Illustrator CS4","Illustrator CS3","Illustrator CS2","Illustrator CS","Illustrator 10","","Illustrator 9","Illustrator 8"]; 
        // var VersionAIDropdown = versionAIGroup.add("dropdownlist", undefined, undefined, {name: "VersionAIDropdown", items: VersionAIDropdown_array}); 
            // VersionAIDropdown.selection = 0; 

        // OPTIONSPANEL
        // ============
        var customGrayCheckbox = optionsPanel.add("checkbox", undefined, undefined, {name: "customGrayCheckbox"}); 
            customGrayCheckbox.helpTip = "Promtps user at the end of logo types generation to edit the gray version. Some users like a darker or yet lighter gray version of the color type."; 
            customGrayCheckbox.text = "Custom Gray"; 
            customGrayCheckbox.value = exportInfo.options.customGray; 


        var cmykBlackGrp = optionsPanel.add("group", undefined, {name: "cmykBlackGrp"}); 
            cmykBlackGrp.orientation = "row"; 
            cmykBlackGrp.alignChildren = ["left","center"]; 

        var customBlackPrintCheckbox = cmykBlackGrp.add("checkbox", undefined, undefined, {name: "customBlackPrintCheckbox"}); 
            customBlackPrintCheckbox.helpTip = "User can set the black values (CMYK) for black logo version in Print"; 
            customBlackPrintCheckbox.text = "Custom Black Print"; 
            customBlackPrintCheckbox.value = exportInfo.options.customBlackPrint; 
            
            cmykBlackGrp.bgSwatchGrp = cmykBlackGrp.add('group', [0, 0, 20, 20])
            cmykBlackGrp.bgSwatchGrp.enabled = Boolean(exportInfo.options.customBlackDigital);

        var bgSelectUpdate = true;
        var bgSwatchButtonPrint = cmykBlackGrp.bgSwatchGrp.add('button')
            bgSwatchButtonPrint.bg = true;
            bgSwatchButtonPrint.onDraw = function () {}; // don't draw the button; it's just there to make the swatch clickable
            
            // alert(exportInfo.options.customPrintColor[0])
            // var appColor = CMYK2RGB(app.activeDocument.defaultFillColor);
            var storedPrintColor = new CMYKColor();
                printColor = exportInfo.options.customPrintColor.split('-');
                // alert(printColor[1])
                storedPrintColor.cyan = printColor[0];
                storedPrintColor.magenta = printColor[1];
                storedPrintColor.yellow = printColor[2];
                storedPrintColor.black = printColor[3];
                // storedPrintColor.cyan = exportInfo.options.customPrintColor[0];
                // storedPrintColor.magenta = exportInfo.options.customPrintColor[1];
                // storedPrintColor.yellow = exportInfo.options.customPrintColor[2];
                // storedPrintColor.black = exportInfo.options.customPrintColor[3];

            var appColorPrint = CMYK2RGB(storedPrintColor);
            // alert(exportInfo.options.customPrintColor[0])
            cmykBlackGrp.bgSwatchGrp.graphics.backgroundColor = cmykBlackGrp.graphics.newBrush(cmykBlackGrp.graphics.BrushType.SOLID_COLOR, [appColorPrint.r / 255, appColorPrint.g / 255, appColorPrint.b / 255, 1]);
            
        
        // Color Picker CMYK black
        var swatchButtonPrint = cmykBlackGrp.bgSwatchGrp.add('button');
        var completedPrint = "";
        swatchButtonPrint.onClick = function () {
            // var fc = app.activeDocument.defaultFillColor;//app.foregroundColor;
            // var storedPrintColor = new CMYKColor();
            // printColor = exportInfo.options.customPrintColor.split('-')
            // storedPrintColor.cyan = printColor[0];
            // storedPrintColor.magenta = printColor[1];
            // storedPrintColor.yellow = printColor[2];
            // storedPrintColor.black = printColor[3];
            // var fc = storedPrintColor;//app.foregroundColor;
            completedPrint = app.showColorPicker(storedPrintColor);
        
            if (completedPrint) {
                // app.activeDocument.defaultFillColor = completedPrint;
                exportInfo.options.customPrintColor = completedPrint.cyan+"-"+completedPrint.magenta+"-"+completedPrint.yellow+"-"+completedPrint.black;
                if (this.bg) {
                    this.parent.parent.backgroundColor = completedPrint; //[pickedColor.hsb.hue, pickedColor.hsb.saturation, pickedColor.hsb.brightness]
                    bgSelectUpdate = false; // dont call colorPicker again from background dropdown
                } else {
                    this.parent.parent.nameColor = completedPrint
                }
                var gfx = this.parent.graphics
                var hsbCol = CMYK2RGB(completedPrint)
                gfx.backgroundColor = gfx.newBrush(gfx.BrushType.SOLID_COLOR, [hsbCol.r / 255, hsbCol.g / 255, hsbCol.b / 255,1]);
            }
            // app.activeDocument.defaultFillColor = completedPrint // set forground to new set color as well
        }
        swatchButtonPrint.onDraw = function () {} // don't draw the button; it's just there to make the swatch clickable
        bgSwatchButtonPrint.onClick = swatchButtonPrint.onClick;

        // Digital Custom Black
        var rgbBlackGrp = optionsPanel.add("group", undefined, {name: "rgbBlackGrp"}); 
            rgbBlackGrp.orientation = "row"; 
            rgbBlackGrp.alignChildren = ["left","center"]; 

        var customBlackDigitalCheckbox = rgbBlackGrp.add("checkbox", undefined, undefined, {name: "customBlackDigitalCheckbox"}); 
            customBlackDigitalCheckbox.helpTip = "User can set the black values (RGB) for black logo version in Digital"; 
            customBlackDigitalCheckbox.text = "Custom Black Digital"; 
            customBlackDigitalCheckbox.value = exportInfo.options.customBlackDigital; 

            rgbBlackGrp.bgSwatchGrp = rgbBlackGrp.add('group', [0, 0, 20, 20])
            rgbBlackGrp.bgSwatchGrp.enabled = Boolean(exportInfo.options.customBlackDigital);
            
        var bgSelectUpdateRGB = true;
        var bgSwatchButtonDigital = rgbBlackGrp.bgSwatchGrp.add('button')
            bgSwatchButtonDigital.bg = true
            bgSwatchButtonDigital.onDraw = function () {} // don't draw the button; it's just there to make the swatch clickable
            
            // var appColorDigital = CMYK2RGB(app.activeDocument.defaultFillColor);
            var storedDigitalColor = new RGBColor();
                digitalColor = exportInfo.options.customDigitalColor.split('-');
                storedDigitalColor.red = digitalColor[0];
                storedDigitalColor.green = digitalColor[1];
                storedDigitalColor.blue = digitalColor[2];
            // var storedDigitalColor = new RGBColor();
            // storedDigitalColor.red = exportInfo.options.customDigitalColor[0];
            // storedDigitalColor.green = exportInfo.options.customDigitalColor[1];
            // storedDigitalColor.blue = exportInfo.options.customDigitalColor[2];

            var appColorDigital = storedDigitalColor;
            rgbBlackGrp.bgSwatchGrp.graphics.backgroundColor = rgbBlackGrp.graphics.newBrush(rgbBlackGrp.graphics.BrushType.SOLID_COLOR, [appColorDigital.red / 255, appColorDigital.green / 255, appColorDigital.blue / 255, 1]);
            
        
        // Color Picker RGB black
        var swatchButtonRGB = rgbBlackGrp.bgSwatchGrp.add('button')
        var completedDigital = "";
        swatchButtonRGB.onClick = function () {
            // var storedDigitalColor = new RGBColor();
            // digitalColor = exportInfo.options.customDigitalColor.split('-');
            // storedDigitalColor.red = digitalColor[0];
            // storedDigitalColor.green = digitalColor[1];
            // storedDigitalColor.blue = digitalColor[2];
            // // var fc = app.activeDocument.defaultFillColor;//app.foregroundColor;
            // var fc = storedDigitalColor;//app.foregroundColor;
            completedDigital = app.showColorPicker(storedDigitalColor);
            if (completedDigital) {
                // app.activeDocument.defaultFillColor = completedDigital;
                // alert(completedDigital.typename)
                // exportInfo.options.customDigitalColor = [CMYK2RGB(completedDigital).r, CMYK2RGB(completedDigital).g, CMYK2RGB(completedDigital).b];
                exportInfo.options.customDigitalColor = completedDigital.red+"-"+completedDigital.green+"-"+completedDigital.blue;
                if (this.bg) {
                    this.parent.parent.backgroundColor = completedDigital; //[pickedColor.hsb.hue, pickedColor.hsb.saturation, pickedColor.hsb.brightness]
                    bgSelectUpdate = false; // dont call colorPicker again from background dropdown
                } else {
                    this.parent.parent.nameColor = completedDigital
                }
                var gfx = this.parent.graphics
                // var hsbCol = CMYK2RGB(completedDigital)
                // gfx.backgroundColor = gfx.newBrush(gfx.BrushType.SOLID_COLOR, [hsbCol.r / 255, hsbCol.g / 255, hsbCol.b / 255,1]);
                gfx.backgroundColor = gfx.newBrush(gfx.BrushType.SOLID_COLOR, [completedDigital.red / 255, completedDigital.green / 255, completedDigital.blue / 255,1]);
            }
            // app.activeDocument.defaultFillColor = completedDigital // set forground to new set color as well
        }
        swatchButtonRGB.onDraw = function () {} // don't draw the button; it's just there to make the swatch clickable
        bgSwatchButtonDigital.onClick = swatchButtonRGB.onClick

        customBlackDigitalCheckbox.onClick = function() {
            rgbBlackGrp.bgSwatchGrp.enabled = customBlackDigitalCheckbox.value;
            colorSettingsExport.update();
        }
        customBlackPrintCheckbox.onClick = function() {
            cmykBlackGrp.bgSwatchGrp.enabled = customBlackPrintCheckbox.value;
            colorSettingsExport.update();
            cmykBlackGrp.bgSwatchGrp.update();
        }
        

        // DIALOGBTNS
        // ==========
        var dialogBtns = colorSettingsExport.add("group", undefined, {name: "dialogBtns"}); 
            dialogBtns.preferredSize.width = 480; 
            dialogBtns.orientation = "row"; 
            dialogBtns.alignChildren = ["right","center"]; 
            dialogBtns.spacing = 10; 
            dialogBtns.margins = 0; 

        var cancel = dialogBtns.add("button", undefined, undefined, {name: "cancel"}); 
            cancel.text = "Cancel"; 

        var ok = dialogBtns.add("button", undefined, undefined, {name: "ok"}); 
            ok.text = "Ok"; 


        // INTERACTION FPR DIALOG
        // dialog code
        ok.onClick = function(exportInfo) {
            var settings = getSettings(exportInfo);
            var saveJson = saveJsonPresetDoc(settings, settingsFile);
            if (saveJson) {
                settingsExport.close(runButtonID);
            }
        }


        cancel.onClick = function() {
            settingsExport.close(cancelButtonID);
        }

        // in case we double clicked the file
        // app.bringToFront();
        colorSettingsExport.show();
        colorSettingsExport.center();

        colorSettingsExport.active = true;

        // $.sleep(2000)
        // alert("yeah")

        // Call main function from getselected, we can reuse scripts
        // var ScriptFilePath = Folder($.fileName).parent.fsName;

        function saveJsonPresetDoc(exportInfo, settingsFile) {
            // var extensionRoot = $.fileName.split('/').slice(0, -2).join('/') + '/';
            // var presetFilePath = new File(extensionRoot + '/presets_json/'+ exportInfo.docName+'.json');
            var presetFilePath = new File(extensionRoot + settingsFile);
            presetFilePath.open("w");
            presetFilePath.write(JSON.stringify(exportInfo));
            presetFilePath.close();
            // getJsonPresetFileNames(exportInfo);
            return presetFilePath
        }

        function getSettings(exportInfo) {
            if (completedPrint == "") completedPrint = storedPrintColor;
            if (completedDigital == "") completedDigital = storedDigitalColor;
            exportInfo = {
                options: {
                    customGray: customGrayCheckbox.value,
                    customBlackPrint: customBlackPrintCheckbox.value,
                    customPrintColor: completedPrint.cyan+"-"+completedPrint.magenta+"-"+completedPrint.yellow+"-"+completedPrint.black,
                    customBlackDigital: customBlackDigitalCheckbox.value,
                    customDigitalColor: Math.round(completedDigital.red)+"-"+Math.round(completedDigital.green)+"-"+Math.round(completedDigital.blue) //[CMYK2RGB(completedDigital).r, CMYK2RGB(completedDigital).b, CMYK2RGB(completedDigital).b],
                },
                activeTab: mainPanel_nav.selection.index,
            }
            // }.svg.StylingSVG = StylingJPGDD.selection.index;
            // exportInfo.svg.FontSVG = FontJPGDD.selection.index;
            // exportInfo.svg.imagesSVG= imagesSVGDropdown.selection.index;
            // exportInfo.svg.decimalSVGInput = decimalSVGInput.text;
            return exportInfo
        }

    } catch(e){
        alert(e+"\n")
    }
}


///////////////////////////////////////////////////////////////////////////////
// Function: getExtensionRootPath
// Usage: return list of file names
// Input: folder
// Return: list of filenames
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
// Function: loadSettings
// Usage: return settings read from settings.json
// Input: filepath
// Return: list of parsed json settings
///////////////////////////////////////////////////////////////////////////////
function loadSettings() {
    // var d = exportInfo;
    // alert(folderPath)
    var settingsFilePath = extensionRoot + settingsFile;

    // we cant reach CEP in ISX
    // var d = readFile(filePath, !0);

    // load file with JSX
    // source: https://community.adobe.com/t5/photoshop-ecosystem-discussions/open-json-file-and-parse-it-extendscript/m-p/8599620
    var scriptFile = File(settingsFilePath);
    scriptFile.open('r');
    var d = scriptFile.read();
    scriptFile.close();
    var d = JSON.parse(d);
    return d
}

data = loadSettings()
showDialog(data, extensionRoot)


// https://coderedirect.com/questions/115104/javascript-convert-hsb-hsv-color-to-rgb-accurately
function HSBToRGB(hsb) {
    var rgb = { };
    var h = Math.round(hsb.hue);
    var s = Math.round(hsb.saturation * 255 / 100);
    var v = Math.round(hsb.brightness * 255 / 100);

        if (s == 0) {

        rgb.r = rgb.g = rgb.b = v;
        } else {
        var t1 = v;
        var t2 = (255 - s) * v / 255;
        var t3 = (t1 - t2) * (h % 60) / 60;

            if (h == 360) h = 0;

                if (h < 60) { rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3 }
                else if (h < 120) { rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3 }
                else if (h < 180) { rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3 }
                else if (h < 240) { rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3 }
                else if (h < 300) { rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3 }
                else if (h < 360) { rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3 }
                else { rgb.r = 0; rgb.g = 0; rgb.b = 0 }
        }

    return { r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b) };
}


// Author RAG inc
// Source AdobeCOlorCalculator

// -------------------------------------------------------
// RGBMetrics()        constructor
// -------------------------------------------------------
function RGBMetrics(r, g, b) {
    this.r = 0.0;
    this.g = 0.0;
    this.b = 0.0;
    this.error = false;
    this.gamut = false;

    if (r != undefined && g != undefined && b != undefined) {
        if (isNaN(r) || isNaN(g) || isNaN(b))
            throw("RGBMetrics() Invalid values [" + r + ", " + g + ", " + b + "]");
        this.r = r;
        this.g = g;
        this.b = b;
        if (!(Math.round(this.r) == Math.round(this.g) && Math.round(this.g) == Math.round(this.b))) {
            if (this.r > 254.9 || this.g > 254.9 || this.b > 254.9)
                this.gamut = true;
            if (this.r < 0.1 || this.g < 0.1 || this.b < 0.1)
                this.gamut = true;
        }
    }
    if (this.r > 255 || this.r < 0 || this.g > 255 || this.g < 0 || this.b > 255 || this.b < 0)
        this.error = true;
    return(this);
}


// -------------------------------------------------------
// CMYKMetrics()        constructor
// -------------------------------------------------------
function CMYKMetrics(C, M, Y, K) {
    this.C = 0.0;
    this.M = 0.0;
    this.Y = 0.0;
    this.K = 0.0;
    this.error = false;

    if (C != undefined && M != undefined && Y != undefined && K != undefined) {
        if (isNaN(C) || isNaN(M) || isNaN(Y) || isNaN(K))
            throw("HSBMetrics() Invalid values [" + C + ", " + M + ", " + Y + ", " + K + "]");
        this.C = C;
        this.M = M;
        this.Y = Y;
        this.K = K;
    }
    return(this);
}

// Returns opposite of souceSpace
// example RGB in is CMYK out
function targetSpace(sourceSpace) {
    return targetSpace = sourceSpace == "RGB" ? "CMYK" : "RGB"
}
// -----------------------------------------
// RGB2CMYK()
// accepts RGBMetrics, returns CMYKMetrics
// -----------------------------------------
function RGB2CMYK(RGB) {
    var sc, cmyk;
    var C, M, Y, K;
    if (app.name == 'Adobe Photosop') {
        var sc = new SolidColor();
        sc.rgb.red = RGB.r;
        sc.rgb.green = RGB.g;
        sc.rgb.blue =  RGB.b;
        C = Math.round(sc.cmyk.cyan*100.0)/100.0;
        M = Math.round(sc.cmyk.magenta*100.0)/100.0;
        Y = Math.round(sc.cmyk.yellow*100.0)/100.0;
        K = Math.round(sc.cmyk.black*100.0)/100.0;
    }
    if (space == "RGB") {
        sc = new RGBColor();
        sc.r = RGB.r;
        sc.g = RGB.g;
        sc.b =  RGB.b;
        // app.foregroundColor = sc
        // app.activeDocument.defaultFillColor = sc
        // alert(app.foregroundColor.c)
        sourceSpace = space;
        colorComponents = RGB.r,RGB.g,RGB.b;
        // alert(targetSpace(sourceSpace))
        var returnColors = app.convertSampleColor(ImageColorSpace[sourceSpace], [RGB.r,RGB.g,RGB.b], ImageColorSpace[targetSpace(sourceSpace)], ColorConvertPurpose.previewpurpose);
        // alert(returnColors[0])
        sc.cyan= returnColors[0];
        sc.magenta = returnColors[1];
        sc.yellow= returnColors[2];
        sc.black= returnColors[3];
        // sc.cyan = app.convertSampleColor(ImageColorSpace["RGB"], [RGB.r,RGB.g,RGB.b], ImageColorSpace["CMYK"], ColorConvertPurpose.previewpurpose)[0];//defaultpurpose))
        // sc.magenta = app.convertSampleColor(ImageColorSpace["RGB"], [RGB.r,RGB.g,RGB.b], ImageColorSpace["CMYK"], ColorConvertPurpose.previewpurpose)[1];//defaultpurpose))
        // sc.yellow = app.convertSampleColor(ImageColorSpace["RGB"], [RGB.r,RGB.g,RGB.b], ImageColorSpace["CMYK"], ColorConvertPurpose.previewpurpose)[2];//defaultpurpose))
        // sc.black = app.convertSampleColor(ImageColorSpace["RGB"], [RGB.r,RGB.g,RGB.b], ImageColorSpace["CMYK"], ColorConvertPurpose.previewpurpose)[3];//defaultpurpose))
        C = Math.round(sc.cyan*100.0)/100.0;
        M = Math.round(sc.magenta*100.0)/100.0;
        Y = Math.round(sc.yellow*100.0)/100.0;
        K = Math.round(sc.black*100.0)/100.0;
        // alert(C+", "+M+", "+Y+", "+K)
    }
    if (space == "CMYK") colorType = new CMYKColor();
    // if (app.name == 'Adobe Illustrator') var sc = colorType;

    cmyk = new CMYKMetrics(C, M, Y, K);
    return(cmyk);
}


// -----------------------------------------
// CMYK2RGB()
// accepts CMYKMetrics, returns RGBMetrics
// Not from RagsInc > Rombout Versluijs 29-12-2022
// Changed 2023-06-06 > need accept RGB documents aswell
// -----------------------------------------

function CMYK2RGB(CMYK) {
    var sc, rgb;
    var R, G, B;
    if (app.name == 'Adobe Photoshop') {
        var sc = new SolidColor();
        sc.cmyk.cyan =   CMYK.cyan;
        sc.cmyk.magenta = CMYK.magenta;
        sc.cmyk.yellow =  CMYK.yellow;
        sc.cmyk.black =  CMYK.black;
        R = Math.round(sc.rgb.red*255.0)/255.0;
        G = Math.round(sc.rgb.green*255.0)/255.0;
        B = Math.round(sc.rgb.blue*255.0)/255.0;
        rgb = new RGBMetrics(R, B, G);
    }
    if (space == "CMYK" || (space == "RGB")) {
        var sc = new CMYKColor();
        sc.cyan =   CMYK.cyan;
        sc.magenta = CMYK.magenta;
        sc.yellow =  CMYK.yellow;
        sc.black =  CMYK.black;

        // app.activeDocument.defaultFillColor = sc
        sourceSpace = space;
        var returnColors = app.convertSampleColor(ImageColorSpace[sourceSpace], [CMYK.cyan,CMYK.magenta,CMYK.yellow, CMYK.black], ImageColorSpace[targetSpace(sourceSpace)], ColorConvertPurpose.defaultpurpose);//previewpurpose);
        sc.red= returnColors[0];
        sc.green = returnColors[1];
        sc.blue= returnColors[2];
        R = Math.round(sc.red);
        G = Math.round(sc.green);
        B = Math.round(sc.blue);

        rgb = new RGBMetrics(R, G, B);
    }
    return(rgb);
}
