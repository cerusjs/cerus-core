/**
 * This is the core cerus class. This "function" will return an object with some functions 
 * pre-added to it. This object can be seen as the CerusJS core. When adding plugins to cerus they 
 * are added to this abject. For this functionality two functions have been pre-added to the object
 * .plugins() and .use(). Both help you with managing the plugins. For more information about 
 * plugins you can read the tutorial about it.
 * @class cerus
 * @nofunction
 */
module.exports = function() {
	var cerus = {};
	var plugins = new (require("./plugins"))(cerus);

	/**
	 * This function returns the plugin managing class. With this class you can not only add, but also
	 * remove, list, clear, etc. your plugins.
	 * @summary Returns the plugin managing class.
	 * @return {Class} The plugins class.
	 * @function plugins
	 */
	cerus.plugins = function() {
		return plugins;
	};

	/**
	 * With this function you can easily add a new plugin to the core. It is basically a shortcut for 
	 * .plugins().add(). This means this plugin will check and then add the plugin, exactly the same as
	 * .plugins().add(). For more information about adding plugins, see {@link plugins.add}.
	 * @example
	 * // in this example a plugin is added to the cerus core
	 * // plugin -> {
	 * //   name: "example",
	 * //   version: "0.0.1",
	 * //   dependencies: []
	 * // }
	 * 
	 * cerus.use(plugin);
	 * // -> will add the plugin to the cerus core
	 * @summary Adds a new plugin to the core.
	 * @param {Object} plugin The plugin object that contains the plugin that will be added.
	 * @function use
	 */
	cerus.use = function(plugin) {
		plugins.add(plugin);
	};

	return cerus;
};
