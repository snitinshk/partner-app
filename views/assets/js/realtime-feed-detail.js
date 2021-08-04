var newCommentHtml = `<div>
                        <span>New comment available click here to see</span>
                    </div>`;
var postId = $('input[name="postId"]').val();
$(document).ready(function(){
    setInterval(() => {
        var lastCommentTimestamp = $('.comment-wrap').first().attr('data-comment-timestamp');
        checkForUpdateOverPost()
        checkForNewComments(lastCommentTimestamp)
        checkForCommentActivity(lastCommentTimestamp)
    }, 5000);
})

function checkForUpdateOverPost(){
    $.get("/forum/check-feedupdate-detail",{postId:postId}).done(function(respData) {
        
        if(respData.code == 200){
            $('.upvotePostCount').text(respData.data.upvotes)
            $('.downvotePostCount').text(respData.data.downvotes)
            $('.postCommentCount').text(respData.data.totalComments)
            $('.postFlagCount').text(respData.data.totalFlags)
        }
    });
}
/**
 * Check if a new Comment is added
 * @param {} lastCommentTimestamp 
 */
 function checkForNewComments(lastCommentTimestamp){

    $.get("/forum/new-comments",{timestamp:lastCommentTimestamp,postId:postId}).done(function(respData) {
        if (respData.code == 200) {
            if(respData.data.length){
                $('.comment-list-wrap').prepend(respData.data);
            }
        } else if(respData.code == 201) {
            console.log('Something went wrong');
        }

    });
}

function checkForCommentActivity(lastCommentTimestamp){
    $.get("/forum/check-commentupdate",{timestamp:lastCommentTimestamp,postId:postId}).done(function(respData) {
        if (respData.code == 200) {
            if(respData.data.length){
                respData.data.forEach(function(CommentDetail){
                    var commentId = CommentDetail._id;

                    if($('#upvoteCount-'+commentId).length){
                        $('#upvoteCount-'+commentId).text(CommentDetail.upvotes)
                    }
                    if($('#downvoteCount-'+commentId)){
                        $('#downvoteCount-'+commentId).text(CommentDetail.downvotes)
                    }
                    if($('#flagCount-'+commentId)){
                        $('#flagCount-'+commentId).text(CommentDetail.totalFlags)
                    }
                })
            }
        } else {
            console.log('Something went wrong');
        }

    });
}


