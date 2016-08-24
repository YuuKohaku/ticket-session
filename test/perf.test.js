'use strict'

describe("PERF", function () {
	this.timeout(100000);
	this.slow(0);
	let iterations = 2000000;
	console.log("ITERATIONS x %d", iterations)
	describe('concat', function () {
		let x1, x2;
		beforeEach(function () {
			x1 = Array(6);
			x2 = Array(10);
			_.fill(x1, 'x1');
			_.fill(x2, 'x2');
		});

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.concat(x1, x2)
			}
		});

		it('native12', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.concat(x2);
			}
		});

		it('native21', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x2.concat(x1);
			}
		});

		it('push', function () {
			let res, j, l = x2.length;
			for (var i = 0; i < iterations; i++) {
				res = x1.slice();
				for (j = 0; j < l; j++) {
					res.push(x2[j]);
				}
			}
		});

		it('push+apply', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.slice();
				res.push.apply(res, x2);
			}
		});
	});

	describe('map', function () {
		let x1, x2;
		let fn = function (x) {
			return x;
		}
		beforeEach(function () {
			x1 = Array(6);
			x2 = Array(10);
			_.fill(x1, 'x1');
			_.fill(x2, 'x2');
		});

		it('native', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.map(fn)
			}
		});

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.map(x1, fn)
			}
		});

		it('push + for of', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = [];
				for (var j of x1) {
					res.push(fn(j));
				}
			}
		});

		it('push + for', function () {
			let res, j, l = x1.length;
			for (var i = 0; i < iterations; i++) {
				res = [];
				for (j = 0; j < l; j++) {
					res.push(fn(x1[j]));
				}
			}
		});


		it('push + while ', function () {
			let res, k = x1.length,
				l = x1.length;
			for (var i = 0; i < iterations; i++) {
				res = Array(k);
				while (l--) {
					res[k - l] = (fn(x1[k - l - 1]));
				}
				l = k;
			}
		});

	});

	describe('forEach', function () {
		let x1, x2;
		beforeEach(function () {
			x1 = Array(6);
			x2 = Array(10);
			_.fill(x1, 'x1');
			_.fill(x2, 'x2');
		});

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				_.forEach(x1, _.identity)
			}
		});


		it('push + for of', function () {
			let res, j;
			for (var i = 0; i < iterations; i++) {
				res = [];
				for (j of x1) {
					_.identity(j);
				}
			}
		});

		it('push + for in', function () {
			let res, j;
			for (var i = 0; i < iterations; i++) {
				res = [];
				for (j in x1) {
					_.identity(x1[j]);
				}
			}
		});

		it('push + while ', function () {
			let res, k = x1.length,
				l = x1.length;
			for (var i = 0; i < iterations; i++) {
				while (l--) {
					_.identity(x1[k - l - 1]);
				}
				l = k;
			}
		});
		it('push + for ', function () {
			let res, j, l = x1.length;
			for (var i = 0; i < iterations; i++) {
				for (j = 0; j < l; j++) {
					_.identity(x1[j]);
				}
			}
		});
	});

	describe('isArray', function () {
		let x1, x2;
		beforeEach(function () {
			x1 = Array(6);
			x2 = Array(10);
			_.fill(x1, 'x1');
			_.fill(x2, 'x2');
		});

		it('lodash', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = _.isArray(x1)
			}
		});


		it('native', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = Array.isArray(x1)
			}
		});

		it('instanceOf', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1 instanceof Array;
			}
		});

		it('proto', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = Object.prototype.toString.call(x1) == "[object Array]"
			}
		});

		it('constructor', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				res = x1.constructor === Array;
			}
		});
	});

	describe('setter', function () {
		class Agent {
			set prop(val) {
				this._prop = val;
			}
			setProp(val) {
				this._prop = val;
			}
		}

		let inst;

		beforeEach(function () {
			inst = new Agent();
		});

		it('setter', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				inst.prop = Math.random()
			}
		});


		it('method', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				inst.setProp(Math.random())
			}
		});

		it('direct', function () {
			let res;
			for (var i = 0; i < iterations; i++) {
				inst._prop = Math.random()
			}
		});
	});

	describe('graph traverse', function () {
		describe('class-content', function () {

			class Agent {
				constructor(i) {
					this.index = i;
					this.content = null;
				}
			}

			let addrs = ['1.content.2.content.3', '1.content.0.content.0', '1.content.1.content.4.content.id'];
			let inst;

			before(function () {
				inst = _.map(Array(20), (a, i) => new Agent(i));
				inst[0].content = [null, inst[1], inst[2]];
				inst[1].content = [inst[3], inst[4], inst[5], inst[6]];
				inst[2].content = {
					'a': inst[7],
					'b': inst[8]
				}
				inst[3].content = new Set([inst[9]]);
				inst[4].content = [inst[10], inst[11], inst[12], inst[13], inst[14]]
				inst[5].content = [inst[15], inst[16], inst[17], inst[18]]
				inst[14].content = {
					'id': inst[19]
				}

				// console.log(require('util')
				// 	.inspect(inst[0], {
				// 		depth: null
				// 	}));
			});

			it('set-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[1])
				}
			});

			it('arr-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[0])

				}
			});

			it('obj-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[2])

				}
			});

			it('set', function () {
				let res, path = addrs[1].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});

			it('arr', function () {
				let res, path = addrs[0].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});

			it('obj', function () {
				let res, path = addrs[2].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});
		});
		describe('obj-content', function () {
			let addrs = ['1.content.2.content.3', '1.content.0.content.0', '1.content.1.content.4.content.id'];
			let inst;

			before(function () {
				inst = _.map(Array(20), (a, i) => {
					let o = {};
					o.index = i;
					return o;
				});
				inst[0].content = [null, inst[1], inst[2]];
				inst[1].content = [inst[3], inst[4], inst[5], inst[6]];
				inst[2].content = {
					'a': inst[7],
					'b': inst[8]
				}
				inst[3].content = new Set([inst[9]]);
				inst[4].content = [inst[10], inst[11], inst[12], inst[13], inst[14]]
				inst[5].content = [inst[15], inst[16], inst[17], inst[18]]
				inst[14].content = {
					'id': inst[19]
				}

				// console.log(require('util')
				// 	.inspect(inst[0], {
				// 		depth: null
				// 	}));
			});

			it('set-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[1])
				}
			});

			it('arr-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[0])

				}
			});

			it('obj-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0].content, addrs[2])

				}
			});

			it('set', function () {
				let res, path = addrs[1].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});

			it('arr', function () {
				let res, path = addrs[0].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});

			it('obj', function () {
				let res, path = addrs[2].split('.'),
					l = path.length,
					k = l;
				for (var i = 0; i < iterations; i++) {
					res = inst[0].content;
					while (l--) {
						res = res[path[k - l - 1]];
					}
					l = k;
				}
			});
		});


		describe('obj-byaddr', function () {
			let addrs = ['1.2.3', '1.0.0', '1.1.4.id'];
			let inst;

			before(function () {
				inst = _.map(Array(20), (a, i) => {
					let o = {};
					o.index = i;
					return o;
				});
				inst[0]['1'] = inst[1];
				inst[0]['2'] = inst[2];
				inst[0]['1.0'] = inst[3];
				inst[0]['1.1'] = inst[4];
				inst[0]['1.2'] = inst[5];
				inst[0]['1.3'] = inst[6];

				inst[0]['2.a'] = inst[7];
				inst[0]['2.b'] = inst[8];

				inst[0]['1.0.0'] = inst[9];
				inst[0]['1.1.0'] = inst[10];
				inst[0]['1.1.1'] = inst[11];
				inst[0]['1.1.2'] = inst[12];
				inst[0]['1.1.3'] = inst[13];
				inst[0]['1.1.4'] = inst[14];
				inst[0]['1.2.0'] = inst[15];
				inst[0]['1.2.1'] = inst[16];
				inst[0]['1.2.2'] = inst[17];
				inst[0]['1.2.3'] = inst[18];

				inst[0]['1.1.4.id'] = inst[19];

				// console.log(require('util')
				// 	.inspect(inst[0], {
				// 		depth: null
				// 	}));
			});

			it('set-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0], addrs[1])
				}
				console.log(res);
			});

			it('arr-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0], addrs[0])

				}
				console.log(res);
			});

			it('obj-lodash', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = _.get(inst[0], addrs[2])

				}
				console.log(res);
			});

			it('set', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = inst[0][addrs[1]];
				}
				console.log(res);
			});

			it('arr', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = inst[0][addrs[0]];
				}
				console.log(res);
			});

			it('obj', function () {
				let res;
				for (var i = 0; i < iterations; i++) {
					res = inst[0][addrs[2]];
				}
				console.log(res);
			});
		});
	});
});