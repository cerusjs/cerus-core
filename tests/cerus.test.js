var expect = require("chai").expect;
var cerus = require("../index")();
var plugins = function() {
	cerus.plugins().clear();
	return cerus.plugins();
}

describe("cerus", function() {
	describe("#plugins", function() {
		describe("constructor", function() {
			context("with no arguments", function() {
				it("shouldn't throw any errors", function() {
					plugins();
				});
			});
		});

		describe("#add", function() {
			context("with no arguments", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						plugins().add();
					}

					expect(func).to.throw();
				});
			});

			context("with an incorrect first argument", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						plugins().add("incorrect");
					}

					expect(func).to.throw();
				});
			});

			context("with an undefined name", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						plugins().add({name: ["incorrect"]});
					}

					expect(func).to.throw();
				});
			});

			context("with an already used name", function() {
				it("should throw an Error", function() {
					var func = function() {
						var plugins_ = plugins();
						plugins_.add({name: "used"});
						plugins_.add({name: "used"});
					}

					expect(func).to.throw();
				});
			});

			context("with a correct name", function() {
				it("shouldn't throw any errors", function() {
					var func = function() {
						plugins().add({name: "correct"});
					}

					expect(func).to.not.throw();
				});
			});

			context("with undefined dependencies", function() {
				it("shouldn't throw any errors", function() {
					var func = function() {
						plugins().add({name: "correct", dependencies: undefined});
					}

					expect(func).to.not.throw();
				});
			});

			context("with a non-existant dependency", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						plugins().add({name: "correct", dependencies: ["non-existant"]});
					}

					expect(func).to.throw();
				});
			});

			context("with a existant dependency", function() {
				it("shouldn't throw any errors", function() {
					var func = function() {
						var plugins_ = plugins();
						plugins_.add({name: "existant"});
						plugins_.add({name: "correct", dependencies: ["existant"]});
					}

					expect(func).to.not.throw();
				});
			});

			context("with non-function entries", function() {
				it("shouldn't throw any errors", function() {
					var func = function() {
						plugins().add(
						{
							name: "correct",
							extra: "non-function"
						});
					}

					expect(func).to.not.throw();
				});
			});

			context("with function entries", function() {
				it("shouldn't throw any errors", function() {
					var func = function() {
						plugins().add(
						{
							name: "correct",
							extra: function() {
								return "should be added";
							}
						});
					}

					expect(func).to.not.throw();
				})
			});

			context("with an _init function entry", function() {
				it("shouldn't throw any errors", function() {
					var func = function() {
						plugins().add(
						{
							name: "correct",
							_init: function() {
								return "initializing";
							}
						});
					}

					expect(func).to.not.throw();
				})
			});
		});

		describe("#remove", function() {
			context("with no arguments", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						plugins().remove();
					}

					expect(func).to.throw();
				});
			});

			context("with an incorrect first argument", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						plugins().remove(["incorrect"]);
					}

					expect(func).to.throw();
				});
			});

			context("with a non-existant plugin", function() {
				it("should throw an Error", function() {
					var func = function() {
						plugins().remove("non-existant");
					}

					expect(func).to.throw();
				});
			});

			context("with an existant plugin", function() {
				it("shouldn't throw any errors", function() {
					var func = function() {
						var plugins_ = plugins();
						plugins_.add({name: "existant"});
						plugins_.remove("existant");
					}

					expect(func).to.not.throw();
				});
			});

			context("with an existant plugin that is depended on", function() {
				it("should throw an Error", function() {
					var func = function() {
						var plugins_ = plugins();
						plugins_.add({name: "core"});
						plugins_.add({name: "plugin", dependencies: ["core"]});
						plugins_.remove("core");
					}

					expect(func).to.throw();
				});
			});

			context("while it has entries", function() {
				it("shouldn't throw any errors", function() {
					var func = function() {
						var plugins_ = plugins();
						plugins_.add(
						{
							name: "existant",
							extra: function() {
								return "this is added and then removed";
							}
						});
						plugins_.remove("existant");
					}

					expect(func).to.not.throw();
				});
			});
		});

		describe("#has", function() {
			context("with no arguments", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						plugins().has();
					}

					expect(func).to.throw();
				});
			});

			context("with an incorrect first argument", function() {
				it("should throw a TypeError", function() {
					var func = function() {
						plugins().has(["incorrect"]);
					}

					expect(func).to.throw();
				});
			});

			context("with a non-existant plugin", function() {
				it("should return false", function() {
					expect(plugins().has("non-existant")).to.deep.equal(false);
				});
			});

			context("with an existant plugin", function() {
				it("should return true", function() {
					var plugins_ = plugins();
					plugins_.add({name: "existant"});

					expect(plugins_.has("existant")).to.deep.equal(true);
				});
			});
		});

		describe("#list", function() {
			context("with no plugins", function() {
				it("should return an empty array", function() {
					var plugins_ = plugins();
					expect(plugins_.list()).to.deep.equal([]);
				});
			});

			context("with a single plugin", function() {
				it("should return an array with the name", function() {
					var plugins_ = plugins();
					plugins_.add({name: "plugin1"});
					expect(plugins_.list()).to.deep.equal(["plugin1"]);
				});
			});

			context("with multiple plugins", function() {
				it("should return an array of names", function() {
					var plugins_ = plugins();
					plugins_.add({name: "plugin1"});
					plugins_.add({name: "plugin2"});
					expect(plugins_.list()).to.deep.equal(["plugin1", "plugin2"]);
				});
			});
		});
	});

	describe("#use", function() {
		it("should work the same as .plugins().add()", function() {
			var plugins_ = plugins();
			cerus.use({name: "plugin"});
			expect(plugins_.list().length).to.equal(1);
		});	
	});
});