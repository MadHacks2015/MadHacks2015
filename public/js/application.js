var showing = 0;
var shades;
var resume;
var orderArr = [
	[0,1,2,3,4,5,6,7,8],
	[1,0,1,2,3,4,5,6,7],
	[2,1,0,1,2,3,4,5,6],
	[3,2,1,0,1,2,3,4,5],
	[4,3,2,1,0,1,2,3,4],
	[5,4,3,2,1,0,1,2,3],
	[6,5,4,3,2,1,0,1,2],
	[7,6,5,4,3,2,1,0,1],
	[8,7,6,5,4,3,2,1,0]
];
var align = function(){
	$.each(paras, function(index, obj){
		var top = $(shades[showing+1]).scrollTop();
		top *= (index+1)*0.5;
		$(obj).css({"top":-top});
	});
}
var order = function(){
	$.each(shades, function(index, obj){
		index -= 1;				
		var left, zindex, opacity;

		if($(obj).attr("id") == "footerInner"){
			zindex = -2000;
			opacity = 1;
			if( $(window).width() < 1000 ){
				left = "0px";
			}else{
				left = $(window).width()/2 - $(obj).width()/2 + "px"
			}
		}else{
			zindex = orderArr[showing][index];
			opacity = zindex/5;
			opacity = 1 - opacity;
			if( $(window).width() < 1000 ){
				left = "0px";
			}else{
				left = $(window).width()/2 - $(obj).width()/2;
				left += 40*(index-showing);
				left += "px";
			}
		}
		
		$(obj).css({"left":left, "z-index":1000-zindex, "opacity":opacity });
	});
	align();
}
$(document).ready(function(){
	shades = $(".inner");
	paras = $(".parallax");
	order();
	$(window).resize(order);
	$.each(shades, function(index, obj){
		$(obj).on("scroll", function(){
			if(index-1 == showing){
				align();
			}
		});
	});
	$(".inner").show(0);
	var moveRight = function(){
		showing = (showing+1) % shades.length;
		order();
	};
					
	$(".left").click(function(){
		showing = (showing-1) % shades.length;
		order();
	});
	$("#school-attend-school").change(function (){
		$("#school-selector").slideToggle();
		$("#school-school").removeClass("error");
	});
	$("input[name='travel']:radio").change(function () {
		$("#venmo").slideToggle();
		$("#school-venmo").removeClass("error");
	});
	$("#hacker-plan-hardware").change(function (){
		$("#plan-hardware-on").slideToggle();
		$("#hacker-plan-hardware-on").removeClass("error");
	});
	$("#hacker-need-partner, #hacker-plan-mentor").change(function (){
		if( $("#hacker-need-partner").prop('checked')
		 || $("#hacker-plan-mentor").prop('checked') )
			$("#partner").slideDown();
		else{
			$("#partner").slideUp();
			$("#hacker-need-partner-skills").removeClass("error");
		}
	});
	$("#resume-button").click(function (){
		$("#resume-button-shadow").click();
	});
	$("#resume-button-shadow").change(function(e){
		$("#resume-button").find("div").text(e.target.files[0].name);
		resume = e.target.files[0];
		$("#resume-button").addClass("done");
	});
	var validateLength = function ($input){
		if($input.val().length <= 0)
			$input.addClass("error");
	}
	var validateSelect = function ($input){
		if($input.val() == null)
			$input.addClass("error");
	}
	$("#validate-general").click(function(){
		$this = $(this).closest("ul");
		validateLength($this.find("#general-first-name"));
		validateLength($this.find("#general-last-name"));
		validateLength($this.find("#general-email"));
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    	if(!re.test($this.find("#general-email").val()))
			$this.find("#general-email").addClass("error");
		validateLength($this.find("#general-password"));
		validateSelect($this.find("#general-swag-size"));
		
		if($this.find(".error").length <= 0)
			moveRight();
	});
	$("#validate-school").click(function(){
		$this = $(this).closest("ul");
		if($this.find("#school-attend-school").prop("checked")){
			validateSelect($this.find("#school-school"));
		}
		validateLength($this.find("#school-city"));
		validateLength($this.find("#school-zip"));
		validateSelect($this.find("#school-state"));
		validateSelect($this.find("#school-country"));
		if($this.find("#school-travel-yes").prop("checked")){
			validateLength($this.find("#school-venmo"));
		}
		
		if($this.find(".error").length <= 0)
			moveRight();
	});
	$("#validate-diet, #anon-surv").click(function(){
		moveRight();
	});
	$("#validate-resume").click(function(){
		if($("#resume-button-shadow").attr("data-done") == undefined){
			$this = $(this).closest("ul");
			var resume = $this.find("#resume-button-shadow");
			if(resume.val().length <= 0){
				resume.addClass("error");
				$("#resume-button").addClass("error");
			}
			if($this.find(".error").length <= 0)
				moveRight();
		}else
			moveRight()
	});
	
	$("form").on("change", ".error", function (){
		$(this).removeClass("error");
		if($(this).attr("type") == "file")
			$("#resume-button").removeClass("error");
	});
	$("textarea").change(function (){
		var id = $(this).attr("id");
		var text = $(this).val();
		$("#"+id+"-shadow").val(text);
	});
	$("#footerTable td").click(function(){
		document.location = $($(this).children()[0]).attr("href");
	});
	$("#application").submit(function (e){
		e.preventDefault();
		
		var data = new FormData();
		$.each($("#application input, #application select"), function(index, obj){
			console.log($(obj).attr("type"), $(obj).attr("name"), $(obj).val())
			
			if( !($(obj).is("select")) && $(obj).attr("type") == "checkbox"){
				data.append($(obj).attr("name"), $(obj).prop("checked"))
			}else{
				data.append($(obj).attr("name"), $(obj).val());
			}
		});
		data.append("travel", $('input[name=travel]:checked').val());
		
		if(resume == undefined)
			data.append("resume", $("#resume-button-shadow").attr("data-done"));
		else
			data.append("resume", resume);

		var purl = $(this).attr("Action");
		$.ajax({
			url:purl,
			type:"POST",
			data:data,
			dataType:"json",
			processData: false,
			contentType: false,
			beforeSend:function (){
				$("button").attr("disabled", "disabled");
			},
			success:function (result){
				if(result.success == true){
					moveRight();
				}
			},
			error: function(error){
				$("button").removeAttr("disabled", "disabled");
			},
			complete: function(a){
				$("button").removeAttr("disabled", "disabled");
			}
		})
	});
	$("#anon").submit(function (e){
		e.preventDefault();
		$.ajax({
			url:"/users/anon",
			type:"POST",
			data:$(this).serialize(),
			dataType:"json",
			beforeSend:function (){
				$("button").attr("disabled", "disabled");
			},
			success:function (result){
				if(result.success == true){
					moveRight();
				}
			},
			error: function(error){
				if(error.responseJSON.error == "exists"){

				}
			},
			complete: function(a){
				$("button").removeAttr("disabled", "disabled");
			}
		})
	});

});