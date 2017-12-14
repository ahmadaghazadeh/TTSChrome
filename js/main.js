/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = screenWidth;
  var height = screenHeight;

  chrome.app.window.create('ttsdemo.html', {
    id: 'ttsID',
    outerBounds: {
      width: width,
      height: height,
      left: 0,
      top: 0
    }
  });
});
