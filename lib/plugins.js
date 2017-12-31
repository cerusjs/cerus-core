/**
 * @class plugins
 */
var plugins = module.exports = function(cerus) {
	this._plugins = {};
}

/**
 * @function plugins.add
 */
plugins.prototype.add = function(plugin) {
	if(typeof plugin !== "object" || plugin === null) {
		throw new TypeError("the argument plugin must be an object");
	}

	var name = plugin["name"];
	var version = plugin["version"];
	var dependencies = plugin["dependencies"];

	if(typeof name !== "string") {
		throw new TypeError("the argument plugin.name must be a string");
	}

	if(typeof version !== "string") {
		throw new TypeError("the argument plugin.version can only be a string");
	}

	if(typeof dependencies !== "object" || dependencies === null) {
		dependencies = [];
	}

	for(var i = 0; i < dependencies.length; i++) {
		if(this._plugins[dependencies[i]] === undefined) {
			throw new Error("the dependency '" + dependencies[i] + "' has not been loaded yet");
		}
	}

	for(var key in plugin) {
		if(typeof plugin[key] !== "function") {
			delete plugin[key];
			continue;
		}

		if(key === "init_") {
			console.log("(deprecation) the plugin initiation function has been changed to _init!");
		}

		if(key === "_init") {
			plugin[key](cerus);
		}
		else if(cerus[key] === undefined) {
			cerus[key] = plugin[key];
		}
	}

	this._plugins[name] = {
		"name": name,
		"version": version,
		"funcs": plugin,
		"dependencies": dependencies
	}
}

/**
 * @function plugins.remove
 */
plugins.prototype.remove = function(name) {
	if(typeof name !== "string") {
		throw new TypeError("the argument name must be a string");
	}

	if(this._plugins[name] === undefined) {
		throw new Error("the specified plugin doesn't exist");
	}

	for(var plugin in this._plugins) {
		if(this._plugins[plugin].dependencies.includes(name)) {
			throw new Error("the plugin " + plugin + " depends on this plugin");
		}
	}

	var plugin = this._plugins[name];

	for(var func in plugin.funcs) {
		func = plugin.funcs[func];

		if(func !== "_init") {
			delete cerus[func];
		}
	}

	delete this._plugins[name];
}

/**
 * @function plugins.has
 */
plugins.prototype.has = function(name) {
	if(typeof name !== "string") {
		throw new TypeError("the argument name must be a string");
	}

	return Object.keys(this._plugins).includes(name);
}

/**
 * @function plugins.list
 */
plugins.prototype.list = function(name) {
	return Object.keys(this._plugins);
}