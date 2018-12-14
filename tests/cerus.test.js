const expect = require("chai").expect;
const cerus = require("../index")();
const plugins = () => {
	cerus.plugins().clear();
	return cerus.plugins();
}

describe("cerus", () => {
	describe("#plugins", () => {
		describe("#add", () => {
			context("with an already used name", () => {
				it("should throw an Error", () => {
					const func = () => {
						const _plugins = plugins();
						_plugins.add({name: "used"});
						_plugins.add({name: "used"});
					}

					expect(func).to.throw();
				});
			});

			context("with a non-existant dependency", () => {
				it("should throw a TypeError", () => {
					const func = () => {
						plugins().add({name: "correct", dependencies: ["non-existant"]});
					}

					expect(func).to.throw();
				});
			});

			context("with a existant dependency", () => {
				it("shouldn't throw any errors", () => {
					const func = () => {
						const _plugins = plugins();
						
						_plugins.add({name: "existant"});
						_plugins.add({name: "correct", dependencies: ["existant"]});
					}

					expect(func).to.not.throw();
				});
			});

			context("with an entry with a non-function value", () => {
				it("shouldn't throw any errors", () => {
					plugins().add({
						name: "correct",
						extra: "non-function"
					});

					expect(cerus.extra).to.deep.equal(undefined)
				});
			});

			context("with an entry with the _init and a custom function", () => {
				it("should add the custom function and call the _init function", () => {
					const _plugins = plugins();
					let called = false;

					_plugins.add({
						name: "entry",
						_init: () => {
							called = true;

							return "initializing";
						},
						extra: () => {
							return "should be added";
						}
					});

					expect(called).to.equal(true);
					expect(cerus.extra).to.be.a("function");
				})
			});
		});

		describe("#remove", () => {
			context("with a non-existant plugin", () => {
				it("should throw an Error", () => {
					const func = () => {
						plugins().remove("non-existant");
					}

					expect(func).to.throw();
				});
			});

			context("with an existant plugin", () => {
				it("shouldn't throw any errors", () => {
					const func = () => {
						const _plugins = plugins();

						_plugins.add({name: "existant"});
						_plugins.remove("existant");
					}

					expect(func).to.not.throw();
				});
			});

			context("with an existant plugin that is depended on", () => {
				it("should throw an Error", () => {
					const func = () => {
						const _plugins = plugins();

						_plugins.add({name: "core"});
						_plugins.add({name: "plugin", dependencies: ["core"]});
						_plugins.remove("core");
					}

					expect(func).to.throw();
				});
			});

			context("while it has entries", () => {
				it("should remove the entry", () => {
					const _plugins = plugins();

					_plugins.add({
						name: "existant",
						extra: () => {
							return "this is added and then removed";
						}
					});
					_plugins.remove("existant");
					expect(_plugins.list().length).to.equal(0);
				});
			});
		});

		describe("#has", () => {
			context("with a non-existant plugin", () => {
				it("should return false", () => {
					expect(plugins().has("non-existant")).to.deep.equal(false);
				});
			});

			context("with an existant plugin", () => {
				it("should return true", () => {
					const _plugins = plugins();

					_plugins.add({name: "existant"});
					expect(_plugins.has("existant")).to.deep.equal(true);
				});
			});
		});

		describe("#list", () => {
			context("with no plugins", () => {
				it("should return an empty array", () => {
					expect(plugins().list()).to.deep.equal([]);
				});
			});

			context("with a single plugin", () => {
				it("should return an array with the name", () => {
					const _plugins = plugins();

					_plugins.add({name: "plugin1"});
					expect(_plugins.list()).to.deep.equal(["plugin1"]);
				});
			});

			context("with multiple plugins", () => {
				it("should return an array of names", () => {
					const _plugins = plugins();

					_plugins.add({name: "plugin1"});
					_plugins.add({name: "plugin2"});
					expect(_plugins.list()).to.deep.equal(["plugin1", "plugin2"]);
				});
			});
		});
	});

	describe("#use", () => {
		it("should work the same as .plugins().add()", () => {
			const _plugins = plugins();

			cerus.use({name: "plugin"});
			expect(_plugins.list().length).to.equal(1);
		});	
	});
});