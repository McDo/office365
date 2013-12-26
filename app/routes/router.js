
module.exports = Marionette.AppRouter.extend({

	appRoutes: {
		"!/feature/:id": "scrollTo",
		"!/share": "share",

		":missing": "missing",
		"!/:missing": "missing",
		"!/:missing/:missing": "missing",
		"!/:missing/:missing/:missing": "missing"
	}
	
});