Office365 Home Premium -- primitive man's daily life with Office365 
===================================================================


Little stories about a primitive man family that overcame difficulties with the help of Office365 Home Premium in daily life. Showing the new features of the product. The site is constructed with [Backbone Marionette](http://marionettejs.com/) and applies responsive design. It has been tested on most modern browsers like Chrome( desktop and android devices), Internet Explorer10/11( desktop and windows phone ), firefox and Safari( desktop and iPad/iPhone ). 

See the official website [here](http://www.microsoft.com/china/officeconsumer/campaign).

![](https://raw.github.com/McDo/office365/master/README/envelop.png)

Prerequisite
------------

  - [Brunch.io](http://brunch.io/) *v1.7.13*
  - [Compass](http://compass-style.org/) *v0.12.2* 
  - [Modernizr](http://modernizr.com/) *v2.6.2* (custom build for media query)
  - [Backbone](http://backbonejs.org/) *v1.0.0*
  - [Underscore](http://underscorejs.org/) *v1.5.1*
  - [Backbone Marionette](http://marionettejs.com/) *v1.1.0*
  - [jQuery](http://code.jquery.com/jquery-1.7.2.min.js) *v1.7.2*
  - [jquery.mousewheel.js](https://github.com/brandonaaron/jquery-mousewheel) *v3.1.3*
  - [jquery.scrollTo.js](https://github.com/flesler/jquery.scrollTo) *v1.4.6*
  - [jquery.easing.js](http://gsgd.co.uk/sandbox/jquery/easing/) *v1.3*
  - [jquery.event.mousestop.js](http://richardscarrott.co.uk/posts/view/jquery-mousestop-event) *v0.1.1*
  - [jquery.hammer.js](http://eightmedia.github.io/hammer.js/) *v1.0.6dev*
  - [jquery.bgpos.js](http://eightmedia.github.io/hammer.js/) (bug fixed on IE11)
  - [paper.js](http://paperjs.org/) *v0.9.9*
  - [easeljs](http://www.createjs.com/#!/EaselJS) *v0.6.1*
  - [tween.js](http://www.createjs.com/#!/TweenJS)

Getting started
---------------
###step1
getting [node.js](http://nodejs.org) if you don't have one.

###step2
Installing brunch, the project building tool.
```sh
sudo npm install brunch -g
```

###step3
Cloning the repository.
```sh
git clone https://github.com/McDo/office365.git
cd ./office365
```

###step4
Installing [Compass](http://compass-style.org/), and open-source css authoring framework, and compiling all sass files to css. 
```sh
cd ./compass
compass watch
```

###step5
Building the project ( minify and concatenate js, css files, etc. ) and starting the local server.
Go to root directory of the project, and
```sh
brunch watch --server -P
```
or
```sh
npm start
```
Accessing it from http://localhost:3333 and have fun with it.

Project Structure
-----------------
The project is built with an AppController ( extends from Marionette Controller ) and several Views ( extend from Backbone Marionette ItemView ). The View controls behaviors of the attached DOM element and all of its sub-elements, and the AppController is in charge of deciding which View is about to show up depends on user interactions and change the routes. Although the project doesn't have any backend data, it's still cool to construct it in a MVC style with Backbone and Marionette that we can easily add or modify a view without interferer other part of the code. 

Here is the full structure of the code: 

![](https://raw.github.com/McDo/office365/master/README/tree.jpg)


What if confused with the code ...
----
I've tried my best to annotate the code for some time. But maybe you would find some parts are hard to understand ( sorry about that but I'm not a native english speaker after all ) still. So if you find any issue with the comments or the code, please send [me](mailto:mcdooooo@gmail.com) an email or use the [issue tracker](https://github.com/McDo/office365/issues/new). 

Thanks.


License
----

MIT

Copyright (c) 2013 Logicdeisgn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


    