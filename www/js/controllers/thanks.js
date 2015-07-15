/**
 *
 */

var ThanksController = /*@ngInject*/ function($scope, $sce) {

  // TODO(all): Use the message-response objects to customize the thanks page

  $scope.shares = [
    {
      name: 'Facebook',
      link: 'https://www.facebook.com/sharer/sharer.php?app_id=709021229138321&u=https%3A%2F%2Fdemocracy.io%2F&display=popup',
      graphic: '<svg width="70" height="70" viewBox="0 0 1900 1900" xmlns="http://www.w3.org/2000/svg"><filter id="dropshadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur in="SourceAlpha" result="blur-out" stdDeviation="50" /><feOffset in="blur-out" result="the-shadow" dx="50" dy="50"/><feColorMatrix in="the-shadow" result="color-out" type="matrix" values="0.05 0 0 0   0.05 0 0 0 0   0.05 0 0 0 0   0 0 0 0 .14 0"/><feBlend in="SourceGraphic" in2="color-out" mode="normal"/></filter><path id="facebook" d="M1376 128q119 0 203.5 84.5t84.5 203.5v960q0 119-84.5 203.5t-203.5 84.5h-188v-595h199l30-232h-229v-148q0-56 23.5-84t91.5-28l122-1v-207q-63-9-178-9-136 0-217.5 80t-81.5 226v171h-200v232h200v595h-532q-119 0-203.5-84.5t-84.5-203.5v-960q0-119 84.5-203.5t203.5-84.5h960z" fill="#fff" style="filter:url(#dropshadow)"/></svg>'
    },
    {
      name: 'Twitter',
      link: 'https://twitter.com/intent/tweet?status=I%20just%20wrote%20a%20letter%20to%20my%20representatives%20using%20https%3A%2F%2Fdemocracy.io&related=eff,efflive',
      graphic: '<svg width="70" height="70" viewBox="0 0 1900 1900" xmlns="http://www.w3.org/2000/svg"><path id="twitter" d="M1408 610q-56 25-121 34 68-40 93-117-65 38-134 51-61-66-153-66-87 0-148.5 61.5t-61.5 148.5q0 29 5 48-129-7-242-65t-192-155q-29 50-29 106 0 114 91 175-47-1-100-26v2q0 75 50 133.5t123 72.5q-29 8-51 8-13 0-39-4 21 63 74.5 104t121.5 42q-116 90-261 90-26 0-50-3 148 94 322 94 112 0 210-35.5t168-95 120.5-137 75-162 24.5-168.5q0-18-1-27 63-45 105-109zm256-194v960q0 119-84.5 203.5t-203.5 84.5h-960q-119 0-203.5-84.5t-84.5-203.5v-960q0-119 84.5-203.5t203.5-84.5h960q119 0 203.5 84.5t84.5 203.5z" fill="#fff" style="filter:url(#dropshadow)" /></svg>'
    },
    {
      name: 'Email',
      link: 'mailto:?Subject=Writing%20to%20my%20representatives&Body=Hi%2C%0A%0AI%20just%20wrote%20a%20message%20to%20my%20representatives%20using%20https%3A//democracy.io%20about%20an%20important%20issue%20I%20care%20about.%0A%0AWill%20you%20do%20the%20same%3F%0A%0AThanks%2C%0A%0A',
      graphic: '<svg width="70" height="70" viewBox="0 0 1900 1900" xmlns="http://www.w3.org/2000/svg"><path id="email" d="M1376 128q119 0 203.5 84.5t84.5 203.5v960q0 119-84.5 203.5t-203.5 84.5h-960q-119 0-203.5-84.5t-84.5-203.5v-960q0-119 84.5-203.5t203.5-84.5h960zm32 1056v-436q-31 35-64 55-34 22-132.5 85t-151.5 99q-98 69-164 69t-164-69q-46-32-141.5-92.5t-142.5-92.5q-12-8-33-27t-31-27v436q0 40 28 68t68 28h832q40 0 68-28t28-68zm0-573q0-41-27.5-70t-68.5-29h-832q-40 0-68 28t-28 68q0 37 30.5 76.5t67.5 64.5q47 32 137.5 89t129.5 83q3 2 17 11.5t21 14 21 13 23.5 13 21.5 9.5 22.5 7.5 20.5 2.5 20.5-2.5 22.5-7.5 21.5-9.5 23.5-13 21-13 21-14 17-11.5l267-174q35-23 66.5-62.5t31.5-73.5z" fill="#fff" style="filter:url(#dropshadow)"/></svg>'
    }
  ];

  $scope.safeGraphic = function(share) {
    return $sce.trustAsHtml(share.graphic);
  };

  $scope.sharePopup = function(link) {
    window.open(link, 'Share', 'width=650,height=400');
  };
};

module.exports = ThanksController;
