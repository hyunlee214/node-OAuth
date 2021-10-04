// TODO: initialize Facebook SDK

window.fbAsyncInit = () => {
  FB.init({
    appId      : APP_CONFIG.FB_APP_ID,
    // cookie     : true,
    // xfbml      : true,
    version    : 'v12.0'
  });

  // index.pug 버튼이벤트
  document.getElementById('fb-login').addEventListener('click', () => {
  // facebook 로그인 시 할당받는 액세스토큰 + 액세스토큰 안의 유저 정보 필요
  // FB.login() API 사용
  FB.login(
    (response) => {
    
    // 액세스 토큰 : 해당 user의 프로필과 이메일 정보를 알아낼 권한만 보유 , expiresIn시간 동안만 유효  
    // 해당 서비스의 서버가 액세스 토큰을 받게 되면, 해당 액세스 토큰이 해당 앱에서 사용 가능한 액세스 토큰이 맞는지 검증 필요(요청 단계)
    // facebook이 해당 앱에게 액세스 토큰의 데이터 전송 
    // 해당 앱은 받은 정보를 이용해 회원가입 완료 
    fetch(
      `/users/auth/facebook?access_token=${response.authResponse.accessToken}`,
      {
        method: 'POST',
      }
    )       
  }, 
    {scope: 'public_profile,email'})
  })
};

((d, s, id) => {
   const fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) 
   {
     return;
    }

   const js = d.createElement(s)
   js.id = id
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 })
 (document, 'script', 'facebook-jssdk');