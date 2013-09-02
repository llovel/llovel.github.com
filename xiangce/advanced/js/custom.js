/* JS DOCUMENTATION:

* FOLIO Ner2 *

*/

/*********************************************
* ON READY
*********************************************/

//jacobo - inicializa la variable vacia que controla si hay un trabajo abierto
var donde = null;

$(document).ready(function(){
	
/****************************
 MULTIDISPLAY SMART COLLUMS 
******************************************/

function smartColumns() { //Create a function that calculates the smart columns
    //Reset column size to a 100% once view port has been adjusted
	$("ul#thumbs").css({ 'width' : "100%"});
	var colWrap = $("ul#thumbs").width(); //Get the width of row
	var colNum = Math.floor(colWrap / 200); //Find how many columns of 200px can fit per row / then round it down to a whole number
	var colFixed = Math.floor(colWrap / colNum); //Get the width of the row and divide it by the number of columns it can fit / then round it down to a whole number. This value will be the exact width of the re-adjusted column
	$("ul#thumbs").css({ 'width' : colWrap}); //Set exact width of row in pixels instead of using % - Prevents cross-browser bugs that appear in certain view port resolutions.
	$("ul#thumbs li").css({ 'width' : colFixed}); //Set exact width of the re-adjusted column
	/*$(".item figure img").css({ 'width' : colWrap});*/
}
smartColumns();//Execute the function when page loads


/***************************
// SLIDE NAV
*********************************/

barra = $('nav'); // navegacion
trabajos = $('#wrapper'); // contenidos
loquedura = {queue:true, duration:1250, easing: 'easeInOutExpo'}; // estilo del .animate()
// para las animaciones del slideNav
function para(){ barra.stop(); trabajos.stop(); };
// devuelve los pixels que hay que desplazar
function mide(){ 	return ($('nav').width()-10)+'px'; };
// si no pasa parÃ¡metro entra el menÃº, si pasa parÃ¡metro lo saca
function slideNav(e){ 
	para();
	// desplaza la navegacion
	barra.animate({  left: (e) ? '-'+mide() : 0	}, loquedura);
	// desplaza los contenidos
	trabajos.animate({ left: (e) ? 0 : mide() }, loquedura);
};
barra.mouseenter(function(){ slideNav();});
barra.mouseleave(function(){ slideNav(1); });
$("#tap-close").click(function(){ slideNav(1); });
var initBar = setTimeout('barra.mouseleave()',1000); // coloca la navegaciÃ³n en su posiciÃ³n 1 seg despues de cargar la pÃ¡gina



//$("ul#thumbs img").hide();
//
//$("ul#thumbs img").bind("load", function () { $(this).fadeIn(); });


/****************************************
// HASH FUNCTIONS
*******************************************/

var controlHash = "";
$(function() {
    var newHash      = "",
        $mainContent = $("#work-detail-wrapper"),
        $pageWrap    = $("#thumb-wrapper"),
        $el;
	// Cuando se hace click en un 'a' cambia el hash
    $(".launcher").delegate("a:not(#filters-launcher)", "click", function() {
        window.location.hash = $(this).attr("href");
        donde = 1;
        if ( $.browser.msie ) {
			if(parseInt($.browser.version, 10) <=7){
				window.location.reload();
			} ;
		}   
        return false;
    });
    $("li.thumb").delegate("a", "click", function() {
    	if ($(this).attr("href") != controlHash ){
    		createLoader($(this));
	        window.location.hash = $(this).attr("href");
	        donde = 1;
    	}else{
    		if (controlHash != ""){
    			$mainContent.slideDown(300, function() {
					var viewportHeight = $(window).height();
					$mainContent.height(viewportHeight);
	            });
    		}
    	}
    });
	// Cuando cambia el hash hace lo siguiente 
    $(window).bind('hashchange', function(){
        newHash = window.location.hash.substring(1);
        if (newHash && newHash != controlHash) {
        	controlHash = window.location.hash.substring(1);
        	$mainContent.load(newHash, function(response, status, xhr) {
        		if (status == "error") {
					//alert("Error loading work");
					$('#imgLoad').remove();
				}
        		$('#imgLoad').remove();
        		// activa slides
        		
				$('#prev').click(function(){
					activeSlides();
				});
				$('#next').click(function(){
					activeSlides(1);
				});
				
				// baja la persiana 
        		$mainContent.slideDown(300, function() {
					var viewportHeight = $(window).height();
					$mainContent.height(viewportHeight);
	            });
	            $('html,body,#wrapper').animate({scrollTop:0}, 500);
//                $.scrollTo("#top-work", 300);
				slideWorks();
				centerWork();
				closeSlideWork();

				// Hace el fundido al cargar las imÃ¡genes
				$('#slides img').load(function() {  
				  	var aparece = setTimeout("$('figure img').animate({opacity: 1},2000)", 200); 
				});
				// Coloca el fondo en su sitio
				$("img.img-work-back").fullBg();
				
                $(".thumbs a").removeClass("current");
                $(".thumbs a[href='"+newHash+"']").addClass("current");
                setTimeout(
				   function(){
					  mCustomScrollbars();
				   }, 1000);
			    $('#slideshow').fullDivGal();
            });
        };
    });
    $(window).trigger('hashchange');
});


      		

/********************************************************
 *  AJAX LOADER ANIMATION
 * ****************************************************** */
function createLoader(dondeLoad){
	var marca = document.createElement("img");
	marca.setAttribute("id", 'imgLoad');
	marca.setAttribute("src", "images/ajax-loader.gif");
	dondeLoad.append(marca);
}


/******************************************
// STICK THE NAV BAR IN IPAD
*************************************************/
(function ($) {
 
  $.fn.stickySidebar = function (opts) {
 
    var stickyboxes = []
      , $window = $(window)
      , settings = $.extend({
          speed: 350 // animation duration
        , easing: "linear" // use easing plugin for more options
        , padding: 0
      }, opts);
 
    this.each( function () {
 
      var _self = $(this);
      this.offs = {}; // our parents offset
      this.orig = { // cache for original css
          top: _self.css("top")
        , left: _self.css("left")
        , position: _self.css("position")
        , marginTop: _self.css("marginTop")
        , marginLeft: _self.css("marginLeft")
        , offset: _self.offset()
      };   
 
      this.setPositions = function () {
        // set position according to nearest postioned container
        var currOff = _self.offset();
        this.offs = findPositionedParent();
        _self.css({
            position: "absolute"
          , top: currOff.top - this.offs.top + "px"
          , left: currOff.left - this.offs.left + "px"
          , margin: 0
          , width: _self.width()
        });
        this.moveIntoView();
      }
 
      this.moveIntoView = function (ev) {
        var elem = _self.get(0)
          , sTop = $window.scrollTop() - elem.offs.top
          , currOffs = _self.offset()
          , origTop = elem.orig.offset.top - elem.offs.top;
        // scrolled down out of view
        if (origTop < sTop) {
          _self
            .stop()
            .animate(
                {top: sTop + settings.padding + "px"}
              , settings.speed
              , settings.easing
            );
        }
        // scolled back up past original offset
        else if (currOffs.top > origTop)
          _self
            .stop()
            .animate(
                {top: origTop}
              , settings.speed
              , settings.easing
            );
      }
 
      var findPositionedParent = function () {
        // start with current parent
        var $parent = _self.parent()
          , parentOffs = $parent.offset();
        // go up the tree until we find an elem to position from
        while (parentOffs && "top" in parentOffs
          && $parent.css("position") == "static") {
          $parent = $parent.parent();
          parentOffs = $parent.offset();
        }
        if (parentOffs) // found a postioned ancestor
          return parentOffs;
        else return { top: 0, left: 0 }; // ooops went to far set to doc
      }
 
      this.reset = function () {
        _self.css({
            position: this.orig.position
          , marginTop: this.orig.marginTop
          , marginLeft: this.orig.marginLeft
          , left: this.orig.left
          , top: this.orig.top
        });
      }
 
      this.setPositions();
      stickyboxes[stickyboxes.length] = this;
 
    });
 
    $window.bind("resize", function () {
      for (var i = 0, sbl = stickyboxes.length; i < sbl; ++i)
        stickyboxes[i].reset();
      for (i = 0; i < sbl; ++i)
        stickyboxes[i].setPositions();
    });
    $window.bind("scroll", function () {
      for (var i = 0, sbl = stickyboxes.length; i < sbl; ++i)
        stickyboxes[i].moveIntoView();
    });
 
    return this;
 
  }
 
})(jQuery);

if (navigator.userAgent.match(/like Mac OS X/i)) {
                //alert('Wellcome to my portfolio ready for iPad & iPhone.');
				$('#main-nav').stickySidebar();
				barra.mouseenter(function(){ 
					slideNav();
					}, function(){
						$("#wrapper").addClass('fix-wall');
						})
				barra.mouseleave(function(){
					slideNav(1);
					},function(){
						$("#wrapper").removeClass('fix-wall');
						})
				$("#tap-close").click(function(){ 
					slideNav(1);
					},function(){
						$("#wrapper").removeClass('fix-wall');
						})					
}


/**************************************************
 SLIDE WORK WRAPPER
********************************************************/
var workWrapper = $('#work-detail-wrapper');
function viewportHeight(){
	return $(window).height();
};
function viewportWidth(){
	return $(window).width();
};
function slideWorks() { 
	workWrapper.height(viewportHeight());
	workWrapper.width(viewportWidth());
}
slideWorks();//Execute the function when page loads


function closeSlideWork(){
	$('#closebt a').click(function () {
	$("#work-detail-wrapper").slideUp();
	donde = null;
});
};

/*************************************************
 * CENTERWORK
 ************************************************/
function centerWork() { // esto centra el trabajo en la pÃ¡gina y otras cosas mas
    function wrapper (){
    	return $("#work-detail-wrapper"); 
    }
	var itemW = $(".item-wrapper");
	var theItem = $('.item-wrapper .item');
	theItem.css('height', itemW.height() - 222 +'px');
};
//* SHOW INFO
function infoDiv(){
	return $('div.info-work');
}
function showInfo(){
	if (infoDiv().css('display') = 'none'){
		infoDiv().fadeIn(1000);
	}else{
		infoDiv().fadeOut(1000);
	}
}

/**********************************
   ON LOAD SLIDE NAV FUNC
****************************************/
$(window).load(function(){
//    slideNav();//Execute the function when page loads	
(function(){
		$('.thumb').fadeTo(250, 0.4);
	});
	centerWork();
});

/***************************************
 ON RESIZE ADJUST IMAGES
*********************************************/
$(window).resize(function(){
	slideWorks(); //Esential for calculate sizes in iPad landscape/portrait modes.
	centerWork();
	smartColumns();
	slideNav(1);	//Execute the function when page loads 
});

/**********************************************
//NAVIGATION		
************************************************/
$('#filters-launcher').click(function(){
	$('#filters').fadeIn(500);
	$('#sections').fadeOut(500);
});

$('.close-sub').click(function(){
	$('#filters').fadeOut(500);
	$('#sections').fadeIn(500);
});
var cat = "none";
if(cat == "none" )
		$(".thumb").fadeTo(100, 0.4);

/****************************************
//FILTERS
********************************************/
$("#filter-menu a").click(function() {
	cat = $(this).attr("class");
	$("#works .thumb").not("."+cat).fadeTo(100, 0.1);
	$("#works .thumb").filter("."+cat).fadeTo(100, 1);
	$("#filter-menu a").parent().removeClass("active");
	$(this).parent().addClass("active");
	// devuelve la altura del detalle de trabajos
	function altoScroll(){
		return $('#work-detail-wrapper').height();
	};
	// Si existe la variable de control 'donde': baja el html, sino lo sube
	$('html,body,#wrapper').animate({scrollTop: (donde) ? altoScroll() : 0}, 500);
	//$.scrollTo("#thumbs li:first-child", 300);
	return false;
});
$("#filter-menu a.none").click(function() {
	$("#works .thumb").animate({ opacity: 0.4 },{queue:true, duration:250, easing: 'easeInOutExpo'});
}); 

/*******************************************
 * THUMBS HOVER FIX
 ********************************************/
$('.thumb').hover(function(){
	if(cat== null || cat == "none" )
		$(this).fadeTo(100, 1);
}, function(){
	if(cat== null || cat == "none" )
		$(this).fadeTo(100, 0.4)
});


}); // End document ready

/*******************************************
 * MEDIA QUERIES TO DINAMYC ENHANCEMENT
 ********************************************/
// Edit to suit your needs.
var ADAPT_CONFIG = {
  // Where is your CSS/adaptive/folder?
  path: 'assets/',

  dynamic: true,
 
  range: [
    '0px    to 449px  = mobile.css',
    '459px  to 840px  = middle.css',
    '841px  to 1440px = large.css',
    '1441px  		  = xlarge.css'
  ]
};

