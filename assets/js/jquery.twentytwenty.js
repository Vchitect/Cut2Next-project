(function($){

  $.fn.twentytwenty = function(options) {
    // Only 'ratio' option is relevant now
    var options = $.extend({
      ratio: 0.5 // Default aspect ratio (e.g., 16:9 for width:height = 1.77, so height/width = 0.5625. If ratio is height/width, then 0.5 means height is half of width, 2:1 ratio)
                  // For a 16:9 video, you'd want ratio: 9/16 = 0.5625
                  // For a 4:3 video, you'd want ratio: 3/4 = 0.75
                  // Please adjust this ratio based on your video's actual aspect ratio.
    }, options);

    return this.each(function() {
      var container = $(this);
      
      // Get ratio from data attribute or options
      var thisRatio = $(container).attr("data-ratio") || $(container).attr("ratio"); // Use data-ratio for consistency
      var ratio = thisRatio ? parseFloat(thisRatio) : options.ratio;

      // We no longer need wrapping, overlays, handles, or direction arrows
      // The original container will directly become our video container

      // Select the single video element
      // Assuming your HTML will now look like:
      // <div class="my-video-container" data-ratio="0.5625">
      //   <video class="video" src="your_video.mp4" controls></video>
      // </div>
      var videoElement = container.find(".video:first");

      // Add classes for styling, if needed
      container.addClass("twentytwenty-container twentytwenty-single-video");
      videoElement.addClass("twentytwenty-main-video");

      // Function to calculate dimensions based on container width and ratio
      var calcDimensions = function() {
        var w = container.width(); // Get current width of the container
        var h = w * ratio;          // Calculate height based on ratio

        return {
          w: w + "px",
          h: h + "px"
        };
      };

      // Function to adjust the container's height to maintain aspect ratio
      var adjustContainerHeight = function(dimensions) {
        container.css("height", dimensions.h);
      };

      // Recalculate and adjust on window resize
      $(window).on("resize.twentytwenty-single-video", function() {
        var dimensions = calcDimensions();
        adjustContainerHeight(dimensions);
      });

      // Initial adjustment when the page loads
      $(window).trigger("resize.twentytwenty-single-video");

      // Removed all slider-related event listeners (movestart, move, moveend, mouseenter, mousemove, click, etc.)
      // Removed all clipping logic
    });
  };

})(jQuery);