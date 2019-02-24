/* Global Variables */
var continueTL;

/* Global Variables - Sections type index map */
var scenarios = [3,4,6,8,10,12,13,14,17];
var questionnaires = [5,9,11];
var accordions = [15];
var markings = [7,16];
var quizPageNumber = 18;
var summaryPageNumber = 19;

/* Global Variables - Final Quiz */
var quiz;
var finalGrade = 0;
var questionCounter = 0; 
var selections = [];
var questions = [{
	description: "הממונה עליך מציע/ה לך לצאת איתו/ה לבילוי רומנטי בסוף השבוע בצימר בצפון. האם מדובר בהטרדה מינית?",
	correct: 'devil'
}, {
	description: 'שני חברים מתווכחים ביניהם. במהלך ויכוח פולט האחד לעבר השני את הכינוי גנאי "מתרומם". האם מדובר בהטרדה מינית?',
	correct: 'devil'
}, {
	description: "עמית שולח לעמיתתו לעבודה קישור לאתר פורנוגרפי. העמיתה מגיבה שאינה מעוניינת לקבל קישורים כאלו, אך העמית שולח לה שוב קישורים לאתרים פורנוגרפיים.",
	correct: 'devil'
}, {
	description: 'הממונה אמר למזכירתו, "בוקר טוב, במה נתחיל בנשיקה או בעבודה" המזכירה מחייכת. כעבור מספר ימים הוא שוב שואל "נפתח את היום בנשיקה"? היא נבוכה ולא מגיבה להצעתו. האם מדובר בהטרדה מינית?',
	correct: 'devil'
}, {
	description: "עובד מספר בדיחות גסות לעמיתיו במהלך ארוחת הצהריים המשותפת, למרות שהתבקש על ידם להפסיק. האם מדובר בהטרדה מינית?",
	correct: 'devil'
}];

/* Global Functions */
function updateContactData(){
	var html = "";
	$.each(contact, function(k,v){
		if(k === 'company'){
			return;
		}else if(k === 'phone'){
			var numbers = v.split(",");
			$.each(numbers, function(i, num){
				if(num){
					html+= '<a href="tel:' + num + '">' + num + '</a><br/>'; 
				}
			});
		}else if(k === 'email'){
			var emails = v.split(",");
			$.each(emails, function(i, address){
				if(address){
					html+= '<a href="mailto:' + address + '">' + address + '</a><br/>';
				}
			});	
		}else if(v){
			html+= v + '<br/>'; 
		}
	});
	$('.contactDetails .details').html(html);	
}

function enableScrolling(){
	$.fn.fullpage.setKeyboardScrolling(true,'down');
	$.fn.fullpage.setAllowScrolling(true,'down');
	var tl = new TimelineLite();
	if( !$('.scrollDown').hasClass('visible') ){
		tl.fromTo($('.scrollDown'), 0.5, {display:'none', opacity:0, y:-30}, {display:'block', opacity:1, y:0})
		tl.add(TweenLite.delayedCall(7,displayHint, ["down"]));
	}
	tl.add(function(){
		$('.active.fp-completely').addClass('stepCompleted');
		$('.scrollDown').addClass('visible');
	});
	return tl;
}

function disableScrolling(){
	$.fn.fullpage.setAllowScrolling(false, 'down');
	$.fn.fullpage.setKeyboardScrolling(false, 'down');
	$('.scrollDown').removeClass('visible');
	var tl = new TimelineLite()
		.to($('.scrollDown'), 0.1, {display:'none', opacity:0});
	return tl;
}

function displayHint(dir){
	var hint = $('.hint');
	TweenMax.killTweensOf(hint);
	hint.attr('class', 'hint ' + dir);
	if(dir === 'left'){
		TweenLite.fromTo(hint, 0.5, {opacity:0, display:'none', y:0, x:30}, {opacity:1, display:'flex', y:0, x:0});
	}else{
		TweenLite.fromTo(hint, 0.5, {opacity:0, display:'none', x:0, y:-30}, {opacity:1, display:'flex', x:0, y:0});
	}
	var tl = new TimelineMax({repeat:-1, repeatDelay:2});

	if(dir === 'left'){
		tl.to(hint, 0.50, {x:50, ease:Power2.easeOut}, "bounceme")
		  .to(hint, 1.00, {x:0, ease:Bounce.easeOut}, "bounceme");
	}else{
		tl.to(hint, 0.50, {y:-20, ease:Power2.easeOut}, "bounceme")
		  .to(hint, 1.00, {y:0, ease:Bounce.easeOut}, "bounceme");
	}
	return tl;	
}

function hideHint(){
	var hint = $('.hint');
	TweenMax.killTweensOf(hint);
	TweenMax.killAll(false, false, true, false);
	var tl = new TimelineLite()
		.add(function(){
			hint.attr('class','hint');
			hint.hide();
		});
	return tl;
}


function updateNavigation(index){
	var section = $('.fp-section').get(index-1);
	var group = section.getAttribute('data-group');
	var mainSectionId = section.id.split('_')[0];
	// Top Menu
	$('#menu li').removeClass('active');
	$('#menu li[data-link="' + group + '"]').addClass('active');
	// Address Bar
	location.hash = group + '/' + section.id;
	var baseUrl = window.location.href.split('#')[0];
	window.history.replaceState(undefined, undefined, '#' + group + '/' + section.id );
	var tl = new TimelineMax();
	tl.call(function(){
		$('.scrollDown span').html(index + ' / ' + $('.fp-section').length );
	});
	
	if(group === 'behavior'){
		// Behavior Intro Nav
		var navElm = $('#behaviorTypes ol').find('.' + mainSectionId);
		navElm.addClass('hoverable').prevAll().addClass('hoverable');
		
		// aSide
		var activeSection = $('.aSide li[class^="' + mainSectionId + '"]');
		if(activeSection.length > 0 && typeof activeSection.html() !== "undefined" ){
			$('.aSide li').removeClass('active');
			activeSection.addClass('active');
			tl.to($('.aSide'), 0.5, {display:'block', opacity:1, delay:1});
		}else{
			tl.set($('.aSide'), {display:'none', opacity:0});
		}
	}else{
		tl.set($('.aSide'), {display:'none', opacity:0});
	}
	return tl;
}


/* Animation Functions */

function introAnimation(){
	var tl = new TimelineMax()
		.from($('#introduction h2'), 0.5, {opacity:0})
		.from($('#introduction blockquote'), 0.5, {x:1000})
		.from($('#introduction .intro'), 0.5, {scale:0.8, opacity:0})
		.add(enableScrolling);
	return tl;
}

function behaviorIntro(){
	var tl = new TimelineMax()
		.staggerFrom($('#behavior article > * '), 0.5, {x:1000}, 0.2);
	if($(window).width() < 992){
		tl.from($('#forbidden'), 0.5, {y:1000, ease:Power3.easeOut});
	}else{
		tl.from($('#forbidden'), 0.5, {x:-1000, ease:Power3.easeOut});
	}
	tl.from($('#forbidden img'), 0.5, {opacity:0, scale:0.8, rotation:180});
	tl.add(enableScrolling);
	return tl;
}

function scenarioAnimation(index){
	var scenario = '#' + $('.fp-section').get(index-1).id;
	var tl = new TimelineLite()
		.set($(scenario + ' .slideImg'), 	{x:0})
		.set($(scenario + ' .quote'), 		{x:0})
		.set($(scenario + ' .continue'), 	{x:0, display:'block'})
		.set($(scenario + ' .qContainer'), 	{display:'none',x:0})
		.set($(scenario + ' .bubble'),		{display:'none', opacity:1})
		.fromTo($(scenario + ' .slideImg'),			1.5,	{ opacity:0}, {opacity:1})
		.fromTo($(scenario + ' .quote'),			1,		{scale:1.2, opacity:0}, {scale:1, opacity:1})
		.fromTo($(scenario + ' h4'),				0.5,	{x:-30, opacity:0}, {x:0, opacity:1},"-=1")
		.staggerFromTo($(scenario + ' .pr_step'),	1, 		{x:30, opacity:0}, {x:0, opacity:1}, 0.5)
		.fromTo($(scenario + ' .continue'),			0.5,	{opacity:0, x:50}, {opacity:1, x:0}, "-=0.5")
		.add(TweenLite.delayedCall(3,displayHint, ["left"]));
	;
	return tl;
}

function withinScenarioAnimation(slideId){
	var tl = new TimelineMax({paused: true})
		.add(hideHint())
		.to($('#' + slideId + ' .quote'), 1, {x:2000})
		.to($('#' + slideId + ' .continue'), 0.5, {x:-100, display: 'none'},"-=0.5")
		.set($('#' + slideId + ' .qContainer'),{display:'block'})
		.set($('#' + slideId + ' .bubble'),{display:'block'})
		.staggerFromTo($('#' + slideId + ' .bubble'),0.5, {scale:0.8, opacity:0}, {scale:1, opacity:1}, 1);	
	if($(window).width() <= 991){
		tl.fromTo($('#' + slideId + ' .qContainer'), 1, {x:-1000}, {x:0, delay: 1} );	
	}else if($(window).width() <= 1199){
		tl.fromTo($('#' + slideId + ' .qContainer'), 1, {x:-400}, {x:0} );
		tl.fromTo($('#' + slideId + ' .slideImg'), 1, {x:0}, {x:150},"-=1");
	}else{
		tl.fromTo($('#' + slideId + ' .qContainer'), 1, {x:-800}, {x:0} );
		tl.fromTo($('#' + slideId + ' .slideImg'), 1, {x:0}, {x:200},"-=1");
	}
	if($('#' + slideId + ' .qContainer > .question').hasClass('no-question')){
		tl.add(enableScrolling);
	}
	continueTL = tl;
	return tl;
}

function questionnaireAnimation(index){
	var questionnaire = '#' + $('.fp-section').get(index-1).id;
	var tl = new TimelineLite()
		.fromTo($(questionnaire + ' h2'), 1, {opacity:0, x:-30}, {opacity:1, x:0} )
		.staggerFromTo($(questionnaire + ' figure img'),	1,	{opacity:0, y:30}, {opacity:1,y:0}, 0.2)
		.staggerFromTo($(questionnaire + ' figcaption'),	1,	{opacity:0, y:-30}, {opacity:1,y:0}, 0.2, "-=0.5")
		.staggerFromTo($(questionnaire + ' .qBtns'), 1, {opacity:0, y:-30, zIndex:-1}, {opacity:1, y:0, zIndex:0}, 0.2, "-=0.5" ) 
		.staggerFromTo($(questionnaire + ' .feedback'), 0.5, {opacity:0, y:-30, zIndex:-1}, {opacity:1, y:0 }, 0.1 );
	return tl;
}

function markingAnimation(index){
	var marking = '#' + $('.fp-section').get(index-1).id;
	var tl = new TimelineLite()
		.fromTo($(marking + ' h2'), 1, {opacity:0, x:-30}, {opacity:1, x:0} )
		.staggerFromTo($(marking + ' .question'), 1, {opacity:0, y:-30}, {opacity:1,y:0}, 0.2)
		.fromTo($(marking + ' .wrapper .quote'), 1, {opacity:0, y:-30}, {opacity:1,y:0});
	return tl;
}

function showQuote(){
	var sectionId = '#' + $('.section.active').attr('id');
	var quoteElm =  $(sectionId + " .wrapper .quote");
	var tl = new TimelineLite();
	if(quoteElm.hasClass('show')){
		tl.set(quoteElm, {xIndex:1});
	}else{
		tl.fromTo( quoteElm  , 1, {x:-1000, display:'none'}, {x:0, display:'block'} );
		tl.add(function(){quoteElm.addClass('show');});
	}
	return tl;
}

function accordionAnimaion(index){
	var accordion = '#' + $('.fp-section').get(index-1).id;
	var tl = new TimelineLite()
		.fromTo($(accordion + ' h4'), 1, {opacity:0, y:100}, {opacity:1, y:0} )
		.staggerFromTo($(accordion + ' .accordionContainer article'),	1,	{opacity:0, y:30}, {opacity:1,y:0}, 0.2);
	return tl;
}

/* Quiz Functions */

function startQuiz(){
	window.quiz = $('.quizContainer');
	var tl = new TimelineLite();
	var answeredQuestions = selections.length;
	
	if(window.quiz.is(':last-child')){
		tl.from($('#summaryQuiz h2'), 0.5, {y:-30, opacity:0})
		.from($('#summaryQuiz .quizContainer'), 0.5, {y:-30, opacity:0}, "-=0.5")
		.add(displayNextQuestion(answeredQuestions, false));
	}
	return tl;	
}

function displayNextQuestion(i, animate){
	var slideImg = window.quiz.closest('.fp-section#summaryQuiz').find('.slideImg');
	var slideImgFile = "url(img/slides/pressing/quiz/q" + (i+1) + ".png)";
	var tl = new TimelineLite();
	if(animate){
		tl.fromTo(slideImg, 0.5, {opacity:1,x:0},{opacity:0,x:-600});
		tl.fromTo(quiz, 0.5, {opacity:1,x:0},{opacity:0,x:-600});
	}
	tl.add(function(){
		quiz.find('.qNum').html(i+1);
		quiz.find('.desc').html(questions[i].description);	
		slideImg.css('background-image', slideImgFile);
	})
	.fromTo(quiz, 0.5, {opacity:0,display:'none',x:30}, {opacity:1,display:'block',x:0})	
	.fromTo(slideImg, 0.5, {opacity:0, x:-600},{opacity:1,x:0})
	return tl;
}

function caclculateFinalGrade(correctAnswers){
	var answerValue = 100 / questions.length;
	window.finalGrade = answerValue * correctAnswers;
}
	
function showFeedback(){
	var section = quiz.closest('.fp-section.quiz.active');
	var correctCounter = 0;
	quiz.fadeOut(function(){
		var html = '<ul class="quizFeedback">';
		$.each(questions, function(i){
			var qResult = questions[i].correct === selections[i] ? 'correct' : 'wrong';
			qResult === 'correct' ? correctCounter++ : "";
			html += '<li>';
				html += '<div class="desc"><p>' + questions[i].description + '</p></div>';
				html += '<div class="selection"><span class="' + selections[i] + '">' + selections[i] + '</span></div>';
				html += '<div class="result"><span class="' + qResult + '">' + qResult + '</span></div>';
			html += '</li>';
		});
		html += '</ul>';
		quiz.after(html);
		TweenMax.staggerFromTo($('.quizFeedback li'), 1, {y:-30, opacity:0},{y:0, opacity:1}, 0.5);
		section.find('.slideImg').fadeTo('slow', 0);
		caclculateFinalGrade(correctCounter);
		enableScrolling();
	});
}

function summaryAnimaion(){
	var grade = window.finalGrade >= 100 ? 95 : window.finalGrade
	var index = Math.floor(grade / (100 / 3));
	var pinPosition;
	var tl = new TimelineLite()
		.set($('#quizResults .descriptions > div p'), {fontWeight: 'normal'})
		.from($('#quizResults h2'), 0.5, {y:-30, opacity:0},1)
		.from($('#quizResults .description'), 0.5, {y:-30, opacity:0},2)
		.from($('#quizResults .resultScale'), 0.5, {y:-30, opacity:0},3);
		
		if($(window).width() < 768){
			pinPosition = "calc(" + grade + "% - (40 * 0." + grade + "px))";
			tl.fromTo($('#quizResults .pin'), 0.2, {bottom:-10},{bottom:pinPosition},4);
		}else{
			pinPosition = "calc(" + grade + "% - 25px)";
			tl.fromTo($('#quizResults .pin'), 0.2, {right:-25},{right:pinPosition},4);
		}
	
		
		tl.to($('#quizResults .descriptions > div:eq(' + index + ') p'), 0.5, {fontWeight: 900},5)
		.from($('#quizResults .thankyou'), 0.5, {y:-30, opacity:0},6)
	;
	return tl;
}	 

/* Main Animation */
function mainAnimation(index, nextIndex){
	var secId = '#' + $('.fp-section').get(nextIndex-1).id;
	var tl = new TimelineMax()
		.add(hideHint());
	
	if( !$(secId).hasClass('stepCompleted') ){
		tl.add(disableScrolling);
	}else{
		tl.add(enableScrolling);
	}
	tl.add(function(){
		$(secId).addClass('stepEntered');
	});
	
	tl.add(updateNavigation(nextIndex));
	
	if(nextIndex === 1){
		tl.add(introAnimation);
		
	}else if(nextIndex === 2){
		tl.add(behaviorIntro);
		
	}else if($.inArray(nextIndex, scenarios) !== -1){
		tl.add(scenarioAnimation(nextIndex));
		
	}else if($.inArray(nextIndex, questionnaires) !== -1){
		tl.add(questionnaireAnimation(nextIndex));
		
	}else if($.inArray(nextIndex, markings) !== -1){
		tl.add(markingAnimation(nextIndex));	
	
	}else if($.inArray(nextIndex, accordions) !== -1){
		tl.add(accordionAnimaion(nextIndex));	
		
	}else if(nextIndex === quizPageNumber){
		tl.add(startQuiz());
	
	}else if(nextIndex === summaryPageNumber){
		tl.add(summaryAnimaion());	
	}
	
	return tl;
}

/* Click Events -------------------------------------------------------------- */

// Yes/No Questions
$(document).on('click', '.yes-no .qBtn', function(){
	var elm = $(this);
	var section = elm.closest('.section');
	var totalQuestions = $('.section.active .question.yes-no').length;
	var rel = elm.find('button').attr('rel');
	var feedback = elm.parent().next('.feedback');
	var tl = new TimelineMax();
	
	tl.add(function(){
		elm.siblings().removeClass('selected');
		elm.addClass('selected');
		feedback.find('.option').removeClass('show');
		feedback.find('.option.' + rel).addClass('show');
	});
	tl.fromTo(feedback, 0.5, {opacity:0, display:'none'}, {opacity: 1, display: 'block'});
	tl.add(function(){		
		var answers = $('.section.active .option.show').length;
		if(section.hasClass('questionnaire') && $(window).width() < 768 && answers !== totalQuestions){
	   		tl.fromTo(section.find('.nextQuestion'), 0.5, {opacity:0,display:'none'},{opacity:1,display:'flex'});
		}
		if( answers === totalQuestions){
			tl.add(showQuote());
			tl.add(enableScrolling());
		}
	});
});

// Next Question Button
$(document).on('click', '.nextQuestion', function(e){
	e.preventDefault();
	var currentQuestion = $('.section.active .questions .question:visible');
	new TimelineLite()
		.to($(this), 0.5, {opacity:0,display:'none'})
		.to(currentQuestion, 0.5, {opacity:0,display:'none'}, "-=0.5")
		.fromTo(currentQuestion.next(), 0.5, {opacity:0,display:'none'},{opacity:1,display:'block'});
});

// Reveal
$(document).on('click', '.reveal button', function(){
	var feedback = $(this).next('.feedback');
	var tl = new TimelineMax()
		.to($(this), 0.5, {opacity:0, display:'none'})
		.fromTo(feedback, 0.5, {opacity:0, display:'none'}, {opacity: 1, display: 'block'})	
		.add(enableScrolling);
});

// Accordion
$(document).on('click', '.accordionContainer .title button', function(){
	var accEl = $(this).closest('.accordionContainer');
	var current = $(this).closest('article').addClass('visited');
	var totalArticles = accEl.find('> article').length;
	var tl = new TimelineLite()
		.call(function(){current.toggleClass('open')});
	if(current.hasClass('open')){			
		tl.to(current.find('.content'), 0.5, {height: '5px'})
		  .to(current.find('.title button'), 0.5, {rotation:0}, "-=0.5");
	}else{
		tl.set(current.find('.content'), {height: 'auto'});
		tl.from(current.find('.content'), 0.5, {height: '5px'});
		tl.to(current.find('.title button'), 0.5, {rotation:45}, "-=0.5");
	}
	if(accEl.hasClass('single')){
		var others = accEl.find('article').not(current);
		tl.call(function(){others.removeClass('open');});
		tl.to(others.find('.content'), 0.5, {height: '5px'}, "-=0.5");
		tl.to(others.find('.title button'), 0.5, {rotation:0}, "-=0.5");
	}
	var totalVisited = accEl.find('> article.visited').length;
	if(totalVisited === totalArticles){
		tl.add(enableScrolling());
	}
});


// On Load ----------------------------------------------------------------- //
$(function() {
	updateContactData();
	TweenMax.to($('html'), 1, {opacity:1});
	$( "#behaviorTypes" ).clone().appendTo( ".aSide" );

	$('#fullpage').fullpage({
		css3: true,
		paddingTop: '50px',
		fixedElements: '.aSide',
		
		afterRender: function(){
			var anchors =  window.location.hash.replace('#', '').split('/');
			if(anchors.length > 1){
				var lastAnchor = anchors[anchors.length-1];
				var index = $('.fp-section[id="' + lastAnchor + '"]').index() + 1;
				$(".fp-section:lt(" + (index-1) + ")").addClass('stepCompleted stepEntered');
				$.fn.fullpage.moveTo(index);
				
			}else{
				updateNavigation(1);
				introAnimation();
			}
		},
		
		onLeave: function(index, nextIndex, direction){
			TweenMax.killAll(true);
			mainAnimation(index, nextIndex, direction);
			console.log(nextIndex);
		}
	});
	
	// Hash Change
	$(window).on('hashchange', function() {
		var anchors =  window.location.hash.replace('#', '').split('/');
		if(anchors.length > 0){
			var lastAnchor = anchors[anchors.length-1];
			var index = $('.fp-section[id="' + lastAnchor + '"]').index() + 1;
			$.fn.fullpage.moveTo(index);
		}else{
			introAnimation();
		}		
	});
	
	// Navigation
	$(document).on('click', '#menu li', function(e){
		e.preventDefault();
		var secId = $(this).data('link');
		var secElm = $('.fp-section[data-group="' + secId + '"]');
		var index = secElm.index() + 1;		
		if(secElm.hasClass('stepEntered')){
			index > 0 ? $.fn.fullpage.moveTo(index) : '';
		}
		
	});
	
	// Behavior Side Menu
	$(document).on('click', '#behaviorTypes li', function(e){
		e.preventDefault();
		var secId = $(this).data('link');
		console.log(secId)
		var secElm = $('.fp-section[id="' + secId + '"]');
		var index = secElm.index() + 1;
		if(secElm.hasClass('stepEntered')){
			index > 0 ? $.fn.fullpage.moveTo(index) : '';
		}
	});

	// Continue
	$(document).on('click', '.continue', function(e){
		e.preventDefault();
		var slideId = $(this).closest('.fp-section').attr('id'); 
		var tl = withinScenarioAnimation(slideId);
		tl.play();
	});

	// Go Back
	$(document).on('click', '.goBack', function(){
		continueTL.timeScale(1.5).reverse();
	});
	
	// Left & Right Keys
	$(document).on('keyup', function(e){
		var $continue = $('.scenario.active .continue');
		var $goBack = $('.scenario.active .goBack');
		
		if(e.which === 37){
			if(!$continue.hasClass('triggered')){
				$continue.trigger('click').addClass('triggered');
				$goBack.removeClass('triggered');
			}
		}else if(e.which === 39){
			if(!$goBack.hasClass('triggered')){
				$goBack.trigger('click').addClass('triggered');
				$continue.removeClass('triggered');
			}
		}
	});

	// Scroll Down Button
	$(document).on('click', '.scrollDown, .no-question button', function(){
		$.fn.fullpage.moveSectionDown(); 
	});
	
	// Quiz buttons
	$(document).on('click', '.quizContainer .qBtns button', function(){
		var selected = $(this).attr('class');
		selections.push(selected);
		 
		if(selections.length < questions.length){
			 displayNextQuestion(++questionCounter);
		}else{
			showFeedback();			 
		}		
	});
});