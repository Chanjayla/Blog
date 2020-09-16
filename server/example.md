### 构造器模式
javascript不支持类的概念，但可以使用new关键字调用函数达到创建实例的效果，new+函数名返回一个根据函数结构创建的对象。函数带有prototype属性，可以通过Prototype链来达到继承的效果。

```
function Test() {
    this.a = 1;
}
Test.prototype.b = function() {
    console.log(this.a);
}
var test = new Test();
test.b();
```
### 模块化模式
Object对象模块化
```
var myObjectModel = {
    func: function() {
        //...
    }
}
```
闭包模块化
```
var testModule = (function () {

  var counter = 0;

  return {

    incrementCounter: function () {
      return counter++;
    },

    resetCounter: function () {
      console.log( "counter value prior to reset: " + counter );
      counter = 0;
    }
  };

})();
```
- 优点：模块模式支持私有数据，使javascript有更清晰的封装结构
- 缺点：不能为私有成员创建自动化测试，当私有成员出现bug需要修复时会带来额外的复杂性。

