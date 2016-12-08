$(function(){
	$("input[type='text']").not(".no").each(function(){
		$(this).placeholder();
	});
	$(".tabs").each(function(){
		$(this).tabs();
	});
	resize();
	$(window).resize(function(event) {
		resize();
	});

	$(".menu").click(function () {
	    $(".nav").slideToggle();
	})
	
	$(".div_select .sel li").click(function () {
	    $(this).parents(".sel").find("li").removeClass("on");
        $(this).addClass("on")
	    if ($(this).parents(".sel").hasClass("on")) {
	        $(this).parents(".sel").removeClass("on");
	        $(this).parent().find("li").show();
	    }
	    else {

	        $(this).parents(".sel").addClass("on")
	        $(this).parent().find("li").hide();
	        $(this).show(); 
	    }
	})

	document.body.addEventListener('touchstart', function () { });

	$(".sec_list2 li").click(function () {
	    if ($(this).find(".drop").length > 0) {
	        $(this).toggleClass("on");
	        $(this).find(".drop").stop().slideToggle();
	    }
	})

	$(".other_login").css("margin-top",$(window).height()-$(".mainer").height()-$(".header").height()-$(".other_login").height()-30)

	$(".sec_radio li").click(function () { $(this).parent().find("li").removeClass("on"); $(this).addClass("on");})


    //输入金额
	$(".input_money").blur(function () {
	    var money = $(this).val();
	    var reg = /^\d+(\.\d{2})?$/;
	    if (!reg.test(money)) {
	        $(this).parent().addClass("err");
	        $(this).focus();
	    }
	    else
	        $(this).parent().removeClass("err");
	})
    //购买数量
	$(".input_num").blur(function () {
	    var num = $(this).val();
	    
	    if (isNaN(num)) {
	        $(this).parent().addClass("err");
            $(this).val("")
	        $(this).focus();
	    }
	    else
	        $(this).parent().removeClass("err");
	})
    //替换
	$("#img1").change(function () {
	    var img = document.getElementById('img1'),
              blob = URL.createObjectURL(img.files[0]),
              newImg = new Image();
	   
	    if ($(this).parents(".div_input").find(".img").length > 0) {
	        $(this).parents(".div_input").find(".img").last().css({
	            "background": "url(" + blob + ") no-repeat center center",
	            "background-size": "cover"
	        });
	    }
	    else {

	        if ($(this).parents(".div_input").find(".img2").length > 0) {
	            $(this).parents(".div_input").find(".img2").last().css({
	                "background": "url(" + blob + ") no-repeat center center",
	                "background-size": "cover"
	            });
	        }
	        else {
	            $(this).parents(".div_input").find("input[type='text']").hide()
	            $(this).parents(".div_input").prepend('<div class="flex"><section class="img2" style="background:url(' + blob + ') no-repeat center center; background-size:cover;"></section></div>');
	        }
	    }
	    
	})

    //添加
	$("#img2").change(function () {
	    var img = document.getElementById('img2'),
              blob = URL.createObjectURL(img.files[0]),
              newImg = new Image();

	    var img = $(this).parents(".div_input").find(".img2").eq(0).clone();
	    $(this).parents(".div_input").find(".flex").append(img);


	    $(this).parents(".div_input").find(".img2").last().css({
	        "background": "url(" + blob + ") no-repeat center center",
	        "background-size": "cover"
	    });

	})

    //头像
	$("#img3").change(function () {
	    var img = document.getElementById('img3'),
              blob = URL.createObjectURL(img.files[0]),
              newImg = new Image();
         


	    $(this).parent(".img").last().css({
	        "background": "url(" + blob + ") no-repeat center center",
	        "background-size": "cover"
	    });

	})
 



	$(".footer2 .item .sec_add_pl input").focus(function () {
	    $(this).parents(".footer2").find(".item").eq(1).hide()
	    $(this).parents(".footer2").find(".item").eq(2).show()
	})

	$(".footer2 .item .sec_add_pl input").blur(function () {
	    $(this).parents(".footer2").find(".item").eq(1).show()
	    $(this).parents(".footer2").find(".item").eq(2).hide()
	})

});

/*main*/
//

/*call*/
//
function resize(){
	var ht=$(window).height();
	 
}
$.fn.placeholder = function () {
    var $obj = this;
    var v = $(this).val();
    $obj.focus(function (event) {
        if ($obj.val() == v) {
            $obj.val("");
        }
    });
    $obj.blur(function (event) {
        if ($obj.val() == "") {
            $obj.val(v);
        }
    });
}
$.fn.tabs = function () {
    var $obj = this;
    var $tabs = $obj.find(".ts >.t");
    var $cnts = $obj.find(".cs >.c");

    $tabs.click(function (event) {
        var i = $tabs.index(this);
        $cnts.hide();
        $cnts.eq(i).show();

        $tabs.removeClass('on');
        $(this).addClass('on');

        return false;
    });
    $tabs.first().click();
}


/* 多图上传 */
var mod_img_pub = {};
mod_img_pub.showImage = function(){
    // 获取文件路径
	var imgUpload = document.getElementById('img-upload');
	var path = URL.createObjectURL(imgUpload.files[0]);
    var node = $('<div class="pub-img-item"><div class="pub-img-del" onclick="mod_img_pub.delImage(this);"><input class="bjy-filename" type="hidden" name="image[]"></div></div>');
    node.css("background-image", "url(" + path + ")");
    // 插入图像到页面中
    $("#pub-img-wrap").append(node);
};




/*收藏和取消收藏*/
var collect = {};
collect.send_collect = function(em){

	var isCollected = $(em).hasClass('collected');
	if (isCollected) {
		$(em).removeClass('collected');
		$(em).addClass('nocollect');

	}else{
		$(em).removeClass('nocollect');
		$(em).addClass('collected');
	}
};

/**多图发布功能**/

 $(function(){
            var formdata = new FormData();
            var count = 0;
            var files = [];
            
            var wrap = $("#pub-img-wrap").eq(0);
            var upLoadBtn = $("#img-upload").eq(0);
            var img_del_src = "img/close.png";
            var publishBtn = $("#publish_btn").eq(0);
            
            upLoadBtn.on("change", function(){
                var len = upLoadBtn[0].files.length;
                if(len > 0){
                    for(var i = 0; i < len; i+=1){
                        (function(j){
                            var reader = new FileReader();
                            
                            reader.onload = function(e){
                                count += 1;
                                files.push(upLoadBtn[0].files[j]);
                                
                                var src = e.target.result;
                                
                                // 预览
                                var node = $('<div class="pub-img-item"><img onclick="saveimg.img_del(this)" class="pub-img-del" src="' + img_del_src + '"></div>');
                                node.css("background-image", "url(" + src + ")");
                                wrap.append(node);
                            };
                            
                            reader.readAsDataURL(upLoadBtn[0].files[j]);
                        })(i)
                    }
                }
            });
            
            saveimg = {};
            saveimg.img_del = function(em){ // 删除
                files.splice($(this).parent().index(), 1);
                $(em).parent().remove();
                count -= 1;
            }
           
            saveimg.publish = function(){ // 发布
                for(var i = 0; i < files.length; i++){
                    formdata.append("file[]", files[i])
                };

                formdata.append("title_text",$("#title_text").val());
                formdata.append("intro_text",$("#intro_text").val());
                formdata.append("content_text",$("#content_text").val());
                formdata.append("content_text",$("#content_text").val());
                
                var config = {
                    url: "saveimg.php",
                    type: "POST",
                    cache: false,
                    data: formdata,
                    processData: false,
                    contentType: false
                };
                
                $.ajax(config).done(function(status){
                    // 处理回调
                    console.log(status);
                    alert(status);
                });
            }
        });



	var timeOutEvent=0;  
	$(function(){  
/*	    $(".info_mess").on({  
	        touchstart: function(e){  
	    
	            timeOutEvent = setTimeout(function (){   
				    timeOutEvent = 0;   
				  	$(".info_mess_footer").removeClass("hide");
				  	$(".item_select").removeClass("hide");
	   				$(".info_head").css("margin-left",'0em');

				} ,500);  
	           // e.preventDefault();  
	        },  
	        touchmove: function(){  
	                    clearTimeout(timeOutEvent);   
	                timeOutEvent = 0;   
	        },  
	        touchend: function(){  
	            clearTimeout(timeOutEvent);  
	            if(timeOutEvent!=0){   
 				
	            }   
	          
	        }  
	    });*/

	    $(".item_select_status").click(function(e){
	    		if ($(this).hasClass("selected")) {
	    			$(this).removeClass("selected");
	    			$(this).addClass("noselect");
					$(".select_status").removeClass("selected");
					$(".select_status").addClass("noselect");
	    		}else{
					$(this).removeClass("noselect");
	    			$(this).addClass("selected");
					if($(".mess_list").find(".noselect").length <= 0){
						$(".select_status").removeClass("noselect");
						$(".select_status").addClass("selected");
					}

	    		}
	    		e.stopPropagation(); 
	    });  
/*	     mess_select = {};
	    mess_select.click_item_select = function (em){
	    		if ($(em).hasClass("selected")) {
	    			$(em).removeClass("selected");
	    			$(em).addClass("noselect");
	    		}else{
					$(em).removeClass("noselect");
	    			$(em).addClass("selected");	    			
	    		}
	    }*/
	    $(".select_all").click(function(e){
	    	if ($(".select_status").hasClass("selected")) {
	    		$(".item_select_status").removeClass("selected");
	    		$(".item_select_status").addClass("noselect");
	    		$(".select_status").removeClass("selected");
	    		$(".select_status").addClass("noselect");
	    	}else{
				$(".item_select_status").removeClass("noselect");
	    		$(".item_select_status").addClass("selected");	
	    		$(".select_status").removeClass("noselect");
	    		$(".select_status").addClass("selected");	
	    	}
	    	

	    });
	    $(".delete_mess").click(function(){
	    	$(".item_select_status").each(function(){
	    	
	    		if ($(this).hasClass("selected")) {
	    			$(this).parent().parent().parent().remove();
	    		}
	    	});
	    })

	    $(".mess_opt").click(function(){
	    	var opt_text = $(".mess_opt").text();
	    	if (opt_text == '编辑') {
	    		$(".info_mess_footer").removeClass("hide");
				$(".item_select").removeClass("hide");
	   			$(".info_head").css("margin-left",'0em');
	   			$(".mess_opt").text('取消');
	    	}else{
	    		$(".info_mess_footer").addClass("hide");
				$(".item_select").addClass("hide");
				$(".info_head").css("margin-left",'1em');
				$(".mess_opt").text('编辑');
	    	}
	    });

	    $(".info_mess").click(function(){
	    	if ($(this).find(".mess_content .title div").hasClass('hide_div')) {
		    	$(this).find(".mess_content .title div").removeClass('hide_div');
		    	$(this).find(".mess_content .title div").addClass('show_div');
		    	$(this).find(".mess_content").css("height","auto");
		    	$(this).find(".info_head").css("height","auto");
	    	}else{
	    		$(this).find(".mess_content .title div").addClass('hide_div');
		    	$(this).find(".mess_content .title div").removeClass('show_div');
		    	$(this).find(".mess_content").css("height","3em");
		    	$(this).find(".info_head").css("height","3.53em");
	    	}
	    });
 
	});  
	  
