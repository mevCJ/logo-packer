(function($) {
    $.fn.cepDropZone = function(options) {

        /**
         * Define some default settings
         */
        var defaults = {
            onSuccess : function(event, svg) {
                console.log('CEP Drag-n-Drop finished successfully', svg);
            },
            onError : function(event, error) {
                console.error('Oops! CEP Drag-n-Drop encountered an error.');
            }
        };

        var onSuccess = function(){}
        if (options.onSuccess instanceof Function) {
            onSuccess = options.onSuccess;
        }

        var onError = function(){}
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
            var $dropzone = $('<textarea/>')
                .attr({
                    class       : 'dropzone',
                    id          : 'dropzone--' + new Date().getTime(),
                    ondragover  : '(function(e) { e.preventDefault() })(event)',
                    placeholder : 'Drop page items here'
                });
            return $dropzone;
        }

        /**
         * Adds default styling to the window. Object is not styled inline
         * so that styles can be over-ridden via CSS stylesheets.
         */
        function appendStyles() {

            var rules = '', bodyWidth;

            function getStyleRule(selector, rules) {
                var props = [];
                for (var prop in rules) {
                    props.push(prop + ' : ' + rules[prop]);
                }
                return selector + ' { ' + props.join('; ') + ' } ';
            }

            bodyWidth = parseInt($('body').width()) - (parseInt($('body').css('padding')) * 2);

            rules += getStyleRule('.dropzone', {
                'display'         : 'inline-flex',
                'width'           : (bodyWidth - 48) + 'px',
                'height'          : '20px',
                'padding'         : '40px 20px',
                'background'      : '#aaa',
                'border'          : '4px dashed #888',
                'border-radius'   : '6px',
                'resize'          : 'none',
                'text-align'      : 'center',
                'overflow'        : 'hidden'
            });

            rules += getStyleRule('.dropzone:hover', {
                'background'   : '#bbb',
                'border-color' : '#555',
                'cursor'       : 'move'
            });

            var $style = $('<style/>');
            $style.text(rules);
            $style.appendTo($('head'));
        };

        /**
         * Prettifies the SVG. Not really necessary. Just obsessive.
         * @param {string}  svg     The SVG string.
         * @returns {string}
         */
        function cleanSvg(svg) {
            svg = svg.replace(/\s\s+/g, ' ');

            var lines = svg.split('\n');

            lines.map(function(line) {
                line = line.replace(/\s\s+/g, ' ');
                line = line.replace(/\t+/g, ' ');
                return line;
            });

            return lines.join('');
        }

        /**
         * Handles the drop event.
         * @param {Event}   event   The drop event.
         * @returns void
         */
        function dropEventHandler(event) {
            event.preventDefault();
            
            
            var $target = $(event.target);
            var csInterface = new CSInterface();
            csInterface.evalScript('app.executeMenuCommand("copy")', function(result) {
                try {
                    var svg,
                    $svg = $('<svg/>');
                    
                    $target.focus();
                    // $target.val('');
                    
                    document.execCommand("paste");
                    
                    svg = $target.val();
                    // console.log("SVG paste "+document.execCommand("paste", false,null))
                    
                    svg = cleanSvg(svg);
                    
                    $target.val(svg);
                    if (onSuccess instanceof Function) {
                        onSuccess.apply(this, [event, svg]);
                    }
                }
                catch(error) {
                    console.error(error);
                    if (onError instanceof Function) {
                        onError.apply(this, [event, error]);
                    }
                }
            });
        }

        /*
         * Add default styles.
         */
        appendStyles();

        /**
         * Return the object to preserve method chaining
         */
        return this.each(function(i) {

            var $anchor = $(this);

            console.log('Adding cep-dropzone ' + i);

            var $dropzone = getDropZone()
            $dropzone.appendTo($anchor);

            $dropzone.on('drop', dropEventHandler);

            return this;
        });

    };
})(jQuery);