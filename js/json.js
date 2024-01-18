// Source Gridder CEP
// app.js

function readFile(t, o) {
    try {
        var e = cep.fs.readFile(t).data;
        return o && e ? JSON.parse(e) : e;
    } catch (e) {
        alert("readFile(" + t + ", " + o + ") - error: " + e);
    }
}
function saveFile(e, t, o, r, s) {
    try {
        o && t && (t = JSON.stringify(t, null, 4)), cep.fs.writeFile(e, t, s), r instanceof Function && r(e, t, o);
    } catch (e) {
        alert("saveFile() - error: " + e);
    }
}
function makeDir(e, t) {
    try {
        cep.fs.makedir(e), t instanceof Function && t(e);
    } catch (e) {
        alert("makeDir() - error:" + e);
    }
}
function chooseFiles(e, t, o, r, s) {
    try {
        var n = "";
        t = "string" == typeof t ? t.replace(/ /g, "").split(",") : "";
        for (var a = 0; a < t.length; a++) n += "*." + t[a];
        var c = cep.fs.showOpenDialogEx(r || !1, !1, "string" == typeof o ? o : "Choose files..", "string" == typeof e ? e : "", t, n).data;
        r || (c = c[0]);
        for (a = 0; a < arguments.length; a++) arguments[a] instanceof Function && arguments[a](c, { path: e, types: t, title: o });
        return c;
    } catch (e) {
        alert("chooseFiles() - error: " + e);
    }
}
String.prototype.gsep = function (e) {
    return this.replace(/\\/g, e || "/");
};
var PATH = require("path"),
    CS = new CSInterface(),
    app = {},
    hostEnvironment = (window.CS = CS).getHostEnvironment(),
    appID = hostEnvironment.appId,
    extID = CS.getExtensionID(),
    appName = hostEnvironment.appName,
    appVersion = hostEnvironment.appVersion,
    $path = {
        host: CS.getSystemPath(SystemPath.HOST_APPLICATION),
        myDocs: CS.getSystemPath(SystemPath.MY_DOCUMENTS),
        userData: CS.getSystemPath(SystemPath.USER_DATA),
        extension: CS.getSystemPath(SystemPath.EXTENSION),
        commonFiles: CS.getSystemPath(SystemPath.COMMON_FILES),
        application: CS.getSystemPath(SystemPath.APPLICATION),
        project: {},
    };
($path.extScripts = $path.extension + "/" + "scripts" + "/"),
    ($path.extSettings = $path.extension + "/" + "settings" + "/"),
    ($path.extTemp = $path.extension + "/" + "temp" + "/"),
    ($path.project.ext = $path.project.main + "/" + extID),
    ($path.project.ILST = $path.project.ext + "/" + "Illustrator"),
    ($path.project.app = $path.project[appName]),
    ($path.project.logPath = $path.project.app + "/" + "log.txt"),
    ($path.project.myScripts = $path.project.app + "/" + "My Scripts"),
    ($path.project.messages = $path.extension + "/" + "messages"),
    ($path.project.systemLogPath = $path.extension + "/" + "systemLog.txt");
console.log("Ext path "+$path.extension);
// console.log($path.extension + "/js/libs/jquery-3.4.1.min.js");
// console.log("Ext path "+$path.extSettings);
// moved to mainjs
// (window.jQuery = require(PATH.normalize($path.extension + "/js/libs/jquery-3.4.1.min.js").gsep())), (window.$ = window.jQuery);
var previousVersion= "1.0.2";
var setting = {
    data: {
        generation: {
            client: "",
            type: "select",
            colors: { 
                fullcolor: true, 
                pms: false, 
                inverted: {
                    inverted: false,
                    invertedName: false,
                    invertedType: "",
                    invertedColor: "",
                    invertedPreview: ""
                },
                grayscale: false, black: true, white: true },
            media: "",
            separator: {
                dash: false,
                underscrore: false,
            },
        },
        export: {
            destfolder: "",
            formats: { ai: false, pdf: false, svg: false, eps: false, jpg: false, png: false },
        },
        extras: {
            autoresize: true,
            subfolders: true,
            checkABhasArt: true,
            allartboards: true,
            tooltips: false,
        },
    },
    loaded: !1,
    loadTimeout: 0,
    // path: $path.extSettings + "user.json",
    // saveset: $path.extSettings + "save.json",
    path: $path.extSettings + "user.json",
    saveset: $path.extSettings + "save.json",
    root: { path: $path.extSettings + "root.json", data: { oldVersion: previousVersion } },
    create: function () {
        return makeDir($path.extSettings) || saveFile(setting.path, setting.data, !0), setting;
        // return fs.existsSync($path.extSettings) || makeDir($path.extSettings), fs.existsSync(setting.path) || saveFile(setting.path, setting.data, !0), fs.existsSync(setting.root.path) || saveFile(setting.root.path, setting.root.data, !0), setting;
    },
    get: function (e) {
        // console.log(setting.path);
        return setting.create(), readFile(setting.path, !0);
        // return readFile(setting.path, !0);
    },
    save: function (e) {
        // console.log(setting.path);
        // console.log(setting.saveset);
        return saveFile(setting.path, e(setting.get()), !0), setting;
        // console.log(setting.get());
        // return saveFile(setting.path, setting.get(), !0), setting;
    },
    merge: function (t) {
        // try {
            console.log(t);
            return (
                t
                    // ? setting["save" + t.slice(0, 1).toUpperCase() + t.slice(1).toLowerCase()](function (e) {
                    ? setting["save"](function (e) {
                          return e ? $.extend(!0, {}, setting[t].data, e) : setting[t.toLowerCase()].data;
                      })
                    : setting.save(function (e) {
                          return e ? $.extend(!0, {}, setting.data, e) : setting.data;
                      }),
                setting
            );
        // } catch (e) {
        //     $console.systemLog.write("varialbles.js => setting.merge()", e);
        // }
    },
    load: function (e,b,o) {
        // Dirty clear for checkbox > need to fix error
        $('input').each(function () {
            $(this).prop('checked',false);
        });
        try {
            // setting.merge("root");
            // var t = setting.merge().get();
            // console.log(t)
            if (b) var t = e;
            if (!b) var t = setting.data; // Reset to default values
            // if (!b) var t = setting.get();
            var clientName = t.generation.client.replace(/[^a-zA-Z0-9-_]/g, '').trim().replace(/\s+/g, '');
            return (
                $("#clientName").val(clientName),
                $("#logotype option[value=" + t.generation.type + "]").prop("selected", true),
                $("input[value='"+ t.generation.mediatype+"']").prop("checked", true),
                $("#colors input[value=fullcolor]").prop("checked", t.generation.colors.fullcolor),
                $("#colors input[value=pms]").prop("checked", t.generation.colors.pms),
                $("#colors input[value=inverted]").prop("checked", t.generation.colors.inverted.inverted),
                $("#colors input[name=invertedName]").val(t.generation.colors.inverted.invertedName),
                $("#colors input[name=invertedType]").attr('value',t.generation.colors.inverted.invertedType),
                $("#invertedColor").attr('value', t.generation.colors.inverted.invertedColor),
                $("#setInverted").css("background", t.generation.colors.inverted.invertedPreview),
                $("#colors input[value=grayscale]").prop("checked", t.generation.colors.grayscale),
                $("#colors input[value=black]").prop("checked", t.generation.colors.black),
                $("#colors input[value=white]").prop("checked", t.generation.colors.white),
                // $("#separator input[value=" + t.generation.separator + "]").prop("checked", true),
                $("input[value='dash']").prop("checked", t.generation.separator.dash),
                $("input[value='underscore']").prop("checked", t.generation.separator.underscore),
                $("#expPath").val(t.export.destfolder),
                $("#formats input[value=ai]").prop("checked", t.export.formats.ai),
                $("#formats input[value=pdf]").prop("checked", t.export.formats.pdf),
                $("#formats input[value=svg]").prop("checked", t.export.formats.svg),
                $("#formats input[value=eps]").prop("checked", t.export.formats.eps),
                $("#formats input[value=jpg]").prop("checked", t.export.formats.jpg),
                $("#formats input[value=png]").prop("checked", t.export.formats.png),
                $("#autoResize input[value=autoresize]").prop("checked", t.extras.autoresize),
                $("#subFolders input[value=subfolders]").prop("checked", t.extras.subfolders),
                $("#checkABhasArt input[value=checkABhasArt]").prop("checked", t.extras.checkABhasArt),
                $("#allartboards input[value=allartboards]").prop("checked", t.extras.allartboards),
                $("#toolTipsMain input[value=toolTips]").prop("checked", t.extras.tooltips),
                // destFolder = t.export.destfolder,
                CS.evalScript(`setDestFolderFromJson('${t.export.destfolder}')`, function (run) {
                    // console.log(run.split(",")[0]);
                    // console.log(run.split(",")[1]);
                    var setDestFolder = $("#setDestFolder");
                    var openDestFolder = $("#openDestFolder");
                    var clearDestFolder = $("#clearDestFolder");
                    var expBtn = $("#export_btn");
                    var expPath = $("#expPath");
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
                }),
                getValues(),
                exportSettingsToNone(),
                checkDropzone(),
                checkTooltips(),
                // t.export.destfolder = "" == false ? $("#setDestFolder").trigger("click") : "",
                (setting.loaded = !0),
                setting
            );
        } catch (e) {
            console.log(e);
        }
    },
    saves: function (e) {
        // console.log(setting.path);
        // console.log($("#formats input[name=formats]:checked").val());
        formats = [];
        $("input:checkbox[name=formats]").each(function () {
            formats.push( $(this).val()+'":'+$(this).is(':checked'));
        });
        try {
            var data = {
                generation: {
                    client: $("#clientName").val(),
                    type: $("#logotype").val(),
                    mediatype: $("input[name='media']:checked").val(),
                    colors: {
                        fullcolor: $("input[value='fullcolor']").is(':checked'),
                        pms: $("input[value='pms']").is(':checked'),
                        inverted: {
                            inverted: $("input[value='inverted']").is(':checked'),
                            invertedName: $("input[name='invertedName']").is(':checked'),
                            invertedType: $("input[name='invertedType']").val(),
                            invertedColor: $("#invertedColor").val(),
                            invertedPreview: $("#setInverted").css("background-color")
                        },
                        grayscale:$("input[value='grayscale']").is(':checked'),
                        black:$("input[value='black']").is(':checked'),
                        white:$("input[value='white']").is(':checked'),
                    },
                    // separator: $("input[name='separator']:checked").val(),
                    separator: {
                        dash: $("input[value='dash']").is(':checked'),
                        underscore: $("input[value='underscore']").is(':checked'),
                    },
                },
                export: {
                    destfolder: $("#expPath").val(),
                    formats: {
                        ai:$("input[value='ai']").is(':checked'),
                        pdf:$("input[value='pdf']").is(':checked'),
                        svg:$("input[value='svg']").is(':checked'),
                        eps:$("input[value='eps']").is(':checked'),
                        jpg:$("input[value='jpg']").is(':checked'),
                        png:$("input[value='png']").is(':checked'),
                    },
                },
                extras: {
                    autoresize: $("input[name='autoresize']").is(':checked'),
                    subfolders: $("input[name='subfolders']").is(':checked'),
                    checkABhasArt: $("input[name='checkABhasArt']").is(':checked'),
                    allartboards: $("input[name='allartboards']").is(':checked'),
                    tooltips: $("input[name='toolTips']").is(':checked'),
                },
            };
        } catch (e) {
            console.log(e);
        }
        return saveFile(setting.saveset, data, !0), data;
    },
    import: function (e, t) {
        try {
            var o = chooseFiles("", "json", "Choose settings file");
            if (o && o.length) {
                var r = readFile(o, !0);
                setting.load(r,true,false);
            // }
            //     return (
            //         setting.save(function (e) {
            //             return $.extend(e, r);
            //         }),
            //         t instanceof Function && t(o, r),
            //         confirm("In order that changes became effective it is necessary to reboot extension. To reboot?") && location.reload(),
            //         !0
            //     );
            }
            return !1;
        } catch (e) {
            console.log("varialbles.js => setting.import()", e);
            // $console.systemLog.write("varialbles.js => setting.import()", e);
        }
    },
    
    export: function (e, t) {
        try {
            var o = cep.fs.showSaveDialogEx("Export setting", e || $path.project.ext, "", "setting.json", "").data;
            if (o && o.length) {
                // saveFile(o, setting.get(), !0);
                saveFile(o, setting.saves(), !0);
            //     var r = o.gsep(),
            //         s = PATH.dirname(r).gsep();
            //     return $console.log("Settings have been exported to folder " + r + " " + LAUX.button.execute.getHTMLString(s, "", "Open directory")), t instanceof Function && t(o), !0;
            }
            return !1;
        } catch (e) {
            console.log("varialbles.js => setting.export()", e);
            // $console.systemLog.write("varialbles.js => setting.export()", e);
        }
    },

    readExportSettings: function (e,b,o) {
        // Dirty clear for checkbox > need to fix error
        $('input').each(function () {
            $(this).prop('checked',false);
        });
        try {
            if (b) var t = e;
            var data = {
                // ai: {
                //     VersionAI: VersionAIDropdown.selection.index,
                //     compatiblepdfAI: compatibelPDFAICheckbox.value,
                //     includeLinkedAI: includeLinkedAICheckbox.value,
                //     embedICCAI: embedICCProfilesAICheckbox.value,
                //     includeCmykinRGBEPS: includeCmykinRGBEPSCheckbox.value,
                //     usecompressionAI: useCompressionAICheckbox.value,
                // },
                // pdf: {
                //     adobepresetPDF: pdfPresetsPDFDropdown.selection.index,
                //     preserveEditabilityPDF: preserveEditingPDFCheckbox.value,
                //     embedPageThumbnailsPDF: embedPageThumbnailsPDFCheckbox.value,
                //     optimizeviewPDF: optimizeFastWebPDFCheckbox.value,
                //     createlayersPDF: createAcrobatLayerPDFCheckbox.value,
                // },
                // eps: {
                //     VersionEPS: VersionEPSDropdown.selection.index,
                //     embedFontsEPS: embedFontsEPSCheckbox.value,
                //     includeLinkedEPS: includeLinkedEPSCheckbox.value,
                //     includeThumbsEPS: includeThumbsEPSCheckbox.value,
                //     includeCmykinRGBEPS: includeCmykinRGBEPSCheckbox.value,
                //     compatiblePrintingEPS: compatiblePrintingEPSCHeckbox.value,
                //     adobeposttscriptEPS: adobePostscriptEPSDropdown.selection.index,
                // },
                svg: {
                    StylingSVG: t.svg.StylingSVG,
                    FontSVG: t.svg.FontSVG,
                    imagesSVG: t.svg.imagesSVG,
                    decimalSVG: t.svg.decimalSVG,
                    minimizeSVG: t.svg.minimizeSVG,
                    responsiveSVG: t.svg.responsiveSVG,
                },
                // jpg: {
                //     compressionmethodJPG: compressionPresetsJPGDropdown.selection.index,
                //     antialiasingJPG: antialiasingJPGDropdown.selection.index,
                //     embedICCJPG: embedICCProfilesJPGCheckbox.value,
                // },
                // png: {
                //     antialiasingPNG: antialiasingPNGDropdown.selection.index,
                //     interlacedPNG: interlacedPNGCheckbox.value,
                //     backgroundColorPNG: backgroundcolorPNGDropdown.selection.index,
                // },
                // activeTab: fileFormatsPanel_nav.selection.index,
            }

            return data
        } catch (e) {
            console.log(e);
        }
    },
    loadExportSettings: function (e, t) {
        try {
            var o = $path.extension + '/settings/settings.json';
            console.log("settings.json file "+ o)
            if (o && o.length) {
                var r = readFile(o, !0);
                // setting.readExportSettings(r,true,false);
                // console.log("read settings.json "+r)
                // console.log(r)
                return r
            }
            return !1;
        } catch (e) {
            console.log("setting.loadExportSettings()", e);
        }
    },
};
