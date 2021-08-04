

/**Scripting for feed detail */

$(document).ready(function(){
    
    $("#reportPostModal").on("hidden.bs.modal", function(){
        // console.log('Í am report post');
        $("textarea#reportPostReason").val('');
    });
    $("#reportCommentModal").on("hidden.bs.modal", function(){
        // console.log('Í am report comment');
        $("textarea#reportCommentReason").val('');
        $('#reportedCommentId').val('');
    });

    $(document).on('click', '.reportComment', function() {
        
        var isAlreadyReported = parseInt($(this).attr('data-isreported'));
        var commentId = $(this).attr('data-id');
        $('#reportedCommentId').val(commentId);
        /**
         * Report this post only if not reported before
         */
        if(isAlreadyReported == 0){
            $('#reportCommentModal').modal(true);
        }else{
            alert('You have already reported this comment');
        }
    })
    $('.reportPost').click(function() {
        var isAlreadyReported = parseInt($(this).attr('data-isreported'));
        /**
         * Report this post only if not reported before
         */
        if(isAlreadyReported == 0){
            $('#reportPostModal').modal(true);
        }else{
            alert('You have already reported this post');
        }
    })
    /**
     * Handle report comment modal click event
     */
    $('#reportCommentBtn').click(function(){
        var commentId = $('#reportedCommentId').val();
        var reason = $("textarea#reportCommentReason").val();
        var currentEle = $('#flagCount-'+commentId);
        var reportCount = parseInt(currentEle.text())
        currentEle.text(Math.abs(reportCount+1));
        $("span[data-id="+commentId+"]").attr('data-isreported',1);
        $('#reportCommentModal').modal('hide');
        $.ajax({
            url: '/forum/report',
            type: 'PUT',
            data: {reason:reason,commentId:commentId},
            success: function(respData) {
                if(respData.code == 201){
                    currentEle.text(reportCount-1);
                    console.log('Something went wrong');
                }
            }
        });
    });
    /**
     * Handle report post modal click event
     */
    $('#reportPostBtn').click(function(){
        var postId = $('input[name="postId"]').val();
        var reason = $("textarea#reportPostReason").val();
        var reportCount = parseInt($('.postFlagCount').text())
        $('.reportPost').attr('data-isreported',1)
        $('.postFlagCount').text(Math.abs(reportCount+1));
        $('#reportPostModal').modal('hide');
        $.ajax({
            url: '/forum/report',
            type: 'PUT',
            data: {reason:reason,postId:postId},
            success: function(respData) {
                if(respData.code == 201){
                    $('.postFlagCount').text(reportCount-1);
                    console.log('Something went wrong');
                }
            }
        });
    });
    /**
     * Handling of upvote of post
     */
    $(document).on('click', '.upvoteCommentBtn', function() {
        var id = $(this).attr('id');
        var attrId = $(this).attr('data-id');
        var upvoteElement = $('#upvoteCount-'+attrId);
        var downvoteElement = $('#downvoteCount-'+attrId);
        var upvotes = parseInt(upvoteElement.text())
        var downvotes = parseInt(downvoteElement.text())
        var action;
        if($(this).hasClass('success')){
            upvoteElement.text(upvotes-1)
            action = 'DELETED'
        }else{
            upvoteElement.text(upvotes+1)
            action = 'UPVOTED'
        }
        if($('#downvote-'+attrId).hasClass('danger')){
            downvoteElement.text(Math.abs(downvotes-1))
            $('#downvote-'+attrId).removeClass('danger')
        }
        $(this).toggleClass('success')
        addCommentActivity({action:action,commentId:attrId});
    })
    /**
     * Handling of downvote of comments
     */
     $(document).on('click', '.downvoteCommentBtn', function() {
        var id = $(this).attr('id');
        var attrId = $(this).attr('data-id');
        var upvoteElement = $('#upvoteCount-'+attrId);
        var downvoteElement = $('#downvoteCount-'+attrId);
        var upvotes = parseInt(upvoteElement.text())
        var downvotes = parseInt(downvoteElement.text())
        var action;
        if($(this).hasClass('danger')){
            downvoteElement.text(Math.abs(downvotes-1))
            action = 'DELETED'
        }else{
            downvoteElement.text(Math.abs(downvotes+1))
            action = 'DOWNVOTED'
        }
        if($('#upvote-'+attrId).hasClass('success')){
            upvoteElement.text(upvotes-1)
            $('#upvote-'+attrId).removeClass('success')
        }
        $(this).toggleClass('danger')
        addCommentActivity({action:action,commentId:attrId});
    })
    /**
     * Handling of upvote of posts
     */
    $('.upvotePostBtn').click(function(){
        var upvotes = parseInt($('.upvotePostCount').text())
        var downvotes = parseInt($('.downvotePostCount').text())
        var action;
        if($(this).hasClass('success')){
            $('.upvotePostCount').text(Math.abs(upvotes-1))
            action = 'DELETED'
        }else{
            $('.upvotePostCount').text(Math.abs(upvotes+1))
            action = 'UPVOTED'
        }
        if($('.downvotePostBtn').hasClass('danger')){
            $('.downvotePostCount').text(Math.abs(downvotes-1))
            $('.downvotePostBtn').removeClass('danger')
        }
        $(this).toggleClass('success')
        addPostActivity(action);
    })
    /**
     * Handling of downvote of comments
     */
    $('.downvotePostBtn').click(function(){
        var action;
        var downvotes = parseInt($('.downvotePostCount').text())
        var upvotes = parseInt($('.upvotePostCount').text())
        if($(this).hasClass('danger')){
            $('.downvotePostCount').text(Math.abs(downvotes-1))
            action = 'DELETED'
        }else{
            $('.downvotePostCount').text(Math.abs(downvotes+1))
            action = 'DOWNVOTED'
        }
        if($('.upvotePostBtn').hasClass('success')){
            $('.upvotePostCount').text(Math.abs(upvotes-1))
            $('.upvotePostBtn').removeClass('success')
        }
        $(this).toggleClass('danger')
        addPostActivity(action);
    })
    /**
     * Post a comment and immediately show it in UI
     */
    $('#postComment').click(function(){
        $('#postComment').attr('disabled',true);
        var comment = $('textarea[name="comment"]').val();
        var postId = $('input[name="postId"]').val();
        var commentCount = parseInt($('.postCommentCount').text())
        if(comment){
            $('.postCommentCount').text(commentCount+1)
            $('.commentErr').text('');
            $.post( "/forum/add-comment", { comment: comment, postId: postId }).done(function( respData ) {
                if(respData.code == 200){
                    $('textarea[name="comment"]').val('');
                    $('#postComment').attr('disabled',false);
                    $('.comment-list-wrap').prepend(respData.data)
                }else{
                    $('.postCommentCount').text(Math.abs(commentCount-1))
                }
            });
        }else{
            $('.commentErr').text('Enter some text to post');
            $('#postComment').attr('disabled',false);
        }
    })

    /**
     * @input: object
     * Upvote downvote a comment
     */
     function addCommentActivity(data){
        var postId = $('input[name="postId"]').val();
        $.post( "/forum/comment/add-activity", { activity: data.action,postId:postId, commentId: data.commentId }).done(function( respData ) {
            if(respData.code == 201){
                console.log('something not right response not saved');
            }
        });
    }
    /**
     * @input: action : upvoted/downvoted/deleted
     * Upvote downvote a post
     */
    function addPostActivity(action){
        var postId = $('input[name="postId"]').val();
        $.post( "/forum/add-activity", { activity: action, postId: postId }).done(function( respData ) {
            if(respData.code == 201){
                console.log('something not right response not saved');
            }
        });
    }

    /**
     * Handling of infinite scroll pagination
     */
    var currentPage = 2;
    $(window).scroll(function() {
        var postId = $('input[name="postId"]').val();
        if ($(window).scrollTop() == $(document).height() - $(window).height()) {
            $.get("/forum/post-detail/"+postId+"", {
                page: currentPage
            }).done(function(respData) {
                if (respData.code == 200) {
                    currentPage++;
                    showPaginatedComment(respData.data);
                } else {
                    console.log('Something went wrong');
                }
            });
        }
    });
})
/**
 * Method to loop over every record and then set it on dom
 */
 function showPaginatedComment(commentInfo) {
    var finalComment = ``;
    commentInfo.forEach(element => {
        finalComment += createPaginatedComment(element)
    });
    $('.comment-list-wrap').append(finalComment)
}

/**
 *  Method to create formated html for a comment 
 */
function createPaginatedComment(commentData) {
    var commentId = commentData._id;
    var profilepic = (commentData.adminPic)?'/upload/influencers/'+commentData.adminPic:'/assets/images/defaultprofilepic.png';
    var adminName = commentData.admin;
    var profileLink = (userId != commentData.adminId)?'/viewprofile/'+commentData.adminId:'javascript:void(0)'
    return `
    <div data-comment-timestamp = "`+new Date(commentData.createdAt).getTime() +`" class="comment-wrap forum-detail-wrap">
        <div class="forum-detail-top ">
            <div class="forum-list-info-wrap ">
                <div class="forum-list-info-profile-pic ">
                    <a href="`+profileLink+`">
                        <img src="`+profilepic+`" class="rounded-circle">
                    </a>
                    
                </div>
                <div class="forum-list-info-flag-wrap ">
                    <h4>
                        `+adminName+`
                    </h4>
                </div>
            </div>
            <div class="forum-list-content-wrap ">
                <div class="forum-list-desc">
                    <span>`+commentData.comment+`</span>
                </div>
            </div>
        </div>
        <div class="form-detial-bottom ">
            <div class="form-detial-action-wrap ">
                <div class="forum-detial-action-left">
                    <a href="javascript:void(0)" class="btm-action-btn">
                        <span data-id="`+commentId+`" id="upvote-`+commentId+`" class="mdi mdi-thumb-up upvoteCommentBtn"></span>
                        <span id="upvoteCount-`+commentId+`" class="upvoteCommentCount">0</span>
                    </a>
                    <a href="javascript:void(0)" class="btm-action-btn">
                        <span data-id="`+commentId+`" id="downvote-`+commentId+`" class="mdi mdi-thumb-down downvoteCommentBtn"></span>
                        <span id="downvoteCount-`+commentId+`" class="downvoteCommentCount">0</span>
                    </a>
                    <a href="javascript:void(0)" class="btm-action-btn">
                        <span data-id="`+commentId+`" data-isReported="0" class="mdi mdi-flag reportComment"></span>
                        <span id="flagCount-`+commentId+`">0</span>
                    <a>
                </div>
                <div class="forum-detial-action-right ">
                    <a href="javascript:void(0) " class="btm-action-btn no-cursor ">
                        <span class="mdi mdi-clock grey "></span>`+timeAgo(commentData.createdAt)+`
                    </a>
                </div>
            </div>
        </div>
    </div>`
}

/**Scripting for feed detail end */