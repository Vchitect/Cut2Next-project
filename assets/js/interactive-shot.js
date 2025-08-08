$(document).ready(function() {
  // Initialize each interactive container
  $('.interactive-shot-container').each(function() {
      var $container = $(this);
      var inputImage = $container.data('input-image');
      
      // --- ROBUST METHOD: Store the original description text in data attribute ---
      var descText = $container.find('.desc').text();
      $container.data('desc-text', descText);
      
      $container.data('state', 0).addClass('state-input');
      
      // Create initial elements for state 0
      var $image = $('<img>').attr('src', inputImage);
      var $overlay = $('<div>').addClass('interactive-overlay').html(
          '<i class="fas fa-cut"></i><p>Cut to Next Shot</p>'
      );
      var $label = $('<div>').addClass('shot-label').text('Input Shot Image');
      // Create the desc element from the stored text
      var $desc = $('<div>').addClass('desc').text(descText);
      
      // Clear original content and append the new structure
      $container.empty().append($image, $overlay, $desc, $label);
  });

  // Attach a single, unified click event handler
  $(document).on('click', '.interactive-shot-container', function() {
      var $container = $(this);
      var state = $container.data('state');
      
      // Get all necessary data from the container's data attributes
      var inputImage = $container.data('input-image');
      var resultImage = $container.data('result-image');
      var videoSrc = $container.data('video-src');
      // --- ROBUST METHOD: Always get the description from stored data ---
      var descText = $container.data('desc-text');
      
      var nextState = (state + 1) % 3;
      $container.data('state', nextState);
      
      // Clear container and remove all state classes before adding new content
      $container.empty().removeClass('state-input state-result state-video');

      switch(nextState) {
          case 0: // State 0: Back to Input Image
              $container.addClass('state-input');
              var $image = $('<img>').attr('src', inputImage);
              var $overlay = $('<div>').addClass('interactive-overlay').html(
                  '<i class="fas fa-cut"></i><p>Cut to Next Shot</p>'
              );
              var $label = $('<div>').addClass('shot-label').text('Input Shot Image');
              var $desc = $('<div>').addClass('desc').text(descText);
              $container.append($image, $overlay, $desc, $label);
              break;
              
          case 1: // State 1: Show Result Image
              $container.addClass('state-result');
              var $image = $('<img>').attr('src', resultImage);
              var $label = $('<div>').addClass('shot-label').text('Cut2Next Result');
              var $desc = $('<div>').addClass('desc').text(descText);
              $container.append($image, $desc, $label);
              break;
              
          case 2: // State 2: Play Video - FINAL FIX
              $container.addClass('state-video');
              var $video = $('<video muted autoplay loop playsinline width="100%"></video>');
              var $source = $('<source>').attr('src', videoSrc).attr('type', 'video/mp4');
              $video.append($source);
              var $watermark = $('<div>').addClass('video-watermark').text('Animated by Gen-4');
              // --- FINAL FIX: The .desc element is now correctly created and added here too ---
              var $desc = $('<div>').addClass('desc').text(descText);
              $container.append($video, $desc, $watermark);
              break;
      }
  });

  // Re-initialize Bulma Carousels
  if ($('#results-carousel').length) {
    bulmaCarousel.attach('#results-carousel', {
      slidesToScroll: 1,
      slidesToShow: 2,
      infinite: true,
      autoplay: false,
    });
  }
  if ($('#results-carousel-2').length) {
    bulmaCarousel.attach('#results-carousel-2', {
      slidesToScroll: 1,
      slidesToShow: 2,
      infinite: true,
      autoplay: false,
    });
  }
});