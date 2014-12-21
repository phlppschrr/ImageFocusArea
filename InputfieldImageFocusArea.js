$(document).ready(function () {

    $('.InputfieldImageFocusArea').on('click', '.button-setfocus', function (event) {

        event.preventDefault();

        var popup;
        var $saveButton;
        var $cancelButton;
        var jcrop;
        var $targetInput = $('#' + $(this).data('inputtarget'));
        var ratioWidth = $(this).data('ratiowidth');
        var ratioHeight = $(this).data('ratioheight');
        var aspectRatio = false;
        if (!ratioWidth) ratioWidth = 0;
        if (!ratioHeight) ratioHeight = 0;
        if (ratioWidth>0 && ratioHeight>0) {
            aspectRatio = ratioWidth / ratioHeight;
        }
        var $modal;


        var key = $(this).data('key');
        var $container = $(this).parents('.InputfieldImage');
        var imageUrl = $container.find('a.InputfieldFileLink').attr('href');
        var saveObj = $targetInput.val();
        if (saveObj) {
            saveObj = JSON.parse(saveObj);
        } else {
            saveObj = {};
        }

        function initCropping() {
            $('#image-focusrect-modal').css('max-width', '90%');

            var jcropSettings = {
                boxWidth: $(window).width() * .9,
                boxHeight: ($(window).height() * .9) - 60
            };
            var savedCoords = $targetInput.val();
            if (saveObj[key]) {
                //savedCoords = JSON.parse(savedCoords);
                jcropSettings.setSelect = [saveObj[key].x, saveObj[key].y, saveObj[key].x2, saveObj[key].y2];
            }
            if (aspectRatio) {
                jcropSettings.aspectRatio = aspectRatio;
            }
            if (ratioWidth>0 || ratioHeight>0) {
                jcropSettings.onChange = function (c) {
                    // change marker if selection would need upscaling in thumbmode
                    if (c.w < ratioWidth || c.h < ratioHeight) {
                        $modal.addClass('has-upscale-warning');
                    } else {
                        $modal.removeClass('has-upscale-warning');
                    }
                };
            }

            $('#target').Jcrop(jcropSettings, function () {
                jcrop = this;
            });

        };

        $.magnificPopup.open({
            type: 'ajax',
            closeOnContentClick: false,
            closeOnBgClick: false,
            closeBtnInside: false,
            items: {
                src: ['<div id="image-focusrect-modal">',
                    '<img src="' + imageUrl + '" id="target" />',
                    '<button class="ui-button ui-state-default image-focuspoint-save"><span class="ui-button-text">Apply</span></button>',
                    '<button class="ui-button ui-state-default image-focuspoint-cancel"><span class="ui-button-text">Cancel</span></button>',
                    '</div>'
                ].join('\n'),
                type: 'inline'
            },
            callbacks: {
                open: function () {
                    popup = this;
                    $modal = $('#image-focusrect-modal');
                    $saveButton = $(this.content).find('.image-focuspoint-save');
                    $cancelButton = $(this.content).find('.image-focuspoint-cancel');
                    $saveButton.click(function (e) {

                        var newSaveCoords = jcrop.tellSelect();
                        if (newSaveCoords.w === 0 && newSaveCoords.h === 0) {
                            newSaveCoords = '';
                        } else {
                            newSaveCoords.x = Math.round(newSaveCoords.x);
                            newSaveCoords.x2 = Math.round(newSaveCoords.x2);
                            newSaveCoords.y = Math.round(newSaveCoords.y);
                            newSaveCoords.y2 = Math.round(newSaveCoords.y2);
                            newSaveCoords.w = newSaveCoords.x2 - newSaveCoords.x;
                            newSaveCoords.h = newSaveCoords.y2 - newSaveCoords.y;
                        }

                        saveObj[key] = newSaveCoords;

                        $targetInput.val(JSON.stringify(saveObj));
                        jcrop.destroy();
                        popup.close();
                    });

                    $cancelButton.click(function (e) {
                        jcrop.destroy();
                        popup.close();
                    });

                    initCropping();

                }
            }
        });

    });

});


$(document).ready(function() {

    var magnificOptions = {
        type: 'image',
        closeOnContentClick: true,
        closeBtnInside: true,
        image: {
            titleSrc: function(item) {
                return item.el.find('img').attr('alt');
            }
        },
        callbacks: {
            open: function() {
                // for firefox, which launches Magnific after a sort
                if($(".InputfieldFileJustSorted").size() > 0) this.close();
            }
        }
    };

    $("a.InputfieldFileLink").magnificPopup(magnificOptions);

    $(document).on('click', '.InputfieldImageFocusArea .InputfieldFileMove', function() {

        var $li = $(this).parent('p').parent('li');
        var $ul = $li.parent();

        if($(this).is('.InputfieldFileMoveTop')) $ul.prepend($li);
        else $ul.append($li);

        $ul.children('li').each(function(n) {
            $(this).find('.InputfieldFileSort').val(n);
        });

        return false;
    });

    function setGridModeItem($a) {
        var $img = $a.children("img");
        var gridSize = $img.attr('data-gridsize');
        $a.css('background', '#000 url(' + $img.attr('src') + ') center center no-repeat');
        $a.css('width', gridSize + 'px').css('height', gridSize + 'px');
        $img.css('height', gridSize + 'px');
        if($img.width() > (gridSize-1) && $img.height() > (gridSize-1)) $a.css('background-size', 'cover');
    }

    function setGridMode($parent) {
        $parent.find("i.fa-th").replaceWith($("<i class='fa fa-list'></i>"));
        $parent.find(".InputfieldFileLink").each(function() {
            setGridModeItem($(this));
        });
        $parent.addClass('InputfieldImageGrid');
    }

    function unsetGridModeItem($a) {
        $a.css({
            background: 'none',
            width: '',
            height: ''
        }).find('img').css('height', '');
    }

    function unsetGridMode($parent) {
        $parent.removeClass('InputfieldImageGrid');
        $parent.find(".InputfieldFileLink").each(function() {
            unsetGridModeItem($(this));
        });
        $parent.find("i.fa-list").replaceWith($("<i class='fa fa-th'></i>"));
    }

    var $listToggle = $("<a class='InputfieldImageListToggle HideIfEmpty' href='#'></a>")
        .append("<i class='fa fa-th'></i>");
    $(".InputfieldImageFocusArea .InputfieldHeader").append($listToggle);
    $(document).on('click', '.InputfieldImageListToggle', function() {
        var $parent = $(this).parents(".InputfieldImageFocusArea");
        if($parent.hasClass('InputfieldImageGrid')) unsetGridMode($parent);
        else setGridMode($parent);
        return false;
    });

    $(".InputfieldImageFocusArea").find(".InputfieldImageDefaultGrid").each(function() {
        setGridMode($(this).parents(".InputfieldImage"));
    });

    $(document).on('AjaxUploadDone', '.InputfieldImageFocusArea .InputfieldFileList', function() {
        $("a.InputfieldFileLink", $(this)).magnificPopup(magnificOptions);
        var $parent = $(this).parents('.InputfieldImageFocusArea');
        if($parent.is(".InputfieldImageGrid")) {
            unsetGridMode($parent);
            setGridMode($parent);
        }
    });

});