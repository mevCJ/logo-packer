// Adds CSS for monitors max-width 1920
/* Smaller display > font and inputs smaller */
/* @media (max-width: 1920px) {
    .hostElt,
    .hostElt * {
        font-size: 10px !important;
    }
    input {
        padding: 5px 6px 2px;
    }
    select {
        padding: 3px;
    }
    input[type="radio"],
    input[type="checkbox"] {
        width: 12px;
        height: 12px;
    }
    .icon,
    .errIcon:before,
    .project h1:before,
    #instructions h1:before,
    .settings h1:before {
        height: 11px;
        width: 11px !important;
    }
    .col:nth-of-type(1) {
        max-width: 50px !important;
    }
    body.closed #instructions {
    height: 15px;
}
} */

function addRule(stylesheetId, selector, rule) {
    var stylesheet = document.getElementById(stylesheetId);
    
    if (stylesheet) {
        stylesheet = stylesheet.sheet;
        if (stylesheet.addRule) {
            stylesheet.addRule(selector, rule);
        } else if (stylesheet.insertRule) {
            stylesheet.insertRule(selector + ' { ' + rule + ' }', stylesheet.cssRules.length);
        }
    }
}

monitorCheck = function(){
    var styleId = "hostStyle";
    var winW = screen.width;
    var winH = screen.height;
    console.log(`Monitor:${winW} x ${winH}`);
    if (winW <= 1920){
        console.log(`Added extra CSS`);
        addRule(styleId, ".col:nth-of-type(1)", "   max-width: " + "50px !important;");
        addRule(styleId, ".hostElt,.hostElt *,.hostElt h1","    font-size: " + "10px !important;");
        addRule(styleId, "input","       padding: " + "5px 6px 2px;");
        addRule(styleId, "select","       padding: " + "3px;");
        addRule(styleId, "input[type=\"radio\"],input[type=\"checkbox\"]","       width: " + "12px;");
        addRule(styleId, "input[type=\"radio\"],input[type=\"checkbox\"]","       height: " + "12px;");
        addRule(styleId, ".icon,.errIcon:before,.project h1:before,#instructions h1:before,.settings h1:before","       height: " + "11px !important;");
        addRule(styleId, ".icon,.errIcon:before,.project h1:before,#instructions h1:before,.settings h1:before","       width: " + "11px !important;");
        addRule(styleId, "body.closed #instructions ","       height: " + "15px;");
    }
}
