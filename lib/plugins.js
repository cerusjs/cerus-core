/**
 * With this class you can manage your plugins. A plugin is an object that contains functions that 
 * are added to the cerus core. This means that with this class you can manage the plugins that 
 * will expand CerusJS' functionality.
 * @example
 * // this is a basic example of adding a plugin
 * var plugin = {
 *   name: "example",
 *   example: function() {
 *     return "example";
 *   } 
 * };
 * 
 * cerus.plugins().add(plugin); // or cerus.use(plugin);
 * // -> this will add the specified plugin
 *
 * cerus.example();
 * // -> this will now return "example"
 * @class plugins
 */
class plugins {
	constructor(cerus) {
		this._plugins = {};
		this._cerus = cerus;
	}

	/**
	 * This function is used to add a new plugin to CerusJS' core. You can add the plugin using the 
	 * plugin parameter. The plugin object must contain a name else it will throw a TypeError. If 
	 * the plugin has already been added it will also throw an Error. If you want to re-add a 
	 * plugin you have to remove the old plugin first. You can also add dependencies to your 
	 * plugin. This means that before adding the plugin your list of dependencies is checked. If a 
	 * dependency isn't added yet it'll throw an error. All keys, apart from the name and 
	 * dependencies, that aren't function are removed from the object. If you add a _init function 
	 * (was init_, but that is deprecated) that function will not be added and will be called to 
	 * initialize the plugin. It is called with the cerus object as parameter. This is how a plugin
	 * should get access to the cerus object. The rest of the functions are added to the cerus core
	 * if the key isn't taken yet.
	 * @example
	 * var plugin = {
	 *   name: "example",
	 *   example: function() {
	 *     return "example";
	 *   } 
	 * };
	 * 
	 * cerus.plugins().add(plugin);
	 * // -> this will add the specified plugin
	 * @example
	 * var plugin = {
	 *   name: "example",
	 *   _init: function() {
	 *     console.log("initialized the plugin");
	 *   },
	 *   example: function() {
	 *     return "example";
	 *   } 
	 * };
	 * 
	 * cerus.plugins().add(plugin);
	 * // -> this will add the specified plugin and call the _init function.
	 * @summary Adds a new plugin to the CerusJS core.
	 * @param {Object} plugin The plugin object that contains the plugin that will be added.
	 * @param {String} plugin.name The name of the plugin.
	 * @param {String[]} (plugin.dependencies) The dependencies for the plugin.
	 * @function add
	 * @id plugins.add
	 */
	add(plugin) {
		// Check if the arguments are correct
		if(typeof plugin !== "object" || plugin === null) {
			throw new TypeError("the argument plugin must be an object");
		}

		// Create variables for the name and dependencies
		var name = plugin["name"];
		var dependencies = plugin["dependencies"];

		// Check if the name is correct
		if(typeof name !== "string") {
			throw new TypeError("the argument plugin.name must be a string");
		}

		// Check if the name isn't used yet
		if(this._plugins[name] !== undefined) {
			throw new Error("the inserted plugin has already been added");
		}

		// Check if the dependencies are correct
		if(!(dependencies instanceof Array)) {
			dependencies = [];
		}

		// Loop through all of the dependencies
		for(var i = 0; i < dependencies.length; i++) {
			// Check if the dependency is correct
			if(typeof dependencies[i] !== "string") {
				throw new TypeError("the argument plugin.dependencies can only be an array of strings");
			}

			// Check if the dependency has been added
			if(this._plugins[dependencies[i]] === undefined) {
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

			// Say the init_ entry is deprecated and call it (will be removed in a future version)
			if(key === "init_") {
				console.log("(deprecation) using init_ is deprecated and _init should be used instead");
				plugin[key](this._cerus);
			}

			// Call the _init functions
			if(key === "_init") {
				plugin[key](this._cerus);
			}

			// Add the entry if the specified key is still free
			else if(this._cerus[key] === undefined) {
				this._cerus[key] = plugin[key];
			}

			// Remove the entries that are already used
			else {
				delete plugin[key];
			}
		}

		// Add the plugin and it's data to the array
		this._plugins[name] = {
			name, dependencies, funcs: plugin
		};
	}

	/**
	 * With this function you can remove a plugin. The plugin removed can be specified with the name 
	 * parameter. A plugin cannot be removed if it hasn't been added yet. All plugins are also checked
	 * if they don't depend on the plugin that will be removed. An error will be throw if this is the 
	 * case. Before the plugin is removed of the list it's function are removed from the cerus core.
	 * @example
	 * // with plugin "example" already added
	 * cerus.plugins().remove("example");
	 * // -> will remove the cerus plugin
	 * @summary Removes a plugin from the cerus core.
	 * @param {String} name The name of the plugin that will be removed.
	 * @function remove
	 * @id plugins.remove
	 */
	remove(name) {
		// Check if the arguments are correct
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		// Check if the specified plugin exists
		if(this._plugins[name] === undefined) {
			throw new Error("the specified plugin doesn't exist");
		}

		// Loop through the dependencies to check if the specified plugin isn't depended upon
		for(var plugin in this._plugins) {
			if(this._plugins[plugin].dependencies.includes(name)) {
				throw new Error("the plugin " + plugin + " depends on this plugin");
			}
		}

		var plugin_ = this._plugins[name];

		// Loop through the plugin's entries to remove them from cerus
		for(var func in plugin_.funcs) {
			func = plugin_.funcs[func];

			if(func !== "_init") {
				delete this._cerus[func];
			}
		}

		// Delete the plugin from the list
		delete this._plugins[name];
	}

	/**
	 * This function will check if the specified plugin is added to CerusJS' core.
	 * @example
	 * // with plugin "example" already added
	 * cerus.plugins().has("example");
	 * // -> will return true
	 * @summary Checks if the plugin has been added to the cerus core.
	 * @param {String} name The name of the plugin that will be checked.
	 * @return {Boolean} If the plugin has been added to CerusJS' core.
	 * @function has
	 * @id plugins.has
	 */
	has(name) {
		// Check if the arguments are correct
		if(typeof name !== "string") {
			throw new TypeError("the argument name must be a string");
		}

		// Return if the list of plugins includes the specified name
		return Object.keys(this._plugins).includes(name);
	}

	/**
	 * This function will list all of the plugins that have been added to CerusJS' core.
	 * @summary Lists all plugins added to the cerus core.
	 * @function list
	 * @id plugins.list
	 */
	list() {
		return Object.keys(this._plugins);
	}

	/**
	 * With this function you can clear all of the current plugins. Before they are removed from the 
	 * plugin list their functions are removed from the cerus core.
	 * @summary Clears all of the plugins.
	 * @function clear
	 * @id plugins.clear
	 */
	clear() {
		var left = {};

		for(var plugin in this._plugins) {
			try {
				this.remove(plugin);
			}
			catch(e) {
				left[plugin] = this._plugins[plugin];
			}
		}

		if(Object.keys(left).length > 0) {
			this._plugins = left;
			this.clear();
		}
	}
}

module.exports = plugins;