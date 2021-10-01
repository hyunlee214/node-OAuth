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
    console.log(response);
    // handle the response
  }, 
    {scope: 'public_profile,email'});
  })
};

((d, s, id) => {
   const fjs = d.getElementsByTagName(s)[0];
   if (d.getElementById(id)) 
   {return;}

   const js = d.createElement(s)
   js.id = id
   js.src = "https://connect.facebook.net/en_US/sdk.js";
   fjs.parentNode.insertBefore(js, fjs);
 })
 (document, 'script', 'facebook-jssdk');