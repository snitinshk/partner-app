var apiObj = null;

function StartMeeting(videoMeetingLink, username)
{
    var spinne = document.getElementsByClassName("loading");
    var spinner = spinne[0];
    spinner.style.visibility = "visible";
    console.log(videoMeetingLink)
    const domain = 'meet.codepartner.me';
    const options = {
        roomName: videoMeetingLink,
        width: '100%',
        height: '600px',
        parentNode: document.querySelector('#jitsi-meet-conf-container'),
        userInfo: {
            displayName: username
        },
        configOverwrite:{
            subject: 'Code Partner Session',
        },
        interfaceConfigOverwrite: {
            DEFAULT_BACKGROUND: "#8a8cff",
            SHOW_JITSI_WATERMARK: false,
            noSsl: true,
            SHOW_BRAND_WATERMARK: false,
            SHOW_WATERMARK_FOR_GUESTS: false,
            SHOW_POWERED_BY: false,
            SHOW_PROMOTIONAL_CLOSE_PAGE: false,
            TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'videoquality' ,'recording', 'desktop', 'fullscreen', 'fodeviceselection', 'hangup', 'profile', 'info', 'chat', 'settings', 'raisehand', 'videoquality', 'filmstrip', 'feedback', 'tileview', 'download', 'help', 'mute-everyone'
            ],
        },

        onload: function () {
            spinner.style.visibility = "hidden";
            $('#joinMsg').hide();
            $('#btnStart').prop('disabled', true);
        }
    };

    apiObj = new JitsiMeetExternalAPI(domain, options);

    apiObj.addEventListeners({
        readyToClose: function () {
            alert('Meeting has ended');
            $("#jitsi-meet-conf-container").empty();
            $('#containerr').hide();
        }
    });

}