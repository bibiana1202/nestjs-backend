# nestjs-backend


8장.NestJS 시작하기

8.1 왜 NestJS가 필요할까?
- NestJS는 서버 개발 시의 아키텍처를 누구든 비슷하게 설계하도록 아키텍처 문제를 해결하는데 중점을 두고 있습니다.

8.2 NestJS 소개
- Node.js에서 실행하는 서버 사이드 프레임워크 입니다.
- 타입스크립트를 완벽하게 지원합니다.
- 자바스크립트의 최신스펙을 사용합니다.
- HTTP 요청 부분은 추상화된 코드를 제공해 익스프레스와 패스티파이를 사용할수 있습니다.

8.2.1 익스프레스와 NestJS 비교하기
- 자바스크립트의 최신 기능을 사용해 효율성을 추구하며 상업용 서버 애플리케이션 구축을 목표로 하는 프레임 워크
- @Controller 데코레이터 사용
- 잘 만든 의존성 주입 기능을 제공함. 서비스의 의존 관계의 관리가 쉬움
- @Catch 데코레이터 사용
- jest를 기반으로 한 내장 테스트 모듈을 제공
- 컨트롤러,프로바이더,모듈을 사용한 애플리케이션 아키텍처 제공

8.2.2 NestJS 둘러보기
- 핵심 기능 : 의존성 주입 = 모듈 간의 결합도를 낮춰서 코드의 재사용을 용이하게 합니다.
- 데코레이터 : 일종의 함수이며 @데코레이터명으로 사용 할 수 있습니다. 메소드,클래스,프로퍼티,파라미터에 붙일수 있습니다.
- NestJS 는 익스프레스를 품고 있기 때문에 익스프레스 기반의 미들웨어를 거의 대부분 사용할 수 있습니다. 정확하게는 HTTP 요청과 응답에 익스프레스의 Request와 Response 객체를 기본으로 사용합니다.

8.3 NestJS 설치하고 실행하기

8.3.1 의존성 패키지 설치하기
- nestjs/common : NestJS의 공통 코드들
- nestjs/core : NestJS의 핵심 코드(가드,미들웨어,파이프 등)
- nestjs/platform-express : HTTP 요청 에 익스프레스 사용

8.3.2 타입스크립트 설정하기
- 타입스크립트 설정 파일은 tsconfig.json 파일

8.3.3 NestJS의 모듈과 컨트롤러 만들기
- NestJS는 웹서버 이므로 기본적으로 HTTP 요청/응답을 처리
- HTTP 요청을 보통 가드->인터셉터->파이프->컨트롤러->서비스->리포지토리 순서로 처리
- 컨트롤러는 필수로, 클라이언트에서 온 요청을 코드에 전달해야 하기 때문
- 컨트롤러는 모듈에 포함되어 있습니다. 그러므로 NestJS를 최소한의 코드로 실행시키려면 하나의 모둘과 하나의 컨트롤러가 필요합니다.

8.3.4 hello-nest 앱 실행시켜보기
- 진입점은 bootstrap()
- NestFactory는 사실 NestFactoryStatic 클래스이며 create() 함수에 루트 모듈을 넣어서 NestApplication 객체를 생성합니다.
- NestApplication 객체에는 HTTP 부분을 모듈화한 HTTPAdapter가 있습니다.

8.3.5 NestJS의 네이밍 규칙
- 파일명은 .으로 연결, 모듈이 둘이상 단어로 구성되어 있으면 대시로 연결
- 클래스명은 낙타표기법
- 같은 디렉터리에 있는 클래스는 index.ts를 통해서 임포트 하는 것을 권장
- 타입스크립트에서는 인터페이스를 많이 사용, 인터페이스는 타입을 정의하는 데 사용되고 구체적인 내용은 클래스를 만들고 인터페이스를 상속하는 방식으로 작성

8.4 NestJS로 웹 API 만들기

8.4.1 프로젝트 생성과 설정
- .prettierrc 은 코드 포매팅 관련 설정 파일
- nest-cli.json 파일은 nest 명령어를 사용해 프로젝트를 생성하거나 파일을 생성할 때 필요에 따라 수정
- main.ts는 서버 기동 시의 시작 파일
- tsconfig.json 및 tsconfig.build.json은 타입스크립트를 위한 설정 파일

8.4.2 컨트롤러 만들기
- <모듈명>.controller.ts

8.4.3 블로그 API 작성하기

8.4.4 메모리에 데이터를 저장하는 API 만들기

8.4.5 파일에 정보를 저장하도록 API 업그레이드 하기
- 영속성 계층

8.5 의존성 주입하기
- 지금까지 만든 컨트롤러,서비스,리포지토리는 서로 의존 관계입니다. 컨트롤러는 서비스를 사용하고, 서비스는 리포지토리를 사용합니다. 각 단계마다 필요한 객체를 사용하려면 생성자에서 객체를 생성했습니다. 지금은 각각 하나씩만 있지만, 수십 수백 클래스가 있다면 의존성을 해결하고자 그만큼 많은 객체를 생성자에서 만들어야 합니다. 직접 생성하지 않고 다른 곳에서 생성한 객체들을 가져다 쓰면 좋을 것같은데 어떻게 하면 될까요? 이때 제어의 역전 원칙을 사용합니다. 객체 생성은 개발자가 제어하는 영역이었는데 이 영역을 프레임워크에 맡기는 겁니다. 제어의 역전 원칙을 사용해 만든 패턴이 의존성 주입 입니다. 개발자가 객체를 생성하지 않고 프레임워크가 생성한 컨테이너가 의존성을 관리합니다.
- NestJS에서 의존성 주입을 하는 방법은 간단합니다. 주입 하고 싶은 클래스에 @Injectable 데코레이터를 붙이기만 하면 됩니다. 리포지토리와 서비스를 다른 클래스에서 사용하므로 의존성 주입 대상이 될겁니다. @Injectable 데코레이터를 사용하여 다른 클래스에 주입해 사용할수 있는 클래스들을 프로바이더 라고 부릅니다.

8.6 몽고디비 연동하기

---

9장 NestJS 환경 변수 설정하기

9.1 환경 변수 소개
- 환경변수 설정은 ConfigModule에서 할수 있으며, 설정된 환경변수를 다른 모듈에서 가져다 쓰려면 ConfigService를 주입받아서 사용해야 합니다.
- ConfigModule은 초기화를 해야하는데 1.ConfigModule.forRoot() 함수로 쵝화가 가능합니다. 보통 app.module.ts에서 해당 코드를 실행합니다. ConfitModule을 초기화 할때 2.envFilePath 설정에서 환경변수를 읽은 뒤 3.process.env에 설정되어있는 환경변수와 합칩니다. 마지막으로 커스텀 환경변수를 설정한 load옵션의 설정과 병합한뒤 ConfigService를 초기화 합니다.

9.2 프로젝트 생성 및 설정하기
- @nestjs/config 는 내부적으로 dotenv를 사용합니다. dotenv는 .env라는 이름의 파일에 환경변수를 설정하고 불러올 수 있게 하는 자바스크립트로 만든 라이브러리 입니다.

9.3 NestJS 설정 및 테스트 하기
- ConfigModule은 환경 설정에 특화된 기능을 하는 모듈입니다. @nestjs/config 패키지에 포함되어있는 클래스이며 모든 환경 변수 설정은 ConfigModule로 부터 시작한다 생각하면 됩니다.

9.4 ConfigModuled을 전역 모듈로 설정하기
- 환경 변수를 읽어오려면 ConfigService를 사용할수 있어야 합니다.
- isGlobal 옵션을 사용하면 전역 모듈로 등록되어 다른 모듈에 ConfigModule을 일일이 임포트하지 않아도 됩니다.

9.5 여러 환경 변수 파일 사용하기
- dev(개발용),qa(QA용),beta(베타 서비스용),prod(실제 서비스용)
- envFilePath는 환경 변수 파일의 경로를 지정하는 옵션

9.6 커스텀 환경 설정 파일 사용하기
- 커스텀 파일 설정을 하려면 load 옵션을 추가해야 합니다.

9.7 서버 기동과 환경 설정 파일 초기화 순서 알아보기
- npm run start 명령어를 사용해 서버를 기동할때 먼저 실행되는 파일은 main.ts 입니다. main.ts에는 bootstrap() 함수가 있으며 해당 함수를 실행하는 것으로 시작합니다. bootstrap()함수에서는 NestFactory.create()를 실행합니다. NestFactory.create()는 설정되어 있는 모듈을 초기화 하는 작업을 진행합니다.
- 각 모듈이 초기화 될때 의존성 주입을 해야하는 부분들을 초기화 하고 주입하도록 인스턴스를 생성하는 일을 합니다. ConfigModule을 먼저 초기화해 환경변수를 어떤 모듈에서든지 읽을 수 있는 준비를 해줍니다. 다음으로 AppModule을 초기화하고, AppModule 하위에 있는 WeatherModule을 초기화합니다.
- App.Module에 설정되어있는 ConfigModule.forRoot()를 실행해 설정파일을 읽습니다. 아무런 설정이 없으면 .env 파일에서 설정을 읽어옵니다. envFilePath 설정이 있다면 리스트에 담겨있는 순서대로 설정을 읽어서 저장합니다. 다음으로 시스템의 환경변수인 process.env에 있는 환경 변수를 병합합니다. load 옵션이 있다면 load 에 있는 환경변수 합치게 됩니다.
- 모듈이 모두 초기화 되었다면, 컨트롤러의 인스턴스를 생성하고 컨트롤러에 있는 핸들러 함수를 URL과 매핑하는 작업을 진행합니다. 이 작업이 끝나면 서버는 성공적으로 시작된다는 메시지를 보내 줍니다.

9.8 YAML 파일을 사용해 환경변수 설정하기
- js-yaml 패키지 설치

9.9 캐시 옵션 사용하기
- cache:true 사용하면 ConfigService의 get() 함수를 사용할 때 캐시에서 먼저 불러오게 되므로 성능상의 이점이 있습니다.

9.10 확장 변수 사용하기
- 확장 변수는 이미 선언된 변수를 다른 변수에 ${변수명} 으로 할당하는 기능
- expandVariables:true 확장 변수 옵션 추가

9.11 main.ts에서 환경 변수 사용하기
- main.ts는 서버 기동 시 가장 먼저 실행되는 파일 입니다. 가장 먼저 실행되므로 해당 파일에서 NestFactory.create()를 호출해주기 전에는 ConfigModule이 활성화 되지 않습니다. 또한 클래스가 아니라 bootstrap()함수만 있으므로 기존처럼 클래스의 생성자로 의존성 주입을 받을 수 없어, 다른 방법으로 ConfigService를 사용해야 합니다. main.ts에서는 configService 인스턴스를 주입받을 수는 없으므로 app.get()메서드에 ConfigService 클래스를 인수로 주고, 반환값으로 받는 방식을 사용합니다.

---
10장 회원 가입과 인증하기

10.1 실습용 프로젝트 설정하기

10.2 유저 모듈의 엔티티,서비스,컨트롤러 생성하기

10.3 파이프로 유효성 검증하기
- 익스프레스 에서는 컨트롤러 역할을 하는 곳 또는 별도의 라이브러리를 사용해 검증합니다만, NestJS에서는 파이프를 사용해서 유효성 검증을 합니다.
- ValidationPipe 
  - class-validator : 데코레이터를 사용해 간편하게 유효성 검증을 하는 라이브러리
  - class-transformer : JSON 정보를 클래스 객체로 변경합니다. 받은 요청을 변환한 클래스가 컨트롤러의 핸들러 메서드의 매개변수에 선언되어 있는 클래스와 같다면 유효성 검증을 합니다.

10.3.1 전역 ValidationPipe 설정하기
```ts
    import {ValidationPipe} from '@nestjs/common';

    app.useGlobalPipes(new ValidationPipe()); // 전역 파이프에 validationPipe 객체 추가
```

10.3.2 UserDto 만들기
```ts
    import {IsEmail,IsString} from 'class-validator';

    @IsEmail()
    @IsString()
```

10.4 인증 모듈 생성 및 회원 가입 하기
- 인증을 만드는 2가지 : 쿠키를 기반으로 만들거나, 토큰 기반으로 만들기
- 쿠키리스 : 쿠키가 없는 토큰 기반
- 쿠키는 서버에서 보내준 쿠키를 클라이언트(주로 브라우저)에 저장해 관리
- 토큰은 서버에 상태를 저장할 필요가 없다.

10.5 쿠키를 사용한 인증 구현하기
- AuthController에 login 핸들러 메서드가 필요합니다. 두번째로 AuthService에서 email,password를 넘겨주면 해당 정보의 유저가 있는지 유효성 검증을 하는 로직이 필요합니다. 유저 정보의 유효성 검증이 끝나면 응답값에 쿠키 정보를 추가해 반환합니다.
- NestJS에서 인증을 구현할때 보통 인증용 미들웨어인 가드를 함께 사용합니다.
- 가드는 특정 상황(권한,롤,액세스컨트롤)에서 받은 요청을 가드를 추가한 라우트 메서드에서 처리할지 말지를 결정하는 역할을 합니다.
 
 10.5.1 AuthService에 이메일과 패스워드 검증 로직 만들기
 - 유저 정보가 있으면 res.cookie를 사용해서 쿠키를 설정해줍니다.
 - httpOnly를 true로 설정하면 브라우저에서 쿠키를 읽지 못합니다. 브라우저에서 쿠키를 읽을 수 있다면 XSS(Cross Site Scripting)등의 공격으로 쿠키가 탈취되는 상황이 발생합니다.

10.5.2 가드를 사용해 인증됐는지 검사하기
- NestJS 에는 인증할 때 가드라는 미들웨어를 보편적으로 사용합니다.
- 가드는 @Injectable() 데코레이터가 붙어있고 CanActivate 인터페이스를 구현한 클래스 입니다.
- @UseGuard 데코레이터로 가드를 사용할 수 있습니다.
- CanActivate 인터페이스를 구현하려면 canActivate() 메서드를 구현해야 합니다. canActivate() 메서드는 boolean 또는 Promise<boolean>을 반환하며 true인 경우 핸들러 메서드를 실행하고 false이면 403 Forbidden 에러를 줍니다.
- npm install cookie-parser
```ts
    import cookieParser from 'cookie-parser';
    app.use(cookieParser()); // 쿠키 파서 설정
```
- 주의할 점으로 가드 내에서 응답에 쿠키를 설정할 수 없습니다. 또한 가드는 모든 미들웨어의 실행이 끝난 다음 실행되면 filter나 pipe보다는 먼저 실행됩니다.

10.6 패스포트와 세션을 사용한 인증 구현하기
- 서버에서 인증하고 해당 정보를 서버의 특정 공간에 저장해두는것입니다. 이때 사용하는 것이 세션입니다.
- 세션을 사용할때도 쿠키를 사용합니다만, 쿠키는 세션을 찾는 정보만 저장 하고, 중요 정보는 세션에 모두 넣는 것이 좋습ㄴ디ㅏ.
- 세션은 서버의 자원을 사용하는 것이므로 서버에 부하를 주는 단점이 있습니다만, 위조,변조,탈취가 불가능하므로 보안적으로는 더 안전하다고 할수 있습니다.
- 인증 로직 구현은 패스포트 라는 인증 로직 을 쉽게 불리해서 개발하는 라이브러리를 사용합니다.
- 패스포트 사용시 인증 로직은 스트래티지 파일을 생성해서 사용합니다. 인증 로직 수행을 담당하는 클래스를 의미합니다.
- 인증로직을 처리하는 별도의 스트래티지 파일이 필요합니다.
- 세션을 사용시 세션에서 데이터를 읽어오고 저장하므로 세션에 데이터 저장하고 읽어올 세션 시리얼라이저 파일도 필요합니디.
- 가드, 패스포트의 스트래티지, 세션 시리얼라이저가 서로 협력해서 사용자 신원을 확인하고, 인증 정보를 저장하고 읽어와서 다시 인증하는 작업을 합니다.

10.6.1 라이브러리 설치 및 설정하기
- passport-local : username과 password로 인증할수 있는 전략을 사용하는 모듈
- express-session : 세션저장
- @types/passport-local , @types/express-session : 타입스크립트의 타입 정보를 담고 있는 라이브러리

10.6.2 로그인과 인증에 사용할 가드 구현하기
- NestJS에서는 패스포트를 편하게 사용할수 있도록 @nestjs/passport를 제공 : 패스포트 인증에 가드를 사용할 수 있도록 감싸둔 AuthGuard를 제공하는 라이브러리 입니다.
- 패스포트는 인증로직을 스트래티지라는 개념으로 구현합니다. id,password로 인증을 처리할때는 passport-local을 사용합니다. AuthGuard('local')은 로컬스트래티지를 사용합니다. 이외의 스트래티지로 passport-jwt와 passport-google-oauth20 등이 있습니다.
- 가드를 사용하려면 canActivate를 구현해야 합니다. AuthGuard를 상속받았으니 super.canActivate()에서는 passport-local의 로직을 구현한 메서드를 실행합니다.local.strategy.ts 파일 LocalStrategy 클래스를 생성한후 validate()메서드를 구현
- super.logIn()에서는 로그인 처리를 하는데, 여기서는 세션을 저장합니다. 세션을 저장하고 꺼내오는 방법은 session.serializer.ts 파일에 작성합니다.
- AuthenticatedGuard는 로그인 후 인증이 되었는지 확인할때 사용합니다. 세션에 데이터를 저장하고 돌려주는 응답(response)값에 connect.sid라는 이름의 쿠키를 만들게 됩니다. 이후의 요청에 해당 쿠키값을 같이 전송하면 세션에 있는 값을 읽어서 인증 여부를 확일할때 사용하는 가드 입니다.

10.6.3 세션에 정보를 저장하고 읽는 세션 시리얼라이저 구현하기
- SessionSerializer는 PassportSerializer를 상속받습니다.
  - serializeUser() : 세션에 정보를 저장합니다.
  - deserializeUser() : 세션에서 가져온 정보로 유저 정보를 반환합니다.
  - getPassportInstance() : 패스포트 인스턴스를 가져옵니다. 패스포트 인스턴스의 데이터가 필요한 경우 사용합니다.
- 

10.6.4 email,password 인증 로직이 있는 LocalStrategy 파일 작성하기
- 인증 방법은 다양합니다. 다양한 방법을 패키지 하나에 담을 필요는 없기 때문에 패스포트에서는 이를 strategy라는 별개의 패키지로 모두 분리해서 담습니다.
- 인증 유형별 스트래티지
  - Local / passport-local : 유저명과 패스워드를 사용해 인증
  - OAuth / passport-oauth : 페이스북, 구글, 트위터 등의 외부 서비스 에서 인증
  - SAML / passport-saml : SAML 신원 제공자에서 인증, OneLogin,Okta 등
  - JWT / passport-jwt : JSON Web Token을 사용해 인증
  - AWS Cognito / passport-cognito : AWS의 Cognito user pool을 사용해 인증
  - LDAP / passport-ldapauth : LDAP 디렉터리를 사용해 인증
- PassportStrategy(Strategy)는 믹스인이라고 불리는 방법입니다. 컴포넌트를 재사용할때 상속을 많이 사용하지만 해당 클래스의 모든 것을 재사용해야 하는 불편함이 있습니다. 클래스의 일부만 확장하고 싶을 때는 믹스인을 사용합니다.
- 믹스인/트레잇 : 클래스에 새로운 기능을 추가하기 위해, 필요한 메서드를 가지고 있는 작은 클래스들을 결합해 기능을 추가하는 방법을 말합니다.

10.6.7 로그인과 세션 저장까지 순서
- 유저가 서버에 로그인 요청을 보냅니다
- 유저가 보낸 요청은 AuthController에 있으며 @UseGuards(LocalAuthGuard) 데코레이터가 붙어있습니다. 이에 LocalAuthGuard가 먼저 실행됩니다. Guard이므로 canActivate() 메서드가 구현되어 있으며, LoadAuthGuard는 AuthGuard('local')을 상속받았으므로 canAtivate() 메서드 내에서 부모의 canActivate()를 호출 하도록 super.canActivate()를 실행합니다.
- super.canActivate()는 LocalStrategy의 validate() 메서드를 실행합니다. validate() 메서드에서는 유저의 email과 password 정보를 사용해 유효한 유저인지 확인합니다.
- LocalStrategy의 validate() 메서드는 성공하면 true, 실패하면 401 에러를 반환합니다. LocalAuthGuard는 LocalStrategy에서 validate()의 반환값이 true이면 super.logIn()을 호출합니다.
- super.logIn()은 SessionSerializer의 serializeUser()를 실행하며 세션에 유저 정보를 저장합니다.
- 인증 및 세션 저장이 완료되면 login3() 메서드의 몸체가 실행되어 클라이언트에게 응답값을 전송합니다.