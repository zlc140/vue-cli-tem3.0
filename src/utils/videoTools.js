//建立一个可存取到该file的url
function getObjectURL(file) {
  var url = null;
  if (window.createObjectURL != undefined) { // basic
    url = window.createObjectURL(file);
  } else if (window.URL != undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file);
  } else if (window.webkitURL != undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file);
  }
  return url;
}

// 获取截图
function captureVideo(file) {
  return new Promise(function (resolve, reject) {
    var video = document.createElement("video");
    var scale = 0.8;
    var captureImage = function () {
      var canvas = document.createElement("canvas");
      setTimeout(function () {
        canvas.width = video.videoWidth * scale;
        canvas.height = video.videoHeight * scale;
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/png"))
        video.src = '';
      }, 4000)
    };
    
    video.controls = "controls";
    video.addEventListener('loadeddata', captureImage);
    video.src = typeof file === 'string' ? file : getObjectURL(file);
    video.play()
  });
  
}

export default {
  captureVideo
}
