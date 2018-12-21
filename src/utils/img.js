// 获取图片尺寸
function getMeasure(file) {
  // 图片尺寸读取
  let reader = new FileReader();
  const promise=new Promise(function(resolve, reject) {
    reader.onload = function (e) {
    
      let data = e.target.result;
      //加载图片获取图片真实宽度和高度
      let image = new Image();
    
      image.onload = function () {
        resolve({
          state:true,
          width: image.width,
          height:image.height
        });
      };
    
      image.onerror =function () {
        reject({
          state:false,
          msg:'图片加载错误'
        })
      };
      image.src = data;
    };
  
    reader.onerror =function () {
      reject({
        state:false,
        msg:'资源读取错误'
      })
    }
  });
  reader.readAsDataURL(file);
  return promise
}

export default {
  getMeasure
}
