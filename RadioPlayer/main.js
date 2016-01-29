/*
*   toggle player interface on search focus
*/

// used to track click toggles
var oddClick = true;

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
*   toggle player interface on toggle arrow click
*/
$('.toggle-player').click(function() {
  // rotates arrow 90 degrees
  if (oddClick)
    $('.toggle-player').addClass('toggle-player-on');
  else
    $('.toggle-player').removeClass('toggle-player-on');

  // move
  var move = $('.player-interface').css("height");
  $('.player-interface').animate(
    {bottom: oddClick ? '-' + move : '0px'},
    225
  );
  oddClick = !oddClick;
});