	/*使用方法：滚动内容使用.scroll-cont类*/
	
	(function($){
		$.fn.thatScrollBar = function(options){
			var Scrollbar = function(ele,opt){
				this.$element = ele;
				this.defaults={
					'Content':'.scroll-cont',//滚动内容
					'scrollbarColor':'#999',//滚动条颜色
					'scrollbarColorHover':'#666'//滚动条hover颜色
				};
				this.options = $.extend({},this.defaults,opt)
			}
			Scrollbar.prototype = {
				init:function(options){
					//滚动包裹区域
					 this.scrollWrap = this.$element;
						
					 this.scrollContent = this.scrollWrap.children(this.options.Content); 
				      //框的高度
				      this.scrollbarCssInit();
				      this.scrollbar = this.scrollWrap.children('.scroll-slider');
				       //自定义的滚动条
				     
				      if(this.scrollContent.height()>this.scrollWrap.height()){
				      	this.scroll(this.scrollContent,this.scrollWrap,this.scrollbar)
				      }
				    this.scrollDelta =0;//注册全局的滚动位置，以便滚轮事件使用
				    this.mouseWheelhandler()
				   
				},
				scrollbarCssInit:function(){
					var that = this;
					var scrollbar = $('<div class="scroll-slider"></div>');
					this.scrollWrap.append(scrollbar)
					this.scrollbar = scrollbar;
					this.scrollbar.css('background-color',this.options.scrollbarColor);
					
				    this.scrollbar.hover(function(){
				      	$(this).css('background-color',that.options.scrollbarColorHover);
				     },function(){
						$(this).css('background-color',that.options.scrollbarColor);
				      })
				    this.scrollWrap.css({
						'padding':'10px',
						'position':'relative',
						'overflow': 'hidden'
					});
					this.scrollContent.css({
						'position':'absolute',
						'top':'0px'
					})
					this.scrollbar.css({
						'width':'10px',
						'position':'absolute',
						'right':'0px',
						'top':'2px',
						'border-radius':'20px'
					})	
				},
				scroll:function(content,wrap,scrollbar){
					var contHeight,warpHeight,rate,h,offsetT;
					var that =this;
					this.contHeight= contHeight= content.height();
			        this.warpHeight =warpHeight =  wrap.height();
			        this.rate = rate = warpHeight/contHeight;
			        this.h = h =  Math.floor(rate*warpHeight);
			        scrollbar.height(h); 
			        this.offsetT = offsetT =  wrap.offset().top; 
			        scrollbar.mousedown(function(e){
			        e.preventDefault()
			        var temPageY,divOffsetT;
			      	divOffsetT= scrollbar.offset().top;
			        tempPageY = that.tempPageY = e.pageY-divOffsetT;
					that.scrollOn()
					
			        });
				},
				scrollOn:function(){
					var that =this,scrollH;
					 
					function scrollPage(e){
						var scrollH= e.pageY-that.tempPageY-that.offsetT;
						
				            if(scrollH<0){
				              scrollH=0;
				            }else if(scrollH>(that.warpHeight-that.h)){
				              scrollH=that.warpHeight-that.h;
				            }
				        that.scrollDelta = scrollH//重置滚动事件的滚动位置
				            var rate2 = (scrollH+that.h)/that.warpHeight;
				            var contentH = Math.floor(that.contHeight*rate2-that.warpHeight);
				       	
				           that.scrollContent.css("top",-contentH+"px");
				           that.scrollbar.css("top",scrollH+"px");
					}
					 $("body").on("mousemove",scrollPage);
			          $("body").mouseup(function(){
			            $("body").off("mousemove",scrollPage);
			          });
				},
				mouseWheelhandler:function(){
					var that = this,value,delta;
					this.scrollContent.on('mousewheel DOMMouseScroll',function(e){
				    e.preventDefault();
				    value = e.originalEvent.wheelDelta || -e.originalEvent.detail;
					delta = -Math.max(-1,Math.min(1,value))*10;
					that.scrollDelta +=delta;
					if(that.scrollDelta<0){
						that.scrollDelta=0
					}else if(that.scrollDelta>(that.warpHeight-that.h)){
						that.scrollDelta=that.warpHeight-that.h;
					}
						var rate3 = (that.scrollDelta+that.h)/that.warpHeight;
				   		var contentH = Math.floor(that.contHeight*rate3-that.warpHeight);
						that.scrollContent.css("top",-contentH+"px");
						that.scrollbar.css("top",that.scrollDelta+"px");

				   })
				}
				
			}
			var scrollbar = new Scrollbar(this,options);
			return scrollbar.init()
		}
	})(jQuery)