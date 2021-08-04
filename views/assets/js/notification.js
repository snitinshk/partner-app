$(document).ready(function() {
    getAllNotifications();
    setInterval(() => {
        getAllNotifications();
    }, 5000);
    $(document).on('click', '.preview-item', function() {
        var dataId = $(this).attr('data-id')
        $.ajax({
            url: '/notification/read',
            type: 'PUT',
            data: { id: dataId }
        });
    })
});

function getAllNotifications() {
    $.get("/notification/get-new").done(function(respData) {
        if (respData.code == 200) {
            showNotifications(respData.data);
        } else {
            console.log('Something went wrong');
        }

    });
}

function showNotifications(data) {
    var notificationHtml = ``;
    $('.notification-wraper').removeClass('no-data');
    if (data.length > 0) {
        $('.notification_count').text(data.length);
        $('.notification_count').removeClass('no-count');
        data.forEach(element => {
            var profilepic = (element.userPic) ? '/upload/influencers/' + element.userPic : '/assets/images/defaultprofilepic.png';
            notificationHtml += `<div class="dropdown-divider"></div>
            <a data-id="` + element._id + `" class="dropdown-item preview-item" href="/forum/post-detail/` + element.postId + `">
                <div class="preview-thumbnail">
                    <img src="` + profilepic + `" class="rounded-circle">
                </div>
                <div class="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 class="preview-subject font-weight-normal mb-1">` + element.title + `</h6>
                    <p class="text-gray ellipsis mb-0">` + timeAgo(element.createdAt) + `</p>
                </div>
            </a>`
        });
    } else {
        $('.notification-wraper').addClass('no-data');
        $('.notification_count').addClass('no-count');
        notificationHtml += `<div class="dropdown-divider"></div>
            <a class="dropdown-item preview-item">
                <div class="preview-item-content d-flex align-items-start flex-column justify-content-center">
                    <h6 class="preview-subject font-weight-normal mb-1">No notifications found</h6>
                </div>
            </a>`
    }
    $('.notification-wraper').html(notificationHtml);
}