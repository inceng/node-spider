// Talk is cheap,show me the code. 屁话少说，放码过来。
var http = require("http"); // 系统自带
var fs =  require("fs"); // 系统自带
var cheerio =  require("cheerio"); // $  npm install cheerio –save
var request = require("request");  // $  npm install request –save
var i=0; // 次数初始值
var url = "http://desk.zol.com.cn/bizhi/7010_87054_2.html"; // ZOL桌面壁纸下载 - 电脑壁纸


// 主程序入口
function initFetchPage(pageUrl){
	if(pageUrl==""){
		return false;
	}
	startRequest(pageUrl);
}

// 请求入口
function startRequest(pageUrl){
	http.get(pageUrl,function(res){
		var html = "";
		var titles = [];
		// 监听data事件，每次获取一块数据
		res.on("data",function(chuck){
			html += chuck;
		});

		//监听end事件，整个网页获取完毕，回调
		res.on("end",function(){
			var $ = cheerio.load(html); // 使用cheerio模块解析html内容
			savedImages($); // 获取当前文章的图片

			i++;
			// 获取下一篇文章的URL
			var nextPageUrl = "http://desk.zol.com.cn/"+$("#showImg .show1.cur").next().find("a").attr("href"); // 根据具体网址具体获取
			if(i<=50){
				initFetchPage(nextPageUrl);
			}
		});

		res.on("error",function(err){
			console.log(err);
		});
	});
}

// 获取图片
function savedImages($){
	$("#bigImg").each(function(index,item){
		var src = $(this).attr("src");
		var fileName = Math.random()*10000+".jpg";
		// 采用request获取图片
		request.head(src,function(err,res,body){
			if(err){
				console.log(err);
			}
		});
		request(src).pipe(fs.createWriteStream('./images/'+fileName)); // 通过流的方式把图片写入到images目录下
	});
}

initFetchPage(url); 