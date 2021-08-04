
/**
 * Scripting for list feed page
 */
$(document).ready(function() {
    /**
     * Handlign of filter for category and subcategory to make them selected
     */
    $('#category').change(function() {
        var categoryId = $(this).val();
        if(categoryId){
            $.get("/get-subcategory/" + categoryId).done(function(respData) {
                $("#subCategory").empty().append($('<option></option>').attr("value", "").text("Subcategory"));
                respData[0].subCategory.forEach(subcategory => {
                    var option = $('<option></option>').attr("value", subcategory._id).text(subcategory.subCategoryName);
                    $("#subCategory").append(option);
                });
                $('#subCategory').val(selectedSubCat)
            });
        }
    })
    $('#category').trigger('change');
})
/**
 * Handling of infinite scroll pagination
 */
var currentPage = 2;
var limit = 5;
var feedEnd = `<div class="feed-end">
                    <span>No more feeds found</span>
               </div>`
$(window).scroll(function() {
    var selectedCategoryFilter = $('#category').val();
    var selectedSubCategoryFilter = $('#subCategory').val();
    var searchFilter = $('input[name="search"]').val();
    if ($(window).scrollTop() == $(document).height() - $(window).height()) {
        if(totalPost >= (currentPage-1)*limit){
            $.get("/forum", {
                page: currentPage,
                search:searchFilter,
                caegoryType:selectedCategoryFilter,
                subCategoryType:selectedSubCategoryFilter
            }).done(function(respData) {
                if (respData.code == 200) {
                    currentPage++;
                    showPaginatedPost(respData.data);
                } else {
                    console.log('Something went wrong');
                }
    
            });
        }else{
            $('.feed-end-wrapper').html(feedEnd);
            $('.feed-end').fadeIn(1000);
            // console.log('No more post found');
        }
    }
});
/**
 * Method to loop over every record and then set it on dom
 */
function showPaginatedPost(postInfo) {
    var finalPost = ``;
    postInfo.forEach(element => {
        finalPost += createPaginatedPost(element)
    });
    $('.forum-post').append(finalPost);
}
/**
 *  Method to create formated html for a post 
 */
function createPaginatedPost(post) {
    var postId = post._id;
    console.log(userId);
    var profilepic = (post.adminPic) ? '/upload/influencers/' + post.adminPic : '/assets/images/defaultprofilepic.png';
    var profileLink = (userId != post.adminId)?'/viewprofile/'+post.adminId:'javascript:void(0)'
    return `<div class="forum-detail-wrap">
                <div class="forum-detail-top">
                    <div class="forum-list-info-wrap">
                        <div class="forum-list-info-profile-pic">
                        <a href="`+profileLink+`">
                            <img src="`+profilepic+`" class="rounded-circle">
                        </a>
                        </div>
                        <div class="forum-list-info-flag-wrap">
                            <h4>
                                `+post.admin+`
                            </h4>
                        </div>
                    </div>
                    <div class="forum-list-content-wrap">
                        <div class="forum-list-title">
                            <h4>
                                <a href="/forum/post-detail/`+postId+`">
                                    `+post.title+`
                                </a>
                            </h4>
                        </div>
                        <div class="forum-list-desc">
                            <span>`+post.description+`</span>
                        </div>
                    </div>
                </div>
                <div class="form-detial-bottom">
                    <div class="form-detial-action-wrap">
                        <div class="forum-detial-action-left">
                            <a href="javascript:void(0)" class="btm-action-btn no-cursor">
                                <span class="mdi mdi-thumb-up success"></span>
                                <span class="upvotePostCount">`+post.upvotes+`</span>
                            </a>
                            <a href="javascript:void(0)" class="btm-action-btn no-cursor">
                                <span class="mdi mdi-thumb-down danger"></span>
                                <span class="downvotePostCount">`+post.downvotes+`</span>
                            </a>
                            <a href="javascript:void(0)" class="btm-action-btn no-cursor">
                                <span class="mdi mdi-comment"></span>
                                <span class="postComments">`+post.totalComments+`</span>
                            </a>
                            <a href="javascript:void(0)" class="btm-action-btn flag-btn no-cursor">
                                <span class="mdi mdi-flag"></span>
                                <span class="postFlagCount">`+ post.totalFlags +`</span>
                            </a>
                        </div>
                        <div class="forum-detial-action-right">
                            <a href="javascript:void(0)" class="btm-action-btn no-cursor">
                                <span class="mdi mdi-clock grey"></span>
                                `+timeAgo(post.createdAt)+`
                            </a>
                        </div>
                    </div>
                </div>
            </div>`
}

/**
 * Script for list feed page end
 */
