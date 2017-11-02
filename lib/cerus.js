module.exports = function() {
	var self = {};

	self.exit = function(code) {
		code = code || 0;

		process.exit(code);
	}

	self.use = function(plugin) {
		if(typeof plugin !== "object" || plugin == null) {
			throw new TypeError("argument plugin must be an object");
		}

		var name = plugin["name"];
		var version = plugin["version"];

		if(name === undefined) {
			throw new TypeError("argument plugin.name must be a string");
		}

		if(typeof version !== "string") {
			throw new TypeError("argument plugin.version can only be a string");
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
	}

	return self;
}