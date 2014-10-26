$(document).ready(function () {

    $('.InputfieldImageFocusrect').on('click', '.button-setfocus', function (event) {

        event.preventDefault();

        var popup;
        var $saveButton;
        var $cancelButton;
        var jcrop;
        var $targetInput = $('#' + $(this).data('inputtarget'));
        var $container = $(this).parents('.InputfieldImage');
        var imageUrl = $container.find('a.InputfieldFileLink').attr('href');

        function initCropping() {
            $('#image-focusrect-modal').css('max-width', '90%');
            var jcropSettings = {
                boxWidth: $(window).width() * .9,
                boxHeight: ($(window).height() * .9) - 60
            };
            var savedCoords = $targetInput.val();
            if (savedCoords) {
                savedCoords = JSON.parse(savedCoords);
                jcropSettings.setSelect = [savedCoords.x, savedCoords.y, savedCoords.x2, savedCoords.y2]
            }

            $('#target').Jcrop(jcropSettings, function () {
                jcrop = this;
            });

        };

        $.magnificPopup.open({
            type: 'ajax',
            closeOnContentClick: false,
            closeOnBgClick:false,
            closeBtnInside: false,
            items: {
                src: ['<div id="image-focusrect-modal">',
                    '<img src="'+ imageUrl +'" id="target" />',
                    '<button class="ui-button ui-state-default image-focuspoint-save">Apply</button>',
                    '<button class="ui-button ui-state-default image-focuspoint-cancel">Cancel</button>',
                    '</div>'
                ].join('\n'),
                type: 'inline'
            },
            callbacks: {
                open: function () {
                    popup = this;
                    $saveButton = $(this.content).find('.image-focuspoint-save');
                    $cancelButton = $(this.content).find('.image-focuspoint-cancel');

                    $saveButton.click(function (e) {
                        var saveVal = jcrop.tellSelect();
                        if (saveVal.w === 0 && saveVal.h === 0) {
                            saveVal = '';
                        } else {
                            saveVal = JSON.stringify(saveVal);
                        }
                        $targetInput.val(saveVal);
                        jcrop.destroy();
                        popup.close();
                    });

                    $cancelButton.click(function (e) {
                        jcrop.destroy();
                        popup.close();
                    });

                    initCropping()
                }
            }
        });

    });


});