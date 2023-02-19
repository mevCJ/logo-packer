(function ($) {
    $.fn.cepDropZone = function (options) {
        /**
         * Define some default settings
         */
        var defaults = {
            onSuccess: function (event, svg) {
                console.log("CEP Drag-n-Drop finished successfully", svg);
            },
            onError: function (event, error) {
                console.error("Oops! CEP Drag-n-Drop encountered an error.");
            },
        };

        var onSuccess = function () {};
        if (options.onSuccess instanceof Function) {
            onSuccess = options.onSuccess;
        }

        var onError = function () {};
        if (options.onError instanceof Function) {
            onError = options.onError;
        }

        /**
         * Merge the runtime options with the default settings
         */
        var options = $.extend({}, defaults, options);

        /**
         * Appends the dropzone to the document.
         */
        function getDropZone() {
            var $dropzone = $('<textarea allow="clipboard-read; clipboard-write"/>').attr({
                class: "dropzone",
                id: "dropzone--" + new Date().getTime(),
                ondragover: "(function(e) { e.preventDefault() })(event)",
                placeholder: "\n\n\n\n\nDrop page items here",
            });
            return $dropzone;
        }

        /**
         * Adds default styling to the window. Object is not styled inline
         * so that styles can be over-ridden via CSS stylesheets.
         */
        function appendStyles() {
            var rules = "",
                bodyWidth;

            function getStyleRule(selector, rules) {
                var props = [];
                for (var prop in rules) {
                    props.push(prop + " : " + rules[prop]);
                }
                return selector + " { " + props.join("; ") + " } ";
            }

            bodyWidth = parseInt($("body").width()) - parseInt($("body").css("padding")) * 2;

            rules += getStyleRule(".dropzone", {
                display: "inline-flex",
                // 'width'           : '100%',
                width: "var(--width)",
                // 'width'           : (bodyWidth - 48) + 'px',
                height: "110px",
                padding: "0.5rem",
                background: "#333",
                border: "1px dashed rgb(43,122,249)",
                // 'border'          : '4px dashed #888',
                "border-radius": "6px",
                resize: "none",
                "text-align": "center",
                overflow: "hidden",
                // cursor: "default",
            });

            rules += getStyleRule(".is-dragover", {
                // background: "#d0d0d0",
                // "border-color": "#333",
                // cursor: "copy",
            });

            var $style = $("<style/>");
            $style.text(rules);
            $style.appendTo($("head"));
        }

        /**
         * Prettifies the SVG. Not really necessary. Just obsessive.
         * @param {string}  svg     The SVG string.
         * @returns {string}
         */
        function cleanSvg(svg) {
            svg = svg.replace(/\s\s+/g, " ");

            var lines = svg.split("\n");

            lines.map(function (line) {
                line = line.replace(/\s\s+/g, " ");
                line = line.replace(/\t+/g, " ");
                return line;
            });
            console.log(lines);
            return lines.join("");
        }

        /**
         * Handles the drop event.
         * @param {Event}   event   The drop event.
         * @returns void
         */
        function dropEventHandler(event) {
            event.preventDefault();
            // console.log(event.target.nodeName)
            var $target = $(event.target);
            var csInterface = new CSInterface();
            csInterface.evalScript('app.executeMenuCommand("copy")', function (result) {
                try {
                    var svg;
                    var svgHolder = $("#svgHolder");
                    var svg,
                        $svg = $("<svg/>");

                    $target.focus();
                    // $target.val("");
                    // Paste command doesnt work in newer CEP engines, not allowed due to security
                    // document.execCommand("paste");
                    // svg = $target.val();
                    $svg.val("");
                    // svg = cleanSvg(svg);
                    // $target.val("");
                    // $target.val(svg);

                    // https://www.c-sharpcorner.com/forums/how-do-get-clipboard-value-in-jquery
                    // var svgData = clipboard.getData("Text");
                    // var cd = event.originalEvent.clipboardData;
                    // $("#svgHolder").empty().text(cd.getData("text/plain"));
                    // var svgData = window.clipboardData.getData('Text');
                    // console.log(svgData)

                    // https://stackoverflow.com/questions/27738155/unable-to-get-property-getdata-of-undefined-or-null-reference-in-ie-but-not/27738262
                    // var svgData = event.originalEvent.clipboardData.getData('text/plain');
                    // console.log(svgData)


                    // $target.val(parseSVG(svg));
                    // Works with manually pasteing svg code in textarea
                    // document.getElementById("svgHolder").appendChild(parseSVG(svg));

                    // console.log(getClipboard())

                    // Works with manually pasting > works in newer versions
                    // Usage: copy svg and paste it in textarea, then drop/drop. This is not usefull
                    // the paste.js is better in this case
                    // var list = document.querySelector('#svgHolder');
                    // list.appendChild(parseSVG(svg));
                    // list.appendChild(parseSVG(svg));
                    // $target.val("");

                    // list.appendChild(parseSVG("<div>bam creteaadada</div>")); // Works on windwos new version
                    // document.getElementById("svgHolder").appendChild(parseSVG(svg));
                    // document.getElementById("svgHolder").appendChild(parseSVG(svg));
                    // document.getElementById("svgHolder").append(parseSVG(svg));
                    // console.log(document.getElementById("svgHolder").appendChild(parseSVG(svg)));
                    // svgHolder.append(svg);
                    // svgHolder.focus();
                    // svgHolder.val('');
                    // svgHolder.val(svg);
                    // console.log($target.data)
                    // svgHolder.val($target.data);
                    // document.execCommand('paste'); //NOT WORKING
                    // document.execCommand('insertText');
                    // console.log($(event.data))
                    // console.log($(event))
                    // svgHolder.val($(event));

                    // copyPageUrl(event.data);
                    // permis()
                    // csInterface.evalScript('app.executeMenuCommand("paste")')
                    // copyPageUrl()
                    // document.getElementById('svgHolder').appendChild(parseSVG(svg));
                    // var svgDrop = makeSVG('svgDrop', svg);
                    // document.getElementById('svgHolder').appendChild(svgDrop);
                    // $svg.append(svg);
                    // console.log($svg)
                    // console.log($target)
                    // var mediaType = "";
                    // var forMats = [];
                    // var sepaRator = "";
                    // var clientName = $("#clientName").val();
                    // var logoType = $("#logotype").val();

                    getValues();
                    
                    csInterface.evalScript(`generateLogoVariation('${clientName}','${logoType}','${colors}','${mediaType}','${sepaRator}','${forMats}','${autoResize}', '${$path.extension}')`, function (run) {
                        outputRun(run);
                    });

                    if (onSuccess instanceof Function) {
                        // console.info("Dropped Succesfully!");
                        onSuccess.apply(this, [event, svg]);
                    }
                } catch (error) {
                    console.error(error);
                    if (onError instanceof Function) {
                        onError.apply(this, [event, error]);
                    }
                }

                // Fix height textarea
                // https://stackoverflow.com/a/25261886/2175375
                var textAreas = document.getElementsByTagName("textarea");
                Array.prototype.forEach.call(textAreas, function (elem) {
                    elem.placeholder = elem.placeholder.replace(/\\n/g, "\n");
                });
            });
        }
        // Get Clipboard Permission
        // https://stackoverflow.com/questions/6969403/why-is-document-execcommandpaste-not-working-in-google-chrome

        function getClipboard() {
            var pasteTarget = document.createElement("div");
            pasteTarget.contentEditable = true;
            var actElem = document.activeElement.appendChild(pasteTarget).parentNode;
            pasteTarget.focus();
            document.execCommand("Paste", null, null);
            var paste = pasteTarget.innerText;
            actElem.removeChild(pasteTarget);
            return paste;
        }

        // Create svg
        // Source: https://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
        function makeSVG(tag, attrs) {
            var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
            for (var k in attrs) el.setAttribute(k, attrs[k]);
            return el;
        }
        // Create svg
        // Source: https://stackoverflow.com/questions/3642035/jquerys-append-not-working-with-svg-element
        function parseSVG(svgDrop) {
            var div = document.createElementNS("http://www.w3.org/1999/xhtml", "div");
            // div.innerHTML= '<svg xmlns="http://www.w3.org/2000/svg">'+svgDrop+'</svg>';
            div.innerHTML = svgDrop;
            var frag = document.createDocumentFragment();
            while (div.firstChild) frag.appendChild(div.firstChild);
            return frag;
        }

        // https://web.dev/async-clipboard/
        // async function copyPageUrl(text) {
        //     const holder = document.getElementById('svgHolder');
        //     try {
        //         await holder.clipboard.writeText(text);
        //         console.log('Page URL copied to clipboard');
        //     } catch (err) {
        //         console.error('Failed to copy: ', err);
        //     }
        // }
        // async function copyPageUrl(text) {
        //     const { ClipboardItem } = window;
        //     const item = new ClipboardItem({
        //         'text/plain': text
        //       });
        //       console.log(item)
        //       await navigator.clipboard.write([item]);
        // }

        // async function permis(){
        //     //https://web.dev/async-clipboard/
        //     const queryOpts = { name: 'clipboard-read', allowWithoutGesture: false };
        //     const permissionStatus = await navigator.permissions.query(queryOpts);
        //     // Will be 'granted', 'denied' or 'prompt':
        //     console.log(permissionStatus.state);

        //     // Listen for changes to the permission state
        //     permissionStatus.onchange = () => {
        //         console.log(permissionStatus.state);
        //     };
        // }

        // Works, read paste data
        // https://davidea.st/articles/copy-and-paste-clipboard-api
        // document.addEventListener("paste", (event) => {
        //     const text = event.clipboardData.getData("text/plain");
        //     // console.log(text);
        //     document.getElementById('svgHolder').appendChild(parseSVG(text));
        // });
        /*
         * Add default styles.
         */
        appendStyles();

        /**
         * Return the object to preserve method chaining
         */
        return this.each(function (i) {
            var $anchor = $(this);

            console.log("Adding cep-dropzone " + i);

            var $dropzone = getDropZone();
            $dropzone.appendTo($anchor);

            $dropzone.on("drop", dropEventHandler);
            
            // https://codepen.io/pinecode-io/pen/OwJLKL
            $dropzone.on("dragover dragenter", (e) => {
                $dropzone.addClass("is-dragover");
                $dropzone.attr("placeholder", "\n\n\n\n\nGenerate files");
                $("#dropIcon").removeClass("dropIcon").addClass("expIcon");
                $("#dragOver").addClass("is-dragover");
                $("#dropOver").addClass("expIcon");
                e.dataTransfer = e.originalEvent.dataTransfer;
                e.dataTransfer.dropEffect = "copy";
                e.preventDefault();
            });
            $dropzone.on("dragleave dragend drop", (e) => {
                $dropzone.removeClass("is-dragover");
                $dropzone.attr("placeholder", "\n\n\n\n\nDrop page items here");
                $("#dropIcon").removeClass("expIcon").addClass("dropIcon");
                $("#dragOver").removeClass("is-dragover");
                $("#dropOver").removeClass("expIcon");
                // e.preventDefault();
            });
            // $("#dropIcon").on("dragover dragenter", function (e) {
            //     $dropzone.addClass("is-dragover");
            //     $dropzone.attr("placeholder", "\n\n\n\n\nGenerate files");
            //     $("#dropIcon").removeClass("dropIcon").addClass("expIcon");
            //     $("#dragOver").addClass("is-dragover expIcon");
            //     $("#dropOver").addClass("expIcon");
            //     e.preventDefault();
            // });
            // $("#dropIcon").on("dragleave dragend drop", (e) => {
            //     $dropzone.removeClass("is-dragover");
            //     $dropzone.attr("placeholder", "\n\n\n\n\nDrop page items here");
            //     $("#dropIcon").removeClass("expIcon").addClass("dropIcon");
            //     $("#dragOver").removeClass("is-dragover expIcon");
            //     $("#dropOver").removeClass("expIcon");
            //     e.preventDefault();
            // });
            $("#dragOver").on("dragover dragenter", function (e) {
                $dropzone.addClass("is-dragover");
                $dropzone.attr("placeholder", "\n\n\n\n\nGenerate files");
                $("#dropIcon").removeClass("dropIcon").addClass("expIcon");
                $("#dragOver").removeClass("dropIcon").addClass("expIcon");
                $("#dropOver").addClass("expIcon");
                $("#dropOverTxt").text("Generate files");
                
                e.dataTransfer = e.originalEvent.dataTransfer;
                e.dataTransfer.dropEffect = "copy";
                e.preventDefault();

            });
            $("#dropIcon").on("dragleave dragend drop", (e) => {
                $dropzone.removeClass("is-dragover");
                $dropzone.attr("placeholder", "\n\n\n\n\nDrop page items here");
                $("#dropIcon").removeClass("expIcon").addClass("dropIcon");
                $("#dragOver").removeClass("is-dragover expIcon").addClass("dropIcon");
                $("#dropOver").removeClass("expIcon");
                e.preventDefault();
            });
            // console.log($dropzone.attr('id'))
            // $($dropzone.attr('id')).bind("paste", function (e) {
            //     // access the clipboard using the api
            //     // window.pastedData=null;
            //     pastedData = e.originalEvent.clipboardData.getData("text");
            //     // alert(pastedData);
            // });
            return this;
        });
    };
})(jQuery);
