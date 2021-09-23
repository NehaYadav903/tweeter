/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

const escape =  function(str) {
  let div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
};

const createTweetElement = tweetObj => {
  //responsible for returning a tweet <article>
  //Must contain entire HTML structure of the tweet
  const newTweet =
  `
  <article>
  <header class="tweet-head">
    <div>
      <img src=${tweetObj.user.avatars}/>
      <span>${tweetObj.user.name}</span>
    </div>
    <div>
      <span>${tweetObj.user.handle}</span>
    </div>
  </header>
    <div>
      <span>${escape(tweetObj.content.text)}</span>
    </div>
  <footer class="tweet-foot">
    <div>
      <span>${moment(tweetObj.created_at).fromNow()}</span>
    </div>
    
    <div class="tweet-reactions"> 
      <span><i class="fas fa-flag"></i> <i class="fas fa-retweet"></i> <i class="fas fa-heart"></i></span>
    </div>
  </footer>
  </article>
  `;
  return newTweet;
};

const renderTweets = arrayOfTweetObj => {
  //Need to append to .tweets-container
  for (let obj of arrayOfTweetObj) {
    $('.tweet-container').prepend(createTweetElement(obj));
  }
};

const renderLastTweet = arrayOfTweetObj => {
  const lastTweet = arrayOfTweetObj[arrayOfTweetObj.length - 1];
  $('.tweet-container').prepend(createTweetElement(lastTweet));
};

const ajaxPost = (url, data, callback) => {
  $.post(url, data, callback);
};

const getText = queryString => {
  let text = '';
  for (let index in queryString) {
    //text= is 5 chars long
    if (index > 4) {
      text += queryString[index];
    }
  }
  return decodeURIComponent(text);
};

const resetErrorMessage = violation => {
  if (violation === 'over count') {
    $(".error-message").hide();
    $(".error-message").empty();
    $(".error-message").append("<p>⚠️ Too many characters in your tweet. ⚠️</p>");
    $(".error-message").slideDown("slow");
    $('textarea').focus();
  } else if (violation === 'empty') {
    $(".error-message").hide();
    $(".error-message").empty();
    $(".error-message").append("<p>You wrote nothing, do you even want to tweet?🤔</p>");
    $(".error-message").slideDown("slow");
    $('textarea').focus();
  } else {
    $(".error-message").hide();
    $(".error-message").empty();
    $('textarea').focus();
  }
};

// Re-size tweet-textbox automatically while typing
$(document).ready(function() {
  $('textarea').on('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
  });
  
  //Get the tweets
  $.get('/tweets', renderTweets);

  //New tweet form set as hidden
  $('.new-tweet').hide();

  //Toggle button 1
  $('.write').click(function(event) {
    $('.new-tweet').slideToggle('slow');
    $('textarea').focus();
  });

  //When the button is clicked, ie when the form is submitted
  $('.submit-and-display button').click(function(event) {
    event.preventDefault();
    const data = $('form').serialize();
    const dataLength = getText(data).length;

    if (dataLength > 140) {
      resetErrorMessage('over count');
    } else if (dataLength === 0) {
      resetErrorMessage('empty');
    } else {
      resetErrorMessage();
      ajaxPost('/tweets', data, function() {
        //Get the tweet that was just posted
        $.get('/tweets', renderLastTweet);
        //Empty the box after submission
        $('textarea').val("");
      });
      //Reset the character counter to 140 after submitting the tweet
      $(this)
        .closest(".new-tweet")
        .find(".counter")
        .removeClass("negative-count")
        .text(140);
    }
  });
});