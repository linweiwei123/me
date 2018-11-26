function SimpleHtmlParser() {}

SimpleHtmlParser.prototype = {

    handler: null,

    // regexps

    startTagRe: /^<([^>\s\/]+)((\s+[^=>\s]+(\s*=\s*((\"[^"]*\")|(\'[^']*\')|[^>\s]+))?)*)\s*\/?\s*>/m,
    endTagRe: /^<\/([^>\s]+)[^>]*>/m,
    attrRe: /([^=\s]+)(\s*=\s*((\"([^"]*)\")|(\'([^']*)\')|[^>\s]+))?/gm,

    parse: function (s, oHandler) {
        if (oHandler)
            this.contentHandler = oHandler;

        var i = 0;
        var res, lc, lm, rc, index;
        var treatAsChars = false;
        var oThis = this;
        while (s.length > 0) {
            // Comment
            if (s.substring(0, 4) == "<!--") {
                index = s.indexOf("-->");
                if (index != -1) {
                    this.contentHandler.comment(s.substring(4, index));
                    s = s.substring(index + 3);
                    treatAsChars = false;
                } else {
                    treatAsChars = true;
                }
            }

            // end tag
            else if (s.substring(0, 2) == "</") {
                if (this.endTagRe.test(s)) {
                    lc = RegExp.leftContext;
                    lm = RegExp.lastMatch;
                    rc = RegExp.rightContext;

                    lm.replace(this.endTagRe, function () {
                        return oThis.parseEndTag.apply(oThis, arguments);
                    });

                    s = rc;
                    treatAsChars = false;
                } else {
                    treatAsChars = true;
                }
            }
            // start tag
            else if (s.charAt(0) == "<") {
                if (this.startTagRe.test(s)) {
                    lc = RegExp.leftContext;
                    lm = RegExp.lastMatch;
                    rc = RegExp.rightContext;

                    lm.replace(this.startTagRe, function () {
                        return oThis.parseStartTag.apply(oThis, arguments);
                    });

                    s = rc;
                    treatAsChars = false;
                } else {
                    treatAsChars = true;
                }
            }

            if (treatAsChars) {
                index = s.indexOf("<");
                if (index == -1) {
                    this.contentHandler.characters(s);
                    s = "";
                } else {
                    this.contentHandler.characters(s.substring(0, index));
                    s = s.substring(index);
                }
            }

            treatAsChars = true;
        }
    },

    parseStartTag: function (sTag, sTagName, sRest) {
        var attrs = this.parseAttributes(sTagName, sRest);
        this.contentHandler.startElement(sTagName, attrs);
    },

    parseEndTag: function (sTag, sTagName) {
        this.contentHandler.endElement(sTagName);
    },

    parseAttributes: function (sTagName, s) {
        var oThis = this;
        var attrs = [];
        s.replace(this.attrRe, function (a0, a1, a2, a3, a4, a5, a6) {
            attrs.push(oThis.parseAttribute(sTagName, a0, a1, a2, a3, a4, a5, a6));
        });
        return attrs;
    },

    parseAttribute: function (sTagName, sAttribute, sName) {
        var value = "";
        if (arguments[7])
            value = arguments[8];
        else if (arguments[5])
            value = arguments[6];
        else if (arguments[3])
            value = arguments[4];

        var empty = !value && !arguments[3];
        return {
            name: sName,
            value: empty ? null : value
        };
    }
};

module.exports = new SimpleHtmlParser();