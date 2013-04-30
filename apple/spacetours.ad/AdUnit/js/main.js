// Assign a global variable to indicate whether or not
// we are running in the iAd system. This allows us to
// guard against iAd specific code yet still develop
// in Safari.
// All we do is look for the existence of a window.ad
// property.

var runningInAdContext = window.hasOwnProperty('ad');

// Configure the ApplicationController class

iAd.Class({
  name: 'ApplicationController',
  superclass: iAd.RootViewController
});

// The main entry point to the ad - the constructor of the
// ApplicationController.

ApplicationController.prototype.init = function() {
  this.callSuper();
  
  // Create the menu and add it to the root view of
  // the application.
  
  this.menu = new MenuController(MenuConfiguration);
  iAd.RootView.sharedRoot.addSubview(this.menu.view);
  
  // Create a view controller for each of the "pages" in the
  // ad. The pricelist view is simple - it
  // can use the generic view controller class. The others
  // have their own view controller implementation.
  
  this.pricelist = new iAd.ViewController(PricelistConfiguration);
  this.photos = new PhotosController(PhotosConfiguration);
  this.maps = new MapsController(MapsConfiguration);
  this.video = new VideoController(VideoConfiguration);
  this.store = new StoreController(StoreConfiguration);
  
  // The video controller needs to be notified when the visibility
  // of the menu changes, so it can stop video playback when the menu appears.
  this.menu.addPropertyObserver('visible', this.video, 'menuVisibilityChanged');
};

// When the document is ready, we create an instance
// of the ApplicationController. iAd JS will take care of
// the rest.

window.addEventListener('DOMContentLoaded', function () {
  window.controller = new ApplicationController();
}, false);
