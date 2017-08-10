# A simple slider for changing background images in elements of HTML-page

## Description
The slider changes background image of HTML element with background color and other parameters either by click on specify element, or automaticaly after some time. All of those parameters are specified in settings when slider is initialized. Before using images all of them are loaded in cache of browser, so there is not delay before showing next slide.

## Getting started
### Initiate the plugin
```javascript
$(document).ready(function(){
  $('#pageHeader').backgroundSlider({
    //Object with slider settings
  });
});
```
#pageHeader is id of element, which should be run slider. Instead of it id or class of your block is specified. Object with slider settings must be passed to method backgroundSlider().

Also there are second variant to call the method:
```javascript
$(document).ready(function(){
  $('#pageHeader').backgroundSlider( 'method', 'params', {
    //Object with slider settings
  });
});
```
Instead of 'method' is specified string with name of calling method. Instead of 'params' is specified parameters of this method.

For example, you can show one slide if you specify method 'setFrame' and pass for it slide number starting from 0.
```javascript
$(document).ready(function(){
  $('#pageHeader').backgroundSlider( 'setFrame', 1, {
    //Object with slider settings
  });
});
```
### Slider settings
By defaults:
```javascript
$.fn.backgroundSlider.defaults = {
    images: [ 'none' ],            //array with urls of background images; by default - background-image: none;
    bgColors: [ '#fff' ],          //array with colors of background images; by default - background-color: '#fff';
    bgSize: [ 'auto, auto' ],      //array with sizes of background images; by default - background-size: auto, auto;
    bgRepeat: [ 'repeat' ],        //array with options of repeat of background images; by default - background-repeat: repeat;
    bgPosition: [ '0% 0%' ],       //array with coordinates of background images; by default - background-position: 0% 0%;
    glassFilter: [ 'transparent' ],//array with color filters for background images; by default color is transparent;
    frame: 0,                      //frame number from which the slider should start working
    duration: 5000,                //time before showing next slide in milliseconds
    autoRun: false,                //slider auto run
    stickerClick: false,           //navigation by slider when you click on certan sticker
    frames: $.noop,                //number of slides
    leftPtr: $.noop,               //id or class of DOM-element that is left button for slider
    rightPtr: $.noop,              //id or class of DOM-element that is right button for slider
    sticker: $.noop,               //id or class of list ul that is block of stickers
    activeClass: $.noop,           //active sticker css-class
    slideOther: {                  //object with settings for loading addintional content inside of slider using AJAX 
      changeParent: $.noop,        //id or class of block in the main document where the content is inserted
      changeTarget: $.noop,        //block class for fetching from an AJAX-loaded document
      insertFrom: $.noop           //html-file in the directory with the main document, where to insert the content
    }
  };
```
The plugin is flexible tool to create a slider. You do not use background images if you want change only background colors and text blocks.

The frames is one of the most important parameters of slider. When you specify the parameter is defined common number of slides.
If not, then number of slides is defined by images array length. If neither one nor the other then slider behavior is not defined. If both are specified, then frames has a priority. It means that inside of slider can be more slides then images.

Images urls are specified in the array images. Local addresses are counted from the HTML document for which the slider is installed. The indices in the arrays bgColor, bgSize, bgRepeat, bgPosition and glassFilter correspond to the indices of the images array and to each other.

For example, if you do not want specify background color for second slide you can write:
```javascript
  bgColor = [
    '#fff',
    ,
    'blue'
  ]
```
glassFilter is set background color over background image:
```javascript
  glassFilter = [
    'rgba(24,255,15,0.49)'
  ]
```
To autorun slider you should set parameter autoRun as true.

Parameter duration define time between slides in milliseconds. By default 5000 mls.

For the slider, you can specify whether you need to use the left / right buttons to navigate, as well as stickers to navigate and display the current slide number. 

To connect the buttons, you need to specify their id or class in the parameters leftPtr and rightPtr:
```javascript
  leftPtr: '#leftPointer',
  rightPtr: '#rightPointer'
```
Sticker is just a list:
```html
  <ul id="headerSticker">
    <li><a href="#"></a></li>
    <li><a href="#"></a></li>
    <li><a href="#"></a></li>
  </ul>
```
To connect this sticker to the slider, you need to specify the id or sticker class in the sticker parameter:
```javascript
  sticker: '#headerSticker'
```
In addition, in the activeClass parameter, you must specify a class that stylizes the active element of the sticker, otherwise the sticker will not be used for displaying and navigating:
```javascript
  activeClass = '.active-sticker'
```
To switch slides by clicking on individual elements of the sticker, you need to set the parameter:
```javascript
  stickerClick: true
```
This slider, in addition to scrolling the background images, allows you to scroll through additional content - text, images, etc. This content is downloaded from the the HTML file specified in settings via AJAX and inserted into the specified document block. To allow it you should set object slideOther.

To specify the HTML file from which the content is downloaded, the insertFrom parameter of the slideOther object is used. This file should be located in the same directory as the HTML document for which the slider is installed.

To specify the block class with the data to retrieve from this HTML document, use the changeTarget parameter.

The changeParent parameter specifies a block in the main HTML document where the selected block with data from the specified HTML document should be inserted.

For example, configure a slider with three frames for scrolling text. In the folder with the index.html file there is a file sliderContent.html with content:
```html
<html>
  <body>
    <div class="slider-title">
      <h1 class="slider-title">Block number one</h1>
      <h1 class="slider-title">Intoduction</h1>
    </div>
    <div class="slider-title">
      <h1 class="slider-title">Block number two</h1>
      <h1 class="slider-title">Main text</h1>
    </div>
    <div class="slider-title">
      <h1 class="slider-title">Block number three</h1>
      <h1 class="slider-title">Post scriptum</h1>
    </div>
  </body>
</html>
```
The block with the slider-title class will be inserted into the #content block of the main document. The slideOther object will look like this:
```javascript
slideOther: {                  
  changeParent: '#content',        
  changeTarget: '.slider-title',        
  insertFrom: 'sliderContent.html'           
}
```
In the first slide, the first slider-title block will be displayed, in the second, the second slider-title block, and so on.

The backgroundSlider () method must be passed either an array with images, or the number of frames slides (or both). The remaining settings can be omitted, because the slider will be installed without them.

