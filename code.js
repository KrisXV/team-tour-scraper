$(document).ready(function () {
    /* $('#submit').on('click', function () {
        $('#battlelist').html('<p><em>Loading...</em></p>');
        getReplays($("#thread").val(), 1);
    }); */
});

/**
 * {
 * forumName: "name",
 * tiers: [],
 * }
 */
var signups = [];

function validateURL() {
    var url = $('#threadInput').val();
    var regex = /[0-9]+/;
    if (!regex.test(url)) {
        $('#output').html('<p class="error">Error: "' + url + '" does not match the format of "123456".</p>');
        return;
    }
    scrapeHTML(url);
}

function scrapeHTML(url, page) {
    if (!page) page = 1;
    $.ajax({
        url: '//www.smogon.com/forums/threads/' + url + '/page-' + page,
        async: true,
        dataType: 'html',
    }).done(function (data) {
        var finalPage = 0;
        if ($('.pageNav-main li', data).last()) {
            finalPage = parseInt($('.pageNav-main li', data).last().text());
        }
        var posts = $(data).find('article.message--post');
        for (var i = 0; i < posts.length; i++) {
            var post = posts[i];
            var forumName = $(post).attr('data-author');
            var index = signups.findIndex(function (signup) {
                return signup.forumName === forumName;
            });
            if (index < 0) {
                signups.push({forumName: forumName});
            }
        }
        var buf = ['forum_name'];
        if (page < finalPage) {
            scrapeHTML(url, page + 1);
        } else {
            for (var i = 0; i < signups.length; i++) {
                var signup = signups[i];
                buf.push(signup.forumName);
            }
        }
        $('#output').html(buf.join('<br />'));
    });
    // $('#output').html(url);
}
