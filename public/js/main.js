$(document).ready(function(){
    $nav = $('.nav');
    $toggleCollapse = $('.toggle-collapse');

    $toggleCollapse.click(function(){
        $nav.toggleClass('collapse');
    });

    $addAComment = $('.add-comment');
    $commentForm = $('.comment-form');

    $addAComment.click(function(){
        $commentForm.toggleClass('form-comment');
    })

    // $('.move-up span').click(function(){
	// 	$('html body').animate({
	// 		scrollTop: 0}, 1000);
	// });
});

