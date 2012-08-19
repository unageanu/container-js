

__extend__(HTMLDocument.prototype, {

    open : function() {
        //console.log('opening doc for write.');
        if (! this._writebuffer) {
            this._writebuffer = [];
        }
    },
    close : function() {
        //console.log('closing doc.');
        if (this._writebuffer) {
            HTMLParser.parseDocument(this._writebuffer.join(''), this);
            this._writebuffer = null;
            //console.log('finished writing doc.');
        }
    },

    /**
     * http://dev.w3.org/html5/spec/Overview.html#document.write
     */
    write: function(htmlstring) {
        //console.log('writing doc.');
        this.open();
        this._writebuffer.push(htmlstring);
    },

    /**
     * http://dev.w3.org/html5/spec/Overview.html#dom-document-writeln
     */
    writeln: function(htmlstring) {
        this.open();
        this._writebuffer.push(htmlstring + '\n');
    }
});

/**
 * elementPopped is called by the parser in two cases
 *
 * - an 'tag' is * complete (all children process and end tag, real or
 *   implied is * processed)
 * - a replaceElement happens (this happens by making placeholder
 *   nodes and then the real one is swapped in.
 *
 */
var __elementPopped__ = function(ns, name, node){
    //console.log('popped html element %s %s %s', ns, name, node);
    var doc = node.ownerDocument,
        okay,
        event;
    switch(doc.parsing){
        case false:
            //innerHTML so dont do loading patterns for parsing
            //console.log('element popped (implies innerHTML) not in parsing mode %s', node.nodeName);
            break;
        case true:
            switch(doc+''){
                case '[object XMLDocument]':
                    break;
                case '[object HTMLDocument]':
                    switch(node.namespaceURI){
                        case "http://n.validator.nu/placeholder/":
                            //console.log('got script during parsing %s', node.textContent);
                            break;
                        case null:
                        case "":
                        case "http://www.w3.org/1999/xhtml":
                            switch(name.toLowerCase()){
                                case 'script':
                                    try{
                                        okay = Envjs.loadLocalScript(node, null);
                                        // console.log('loaded script? %s %s', node.uuid, okay);
                                        // only fire event if we actually had something to load
                                        if (node.src && node.src.length > 0){
                                            event = doc.createEvent('HTMLEvents');
                                            event.initEvent( okay ? "load" : "error", false, false );
                                            node.dispatchEvent( event, false );
                                        }
                                    }catch(e){
                                        console.log('error loading html element %s %s %s %e', ns, name, node, e.toString());
                                    }
                                    break;
                                case 'frame':
                                case 'iframe':
                                    node.contentWindow = { };
                                    node.contentDocument = new HTMLDocument(new DOMImplementation(), node.contentWindow);
                                    node.contentWindow.document = node.contentDocument;
                                    try{
                                        Window;
                                    }catch(e){
                                        node.contentDocument.addEventListener('DOMContentLoaded', function(){
                                            event = node.contentDocument.createEvent('HTMLEvents');
                                            event.initEvent("load", false, false);
                                            node.dispatchEvent( event, false );
                                        });
                                    }
                                    try{
                                        if (node.src && node.src.length > 0){
                                            //console.log("getting content document for (i)frame from %s", node.src);
                                            Envjs.loadFrame(node, Envjs.uri(node.src));
                                            event = node.contentDocument.createEvent('HTMLEvents');
                                            event.initEvent("load", false, false);
                                            node.dispatchEvent( event, false );
                                        }else{
                                            //I dont like this being here:
                                            //TODO: better  mix-in strategy so the try/catch isnt required
                                            try{
                                                if(Window){
                                                    Envjs.loadFrame(node);
                                                    //console.log('src/html/document.js: triggering frame load');
                                                    event = node.contentDocument.createEvent('HTMLEvents');
                                                    event.initEvent("load", false, false);
                                                    node.dispatchEvent( event, false );
                                                }
                                            }catch(e){}
                                        }
                                    }catch(e){
                                        console.log('error loading html element %s %e', node, e.toString());
                                    }
                                    /*try{
                                        if (node.src && node.src.length > 0){
                                            //console.log("getting content document for (i)frame from %s", node.src);
                                            Envjs.loadFrame(node, Envjs.uri(node.src));
                                            event = node.ownerDocument.createEvent('HTMLEvents');
                                            event.initEvent("load", false, false);
                                            node.dispatchEvent( event, false );
                                        }else{
                                            //console.log('src/parser/htmldocument: triggering frame load (no src)');
                                        }
                                    }catch(e){
                                        console.log('error loading html element %s %s %s %e', ns, name, node, e.toString());
                                    }*/
                                    break;
                                case 'link':
                                    if (node.href) {
                                        __loadLink__(node, node.href);
                                    }
                                    break;
                                case 'option':
                                    node._updateoptions();
                                    break;
                                case 'img':
                                    if (node.src){
                                        __loadImage__(node, node.src);
                                    }
                                    break;
                                case 'html':
                                    //console.log('html popped');
                                    doc.parsing = false;
                                    //DOMContentLoaded event
                                    try{
                                        if(doc.createEvent){
                                            event = doc.createEvent('Events');
                                            event.initEvent("DOMContentLoaded", false, false);
                                            doc.dispatchEvent( event, false );
                                        }
                                    }catch(e){
                                        console.log('%s', e);
                                    }
                                    try{
                                        if(doc.createEvent){
                                            event = doc.createEvent('HTMLEvents');
                                            event.initEvent("load", false, false);
                                            doc.dispatchEvent( event, false );
                                        }
                                    }catch(e){
                                        console.log('%s', e);
                                    }

                                    try{
                                        if(doc.parentWindow){
                                            event = doc.createEvent('HTMLEvents');
                                            event.initEvent("load", false, false);
                                            doc.parentWindow.dispatchEvent( event, false );
                                        }
                                    }catch(e){
                                        console.log('%s', e);
                                    }
                                    try{
                                        if(doc === window.document){
                                            //console.log('triggering window.load')
                                            event = doc.createEvent('HTMLEvents');
                                            event.initEvent("load", false, false);
                                            try{
                                                window.dispatchEvent( event, false );
                                            }catch(e){
                                                console.log('%s', e);
                                            }
                                        }
                                    }catch(e){
                                        //console.log('%s', e);
                                        //swallow
                                    }
                                default:
                                    if(node.getAttribute('onload')){
                                        //console.log('%s onload', node);
                                        node.onload();
                                    }
                                    break;
                            }//switch on name
                        default:
                            break;
                    }//switch on ns
                    break;
                default:
                    console.log('element popped: %s %s', ns, name, node.ownerDocument+'');
            }//switch on doc type
        default:
            break;
    }//switch on parsing
};
