Inputfield And Fieldtype ImageFocusArea
=======================================

for ProcessWire 2.5
-------------------

Makes it possible to select the important part of the image

Usage
-----

Create a new Inputfield ImageFocusArea and add it to the desired template. 
Edit a page with this template and add an image to the new field. You will see a link "Add Image Focusarea". 
Click the link and you will see a popup with a cropping tool similar to the Thumbnails module. Select the important part of the image, click "apply" and save the page.

By default the Field hooks into Pageimage::size and automatically populates the cropping option with percentages of the center of the selected focusarea. 

API usage examples
------------------

```PHP
// by default if you did not define a cropping option, the cropping option gets automatically populated with percentages
echo "<img src='{$page->image->size(200,200)}' />";

// the same as above but here you explict say you want this behaviour
echo "<img src='{$page->image->size(200,200, array('cropping'=>'align'))}' />";

// here the resulting cropped image will be the center area of the selected focusarea 
echo "<img src='{$page->image->size(200,200, array('cropping'=>'inside'))}' />";

// here the complete focusarea will be part of the image, but the outside part will still be used
echo "<img src='{$page->image->size(200,200, array('cropping'=>'outside'))}' />";
```
