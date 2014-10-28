Inputfield And Fieldtype ImageFocusArea
=======================================
*requires ProcessWire 2.5.6 or later*

This Inputfield makes it possible to select the important part of the image and use this area for different cropping options. This module is not a replacement for the existing Thumbnails module, though depending on your need it probably could replace it in many cases.

I think a more flexible cropping approach than the existing Thumbnails module is useful especially when using the new html <picture> and you don't want the editor to define multiple thumbnails.

Usage
-----
Create a new Inputfield ImageFocusArea and add it to the desired template. Edit a page with this template and add an image to the new field. You will see a link "Add Image Focusarea". Click the link and you will see a popup with a cropping tool similar to the Thumbnails module. Select the important part of the image, click "apply" and save the page.

By default the Field hooks into Pageimage::size and automatically populates the cropping option with percentages of the center of the selected focusarea. You can always override this behaviour by calling $image->size with a different cropping option (e.g. ```$image->size(100,100,array('cropping'=>'center'))```).

The module introduces 3 new cropping options:
- **align:** This is the default if you do not override it with another cropping option. When resizing a image the module only adjusts the alignment of the crop. You will get the most zoomed-out result of these options.
- **inside:** Only parts inside of the selected area are used in the resulting image. You will get the most zoomed-in result of these options.
- **outside:** The resized image will contain the whole selected area. The surrounding imagearea will be used to reach the targetsize. This is also true for upscaling=false. Upscaling will only happen if the source image was smaller then the targetsize.

API usage examples
------------------

```PHP
// here we force the old/usual 'center' mode:
echo "<img src='{$page->image->size(200,200,array('cropping'=>'center'))}' />";

// by default if you did not define a cropping option, the cropping option gets automatically populated
// Both calls will result in the same image:
echo "<img src='{$page->image->size(200,200)}' />";
echo "<img src='{$page->image->size(200,200, array('cropping'=>'align'))}' />";

// the resulting image will be the center area of the selected focusarea 
echo "<img src='{$page->image->size(200,200, array('cropping'=>'inside'))}' />";
// to get an image with exactly the same ratio as the focusarea use width()/height() instead of a size() 
echo "<img src='{$page->image->width(200, array('cropping'=>'inside'))}' />";
echo "<img src='{$page->image->height(200, array('cropping'=>'inside'))}' />";

// the whole selected area will be part of the image, the surrounding imagearea will only be used to reach the targetsize 
echo "<img src='{$page->image->size(200,200, array('cropping'=>'outside'))}' />";
```
Flexible CSS Background Images
------------------------------
Additionally you can access a new property ```cssBackgroundPosition```, which could be useful for frontend responsive images. The visual result is similar to the ```cropping='align'``` mode, but depending on the size and postion of the focusArea and your images source and target size your mileage may vary. This property is intended to be used together with ```background-size: cover;```. It is important that the background-image has the same ratio as the original image!

```HTML
<style>
.cssimg{
  background-size: cover;
  width:200px; height: 200px;
}
</style>
<div class="cssimg" style="background-position: <?= $image->cssBackgroundPosition ?>; background-image: url(<?= $image->url ?>);  "></div>
```

