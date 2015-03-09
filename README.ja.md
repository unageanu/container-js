# 概要

ContainerJSは、JavaScriptアプリケーション用の Dipendency Injection コンテナです。

# 特徴

- **依存関係の解決と注入**
 - ContainerJSは、コンテナ管理とされたオブジェクト(=コンポーネントと呼びます)の生成と、その依存コンポーネントの解決・注入を担います。
     - 依存関係は、JavaScriptコードによるコンポーネント定義の中で指定するか、クラス内で宣言的に定義できます。
     - JavaScriptにはインターフェイスがないので、依存関係の解決はコンポーネントに割り当てられた名前で行われます。
 - 依存性注入をコンテナに任せることで、依存関係を考慮しつつインスタンスを生成し参照を設定する処理(いわゆるワイヤリング)を自動化できます。
 - コンポーネントはコンテナによりキャッシュされるので、不要なオブジェクトの生成も削減されます。

- **モジュールの遅延読み込みに対応**
 - require.jsと連携し、必要なモジュールを非同期で遅延読み込みします。
 - ユーザーの操作等を受けてコンポーネントが実際に使われるまで、JavaScriptソースの読み込みと評価を遅延できます。

- **アスペクト指向プログラミングをサポート**
 - コンテナ管理のコンポーネントにメソッド・インターセプタを差し込めます。
 - 性能計測ログの出力など、クラス横断的な機能をインターセプタに集約できます。

# ライセンス
[New BSD License](http://opensource.org/licenses/BSD-3-Clause) 


# 動作確認済みブラウザ

- IE9+
- GoogleChrome
- Firefox4+
- IE7,8( with es5-shim )

※ECMAScript5の機能を使用しています。
※es5-shim (https://github.com/kriskowal/es5-shim) と組み合わせるとIE7,8でも動作します。

# 依存モジュール

ContainerJSは以下のモジュールに依存しています。

- [RequireJS](http://requirejs.org/) ( [New BSD or MIT License](https://github.com/jrburke/requirejs/blob/master/LICENSE) )

また、以下のテスティングフレームワークを使用しています。

- [jasmine](https://github.com/pivotal/jasmine/) ( [MIT License](https://github.com/pivotal/jasmine/blob/master/MIT.LICENSE) )
- [jasmine-reporters](https://github.com/larrymyers/jasmine-reporters) ( [MIT License](https://github.com/larrymyers/jasmine-reporters/blob/master/LICENSE) )
- [Rhino](https://developer.mozilla.org/en-US/docs/Rhino) ( [MPL 2.0 License](https://developer.mozilla.org/en-US/docs/Rhino/License) )
- [env-js](http://www.envjs.com/)

# Getting started

「Hello World」を出力するサンプルです。samples/hello-world 以下に完全なソースがあるのでそちらも参照ください。

ファイル構造:

- index.html
- scripts/
    - main.js
    - require.js
    - container.js
    - app/
        - model.js
        - view.js
    - utils/
        - observable.js

scripts/app/model.js:

    define(["utils/observable"], function(Observable){
    
         "use strict";
    
         /**
         * @class
         */
        var Model = function() {};
        
        Model.prototype = new Observable();
        
        /**
         * @public
         */
        Model.prototype.initialize = function() {
            this.fire( "updated", { 
                property: "message", 
                value :"hello world."
            });
        };
    
        return Model;
    });

scripts/app/view.js:

    define(["container"], function( ContainerJS ){
        
        "use strict";
        
        /**
         * @class
         */
        var View = function() {
            this.model = ContainerJS.Inject("app.Model");
        };
        
        /**
         * @public
         */
        View.prototype.initialize = function() {
            this.model.addObserver("updated", function( ev ) {
                if ( ev.property != "message" ) return;
                var e = document.getElementById(this.elementId);
                e.innerHTML = ev.value; 
            }.bind(this));
        };
        
        return View;
    });

scripts/app/main.js:

    require.config({
        baseUrl: "scripts",
    });
    require(["container"], function( ContainerJS ) {
        
        var container = new ContainerJS.Container( function( binder ){
            
            binder.bind("app.View").withProperties({
                elementId : "console"
            }).onInitialize("initialize")
            .inScope(ContainerJS.Scope.EAGER_SINGLETON);
            
            binder.bind("app.Model");
            
        });
        
        container.onEagerSingletonConponentsInitialized.then( function() {
            container.get("app.Model").then(function( model ){
                model.initialize();
            }, function( error ) {
                alert( error.toString() ); 
            });
        });
        
    });

index.html:

    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Hello World</title>
        <script type="text/javascript" data-main="scripts/main.js" src="scripts/require.js"></script>
      </head>
      <body>
        <div id="console"></div>
      </body>
    </html>

# リファレンス

## Binding

以下の5つの手段でのコンポーネント登録をサポートしています。

- クラス指定
- プロトタイプ指定
- オブジェクト指定
- プロバイダ指定
- インスタンス指定

### クラス指定

- コンポーネントをクラス(コンストラクタ関数)で指定します。
- コンストラクタ関数を `new` 演算子付きで呼び出して作成されたオブジェクトがコンポーネントとなります。
- コンストラクタ関数は、require.jsの `require()` を使用して非同期読み込みされます。
- `withConstructorArgument()` で、コンストラクタ関数に渡す引数をひとつだけ指定できます。 

コンポーネント定義:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.Class");
        binder.bind("anotherName").to("app.Class").withConstructorArgument({
            foo:"foo",
            var:ContainerJS.Inject("app.Class") // 依存性注入も可能
        });
    });

app/class.js:

    define(function(){
        /**
         * @class
         */
        var Class = function(arg) { 
            this.foo = args.foo;
            this.var = args.var;
        };
        return Class;
    });


### プロトタイプ指定

- コンポーネントをプロトタイプで指定します。
- プロトタイプを引数として、`Object#create()`で作成されたオブジェクトがコンポーネントとなります。
- プロトタイプは、require.jsの `require()` を使用して非同期読み込みされます。

コンポーネント定義:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.Prototype").asPrototype();
        binder.bind("anotherName").toPrototype("app.Prototype", {
           foo : { value: "foo" } // 第2引数でObject#create()に渡す引数を指定できます
        });
    });

app/prototype.js:

    define(function(){
        /**
         * @class
         */
        var Prototype = {
            method : function( arg ) {
                return arg;
            }
        }
        return Prototype;
    });

### オブジェクト指定

- require.jsの`require` を使用してロードされたオブジェクトそのものをコンポーネントにします。

コンポーネント定義:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.Object").asObject();
        binder.bind("anotherName").toObject("app.Object");
    });

app/object.js:

    define(function(){
        var Obj = {
            method : function( arg ) {
                return arg;
            }
        }
        return Obj;
    });


### プロバイダ指定

- コンポーネントを生成する関数を指定します。
- 関数の戻り値がコンポーネントとなります。

コンポーネント定義:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("name").toProvider(function(){
            return "foo";
        });
    });

### インスタンス指定

- コンポーネントそのものを指定します。

コンポーネント定義:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("name").toInstance("foo");
    });

## Packaging Policy

Packaging Policyを設定することで、モジュールの読み込み先を制御できます。

### MODULE\_PER\_CLASS

デフォルトのポリシーです。クラスごとにモジュールが用意されているとみなします。
コンポーネントは、名前空間と同じパス以下の `<クラス名を-区切りにしたもの>.js` から読み込まれます。 

ファイル構成:

- app/
    - foo/
        - hoge-hoge.js
        - fuga-fuga.js
- main.js

app/foo/hoge-hoge.js:

    define(function(){
        /**
         * @class
         */
        var HogeHoge = function(arg) {};
        return HogeHoge;
    });

app/foo/fuga-fuga.js:

    define(function(){
        /**
         * @class
         */
        var FugaFuga = function(arg) {};
        return FugaFuga;
    });

main.js:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.foo.HogeHoge");
        binder.bind("app.foo.FugaFuga");
    });

### MODULE\_PER\_PACKAGE

パッケージごとにモジュールが用意されているとみなします。

ファイル構成:

- app/
    - foo.js
- main.js

app/foo.js:

    define(function(){
    
        /**
         * @class
         */
        var HogeHoge = function(arg) {};
        
        /**
         * @class
         */
        var FugaFuga = function(arg) {};
        
        return {
            HogeHoge : HogeHoge,
            FugaFuga : FugaFuga
        }
    });

main.js:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.foo.HogeHoge")
            .assign(ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE);
        binder.bind("app.foo.FugaFuga")
            .assign(ContainerJS.PackagingPolicy.MODULE_PER_PACKAGE);
    });

### SINGLE_FILE

1つのファイルに名前空間内のすべてのクラスが定義されているとみなします。

ファイル構成:

- app.js
- main.js

app.js:

    define(function(){
    
        /**
         * @class
         */
        var HogeHoge = function(arg) {};
        
        /**
         * @class
         */
        var FugaFuga = function(arg) {};
        
        return {
            foo : {
                HogeHoge : HogeHoge,
                FugaFuga : FugaFuga
            }
        }
    });

main.js:

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.foo.HogeHoge")
            .assign(ContainerJS.PackagingPolicy.SINGLE_FILE);
        binder.bind("app.foo.FugaFuga")
            .assign(ContainerJS.PackagingPolicy.SINGLE_FILE);
    });

Packaging Policy はコンポーネント定義の中で指定するほか、デフォルトの設定をコンテナのコンストラクタで指定することもできます。

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("app.foo.HogeHoge");
        binder.bind("app.foo.FugaFuga");
    }, ContainerJS.PackagingPolicy.SINGLE_FILE); // デフォルトの設定をコンストラクタで指定

## Scope

「Singleton」,「EagerSingleton」,「Prototype」をサポートします。デフォルトは「Singleton」です。

- **Singleton**
    - コンポーネントを1つだけ生成します。
    - 複数回同じコンポーネントを取得した場合、常に初回のget()時に作成したコンポーネントが返されます。
    - コンポーネントは `Container#destroy()` で破棄されます。
- **EagerSingleton**
    - Singletonと同じく唯一のインスタンスを返しますが、インスタンスがコンテナの作成時に生成されます。(Singletonの場合、コンテナから初めてコンポーネントを取得した際に生成されます。)
    - これを使うと、コンテナに登録しておくだけで効果を発揮するコンポーネントを作成できます。
    - container.onEagerSingletonConponentsInitialized の Deferred でEagerSingletonコンポーネントの生成完了を捕捉できます。
- **Prototype**
    - コンポーネント取得のたびに、コンポーネントを再作成します。

設定の変更は、 `inScope()` で行います。

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("Foo").inScope( ContainerJS.Scope.SINGLETON ); // default
        binder.bind("Bar").inScope( ContainerJS.Scope.EAGER_SINGLETON );
        binder.bind("Val").inScope( ContainerJS.Scope.PROTOTYPE );
    });
    container.onEagerSingletonConponentsInitialized.then(function(){
        // called when all eager singleton conponents are initialized.
    });

## Injection

プロパティに `ContainerJS.Inject` を設定しておくと、コンテナにより依存モジュールが探索され注入されます。

- `ContainerJS.Inject` を設定すると、プロパティ名でコンポーネントが探索されます。
- `ContainerJS.Inject(name)` で、探索するコンポーネント名を明示できます。
- `ContainerJS.Inject.all`,`ContainerJS.Inject.all(name)` で、指定された名前を持つコンポーネントの配列が注入されます。
- `ContainerJS.Inject.lazily`,`ContainerJS.Inject.lazily(name)`,`ContainerJS.Inject.all.lazily`,`ContainerJS.Inject.all.lazily(name)` で、注入されるコンポーネントが遅延読み込みされるようになります。
  - コンポーネントではなく、コンポーネントを取得するためのDeferredが注入されます。

例:

    define(["container"], function(ContainerJS){
        /**
         * @class
         */
        var Class = function() { 
            this.a = ContainerJS.Inject;
            this.b = ContainerJS.Inject("foo.var");
            this.c = ContainerJS.Inject.all;
            this.d = ContainerJS.Inject.all("foo.var");
            this.e = ContainerJS.Inject.lazily;
            this.f = ContainerJS.Inject.all.lazily("foo.bal");
        };
        Class.prototype.method1 = {
            this.e.then( function(component) {
                // 
            }, function(error) {
                // 
            } )
        };
        return Class;
    });

コンポーネント定義時に注入することもできます。

    var container = new ContainerJS.Container( function( binder ){
        binder.bind("Foo").withProperties({
            a : ContainerJS.Inject("foo.var")
        }).withConstructorArgument({
            b : ContainerJS.Inject.all.lazily("foo.bal")
        });
    });

## Initialization and Destruction

コンポーネント作成時に呼ばれる関数(初期化関数)と破棄時に呼ばれる関数(破棄関数)を登録できます。

- 初期化関数は、コンポーネントの作成/依存性注入/インターセプタの適用がすべて完了した後に実行されます。
- 破棄関数はcontainer.Container#destroy()を実行した際に以下の条件を満たす場合、実行されます。
  - コンポーネントのスコープがSingletonまたはEagerSingletonであること。
  - コンポーネントがdestroy()実行時に作成済みであること。
- 初期化関数・破棄関数は、コンポーネントのメソッド名で指定する方法と関数で指定する方法があります。
  - 関数を指定した場合、引数としてコンポーネントとコンテナが渡されます。

例:

    var c = new ContainerJS.Container( function( binder ) {
        
        // メソッド名で指定
        binder.bind( "Foo" ).onInitialize("initialize").onDestroy("dispose");

        // 関数で指定
        binder.bind( "Bar" ).onInitialize( function( component, container ) {
            component.initialize();
        }).onDestroy( function( component, container ) {
            component.dispose();
        });
    
    });

### Method Interception

コンポーネントのメソッドにインターセプタを差し込めます。

- インターセプタは関数で指定します。引数でメソッド名や引数を格納したオブジェクトが渡されます。
- 第2引数で、適用するコンポーネントおよびメソッドを示す関数を指定できます。
  - 第2引数が明示されない場合、すべてコンポーネントのすべてのメソッドに適用されます。

例:

        var container = new ContainerJS.Container( function( binder ){
            
            binder.bind("app.Component");
            
            binder.bindInterceptor( function( jointpoint ) {
               jointpoint.methodName;
               jointpoint.self;
               jointpoint.arguments; // 引数。改変できます。
               jointpoint.context; // このメソッド呼び出しの間で共有される状態を格納できます。
               return jointpoint.proceed(); // オリジナルのメソッドを呼び出し結果を返します。
            }, function(binding, component, methodName) {
                if  (binding.name !== "app.Component" ) return false;
                return methodName === "method1"
                       || methodName === "method2";
            } );
        });
