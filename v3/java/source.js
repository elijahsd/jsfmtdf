javascript:(function() {
/* Generated using JavaScripthon: https://github.com/metapensiero/metapensiero.pj */

	var _pj;
	var palette;

	function _pj_snippets(container) {
		function in_es6(left, right) {
			if (((right instanceof Array) || ((typeof right) === "string"))) {
				return (right.indexOf(left) > (- 1));
			} else {
				if (((right instanceof Map) || (right instanceof Set) || (right instanceof WeakMap) || (right instanceof WeakSet))) {
					return right.has(left);
				} else {
					return (left in right);
				}
			}
		}

		function set_properties(cls, props) {
			var desc, value;
			var _pj_a = props;
			for (var p in _pj_a) {
				if (_pj_a.hasOwnProperty(p)) {
					value = props[p];
					if (((((! ((value instanceof Map) || (value instanceof WeakMap))) && (value instanceof Object)) && ("get" in value)) && (value.get instanceof Function))) {
						desc = value;
					} else {
						desc = {"value": value, "enumerable": false, "configurable": true, "writable": true};
					}
					Object.defineProperty(cls.prototype, p, desc);
				}
			}
		}
		container["in_es6"] = in_es6;
		container["set_properties"] = set_properties;
		return container;
	}

	_pj = {};
	_pj_snippets(_pj);

	palette = {"none": "", "text": "rgb(40, 40, 40)", "comment": "rgb(130, 130, 130)", "string": "rgb(50, 120, 0)", "function": "rgb(50, 50, 200)", "value": "rgb(50, 50, 200)", "reserved": "rgb(150, 50, 50)", "operator": "rgb(150, 150, 50)", "call": "rgb(100, 100, 220)", "bracket": "rgb(100, 100, 200)", "number": "rgb(200, 50, 50)", "field": ""};

	class rules {
	}

	_pj.set_properties(rules, {"brackets": "[]{}();", "comment": [["//", "\n", ""], ["/*", "*/", ""]], "comment_string": [], "f": ["class", "package", "extends", "implements"], "fields": ".,", "highlight": ["function"], "numbers": "0123456789", "ops": "=+-*/%&|^<>?:!~\\", "reserved": ["abstract", "class", "continue", "for", "new", "switch", "assert", "default", "goto", "synchronized", "do", "if", "private", "break", "implements", "package", "protected", "throw", "else", "import", "public", "throws", "case", "instanceof", "return", "transient", "catch", "extends", "try", "final", "interface", "static", "finally", "strictfp", "native", "super", "while"], "spaces": [" ", "\t"], "string": [["\"", "\"", "\\"], ["'", "'", "\\"]], "text": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890_@", "values": ["true", "false", "null", "boolean", "this", "double", "byte", "enum", "int", "short", "char", "var", "long", "void", "const", "float", "volatile"]});

	class Formatter {
		constructor(palette) {
			this.palette = palette;
		}

		esc(text) {
			text = text.replace("&", "&amp;");
			text = text.replace("<", "&lt;");
			text = text.replace(">", "&gt;");
			return text;
		}

		format(text, entity, bold) {
			if ((this.palette[entity] === "")) {
				return text;
			}
			var result = "";
			result = result.concat("<span class=\"\" style=\"color: ", this.palette[entity], ";\">", ((bold && "<b>") || ""), this.esc(text), ((bold && "</b>") || ""), "</span>");
			return result;
		}
	}

	class Parser {
		constructor(text, rules) {
			this.position = 0;
			this.comment = null;
			this.new_line = true;
			this.fname = false;
			this.rules = rules;
			this.overflow = false;
			this.parsers = ["parse_br", "parse_space", "parse_comment_or_string", "parse_number", "parse_bracket", "parse_operator", "parse_field", "parse_text"];
			this.text = text;
		}

		get_symbols(count = 1) {
			if ((this.text.length === this.position)) {
				this.overflow = true;
				return "";
			}
			if ((this.text.length < (this.position + count))) {
				return "";
			}
			this.position = (this.position + count);
			return this.text.slice((this.position - count), this.position);
		}

		push_back(pos = 1) {
			if ((! this.overflow)) {
				this.position = (this.position - pos);
			}
		}

		parse_br() {
			var sym;
			sym = this.get_symbols();
			if ((sym === "\n")) {
				this.new_line = true;
				return [true, "<br>", "none"];
			}
			this.push_back();
			return [false, "", ""];
		}

		parse_space() {
			var buf, sp, sym;
			sp = "&nbsp;";
			if ((! this.new_line)) {
				sp = " ";
			}
			this.new_line = false;
			sym = this.get_symbols();
			buf = "";
			while (((sym === " ") || (sym === "\t"))) {
				if ((sym === " ")) {
					buf = "{}{}".format(buf, sp);
				} else {
					buf = "{}{}{}{}{}".format(buf, sp, sp, sp, sp);
				}
				sym = this.get_symbols();
			}
			this.push_back();
			if ((buf.length > 0)) {
				return [true, buf, "none"];
			}
			return [false, "", ""];
		}

		parse_comment_single(boundaries) {
			var buf, end, esc, escaped, multiline, pred, start, sym, syms;
			if ((this.comment !== null)) {
				if ((this.comment !== boundaries)) {
					return "";
				}
			}
			multiline = (this.comment === boundaries);
			start = boundaries[0];
			end = boundaries[1];
			esc = boundaries[2];
			syms = "";
			if ((this.comment === null)) {
				syms = this.get_symbols(start.length);
				if ((syms === "")) {
					return "";
				}
				if ((syms !== start)) {
					this.push_back(syms.length);
					return "";
				}
				this.comment = boundaries;
			}
			buf = "";
			buf += syms;
			sym = this.get_symbols();
			while ((sym !== "")) {
				if (((sym === "\n") && (end !== "\n"))) {
					break;
				}
				buf += sym;
				sym = this.get_symbols();
				if ((buf.length < ((start.length * (((! multiline) && 1) || 0)) + end.length))) {
					continue;
				}
				escaped = false;
				if ((buf.length > ((start.length * (((! multiline) && 1) || 0)) + end.length))) {
					pred = buf.slice(((- end.length) - 1), (- end.length));
					escaped = _pj.in_es6(pred, esc);
				}
				if (((! escaped) && (buf.slice((- end.length)) === end))) {
					if ((end === "\n")) {
						this.push_back();
						buf = buf.slice(0, (- 1));
					}
					this.comment = null;
					break;
				}
			}
			this.push_back();
			return buf;
		}

		parse_comment_or_string() {
			var r;
			for (var c, _pj_c = 0, _pj_a = this.rules.comment, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
				c = _pj_a[_pj_c];
				r = this.parse_comment_single(c);
				if (r) {
					return [true, r, "comment"];
				}
			}
			for (var c, _pj_c = 0, _pj_a = this.rules.comment_string, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
				c = _pj_a[_pj_c];
				r = this.parse_comment_single(c);
				if (r) {
					return [true, r, "string"];
				}
			}
			for (var c, _pj_c = 0, _pj_a = this.rules.string, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
				c = _pj_a[_pj_c];
				r = this.parse_comment_single(c);
				if (r) {
					return [true, r, "string"];
				}
			}
			return [false, "", ""];
		}

		parse_symbols(symbols, ent) {
			var buf, sym;
			sym = this.get_symbols();
			buf = "";
			while (((sym !== "") && _pj.in_es6(sym, symbols))) {
				buf = "{}{}".format(buf, sym);
				sym = this.get_symbols();
			}
			this.push_back();
			if ((buf.length > 0)) {
				this.fname = false;
				return [true, buf, ent];
			}
			return [false, "", ""];
		}

		parse_number() {
			return this.parse_symbols(this.rules.numbers, "number");
		}

		parse_bracket() {
			return this.parse_symbols(this.rules.brackets, "bracket");
		}

		parse_operator() {
			return this.parse_symbols(this.rules.ops, "operator");
		}

		parse_field() {
			return this.parse_symbols(this.rules.fields, "field");
		}

		bracket_follow() {
			var forw, found, sym;
			forw = 0;
			found = false;
			while (true) {
				sym = this.get_symbols();
				if ((sym === "")) {
					break;
				}
				forw = (forw + 1);
				if (_pj.in_es6(sym, this.rules.spaces)) {
					continue;
				}
				if ((sym === "(")) {
					found = true;
				}
				break;
			}
			this.position = (this.position - forw);
			return found;
		}

		parse_text() {
			var buf, func, sym, t;
			sym = this.get_symbols();
			buf = "";
			func = this.fname;
			this.fname = false;
			while (((sym !== "") && (_pj.in_es6(sym, this.rules.text) || (func && _pj.in_es6(sym, this.rules.fields))))) {
				buf = "{}{}".format(buf, sym);
				sym = this.get_symbols();
			}
			this.push_back();
			if ((buf.length > 0)) {
				t = "none";
				if (_pj.in_es6(buf, this.rules.reserved)) {
					t = "reserved";
				} else {
					if (func) {
						t = "function";
					} else {
						if (_pj.in_es6(buf, this.rules.values)) {
							t = "value";
						} else {
							if (((buf[0].isalpha() || (buf[0] === "_")) && this.bracket_follow())) {
								t = "call";
							}
						}
					}
				}
				this.fname = (func || _pj.in_es6(buf, this.rules.f));
				return [true, buf, t];
			}
			return [false, "", ""];
		}
		get_next() {
			var e, res, t;
			for (var f, _pj_c = 0, _pj_a = this.parsers, _pj_b = _pj_a.length; (_pj_c < _pj_b); _pj_c += 1) {
				f = _pj_a[_pj_c];
				[res, t, e] = this[f]();
				if (res) {
					return [t, e, _pj.in_es6(e, this.rules.highlight)];
				}
			}
			return ["", "", false];
		}
	}

	class Pyfmtdf {
		constructor(palette, rules) {
			this.palette = palette;
			this.rules = rules;
		}
		doformat(f) {
			var bold, buf, etype, fmt, item, prs;
			fmt = new Formatter(this.palette);
			prs = new Parser(f, this.rules);
			buf = fmt.start();
			while (true) {
				[item, etype, bold] = prs.get_next();
				if ((item === "")) {
					break;
				}
				buf = "{}{}".format(buf, fmt.format(item, etype, bold));
			}
			buf = "{}{}".format(buf, fmt.end());
			return buf;
		}
	}

	function fmt(f) {
		f = f.replace(/\n\n/g, "\n");
		var fmtr, palette, rules;
		rules = new Rules();
		fmtr = new Pyfmtdf(palette, rules);
		return fmtr.doformat(f);
	}

	var t = window.getSelection();
	if (t.rangeCount) {
		var o = fmt(t.toString());
		var r = t.getRangeAt(0);
		r.deleteContents();
		var n = document.createElement("pre");
		r.insertNode(n);
		n.insertAdjacentHTML('afterbegin', o);
	}
})();
