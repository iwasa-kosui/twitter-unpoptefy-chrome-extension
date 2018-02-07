$$ = q => document.querySelectorAll(q);

const createLabelNode = (text, background) => {
  let span = document.createElement('span');
  span.style.padding = '2px 5px';
  span.style.marginRight = '10px';
  span.style.borderRadius = '5px';
  span.style.fontWeight = 'bold';
  span.style.color = 'white';
  span.style.background = background;
  span.textContent = text;
  return span;
}

const timeLineNode = document.querySelector("#stream-items-id");

const updateTimeLine = () => {
  let tweetNodes = Array.from($$('li.stream-item:not([data-labeled="true"])'));
  let tweets = tweetNodes.map((tweetNode) => {
    tweetNode.setAttribute('data-labeled', 'true');
    return {
      id: tweetNode.getAttribute('data-item-id'),
      body: tweetNode.querySelector('.tweet-text').textContent
    }
  });
  console.log(tweets);
  if (tweets.length > 0) {
    fetch('http://127.0.0.1:8000/tweets/', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(tweets),
    })
    .then((response) => {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      let tweetLabels = Array.from(response.data);
      tweetLabels.map((tweetLabel) => {
        let node = document.querySelector('li[data-item-id="' + tweetLabel.id +'"]');
        let tweetTextContainerNode = node.querySelector('.js-tweet-text-container');
        let tweetTextNode = node.querySelector('.tweet-text');

        if (tweetLabel.label == 0) {
          tweetTextNode.style.color = 'black';
          tweetTextNode.style.textShadow = '';
          tweetTextNode.textContent = '✅ ' + tweetTextNode.textContent;
        } else {
          let span = createLabelNode('ポ ', 'red');
          tweetTextNode.style.display = 'inline';
          tweetTextNode.style.color = 'transparent';
          tweetTextNode.style.textShadow = '0px 0px 10px black';
          tweetTextContainerNode.insertBefore(span, tweetTextNode);
          Array.from(node.querySelectorAll(".AdaptiveMedia")).map((mediaNode) => {
            mediaNode.style.display = 'none';
          });
        }
      })
    })
    .catch((error) => {
      console.log(error);
    });
  }
}

const observer = new MutationObserver(records => {
  updateTimeLine();
});

const options = {
  childList: true
};

observer.observe(timeLineNode, options);
setInterval(updateTimeLine, 1000);

updateTimeLine();
