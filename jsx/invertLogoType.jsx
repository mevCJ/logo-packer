var docSelected = app.activeDocument.selection;
if (activeDocument.documentColorSpace == "DocumentColorSpace.RGB"){
	var space = "RGB";
} else {
	var space = "CMYK";
}

function getColorNameValue(){
    alert("doing thing")
    if ( docSelected.length > 0 ) {
            var item = docSelected[0];
            // var color = fillColor;
            // alert(color)
            getBasicColorsFromItem(item)
        // for ( i = 0; i < docSelected.length; i++ ) {
        //     docSelected[i].selected = false;
        // }
        // app.activeDocument.selection = null;
        // for ( i = 0; i < docSelected.length; i++ ) {
        //     docSelected[i].selected = true;
        //     app.doScript(actionName, set)
        //     docSelected[i].selected = false;
        //     app.activeDocument.selection = null;
        // }
    } else {
        alert( "Please select one or more art objects" );
    }


    /**
    * Source: https://community.adobe.com/t5/illustrator-discussions/get-spot-colors-from-selected-object-group-objects/m-p/13356189#M344245
    * Returns array of swatches or colors
    * found in fill or stroke of page item.
    * @author m1b
    * @version 2022-10-11
    * @param {PageItem} item - an Illustrator page item.
    * @returns {Object} -  {fillColors: Array<Color>, strokeColors: Array<Color>}
    */
    function getBasicColorsFromItem(item) {
        if (item == undefined)
            throw Error('getItemColor: No item supplied.');
        var noColor = "[NoColor]",
            colorables = [],
            foundColors = {
                fillColors: [],
                strokeColors: []
            };
        // collect all the colorables
        if (item.constructor.name == 'PathItem') {
            colorables.push(item);
            getPMSColor(item, item);
        } else if (item.constructor.name == 'CompoundPathItem' && item.pathItems) {
            colorables.push(item.pathItems[0]);
            getPMSColor(item.pathItems[0], item.pathItems[0]);
        } else if (item.constructor.name == 'TextFrame' && item.textRanges) {
            for (var i = item.textRanges.length - 1; i >= 0; i--)
                colorables.push({
                    fillColor: item.textRanges[i].characterAttributes.fillColor,
                    strokeColor: item.textRanges[i].characterAttributes.strokeColor
                });
        }
        if (colorables.length > 0)
            for (var i = 0; i < colorables.length; i++) {
                if (
                    colorables[i].hasOwnProperty('fillColor')
                    && colorables[i].fillColor != noColor
                    && (
                        !colorables[i].hasOwnProperty('filled')
                        || colorables[i].filled == true
                    )
                    && colorables[i].fillColor != undefined
                )
                    foundColors.fillColors.push(colorables[i].fillColor);
                if (
                    colorables[i].hasOwnProperty('strokeColor')
                    && colorables[i].strokeColor != noColor
                    && (
                        colorables[i].constructor.name == 'CharacterAttributes'
                        || colorables[i].stroked == true
                    )
                    && colorables[i].strokeColor != undefined
                )
                    foundColors.strokeColors.push(colorables[i].strokeColor);
            }
        else if (item.constructor.name == 'GroupItem') {
            // add colors from grouped items
            for (var i = 0; i < item.pageItems.length; i++) {
                getBasicColorsFromItem(item.pageItems[i]);
            }
        }
    };


    function getPMSColor(colorItem, item){
        colorItem = colorItem.fillColor;
        tint = false;
        if (colorItem.typename == "CMYKColor"){
            fil = colorItem;
            // alert(fil.name)
            inpt = fil.cyan+", "+fil.magenta+", "+fil.yellow+", "+fil.black;
        } else if (colorItem.typename == "RGBColor"){
            fil = colorItem;
            inpt = fil.red+", "+fil.green+", "+fil.blue;
            
            // 2022-12-29
            // use CMYK for RGB better outcome
            var col = new RGBColor;
                col.r = fil.red;
                col.g = fil.green;
                col.b = fil.blue;
            inpt = RGB2CMYK(col).C+", "+RGB2CMYK(col).M+", "+RGB2CMYK(col).Y+", "+RGB2CMYK(col).K;    
        } else if(colorItem.typename == "SpotColor"){
            // alert(colorItem.spot.name);
            // alert(miColor.spot.color);
            fil = colorItem.spot.color;
            tint = colorItem.tint;
            if (app.activeDocument.documentColorSpace == DocumentColorSpace.CMYK){
                fil = colorItem.spot.color;
                inpt = fil.cyan+", "+fil.magenta+", "+fil.yellow+", "+fil.black;
                // alert("getPMSColor "+fil.cyan+", "+fil.magenta+", "+fil.yellow+", "+fil.black)
            } else{
                fil = colorItem.spot.color;
                // fil = colorItem.fillColor;
                inpt = fil.red+", "+fil.green+", "+fil.blue;
                // alert("getPMSColor "+fil.red+", "+fil.green+", "+fil.blue)
                
                // 2022-12-29
                // use CMYK for RGB better outcome
                var col = new RGBColor;
                    col.r = fil.red;
                    col.g = fil.green;
                    col.b = fil.blue;
                // alert("RGB2CMYK "+RGB2CMYK(col))
                inpt = RGB2CMYK(col).C+", "+RGB2CMYK(col).M+", "+RGB2CMYK(col).Y+", "+RGB2CMYK(col).K;
            }
            // alert(inpt)
        } else if (colorItem.typename=="GrayColor"){
        if (app.activeDocument.documentColorSpace == DocumentColorSpace.CMYK){
			fil = grayToCMYK(colorItem);
			inpt = fil.cyan+", "+fil.magenta+", "+fil.yellow+", "+fil.black;
        } else {
            fil = grayToCMYK(colorItem);
			inpt = fil.cyan+", "+fil.magenta+", "+fil.yellow+", "+fil.black;
        }
    } else if (colorItem.typename=="NoColor"){
        return
    }
        // alert(colorItem.typename)
        alert(inpt)
    }
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
        app.foregroundColor = sc
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


var mediaType = "Print";
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

// var docRef = app.activeDocument;
// var aDoc = docRef;
// aDoc.defaultFillColor = white;
// app.executeMenuCommand("Find Fill Color menu item");
// // app.executeMenuCommand("hide");
// app.executeMenuCommand("lock");
// app.executeMenuCommand("selectall");
// for (var x = 0; x < activeDocument.selection.length; x++) {

//             // item = activeDocument.selection[x];
//     aDoc.defaultFillColor = white;
// }
for (var i = 0; i < docRef.selection.length; i++) {
    var item = app.activeDocument.selection[i];
    fillPathItem(item, white)
    // alert(item.fillColor)
}
app.executeMenuCommand("unlockAll");


function fillPathItem(item, color) {
    if (item == undefined)
        throw Error('getItemColor: No item supplied.');
    var noColor = "[NoColor]",
        colorables = [],
        foundColors = {
            fillColors: [],
            strokeColors: []
        };
    // collect all the colorables
    if (item.constructor.name == 'PathItem') {
        colorables.push(item);
        item.fillColor = color;
    } else if (item.constructor.name == 'CompoundPathItem' && item.pathItems) {
        colorables.push(item.pathItems[0]);
        item.pathItems[0].fillColor = color;
    } else if (item.constructor.name == 'TextFrame' && item.textRanges) {
        for (var i = item.textRanges.length - 1; i >= 0; i--)
            colorables.push({
                fillColor: item.textRanges[i].characterAttributes.fillColor,
                strokeColor: item.textRanges[i].characterAttributes.strokeColor
            });
    }
    if (colorables.length > 0)
        for (var i = 0; i < colorables.length; i++) {
            if (
                colorables[i].hasOwnProperty('fillColor')
                && colorables[i].fillColor != noColor
                && (
                    !colorables[i].hasOwnProperty('filled')
                    || colorables[i].filled == true
                )
                && colorables[i].fillColor != undefined
            )
                foundColors.fillColors.push(colorables[i].fillColor);
            if (
                colorables[i].hasOwnProperty('strokeColor')
                && colorables[i].strokeColor != noColor
                && (
                    colorables[i].constructor.name == 'CharacterAttributes'
                    || colorables[i].stroked == true
                )
                && colorables[i].strokeColor != undefined
            )
                foundColors.strokeColors.push(colorables[i].strokeColor);
        }
    else if (item.constructor.name == 'GroupItem') {
        // add colors from grouped items
        for (var i = 0; i < item.pageItems.length; i++) {
            if (!item.pageItems[i].locked){
                fillPathItem(item.pageItems[i], color);
            }
        }
    }
};


function grayToCMYK(color){
    if(color.typename !== 'GrayColor') return false;
        var CMYK = new CMYKColor(),
        convertColor = app.convertSampleColor(ImageColorSpace.GrayScale, [color.gray], ImageColorSpace.CMYK, ColorConvertPurpose.defaultpurpose);
        CMYK.cyan = convertColor[0];
        CMYK.magenta = convertColor[1];
        CMYK.yellow = convertColor[2];
        CMYK.black = convertColor[3];
    return CMYK;
}
function grayToRGB(color){
    if(color.typename !== 'GrayColor') return false;
        var RGB = new RGBColor(),
        convertColor = app.convertSampleColor(ImageColorSpace.GrayScale, [color.gray], ImageColorSpace.RGB, ColorConvertPurpose.defaultpurpose);
        RGB.red = convertColor[0];
        RGB.green = convertColor[1];
        RGB.blue = convertColor[2];
    return RGB;
}