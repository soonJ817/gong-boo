# 개요

* 이 포스트는 javascript 디버깅 툴을 간단히 소개한다.
* 기능을 전부 소개하기엔 내용이 방대하므로 작성자가 자주 쓰는 기능 위주로 소개하였다.
* 자세한 내용은 참고자료의 링크를 확인한다.

# 콘솔 로그를 이용한 javascript 디버깅 시 문제점

* 일반적으로 javascript를 디버깅할 때 console.log를 자주 이용한다.
* 하지만 위 방법으로 디버깅 시 몇가지 문제점이 있다.
1. 타이밍 이슈
2. Object assign 이슈
3. 타입 및 조건문 이슈

## 1. 타이밍 이슈

* 자바스크립트는 기본적으로 비동기방식으로 동작한다.
* 이 경우 console.log를 이용할 때 예기지 못한 값이 나올 수 있다.
<pre><code>
function timeDelay() {
  let foo = 1;

  console.log(foo); // 1

  setTimeout(() => {
    foo = 2;
  }, 100);

  // 비동기로 동작하기 때문에 위 timeout이 끝나기 전에 출력되어 foo는 1로 출력된다.
  console.log(foo); // 1

  setTimeout(() => {
    console.log(foo); // 2
  }, 1000);
}
</code></pre>

## 2. Object assign 이슈



* 자바스크립트 타입은 크게 두가지 타입으로 나눌 수 있다.
  * primitive 타입 (undefined, null, boolean, number, string, symbol)
  * Object 타입 (primitive 타입을 제외한 나머지)
* 위 둘의 특징은 primitive는 value에 의한 복사를, Object 타입은 reference에 의한 복사를 한다.
* 개발자가 위 특징을 고려하지 못한다면 console.log 출력 시 reference에 의한 복사가 일어나면 예상치 못한 값이 나올 수 있다. 
<pre><code>
function valueVSref() {
  const foo = [
    1,
    2,
    {
      foo: 3,
      bar: 4
    }
  ];

  const primitive = foo[0];
  foo[0] = 99;
  console.log(primitive); // 1

  const obj = foo[2];
  foo[2]['foo'] = 100;  
  console.log(obj['foo']); // 100
}
</code></pre>

## 3. 타입 및 조건문 이슈

* 자바스크립트는 타입이 다른 변수들의 연산에 대한 자유도가 높다.
* 조건문에서 true/false를 판별하는 기준도 그만큼 다양하다.
* 위 두가지는 권장하는 코딩 스타일은 아니지만 그럼에도 많은 사람들이 위와 같이 작성한다. 
<pre><code>function typeAndIf() {
  const foo = '1';
  const bar = -1;

  if (foo + bar) {
    console.log('olleh!');  // olleh!
  }
  if (Number(foo) + bar) {
    console.log('olleh!');  // 출력 안됨
  }
}
</code></pre>

* *chrome devtools와 vscode debugger를 이용하면 위 이슈들을 디버깅 가능하다.*

## chrome devtools

* chrome devtools는 단순히 source 디버그 기능 뿐만 아니라 다양한 기능들을 제공한다.
* 필자는 Elements, Console, Source, Network 네가지를 주로 이용한다.
  * Elements: 화면 구성 요소(html 요소, css class)에 대해 출력하고 실시간으로 편집과 확인이 가능하다.
  * Console: 콘솔 로그를 보여준다. 주로 콘솔로 출력한 데이터나 에러 등을 확인할 때 사용한다.
  * Source: 화면이 크게 4가지로 나뉜다. 좌측 상단부터 폴더 트리, 소스 코드, 디버깅 툴, 그리고 하단에 콘솔이 있다.
    * 폴더 트리: 빌드된 파일 시스템을 보여준다. sourceMap을 적용하면 현재 디렉토리 구조를 그대로 출력해준다.
    * 소스 코드: 현재 소스코드를 보여준다. 원하는 곳의 라인에 breakpoint를 지정할 수 있다. sourceMap을 적용하면 실시간으로 수정이 가능하다.
    * 디버깅 툴: breakpoint를 이용해 interrupt가 걸렸을 때 라인/함수단위 실행이 가능하고, Call Stack과 특정 변수에 대한 상태 Watch, 전체 객체에 대한 Scope 기능이 있다. 전체 이벤트에 대한 breakpoint를 지정할 수 있다.
  * Network: http 프로토콜의 request단위로 정보를 조회할 수 있다. 트레픽의 flow control제어가 가능하다.
* 이 외의 기능은 참고자료를 참고바람

## vscode debugger

* vscode는 언어, 프레임워크, 브라우저 별 다양한 debug 확장툴을 지원한다.
* 이번 포스트에서는 크롬 브라우저, angular typescript 기반의 debugger를 소개한다.
* 설정 및 실행 방법
  * 설정 방법은 간단하다. 좌측의 디버거 아이콘 클릭 후 상단의 톱니바퀴를 클릭하면 설정파일이 나온다.
  * 기본적으로 디버거 종류, 요청, 디버거명 등을 json 형식으로 작성한다.
  * 현재 사용중인 설정 파일
<pre>
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome against localhost",
      "sourceMaps": true,
      "sourceMapPathOverrides": {
        "webpack:///./*": "${webRoot}/*",
        "webpack:///src/*": "${webRoot}/*",
        "webpack:///*": "*",
        "meteor://app/*": "${webRoot}/*"
      },
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}/apps/global-rms-nx"
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Attach NestJS WS",
      "port": 9229,
      "restart": true,
      "stopOnEntry": false,
      "protocol": "inspector"
    }
  ]
}
</pre>

  * SourceMaps 옵션 사용 시 크롬 브라우저에서 현재 디렉토리 구조와 동일하게 확인 및 수정이 가능하다.
  * 서버는 현재 노드 서버에서 디버거가 실행중이므로 따로 실행하지 않고 attach로 붙어 작업하였다.
  * 실행은 상단의 재생 아이콘을 눌러 실행하며, 설정 파일에 명시된 server, client를 각각 실행한다.
* 디버그 방법
  * 디버깅 패널의 기능들은 위에서 소개한 크롬 디버거와 동일하게 구성되어 있다.
  * 오른쪽의 소스코드 패널에서 라인 숫자 왼쪽을 클릭하면 breakpoint가 활성화된다.
  * 조건적인 breakpoint를 줄 수도 있다.

# 결론

chrome devtools와 vscode debugger는 제공해주는 기능이 아주 방대하다.
위에서 작성한 기능들은 필자가 자주 쓰는 일부분에 불과하며 조사 과정에서 모르는 기능들이 태반이었다.
Document도 잘 정리되어 있어 조사하는데 크게 불편함이 없었다.
조금만 공부하면 강력한 기능들을 사용할 수 있겠단 생각이 들었다.

# 참고자료

* vscode debugger 공식 사이트: https://code.visualstudio.com/docs/editor/debugging
* chrome devtools 공식 사이트: https://developers.google.com/web/tools/chrome-devtools
