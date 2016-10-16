Smooch.init({
  appToken: '1gyh6e5n3yrcmnvbboonse5sv',
  embedded: true,
  customText : {
    headerText : 'Talk to me!',
    introductionText : 'Talk to my surrogate! He likes to talk about how great I am.',
    intoAppText : 'Click an icon to chat using another platform.'
  }

});

Smooch.render(document.getElementById('chat-window'));
