var cerus = {};
var plugins = new (require("./plugins"))(cerus);

/**
 * @class cerus
 */
module.exports = function() {
	return cerus;
}

/**
 * @function cerus.plugins
 */
cerus.plugins = function() {
	return plugins;
}

/**
 * @function cerus.use
 */
cerus.use = function(plugin) {
	plugins.add(plugin);
}

/*
 // OLD CODE //
module.exports = function() {
	var self = {};

	var plugins = [];

	self.use = function(plugin) {
		if(typeof plugin !== "object" || plugin == null) {
			throw new TypeError("argument plugin must be an object");
		}

		var name = plugin["name"];
		var version = plugin["version"];
		var dependencies = plugin["dependencies"];

		if(name === undefined) {
			throw new TypeError("argument plugin.name must be a string");
		}

		if(typeof version !== "string") {
			throw new TypeError("argument plugin.version can only be a string");
		}

		if(typeof dependencies !== "object" || dependencies === null) {
			dependencies = [];
		}

		for(var i = 0; i < dependencies.length; i++) {
			if(plugins[dependencies[i]] === undefined) {
				throw new Error("Dependency '" + dependencies[i] + "' has not been loaded yet");
			}
		}

		for(var key in plugin) {
			if(typeof plugin[key] !== "function") {
				delete plugin[key];
				continue;
			}

			if(key === "init_") {
				plugin[key](self);
			}
			else if(self[key] === undefined) {
				self[key] = plugin[key];
			}
		}

		plugins[name] = {
			"name": name,
			"version": version,
			"funcs": plugin,
			"dependencies": dependencies
		}
	}

	return self;
}
*/