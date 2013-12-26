
var AppController = require("./controller/AppController");
var Router = require("./routes/router");

var app = new Marionette.Application();

app.addInitializer(function() {
    app.controller = new AppController();

    app.router = new Router({
        controller: app.controller
    });
});

app.on("initialize:after", function() {

    if ( Backbone.history ) {
        Backbone.history.start();
    }

});

module.exports = app;
