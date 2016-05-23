To install dependencies:
    npm install
    cd app/; bower install (needed for building the project)

Run a static file server (serves the dist/ folder):
    grunt serve

Run tests:
    grunt test (needs Node >= 4)

Build project:
    grunt build

JS/CSS libs used:
    * Rivets.js, a small data binding framework
    * ES6 Promise polyfill for IE
    * Skeleton CSS framework

Notes about the project:
    * HTML is fully W3C compliant
    * Responsive layout
    * Minified CSS and JS
    * Lazy loading of games for faster loading times
    * Tested in Chrome 50, Firefox 42, Safari 9.1 and IE 10
    * Stylesheets in CSS3 (SASS based)
