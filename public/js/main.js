$(document).ready(function(){
    $nav = $('.nav');
    $toggleCollapse = $('.toggle-collapse');

    $toggleCollapse.click(function(){
        $nav.toggleClass('collapse');
    });

    $addAComment = $('.add-comment');
    $commentForm = $('.comment-form');
    $editAComment = $('.show-btn edit-btn');

    $addAComment.click(function(){
        $commentForm.toggleClass('form-comment');
    });

    $editAComment.click(function(){
        $commentForm.toggleClass('form-comment');
    });

    $('.move-up span').click(function(){
		$('html body').animate({
			scrollTop: 0}, 1000);
	});
});

