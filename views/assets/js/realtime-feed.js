var newPostHtml = `<div class="new-post-noti-wrap">
                        <span>New post available click here to see</span>
                    </div>`;
var selectedCategoryFilter = $('#category').val();
var searchFilter = $('input[name="search"]').val();
console.log(selectedCategoryFilter);
$(document).ready(function() {
    var lastPostTimestamp = $('.forum-detail-wrap').attr('data-post-timestamp');
    $('body').on('click', '.new-post-available', function(e) {
        window.location.reload();
    });

    setInterval(() => {
        if(selectedCategoryFilter.length == 0 && searchFilter.length ==  0){
            checkForNewFeed(lastPostTimestamp)
        }
        checkForFeedActivity(lastPostTimestamp)
    }, 5000);

    $('.clear-filter-btn').click(function() {
        window.location.replace('/forum');
    });
})

function checkForFeedActivity(lastPostTimestamp) {
    $.get("/forum/check-feedupdate", { timestamp: lastPostTimestamp }).done(function(respData) {
        if (respData.code == 200) {
            if (respData.data.length) {
                respData.data.forEach(function(postDetail) {
                    var postId = postDetail._id;

                    if ($('.upvotePostCount-' + postId).length) {
                        $('.upvotePostCount-' + postId).text(postDetail.upvotes)
                    }
                    if ($('.downvotePostCount-' + postId)) {
                        $('.downvotePostCount-' + postId).text(postDetail.downvotes)
                    }
                    if ($('postComments-' + postId)) {
                        $('.postComments-' + postId).text(postDetail.totalComments)
                    }
                    if ($('postFlagCount-' + postId)) {
                        $('.postFlagCount-' + postId).text(postDetail.totalFlags)
                    }
                })
            }
        } else {
            console.log('Something went wrong');
        }

    });
}
/**
 * Check if a new feed is added
 * @param {} lastPostTimestamp 
 */
function checkForNewFeed(lastPostTimestamp) {
    $.get("/forum/new-feed", { timestamp: lastPostTimestamp }).done(function(respData) {
        if (respData.code == 200) {
            if (respData.data.length) {
                $('.new-post-available').html(newPostHtml);
            }
        } else {
            console.log('Something went wrong');
        }

    });
}