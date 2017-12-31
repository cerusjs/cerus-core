var _plugins, _cerus;

/**
 * @class plugins
 */
var plugins = module.exports = function(cerus) {
	// Initialize all the private variables
	_plugins = {};
	_cerus = cerus;
}

/**
 * @function plugins.add
 */
plugins.prototype.add = function(plugin) {
	// Check if the arguments are correct
	if(typeof plugin !== "object" || plugin === null) {
		throw new TypeError("the argument plugin must be an object");
	}

	// Create variables for the name, version and dependencies
	var name = plugin["name"];
	var version = plugin["version"];
	var dependencies = plugin["dependencies"];

	// Check if the name is correct
	if(typeof name !== "string") {
		throw new TypeError("the argument plugin.name must be a string");
	}

	// Check if the name isn't used yet
	if(_plugins[name] !== undefined) {
		throw new Error("the inserted plugin has already been added");
	}

	// Check if the version is correct
	if(typeof version !== "string") {
		throw new TypeError("the argument plugin.version can only be a string");
	}

	// Check if the depencies are correct
	if(typeof dependencies !== "object" || dependencies === null) {
		dependencies = [];
	}

	// Loop through all of the dependecies
	for(var i = 0; i < dependencies.length; i++) {
		// Check if the dependency is correct
		if(typeof dependencies[i] !== "string") {
			throw new TypeError("the argument plugin.dependencies can only be an array of strings");
		}

		// Check if the dependency has been added
		if(_plugins[dependencies[i]] === undefined) {
			throw new Error("the dependency '" + dependencies[i] + "' has not been loaded yet");
		}
	}

	// Loop though all the possible entries
	for(var key in plugin) {
		// Skip the entries that aren't functions
		if(typeof plugin[key] !== "function") {
			delete plugin[key];
			continue;
		}

		// Say the init_ entry is deprecated
		if(key === "init_") {
			console.log("(deprecation) the plugin initiation function has been changed to _init!");
		}

		// Call the _init functions
		if(key === "_init") {
			plugin[key](_cerus);
		}

		// Add the entry if the specified key is still free
		else if(_cerus[key] === undefined) {
			_cerus[key] = plugin[key];
		}

		// Remove the entries that are already used
		else {
			delete plugin[key];
		}
	}

	// Add the plugin and it's data to the array
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
	// Check if the arguments are correct
	if(typeof name !== "string") {
		throw new TypeError("the argument name must be a string");
	}

	// Check if the specified plugin exists
	if(_plugins[name] === undefined) {
		throw new Error("the specified plugin doesn't exist");
	}

	// Loop through the dependencies to check if the specified plugin isn't depended upon
	for(var plugin in _plugins) {
		if(_plugins[plugin].dependencies.includes(name)) {
			throw new Error("the plugin " + plugin + " depends on this plugin");
		}
	}

	var plugin = _plugins[name];

	// Loop through the plugin's entries to remove them from cerus
	for(var func in plugin.funcs) {
		func = plugin.funcs[func];

		if(func !== "_init") {
			delete _cerus[func];
		}
	}

	// Delete the plugin from the list
	delete _plugins[name];
}

/**
 * @function plugins.has
 */
plugins.prototype.has = function(name) {
	// Check if the arguments are correct
	if(typeof name !== "string") {
		throw new TypeError("the argument name must be a string");
	}

	// Return if the list of plugins includes the specified name
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