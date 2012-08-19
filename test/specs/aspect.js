define([
    "containerjs/aspect",
    "test/utils/matchers"
], function( Aspect, Matchers ) {
    
    var log = [];
    
    var SampleClass = function() {};
    SampleClass.prototype.testA = function() {
        log.push("SampleClass.testA");
        return "SampleClass.testA";
    };
    SampleClass.prototype.testB = function() {
        log.push("SampleClass.testB");
        this.testA();
        return "SampleClass.testB";
    };
    SampleClass.prototype.testC = function() {
        log.push("SampleClass.testC");
        throw new Error("SampleClass.testC");
    };
    
    var SampleClass2 = function() {};
    SampleClass2.prototype = new SampleClass();
    SampleClass2.prototype.testA = function() {
        log.push("SampleClass2.testA");
        return "SampleClass2.testA";
    };
    SampleClass2.prototype.testX = function() {
        log.push("SampleClass2.testX");
        return "SampleClass2.testX";
    };
    SampleClass2.prototype.testY = function() {
        log.push("SampleClass2.testY");
        this.testA();
        this.testB();
        this.testX();
        return "SampleClass2.testY";
    };
    SampleClass2.prototype.testZ = function() {
        log.push("SampleClass2.testZ");
        this.testC();
    };
    
    var sampleObject = Object.create( Object.prototype, {
        testA : {
            value :  function() {
                log.push("SampleClass.testA");
                return "SampleClass.testA";
            }
        },
        testB: {
            value :  function() {
                log.push("SampleClass.testB");
                this.testA();
                return "SampleClass.testB";
            }
        },
        testC: {
            value :  function() {
                log.push("SampleClass.testC");
                throw new Error("SampleClass.testC");
            }
        }
    });
    var sampleObject2 = Object.create( sampleObject, {
        testA  : {
            value :  function() {
                log.push("SampleClass2.testA");
                return "SampleClass2.testA";
            }
        },
        testX  : {
            value :  function() {
                log.push("SampleClass2.testX");
                return "SampleClass.testX";
            }
        },
        testY  : {
            value : function() {
                log.push("SampleClass2.testY");
                this.testA();
                this.testB();
                this.testX();
                return "SampleClass.testY";
            }
        },
        testZ : {
            value : function() {
                log.push("SampleClass2.testZ");
                this.testC();
            }
        }
    });
    Object.freeze(sampleObject);
    
    beforeEach(function() {
        log = [];
    });
    
    describe('Aspect', function() {
        
        describe('Weaving to the normal object', function() {
        
            var obj = new SampleClass();
            obj.testD = function() {
                log.push("SampleClass.testD");
                return "SampleClass.testD";
            };
            var aspect = new Aspect( function( jointpoint ){
                log.push(">>");
                var result = jointpoint.proceed();
                log.push("<<");
                return result;
            });
            obj = aspect.weave(null, obj);
            
            it( "can apply interceptor to the method.", function() {
                obj.testA();
                expect( log.join(" ") ).toEqual( ">> SampleClass.testA <<" );
            });
            
            it( "can apply interceptor to the instance method.", function() {
                obj.testA();
                expect( log.join(" ") ).toEqual( ">> SampleClass.testA <<" );
            });
            
            it( "can apply interceptor to the method that calls locally.", function() {
                obj.testB();
                expect( log.join(" ") ).toEqual( 
                    ">> SampleClass.testB "
                        + ">> SampleClass.testA << "
                   +"<<" );
            });
            
            it( "can apply interceptor to the method that rasies an error.", function() {
                expect( function() {
                    obj.testC();
                }).toThrow( new Error("SampleClass.testC") );
                expect( log.join(" ") ).toEqual( ">> SampleClass.testC" );
            });
        
        });
        
        describe('Weaving to the extended object', function() {
            
            var obj = new SampleClass2();
            var aspect = new Aspect( function( jointpoint ){
                log.push(">>");
                var result = jointpoint.proceed();
                log.push("<<");
                return result;
            });
            obj = aspect.weave(null, obj);
            
            it( "can apply interceptor to the overrided method.", function() {
                obj.testA();
                expect( log.join(" ") ).toEqual( ">> SampleClass2.testA <<" );
            });
            
            it( "can apply interceptor to the overloaded method that calls locally.", function() {
                obj.testB();
                expect( log.join(" ") ).toEqual( 
                    ">> SampleClass.testB "
                        + ">> SampleClass2.testA << "
                  + "<<" );
            });
            
            it( "can apply interceptor to the overloaded method that rasies an error.", function() {
                expect( function() {
                    obj.testC();
                }).toThrow( new Error("SampleClass.testC") );
                expect( log.join(" ") ).toEqual( ">> SampleClass.testC" );
            });
            
            it( "can apply interceptor to the extended method.", function() {
                obj.testX();
                expect( log.join(" ") ).toEqual( ">> SampleClass2.testX <<" );
            });
            
            it( "can apply interceptor to the extended method that calls locally.", function() {
                obj.testY();
                expect( log.join(" ") ).toEqual( 
                    ">> SampleClass2.testY "
                        + ">> SampleClass2.testA << "
                        + ">> SampleClass.testB "
                            + ">> SampleClass2.testA << "
                        + "<< "
                        + ">> SampleClass2.testX << "
                  + "<<");
            });
            
            it( "can apply interceptor to the extended method that rasies an error.", function() {
                expect( function() {
                    obj.testZ();
                }).toThrow( new Error("SampleClass.testC") );
                expect( log.join(" ") ).toEqual( ">> SampleClass2.testZ >> SampleClass.testC" );
            });
        });
        
        describe('Weaving to the object that created by Object.create()', function() {
            
            var obj = sampleObject2;
            var aspect = new Aspect( function( jointpoint ){
                log.push(">>");
                var result = jointpoint.proceed();
                log.push("<<");
                return result;
            });
            obj = aspect.weave(null, obj);
            
            it( "can apply interceptor to the overrided method.", function() {
                obj.testA();
                expect( log.join(" ") ).toEqual( ">> SampleClass2.testA <<" );
            });
            
            it( "can apply interceptor to the overloaded method that calls locally.", function() {
                obj.testB();
                expect( log.join(" ") ).toEqual( 
                    ">> SampleClass.testB "
                        + ">> SampleClass2.testA << "
                  + "<<" );
            });
            
            it( "can apply interceptor to the overloaded method that rasies an error.", function() {
                expect( function() {
                    obj.testC();
                }).toThrow( new Error("SampleClass.testC") );
                expect( log.join(" ") ).toEqual( ">> SampleClass.testC" );
            });
            
            it( "can apply interceptor to the extended method.", function() {
                obj.testX();
                expect( log.join(" ") ).toEqual( ">> SampleClass2.testX <<" );
            });
            
            it( "can apply interceptor to the extended method that calls locally.", function() {
                obj.testY();
                expect( log.join(" ") ).toEqual( 
                    ">> SampleClass2.testY "
                        + ">> SampleClass2.testA << "
                        + ">> SampleClass.testB "
                            + ">> SampleClass2.testA << "
                        + "<< "
                        + ">> SampleClass2.testX << "
                  + "<<");
            });
            
            it( "can apply interceptor to the extended method that rasies an error.", function() {
                expect( function() {
                    obj.testZ();
                }).toThrow( new Error("SampleClass.testC") );
                expect( log.join(" ") ).toEqual( ">> SampleClass2.testZ >> SampleClass.testC" );
            });
        });
        
        
        it( "can apply multiple interceptors.", function() {
            
            var obj = new SampleClass2();
            var aspect1 = new Aspect( function( jointpoint ){
                log.push(">>");
                var result = jointpoint.proceed();
                log.push("<<");
                return result;
            });
            var aspect2 = new Aspect( function( jointpoint ){
                log.push(">>");
                var result = jointpoint.proceed();
                log.push("<<");
                return result;
            });
            obj = aspect1.weave(null, obj);
            obj = aspect2.weave(null, obj);
            
            obj.testY();
            expect( log.join(" ") ).toEqual( 
                ">> >> SampleClass2.testY "
                    + ">> >> SampleClass2.testA << << "
                    + ">> >> SampleClass.testB "
                        + ">> >> SampleClass2.testA << << "
                    + "<< << "
                    + ">> >> SampleClass2.testX << << "
              + "<< <<");
        });
        
        it( "can specify a target method matcher.", function() {
            
            var obj = new SampleClass2();
            var aspectToA = new Aspect( function( jointpoint ){
                log.push(">");
                return jointpoint.proceed();
            }, function( binding, component, name ) {
                if (!binding || !component) 
                    throw new Error("binding or component is null or undfined.");
                return name === "testA";
            });
            var aspectToB = new Aspect( function( jointpoint ){
                log.push(">>");
                return jointpoint.proceed();
            }, function( binding, component, name ) {
                if (!binding || !component) 
                    throw new Error("binding or component is null or undfined.");
                return name === "testB";
            });
            var aspectToAorC = new Aspect( function( jointpoint ){
                log.push(">>>");
                return jointpoint.proceed();
            }, function( binding, component, name ) {
                if (!binding || !component) 
                    throw new Error("binding or component is null or undfined.");
                return name === "testA"
                    ||  name === "testC";
            });
            obj = aspectToA.weave({}, obj);
            obj = aspectToB.weave({}, obj);
            obj = aspectToAorC.weave({}, obj);
            
            obj.testA();
            expect( log.join(" ") ).toEqual( 
                "> >>> SampleClass2.testA");
            log = [];
            
            obj.testB();
            expect( log.join(" ") ).toEqual( 
                ">> SampleClass.testB > >>> SampleClass2.testA");
            log = [];
            
            expect( function() {
                obj.testC();
            }).toThrow( new Error("SampleClass.testC") );
            expect( log.join(" ") ).toEqual( 
                ">>> SampleClass.testC");
            log = [];
            
            obj.testX();
            expect( log.join(" ") ).toEqual( 
                "SampleClass2.testX");
            log = [];
        });
        
        it( "can apply a interceptor that modifies arguments.", function() {
            var obj = {
               testA : function(){ 
                   return Array.prototype.join.call(arguments, "_"); 
               }
            };
            var aspect = new Aspect( function( jointpoint ){
                jointpoint.arguments[0] = "modified";
                jointpoint.arguments.push("added");
                return jointpoint.proceed();
            });
            obj = aspect.weave(null, obj);
            
            expect( obj.testA("a", "b") ).toEqual("modified_b_added");
        });
        
        it( "can apply a interceptor that modifies a result.", function() {
            var obj = {
               testA : function(){ return "a"; }
            };
            var aspect = new Aspect( function( jointpoint ){
                return "_" + jointpoint.proceed() + "_";
            });
            obj = aspect.weave(null, obj);
            
            expect( obj.testA() ).toEqual("_a_");
        });
    });
    
});