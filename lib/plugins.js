var _plugins, _cerus;

/**
 * @class plugins
 */
var plugins = module.exports = function(cerus) {
	_plugins = {};
	_cerus = cerus;
}

/**
 * @function plugins.add
 */
plugins.prototype.add = function(plugin) {
	if(typeof plugin !== "object" || plugin === null) {
		throw new TypeError("the argument plugin must be an object");
	}

	//console.log(this._plugins);

	var name = plugin["name"];
	var version = plugin["version"];
	var dependencies = plugin["dependencies"];

	if(typeof name !== "string") {
		throw new TypeError("the argument plugin.name must be a string");
	}

	if(_plugins[name] !== undefined) {
		throw new Error("the inserted plugin has already been added");
	}

	if(typeof version !== "string") {
		throw new TypeError("the argument plugin.version can only be a string");
	}

	if(typeof dependencies !== "object" || dependencies === null) {
		dependencies = [];
	}

	for(var i = 0; i < dependencies.length; i++) {
		if(_plugins[dependencies[i]] === undefined) {
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
			plugin[key](_cerus);
		}
		else if(_cerus[key] === undefined) {
			_cerus[key] = plugin[key];
		}
	}

	_plugins[name] = {
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

	if(_plugins[name] === undefined) {
		throw new Error("the specified plugin doesn't exist");
	}

	for(var plugin in _plugins) {
		if(_plugins[plugin].dependencies.includes(name)) {
			throw new Error("the plugin " + plugin + " depends on this plugin");
		}
	}

	var plugin = _plugins[name];

	for(var func in plugin.funcs) {
		func = plugin.funcs[func];

		if(func !== "_init") {
			delete _cerus[func];
		}
	}

	delete _plugins[name];
}

/**
 * @function plugins.has
 */
plugins.prototype.has = function(name) {
	if(typeof name !== "string") {
		throw new TypeError("the argument name must be a string");
	}

	return Object.keys(_plugins).includes(name);
}

/**
 * @function plugins.list
 */
plugins.prototype.list = function(name) {
	return Object.keys(_plugins);
}

/**
 * @function plugins.clear
 */
plugins.prototype.clear = function() {
	_plugins = {};
}