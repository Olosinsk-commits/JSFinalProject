/**
 * @author Olga Osinskaya <ssinsk@yandex.ru>
 * @author Noah Greer <Noah.Greer@gmail.com>
 * @author Topher Gidos <tophgidos@gmail.com>
 * 02/19/2018
 * Winter 2018
 * CSD 122 - JavaScript & jQuery
 * Group Project - Group 3 (Olga Osinskaya, Noah Greer, and Topher Gidos)
 *
 * Code for the showcase main page.
 */

$(document).ready(function() {
  $(".gamesSlideshow").before('<ul class="gamesNav">').cycle({
    timeout: 0,
    pager: '.gamesNav',
    // callback fn that creates a thumbnail to use as pager anchor
    pagerAnchorBuilder: function(idx, slideWrapper) {
      let slideSource = slideWrapper.getElementsByTagName('img')[0].src;
      return '<li><a href="#"><img src="' + slideSource + '" width="100" height="100"></a></li>';
    }
  });
});
