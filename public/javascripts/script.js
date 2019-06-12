$(document).ready(function(){
	$('.main').tiltedpage_scroll({angle:40})
})
$(window).scroll(function(){
	var wScroll =$(this).scrollTop();
	$('.text-brand').css({
	'transform': 'translate(0px'+wScroll /3 +'%)'});

	//phimNow
	if(wScroll > $('.PhimNow').offset().top -($(window).height() / 1.3)) {
		$('.PhimNow figure').each(function(i){
			setTimeout(function(){
				$('.PhimNow figure').eq(i).addClass("run");
			},200*(i+1);
		});
	}
}) 