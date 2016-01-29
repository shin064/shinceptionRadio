// used to track click toggles
var oddClick = true;

/*
*   toggle player interface on search focus
*/
$('.input-search').focusin(function() {
  var move = $('.player-interface').css("height");
  // move down
  $('.player-interface').animate(
    {bottom: '-' + move},
    225
  );
  // rotate arrow
  $('.toggle-player').addClass('toggle-player-on');
  oddClick = false;
}).focusout(function() {
  // move up
  $('.player-interface').animate(
    {bottom: '0px'},
    225
  );
  // rotate arrow
  $('.toggle-player').removeClass('toggle-player-on');
  oddClick = true;
});

/*
*   toggle player interface on arrow click/touch
*/
$('.toggle-player').click(function() {
  // rotates arrow 90 degrees
  if (oddClick)
    $('.toggle-player').addClass('toggle-player-on');
  else
    $('.toggle-player').removeClass('toggle-player-on');

  // move player up or down depending on oddClick.
  var move = $('.player-interface').css("height");
  $('.player-interface').animate(
    {bottom: oddClick ? '-' + move : '0px'},
    225
  );
  oddClick = !oddClick;
});