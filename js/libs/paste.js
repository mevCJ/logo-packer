/**
 * jQuery Paste Plugin
 * https://github.com/LeMarck/jquery-paste
 *
 * Copyright 2018 Evgeny Petrov
 * Released under the MIT license
 */
(function ($) {
    $.fn.pastableTextarea = function () {
        return pastableTextarea(this);
    };

    $.pastableTextarea = function (elem) {
        return pastableTextarea(elem);
    };

    function pastableTextarea(elem) {
        [].forEach.call(elem, pasteHandler);

        return elem;
    }

    function createHiddenContenteditable() {
        return $(document.createElement('div'))
            .attr('contenteditable', true)
            .attr('aria-hidden', true)
            .attr('tabindex', -1)
            .css({
                width: 1,
                height: 1,
                left: -1000,
                position: 'fixed',
                overflow: 'hidden'
            });
    }

    function pasteHandler(textarea) {
        let target = $(textarea);
        let clipboardData = window.clipboardData;
        let hiddenInput;

        // In Safari and IE, you must create a hidden
        // contenteditable element to insert an image
        if (!window.Clipboard) {
            hiddenInput = $(createHiddenContenteditable().insertBefore(textarea));
        }

        // IE not able to paste images from the clipboard into the textarea.
        // For this you need to install the handler on a hidden contenteditable
        // element and switch focus from textarea to it.
        if (clipboardData) {
            target = hiddenInput;
            hiddenInput = $(textarea);

            hiddenInput.on('keydown', event => {
                if (event.ctrlKey && event.keyCode === 86) {
                    target.focus();
                }
            });
        }

        target.on('paste', event => {
            // For IE
            const isDone = handlerIE(window.clipboardData, target, hiddenInput) ||
                handlerDefault(event.originalEvent.clipboardData, target) ||
                handlerWebKit(event.originalEvent.clipboardData, hiddenInput, target);

            if (!isDone) {
                target.trigger('pasteError', {
                    message: 'ClipboardData not support'
                });
            }
        });
    }

    function handlerIE(clipboardData, container, target) {
        if (!clipboardData) {
            return false;
        }

        [].forEach.call(clipboardData.files, file => {
            loadingImage(target, URL.createObjectURL(file));
        });
        container.empty();
        target.focus();

        return true;
    }

    function handlerWebKit(clipboardData, container, target) {
        if (!clipboardData.types) {
            return false;
        }

        const types = clipboardData.types.join('');

        if (types.match(/text\/plain/)) {
            target.trigger('pasteText', clipboardData.getData('Text'));
            event.preventDefault();
        }
        if (types.match(/image\//) && container) {
            container.focus();
            setTimeout(() => {
                [].forEach.call(container.find('img'), image => {
                    loadingImage(target, image.src);
                });
                container.empty();
                target.focus();
            });
        }

        return true;
    }

    function handlerDefault(clipboardData, target) {
        if (!clipboardData.items) {
            return false;
        }

        [].forEach.call(clipboardData.items, item => {
            if (item.type.match(/^image\//)) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    loadingImage(target, e.target.result);
                };
                try {
                    reader.readAsDataURL(item.getAsFile());
                } catch (error) {
                    target.trigger('pasteError', error);
                }
            }
            if (item.type === 'text/plain') {
                item.getAsString(text => target.trigger('pasteText', text));
            }
        });
        event.preventDefault();

        return true;
    }

    function loadingImage(target, src) {
        const loader = new Image();

        loader.crossOrigin = 'anonymous';
        loader.onload = () => {
            let blob;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            let dataURL = null;

            canvas.width = loader.width;
            canvas.height = loader.height;
            ctx.drawImage(loader, 0, 0, canvas.width, canvas.height);

            try {
                dataURL = canvas.toDataURL('image/png');
                blob = dataURLtoBlob(dataURL);
            } catch (error) {
                target.trigger('pasteError', error);
            }

            if (dataURL) {
                return target.trigger('pasteImage', {
                    blob: blob,
                    dataURL: dataURL,
                    width: loader.width,
                    height: loader.height
                });
            }
        };
        loader.onerror = () => target.trigger('pasteError', {
            message: 'Failed to get image from: ' + src,
            url: src
        });
        loader.src = src;
    }

    function dataURLtoBlob(dataURL, sliceSize) {
        sliceSize = sliceSize || 512;
        let ref;

        if (!(ref = dataURL.match(/^data:([^;]+);base64,(.+)$/))) {
            return null;
        }

        const byteCharacters = atob(ref[2]);
        const byteArrays = new Array(Math.ceil(byteCharacters.length / sliceSize)).fill(0)
            .reduce((byteArray, chunk) => {
                const slice = byteCharacters.slice(chunk * sliceSize, (chunk + Number(sliceSize)));
                const byteNumbers = new Array(slice.length).fill(0)
                    .map((_, index) => slice.charCodeAt(index));
                byteArray.push(new Uint8Array(byteNumbers));

                return byteArray;
            }, []);

        return new Blob(byteArrays, {
            type: ref[1]
        });
    }
})(jQuery);
