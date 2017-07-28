 var yo = require('yo-yo');
var translate = require('../translate');

module.exports = function pictureCard (pic)
  {
    var el;

    function render(picture)
    {
      console.log(picture);
     return yo`<div class="card ${picture.liked ? 'liked':''}">
    <div class="card-image ">
      <img class="activator" src="${picture.src}" ondblclick=${like.bind(null,null,true)} />
      <i class="fa fa-heart like-heart ${picture.likedHeart ? 'liked' : ''}"></i>
    </div>
    <div class="card-content">
      <a href="/${picture.user.username}" class="card-title">
        <img src="${picture.user.avatar}" class="avatar" />
        <span class="username">${picture.user.name}</span>
      </a>
      <small class="right time">${translate.date.format(new Date(picture.createdAt).getTime())}</small>
      <p>
        <a class="left" href="#" onclick=${like.bind(null,true)}><i class="fa fa-heart-o  heart" aria-hidden="true"></i></a>
        <a class="left" href="#" onclick=${like.bind(null,false)}><i class="fa fa-heart   heart"   aria-hidden="true"></i></a>
        <span class="left likes">${translate.message('likes',{'likes':picture.likes || 0})}</span>
      </p>
    </div>
  </div>`;
    }


  function like(liked,dblclick)
  {
    if (dblclick)
    {
      pic.likedHeart = liked = pic.liked = !pic.liked;
    }
    else
    {
      pic.liked = liked;
    }
    pic.likes+= liked ? 1 : -1; //add or reduce likes count

    function doRender()
    {
        var newEl = render(pic);
        yo.update(el,newEl);
    }

    doRender();

    setTimeout(function(){
      pic.likedHeart = false;
      doRender();
    },1500);



    return false;
  }

  el = render (pic);
  return el;

}