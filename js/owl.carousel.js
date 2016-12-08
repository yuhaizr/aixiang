; (function ($, window, document, undefined) {
    var defaults = { items: 3, loop: false, center: false, mouseDrag: true, touchDrag: true, pullDrag: true, freeDrag: false, margin: 0, stagePadding: 0, merge: false, mergeFit: true, autoWidth: false, autoHeight: false, startPosition: 0, URLhashListener: false, nav: false, navRewind: true, navText: ['prev', 'next'], slideBy: 1, dots: true, dotsEach: false, dotData: false, lazyLoad: false, lazyContent: false, autoplay: false, autoplayTimeout: 5000, autoplayHoverPause: false, smartSpeed: 250, fluidSpeed: false, autoplaySpeed: false, navSpeed: false, dotsSpeed: false, dragEndSpeed: false, responsive: {}, responsiveRefreshRate: 200, responsiveBaseElement: window, responsiveClass: false, video: false, videoHeight: false, videoWidth: false, animateOut: false, animateIn: false, fallbackEasing: 'swing', callbacks: false, info: false, nestedItemSelector: false, itemElement: 'div', stageElement: 'div', themeClass: 'owl-theme', baseClass: 'owl-carousel', itemClass: 'owl-item', centerClass: 'center', activeClass: 'active', navContainerClass: 'owl-nav', navClass: ['owl-prev', 'owl-next'], controlsClass: 'owl-controls', dotClass: 'owl-dot', dotsClass: 'owl-dots', autoHeightClass: 'owl-height' }; var dom = { el: null, $el: null, stage: null, $stage: null, oStage: null, $oStage: null, $items: null, $oItems: null, $cItems: null, $cc: null, $navPrev: null, $navNext: null, $page: null, $nav: null, $content: null }; var width = { el: 0, stage: 0, item: 0, prevWindow: 0, cloneLast: 0 }; var num = { items: 0, oItems: 0, cItems: 0, active: 0, merged: [], nav: [], allPages: 0 }; var pos = { start: 0, max: 0, maxValue: 0, prev: 0, current: 0, currentAbs: 0, currentPage: 0, stage: 0, items: [], lsCurrent: 0 }; var drag = { start: 0, startX: 0, startY: 0, current: 0, currentX: 0, currentY: 0, offsetX: 0, offsetY: 0, distance: null, startTime: 0, endTime: 0, updatedX: 0, targetEl: null }; var speed = { onDragEnd: 300, nav: 300, css2speed: 0 }; var state = { isTouch: false, isScrolling: false, isSwiping: false, direction: false, inMotion: false, autoplay: false, lazyContent: false }; var e = { _onDragStart: null, _onDragMove: null, _onDragEnd: null, _transitionEnd: null, _resizer: null, _responsiveCall: null, _goToLoop: null, _checkVisibile: null, _autoplay: null, _pause: null, _play: null, _stop: null }; function Owl(element, options) { element.owlCarousel = { 'name': 'Owl Carousel', 'author': 'Bartosz Wojciechowski', 'version': '2.0.0-beta.1.8', 'released': '03.05.2014' }; this.options = $.extend({}, defaults, options); this._options = $.extend({}, defaults, options); this.dom = $.extend({}, dom); this.width = $.extend({}, width); this.num = $.extend({}, num); this.pos = $.extend({}, pos); this.drag = $.extend({}, drag); this.speed = $.extend({}, speed); this.state = $.extend({}, state); this.e = $.extend({}, e); this.dom.el = element; this.dom.$el = $(element); this.init(); }
    Owl.prototype.init = function () {
        this.fireCallback('onInitBefore'); if (!this.dom.$el.hasClass(this.options.baseClass)) { this.dom.$el.addClass(this.options.baseClass); }
        if (!this.dom.$el.hasClass(this.options.themeClass)) { this.dom.$el.addClass(this.options.themeClass); }
        if (this.options.rtl) { this.dom.$el.addClass('owl-rtl'); }
        this.browserSupport(); this.sortOptions(); this.setResponsiveOptions(); if (this.options.autoWidth && this.state.imagesLoaded !== true) { var imgs = this.dom.$el.find('img'); if (imgs.length) { this.preloadAutoWidthImages(imgs); return false; } }
        this.width.prevWindow = this.windowWidth(); this.createStage(); this.fetchContent(); this.eventsCall(); this.addCustomEvents(); this.internalEvents(); this.dom.$el.addClass('owl-loading'); this.refresh(true); this.dom.$el.removeClass('owl-loading').addClass('owl-loaded'); this.fireCallback('onInitAfter');
    }; Owl.prototype.sortOptions = function () {
        var resOpt = this.options.responsive; this.responsiveSorted = {}; var keys = [], i, j, k; for (i in resOpt) { keys.push(i); }
        keys = keys.sort(function (a, b) { return a - b; }); for (j = 0; j < keys.length; j++) { k = keys[j]; this.responsiveSorted[k] = resOpt[k]; }
    }; Owl.prototype.setResponsiveOptions = function () {
        if (this.options.responsive === false) { return false; }
        var width = this.windowWidth(); var resOpt = this.options.responsive; var i, j, k, minWidth; for (k in this._options) { if (k !== 'responsive') { this.options[k] = this._options[k]; } }
        for (i in this.responsiveSorted) { if (i <= width) { minWidth = i; for (j in this.responsiveSorted[minWidth]) { this.options[j] = this.responsiveSorted[minWidth][j]; } } }
        this.num.breakpoint = minWidth; if (this.options.responsiveClass) { this.dom.$el.attr('class', function (i, c) { return c.replace(/\b owl-responsive-\S+/g, ''); }).addClass('owl-responsive-' + minWidth); }
    }; Owl.prototype.optionsLogic = function () {
        this.dom.$el.toggleClass('owl-center', this.options.center); if (this.options.slideBy && this.options.slideBy === 'page') { this.options.slideBy = this.options.items; } else if (this.options.slideBy > this.options.items) { this.options.slideBy = this.options.items; }
        if (this.options.loop && this.num.oItems < this.options.items) { this.options.loop = false; }
        if (this.num.oItems <= this.options.items) { this.options.navRewind = false; }
        if (this.options.autoWidth) { this.options.stagePadding = false; this.options.dotsEach = 1; this.options.merge = false; }
        if (this.state.lazyContent) { this.options.loop = false; this.options.merge = false; this.options.dots = false; this.options.freeDrag = false; this.options.lazyContent = true; }
        if ((this.options.animateIn || this.options.animateOut) && this.options.items === 1 && this.support3d) { this.state.animate = true; } else { this.state.animate = false; }
    }; Owl.prototype.createStage = function () { var oStage = document.createElement('div'); var stage = document.createElement(this.options.stageElement); oStage.className = 'owl-stage-outer'; stage.className = 'owl-stage'; oStage.appendChild(stage); this.dom.el.appendChild(oStage); this.dom.oStage = oStage; this.dom.$oStage = $(oStage); this.dom.stage = stage; this.dom.$stage = $(stage); oStage = null; stage = null; }; Owl.prototype.createItem = function () { var item = document.createElement(this.options.itemElement); item.className = this.options.itemClass; return item; }; Owl.prototype.fetchContent = function (extContent) {
        if (extContent) { this.dom.$content = (extContent instanceof jQuery) ? extContent : $(extContent); }
        else if (this.options.nestedItemSelector) { this.dom.$content = this.dom.$el.find('.' + this.options.nestedItemSelector).not('.owl-stage-outer'); }
        else { this.dom.$content = this.dom.$el.children().not('.owl-stage-outer'); }
        this.num.oItems = this.dom.$content.length; if (this.num.oItems !== 0) { this.initStructure(); }
    }; Owl.prototype.initStructure = function () {
        if (this.options.lazyContent && this.num.oItems >= this.options.items * 3) { this.state.lazyContent = true; } else { this.state.lazyContent = false; }
        if (this.state.lazyContent) { this.pos.currentAbs = this.options.items; this.dom.$content.remove(); } else { this.createNormalStructure(); }
    }; Owl.prototype.createNormalStructure = function () {
        for (var i = 0; i < this.num.oItems; i++) { var item = this.fillItem(this.dom.$content, i); this.dom.$stage.append(item); }
        this.dom.$content = null;
    }; Owl.prototype.createCustomStructure = function (howManyItems) { for (var i = 0; i < howManyItems; i++) { var emptyItem = this.createItem(); var item = $(emptyItem); this.setData(item, false); this.dom.$stage.append(item); } }; Owl.prototype.createLazyContentStructure = function (refresh) {
        if (!this.state.lazyContent) { return false; }
        if (refresh && this.dom.$stage.children().length === this.options.items * 3) { return false; }
        this.dom.$stage.empty(); this.createCustomStructure(3 * this.options.items);
    }; Owl.prototype.fillItem = function (content, i) { var emptyItem = this.createItem(); var c = content[i] || content; var traversed = this.traversContent(c); this.setData(emptyItem, false, traversed); return $(emptyItem).append(c); }; Owl.prototype.traversContent = function (c) {
        var $c = $(c), dotValue, hashValue; if (this.options.dotData) { dotValue = $c.find('[data-dot]').andSelf().data('dot'); }
        if (this.options.URLhashListener) { hashValue = $c.find('[data-hash]').andSelf().data('hash'); }
        return { dot: dotValue || false, hash: hashValue || false };
    }; Owl.prototype.setData = function (item, cloneObj, traversed) {
        var dot, hash; if (traversed) { dot = traversed.dot; hash = traversed.hash; }
        var itemData = { index: false, indexAbs: false, posLeft: false, clone: false, active: false, loaded: false, lazyLoad: false, current: false, width: false, center: false, page: false, hasVideo: false, playVideo: false, dot: dot, hash: hash }; if (cloneObj) { itemData = $.extend({}, itemData, cloneObj.data('owl-item')); }
        $(item).data('owl-item', itemData);
    }; Owl.prototype.updateLocalContent = function () { this.dom.$oItems = this.dom.$stage.find('.' + this.options.itemClass).filter(function () { return $(this).data('owl-item').clone === false; }); this.num.oItems = this.dom.$oItems.length; for (var k = 0; k < this.num.oItems; k++) { var item = this.dom.$oItems.eq(k); item.data('owl-item').index = k; } }; Owl.prototype.checkVideoLinks = function () {
        if (!this.options.video) { return false; }
        var videoEl, item; for (var i = 0; i < this.num.items; i++) {
            item = this.dom.$items.eq(i); if (item.data('owl-item').hasVideo) { continue; }
            videoEl = item.find('.owl-video'); if (videoEl.length) { this.state.hasVideos = true; this.dom.$items.eq(i).data('owl-item').hasVideo = true; videoEl.css('display', 'none'); this.getVideoInfo(videoEl, item); }
        }
    }; Owl.prototype.getVideoInfo = function (videoEl, item) {
        var info, type, id, vimeoId = videoEl.data('vimeo-id'), youTubeId = videoEl.data('youtube-id'), width = videoEl.data('width') || this.options.videoWidth, height = videoEl.data('height') || this.options.videoHeight, url = videoEl.attr('href'); if (vimeoId) { type = 'vimeo'; id = vimeoId; } else if (youTubeId) { type = 'youtube'; id = youTubeId; } else if (url) {
            id = url.match(/(http:|https:|)\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/); if (id[3].indexOf('youtu') > -1) { type = 'youtube'; } else if (id[3].indexOf('vimeo') > -1) { type = 'vimeo'; }
            id = id[6];
        } else { throw new Error('Missing video link.'); }
        item.data('owl-item').videoType = type; item.data('owl-item').videoId = id; item.data('owl-item').videoWidth = width; item.data('owl-item').videoHeight = height; info = { type: type, id: id }; var dimensions = width && height ? 'style="width:' + width + 'px;height:' + height + 'px;"' : ''; videoEl.wrap('<div class="owl-video-wrapper"' + dimensions + '></div>'); this.createVideoTn(videoEl, info);
    }; Owl.prototype.createVideoTn = function (videoEl, info) {
        var tnLink, icon, height; var customTn = videoEl.find('img'); var srcType = 'src'; var lazyClass = ''; var that = this; if (this.options.lazyLoad) { srcType = 'data-src'; lazyClass = 'owl-lazy'; }
        if (customTn.length) { addThumbnail(customTn.attr(srcType)); customTn.remove(); return false; }
        function addThumbnail(tnPath) {
            icon = '<div class="owl-video-play-icon"></div>'; if (that.options.lazyLoad) { tnLink = '<div class="owl-video-tn ' + lazyClass + '" ' + srcType + '="' + tnPath + '"></div>'; } else { tnLink = '<div class="owl-video-tn" style="opacity:1;background-image:url(' + tnPath + ')"></div>'; }
            videoEl.after(tnLink); videoEl.after(icon);
        }
        if (info.type === 'youtube') { var path = "http://img.youtube.com/vi/" + info.id + "/hqdefault.jpg"; addThumbnail(path); } else
            if (info.type === 'vimeo') { $.ajax({ type: 'GET', url: 'http://vimeo.com/api/v2/video/' + info.id + '.json', jsonp: 'callback', dataType: 'jsonp', success: function (data) { var path = data[0].thumbnail_large; addThumbnail(path); if (that.options.loop) { that.updateItemState(); } } }); }
    }; Owl.prototype.stopVideo = function () { this.fireCallback('onVideoStop'); var item = this.dom.$items.eq(this.state.videoPlayIndex); item.find('.owl-video-frame').remove(); item.removeClass('owl-video-playing'); this.state.videoPlay = false; }; Owl.prototype.playVideo = function (ev) {
        this.fireCallback('onVideoPlay'); if (this.state.videoPlay) { this.stopVideo(); }
        var videoLink, videoWrap, target = $(ev.target || ev.srcElement), item = target.closest('.' + this.options.itemClass); var videoType = item.data('owl-item').videoType, id = item.data('owl-item').videoId, width = item.data('owl-item').videoWidth || Math.floor(item.data('owl-item').width - this.options.margin), height = item.data('owl-item').videoHeight || this.dom.$stage.height(); if (videoType === 'youtube') { videoLink = "<iframe width=\"" + width + "\" height=\"" + height + "\" src=\"http://www.youtube.com/embed/" + id + "?autoplay=1&v=" + id + "\" frameborder=\"0\" allowfullscreen></iframe>"; } else if (videoType === 'vimeo') { videoLink = '<iframe src="http://player.vimeo.com/video/' + id + '?autoplay=1" width="' + width + '" height="' + height + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>'; }
        item.addClass('owl-video-playing'); this.state.videoPlay = true; this.state.videoPlayIndex = item.data('owl-item').indexAbs; videoWrap = $('<div style="height:' + height + 'px; width:' + width + 'px" class="owl-video-frame">' + videoLink + '</div>'); target.after(videoWrap);
    }; Owl.prototype.loopClone = function () {
        if (!this.options.loop || this.state.lazyContent || this.num.oItems < this.options.items) { return false; }
        var firstClone, lastClone, i, num = this.options.items, lastNum = this.num.oItems - 1; if (this.options.stagePadding && this.options.items === 1) { num += 1; }
        this.num.cItems = num * 2; for (i = 0; i < num; i++) { var first = this.dom.$oItems.eq(i).clone(true, true); var last = this.dom.$oItems.eq(lastNum - i).clone(true, true); firstClone = $(first[0]).addClass('cloned'); lastClone = $(last[0]).addClass('cloned'); this.setData(firstClone[0], first); this.setData(lastClone[0], last); firstClone.data('owl-item').clone = true; lastClone.data('owl-item').clone = true; this.dom.$stage.append(firstClone); this.dom.$stage.prepend(lastClone); firstClone = lastClone = null; }
        this.dom.$cItems = this.dom.$stage.find('.' + this.options.itemClass).filter(function () { return $(this).data('owl-item').clone === true; });
    }; Owl.prototype.reClone = function () {
        if (this.dom.$cItems !== null) { this.dom.$cItems.remove(); this.dom.$cItems = null; this.num.cItems = 0; }
        if (!this.options.loop) { return; }
        this.loopClone();
    }; Owl.prototype.calculate = function () {
        var i, j, k, dist, posLeft = 0, fullWidth = 0; this.width.el = this.dom.$el.width() - (this.options.stagePadding * 2); this.width.view = this.dom.$el.width(); var elMinusMargin = this.width.el - (this.options.margin * (this.options.items === 1 ? 0 : this.options.items - 1)); this.width.el = this.width.el + this.options.margin; this.width.item = ((elMinusMargin / this.options.items) + this.options.margin).toFixed(3); this.dom.$items = this.dom.$stage.find('.owl-item'); this.num.items = this.dom.$items.length; if (this.options.autoWidth) { this.dom.$items.css('width', ''); }
        this.pos.items = []; this.num.merged = []; this.num.nav = []; if (this.options.rtl) {
            dist = this.options.center ? -((this.width.el) / 2) : 0;
        } else {
            dist = this.options.center ? (this.width.el) / 2 : 0;
        }
        this.width.mergeStage = 0; for (i = 0; i < this.num.items; i++) {
            if (this.options.merge) {
                var mergeNumber = this.dom.$items.eq(i).find('[data-merge]').attr('data-merge') || 1; if (this.options.mergeFit && mergeNumber > this.options.items) { mergeNumber = this.options.items; }
                this.num.merged.push(parseInt(mergeNumber)); this.width.mergeStage += this.width.item * this.num.merged[i];
            } else { this.num.merged.push(1); }
            if (this.options.loop) { if (i >= this.num.cItems / 2 && i < this.num.cItems / 2 + this.num.oItems) { this.num.nav.push(this.num.merged[i]); } } else { this.num.nav.push(this.num.merged[i]); }
            var iWidth = this.width.item * this.num.merged[i]; if (this.options.autoWidth) { iWidth = this.dom.$items.eq(i).width() + this.options.margin; if (this.options.rtl) { this.dom.$items[i].style.marginLeft = this.options.margin + 'px'; } else { this.dom.$items[i].style.marginRight = this.options.margin + 'px'; } }
            this.pos.items.push(dist); this.dom.$items.eq(i).data('owl-item').posLeft = posLeft; this.dom.$items.eq(i).data('owl-item').width = iWidth; if (this.options.rtl) { dist += iWidth; posLeft += iWidth; } else { dist -= iWidth; posLeft -= iWidth; }
            fullWidth -= Math.abs(iWidth); if (this.options.center) { this.pos.items[i] = !this.options.rtl ? this.pos.items[i] - (iWidth / 2) : this.pos.items[i] + (iWidth / 2); }
        }
        if (this.options.autoWidth) { this.width.stage = this.options.center ? Math.abs(fullWidth) : Math.abs(dist); } else { this.width.stage = Math.abs(fullWidth); }
        var allItems = this.num.oItems + this.num.cItems; for (j = 0; j < allItems; j++) { this.dom.$items.eq(j).data('owl-item').indexAbs = j; }
        this.setMinMax(); this.setSizes();
    }; Owl.prototype.setMinMax = function () {
        var minimum = this.dom.$oItems.eq(0).data('owl-item').indexAbs; this.pos.min = 0; this.pos.minValue = this.pos.items[minimum]; if (!this.options.loop) { this.pos.max = this.num.oItems - 1; }
        if (this.options.loop) { this.pos.max = this.num.oItems + this.options.items; }
        if (!this.options.loop && !this.options.center) { this.pos.max = this.num.oItems - this.options.items; }
        if (this.options.loop && this.options.center) { this.pos.max = this.num.oItems + this.options.items; }
        this.pos.maxValue = this.pos.items[this.pos.max]; if ((!this.options.loop && !this.options.center && this.options.autoWidth) || (this.options.merge && !this.options.center)) {
            var revert = this.options.rtl ? 1 : -1; for (i = 0; i < this.pos.items.length; i++) { if ((this.pos.items[i] * revert) < this.width.stage - this.width.el) { this.pos.max = i + 1; } }
            this.pos.maxValue = this.options.rtl ? this.width.stage - this.width.el : -(this.width.stage - this.width.el); this.pos.items[this.pos.max] = this.pos.maxValue;
        }
        if (this.options.center) { this.pos.loop = this.pos.items[0] - this.pos.items[this.num.oItems]; } else { this.pos.loop = -this.pos.items[this.num.oItems]; }
        if (this.num.oItems < this.options.items && !this.options.center) { this.pos.max = 0; this.pos.maxValue = this.pos.items[0]; }
    }; Owl.prototype.setSizes = function () {
        if (this.options.stagePadding !== false) { this.dom.oStage.style.paddingLeft = this.options.stagePadding + 'px'; this.dom.oStage.style.paddingRight = this.options.stagePadding + 'px'; }
        if (this.options.rtl) { window.setTimeout(function () { this.dom.stage.style.width = this.width.stage + 'px'; }.bind(this), 0); } else { this.dom.stage.style.width = this.width.stage + 'px'; }
        for (var i = 0; i < this.num.items; i++) {
            if (!this.options.autoWidth) { this.dom.$items[i].style.width = this.width.item - (this.options.margin) + 'px'; }
            if (this.options.rtl) { this.dom.$items[i].style.marginLeft = this.options.margin + 'px'; } else { this.dom.$items[i].style.marginRight = this.options.margin + 'px'; }
            if (this.num.merged[i] !== 1 && !this.options.autoWidth) { this.dom.$items[i].style.width = (this.width.item * this.num.merged[i]) - (this.options.margin) + 'px'; }
        }
        this.width.stagePrev = this.width.stage;
    }; Owl.prototype.responsive = function () {
        if (!this.num.oItems) { return false; }
        var elChanged = this.isElWidthChanged(); if (!elChanged) { return false; }
        var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement; if (fullscreenElement) { if ($(fullscreenElement.parentNode).hasClass('owl-video-frame')) { this.setSpeed(0); this.state.isFullScreen = true; } }
        if (fullscreenElement && this.state.isFullScreen && this.state.videoPlay) { return false; }
        if (this.state.isFullScreen) { this.state.isFullScreen = false; return false; }
        if (this.state.videoPlay) { if (this.state.orientation !== window.orientation) { this.state.orientation = window.orientation; return false; } }
        this.fireCallback('onResponsiveBefore'); this.state.responsive = true; this.refresh(); this.state.responsive = false; this.fireCallback('onResponsiveAfter');
    }; Owl.prototype.refresh = function (init) {
        if (this.state.videoPlay) { this.stopVideo(); }
        this.setResponsiveOptions(); this.createLazyContentStructure(true); this.updateLocalContent(); this.optionsLogic(); if (this.num.oItems === 0) {
            if (this.dom.$page !== null) { this.dom.$page.hide(); }
            return false;
        }
        this.dom.$stage.addClass('owl-refresh'); this.reClone(); this.calculate(); this.dom.$stage.removeClass('owl-refresh'); if (this.state.lazyContent) { this.pos.currentAbs = this.options.items; }
        this.initPosition(init); if (!this.state.lazyContent && !init) { this.jumpTo(this.pos.current, false); }
        this.checkVideoLinks(); this.updateItemState(); this.rebuildDots(); this.updateControls(); this.autoplay(); this.autoHeight(); this.state.orientation = window.orientation; this.watchVisibility();
    }; Owl.prototype.updateItemState = function (update) {
        if (!this.state.lazyContent) { this.updateActiveItems(); } else { this.updateLazyContent(update); }
        if (this.options.center) { this.dom.$items.eq(this.pos.currentAbs).addClass(this.options.centerClass).data('owl-item').center = true; }
        if (this.options.lazyLoad) { this.lazyLoad(); }
    }; Owl.prototype.updateActiveItems = function () {
        var i, j, item, ipos, iwidth, wpos, stage, outsideView, foundCurrent; for (i = 0; i < this.num.items; i++) { this.dom.$items.eq(i).data('owl-item').active = false; this.dom.$items.eq(i).data('owl-item').current = false; this.dom.$items.eq(i).removeClass(this.options.activeClass).removeClass(this.options.centerClass); }
        this.num.active = 0; stageX = this.pos.stage; view = this.options.rtl ? this.width.view : -this.width.view; for (j = 0; j < this.num.items; j++) {
            item = this.dom.$items.eq(j); ipos = item.data('owl-item').posLeft; iwidth = item.data('owl-item').width; outsideView = this.options.rtl ? ipos + iwidth : ipos - iwidth; if ((this.op(ipos, '<=', stageX) && (this.op(ipos, '>', stageX + view))) || (this.op(outsideView, '<', stageX) && this.op(outsideView, '>', stageX + view))) {
                this.num.active++; if (this.options.freeDrag && !foundCurrent) { foundCurrent = true; this.pos.current = item.data('owl-item').index; this.pos.currentAbs = item.data('owl-item').indexAbs; }
                item.data('owl-item').active = true; item.data('owl-item').current = true; item.addClass(this.options.activeClass); if (!this.options.lazyLoad) { item.data('owl-item').loaded = true; }
                if (this.options.loop && (this.options.lazyLoad || this.options.center)) { this.updateClonedItemsState(item.data('owl-item').index); }
            }
        }
    }; Owl.prototype.updateClonedItemsState = function (activeIndex) {
        var center, $el, i; if (this.options.center) { center = this.dom.$items.eq(this.pos.currentAbs).data('owl-item').index; }
        for (i = 0; i < this.num.items; i++) { $el = this.dom.$items.eq(i); if ($el.data('owl-item').index === activeIndex) { $el.data('owl-item').current = true; if ($el.data('owl-item').index === center) { $el.addClass(this.options.centerClass); } } }
    }; Owl.prototype.updateLazyPosition = function () {
        var jumpTo = this.pos.goToLazyContent || 0; this.pos.lcMovedBy = Math.abs(this.options.items - this.pos.currentAbs); if (this.options.items < this.pos.currentAbs) { this.pos.lcCurrent += this.pos.currentAbs - this.options.items; this.state.lcDirection = 'right'; } else if (this.options.items > this.pos.currentAbs) { this.pos.lcCurrent -= this.options.items - this.pos.currentAbs; this.state.lcDirection = 'left'; }
        this.pos.lcCurrent = jumpTo !== 0 ? jumpTo : this.pos.lcCurrent; if (this.pos.lcCurrent >= this.dom.$content.length) { this.pos.lcCurrent = this.pos.lcCurrent - this.dom.$content.length; } else if (this.pos.lcCurrent < -this.dom.$content.length + 1) { this.pos.lcCurrent = this.pos.lcCurrent + this.dom.$content.length; }
        if (this.options.startPosition > 0) { this.pos.lcCurrent = this.options.startPosition; this._options.startPosition = this.options.startPosition = 0; }
        this.pos.lcCurrentAbs = this.pos.lcCurrent < 0 ? this.pos.lcCurrent + this.dom.$content.length : this.pos.lcCurrent;
    }; Owl.prototype.updateLazyContent = function (update) {
        if (this.pos.lcCurrent === undefined) { this.pos.lcCurrent = 0; this.pos.current = this.pos.currentAbs = this.options.items; }
        if (!update) { this.updateLazyPosition(); }
        var i, j, item, contentPos, content, freshItem, freshData; if (this.state.lcDirection !== false) {
            for (i = 0; i < this.pos.lcMovedBy; i++) {
                if (this.state.lcDirection === 'right') { item = this.dom.$stage.find('.owl-item').eq(0); item.appendTo(this.dom.$stage); }
                if (this.state.lcDirection === 'left') { item = this.dom.$stage.find('.owl-item').eq(-1); item.prependTo(this.dom.$stage); }
                item.data('owl-item').active = false;
            }
        }
        this.dom.$items = this.dom.$stage.find('.owl-item'); for (j = 0; j < this.num.items; j++) {
            this.dom.$items.eq(j).removeClass(this.options.centerClass); contentPos = this.pos.lcCurrent + j - this.options.items; if (contentPos >= this.dom.$content.length) { contentPos = contentPos - this.dom.$content.length; }
            if (contentPos < -this.dom.$content.length) { contentPos = contentPos + this.dom.$content.length; }
            content = this.dom.$content.eq(contentPos); freshItem = this.dom.$items.eq(j); freshData = freshItem.data('owl-item'); if (freshData.active === false || this.pos.goToLazyContent !== 0 || update === true) { freshItem.empty(); freshItem.append(content.clone(true, true)); freshData.active = true; freshData.current = true; if (!this.options.lazyLoad) { freshData.loaded = true; } else { freshData.loaded = false; } }
        }
        this.pos.goToLazyContent = 0; this.pos.current = this.pos.currentAbs = this.options.items; this.setSpeed(0); this.animStage(this.pos.items[this.options.items]);
    }; Owl.prototype.eventsCall = function () {
        this.e._onDragStart = function (e) { this.onDragStart(e); }.bind(this); this.e._onDragMove = function (e) { this.onDragMove(e); }.bind(this); this.e._onDragEnd = function (e) { this.onDragEnd(e); }.bind(this); this.e._transitionEnd = function (e) { this.transitionEnd(e); }.bind(this); this.e._resizer = function () { this.responsiveTimer(); }.bind(this); this.e._responsiveCall = function () { this.responsive(); }.bind(this); this.e._preventClick = function (e) { this.preventClick(e); }.bind(this); this.e._goToHash = function () { this.goToHash(); }.bind(this); this.e._goToPage = function (e) { this.goToPage(e); }.bind(this); this.e._ap = function () { this.autoplay(); }.bind(this); this.e._play = function () { this.play(); }.bind(this); this.e._pause = function () { this.pause(); }.bind(this); this.e._playVideo = function (e) { this.playVideo(e); }.bind(this); this.e._navNext = function (e) {
            if ($(e.target).hasClass('disabled')) { return false; }
            e.preventDefault(); this.next();
        }.bind(this); this.e._navPrev = function (e) {
            if ($(e.target).hasClass('disabled')) { return false; }
            e.preventDefault(); this.prev();
        }.bind(this);
    }; Owl.prototype.responsiveTimer = function () {
        if (this.windowWidth() === this.width.prevWindow) { return false; }
        window.clearInterval(this.e._autoplay); window.clearTimeout(this.resizeTimer); this.resizeTimer = window.setTimeout(this.e._responsiveCall, this.options.responsiveRefreshRate); this.width.prevWindow = this.windowWidth();
    }; Owl.prototype.internalEvents = function () {
        var isTouch = isTouchSupport(); var isTouchIE = isTouchSupportIE(); if (isTouch && !isTouchIE) { this.dragType = ['touchstart', 'touchmove', 'touchend', 'touchcancel']; } else if (isTouch && isTouchIE) { this.dragType = ['MSPointerDown', 'MSPointerMove', 'MSPointerUp', 'MSPointerCancel']; } else { this.dragType = ['mousedown', 'mousemove', 'mouseup']; }
        if ((isTouch || isTouchIE) && this.options.touchDrag) { this.on(document, this.dragType[3], this.e._onDragEnd); } else { this.dom.$stage.on('dragstart', function () { return false; }); if (this.options.mouseDrag) { this.dom.stage.onselectstart = function () { return false; }; } else { this.dom.$el.addClass('owl-text-select-on'); } }
        this.dom.$stage.on(this.dragType[2], '.owl-video-play-icon', this.e._playVideo); if (this.options.URLhashListener) { this.on(window, 'hashchange', this.e._goToHash, false); }
        if (this.options.autoplayHoverPause) { var that = this; this.dom.$stage.on('mouseover', this.e._pause); this.dom.$stage.on('mouseleave', this.e._ap); }
        if (this.transitionEndVendor) { this.on(this.dom.stage, this.transitionEndVendor, this.e._transitionEnd, false); }
        if (this.options.responsive !== false) { this.on(window, 'resize', this.e._resizer, false); }
        this.updateEvents();
    }; Owl.prototype.updateEvents = function () { if (this.options.touchDrag && (this.dragType[0] === 'touchstart' || this.dragType[0] === 'MSPointerDown')) { this.on(this.dom.stage, this.dragType[0], this.e._onDragStart, false); } else if (this.options.mouseDrag && this.dragType[0] === 'mousedown') { this.on(this.dom.stage, this.dragType[0], this.e._onDragStart, false); } else { this.off(this.dom.stage, this.dragType[0], this.e._onDragStart); } }; Owl.prototype.onDragStart = function (event) {
        var ev = event.originalEvent || event || window.event; if (ev.which === 3) { return false; }
        if (this.dragType[0] === 'mousedown') { this.dom.$stage.addClass('owl-grab'); }
        this.fireCallback('onTouchStart'); this.drag.startTime = new Date().getTime(); this.setSpeed(0); this.state.isTouch = true; this.state.isScrolling = false; this.state.isSwiping = false; this.drag.distance = 0; var isTouchEvent = ev.type === 'touchstart'; var pageX = isTouchEvent ? event.targetTouches[0].pageX : (ev.pageX || ev.clientX); var pageY = isTouchEvent ? event.targetTouches[0].pageY : (ev.pageY || ev.clientY); this.drag.offsetX = this.dom.$stage.position().left - this.options.stagePadding; this.drag.offsetY = this.dom.$stage.position().top; if (this.options.rtl) { this.drag.offsetX = this.dom.$stage.position().left + this.width.stage - this.width.el + this.options.margin; }
        if (this.state.inMotion && this.support3d) { var animatedPos = this.getTransformProperty(); this.drag.offsetX = animatedPos; this.animStage(animatedPos); } else if (this.state.inMotion && !this.support3d) { this.state.inMotion = false; return false; }
        this.drag.startX = pageX - this.drag.offsetX; this.drag.startY = pageY - this.drag.offsetY; this.drag.start = pageX - this.drag.startX; this.drag.targetEl = ev.target || ev.srcElement; this.drag.updatedX = this.drag.start; this.on(document, this.dragType[1], this.e._onDragMove, false); this.on(document, this.dragType[2], this.e._onDragEnd, false);
    }; Owl.prototype.onDragMove = function (event) {
        if (!this.state.isTouch) { return; }
        if (this.state.isScrolling) { return; }
        var neighbourItemWidth = 0; var ev = event.originalEvent || event || window.event; var isTouchEvent = ev.type == 'touchmove'; var pageX = isTouchEvent ? ev.targetTouches[0].pageX : (ev.pageX || ev.clientX); var pageY = isTouchEvent ? ev.targetTouches[0].pageY : (ev.pageY || ev.clientY); this.drag.currentX = pageX - this.drag.startX; this.drag.currentY = pageY - this.drag.startY; this.drag.distance = this.drag.currentX - this.drag.offsetX; if (this.drag.distance < 0) { this.state.direction = this.options.rtl ? 'right' : 'left'; } else if (this.drag.distance > 0) { this.state.direction = this.options.rtl ? 'left' : 'right'; }
        if (this.options.loop) { if (this.op(this.drag.currentX, '>', this.pos.minValue) && this.state.direction === 'right') { this.drag.currentX -= this.pos.loop; } else if (this.op(this.drag.currentX, '<', this.pos.maxValue) && this.state.direction === 'left') { this.drag.currentX += this.pos.loop; } } else { var minValue = this.options.rtl ? this.pos.maxValue : this.pos.minValue; var maxValue = this.options.rtl ? this.pos.minValue : this.pos.maxValue; var pull = this.options.pullDrag ? this.drag.distance / 5 : 0; this.drag.currentX = Math.max(Math.min(this.drag.currentX, minValue + pull), maxValue + pull); }
        if ((this.drag.distance > 8 || this.drag.distance < -8)) {
            if (ev.preventDefault !== undefined) { ev.preventDefault(); } else { ev.returnValue = false; }
            this.state.isSwiping = true;
        }
        this.drag.updatedX = this.drag.currentX; if ((this.drag.currentY > 16 || this.drag.currentY < -16) && this.state.isSwiping === false) { this.state.isScrolling = true; this.drag.updatedX = this.drag.start; }
        this.animStage(this.drag.updatedX);
    }; Owl.prototype.onDragEnd = function (event) {
        if (!this.state.isTouch) { return; }
        if (this.dragType[0] === 'mousedown') { this.dom.$stage.removeClass('owl-grab'); }
        this.fireCallback('onTouchEnd'); this.state.isTouch = false; this.state.isScrolling = false; this.state.isSwiping = false; if (this.drag.distance === 0 && this.state.inMotion !== true) { this.state.inMotion = false; return false; }
        this.drag.endTime = new Date().getTime(); var compareTimes = this.drag.endTime - this.drag.startTime; var distanceAbs = Math.abs(this.drag.distance); if (distanceAbs > 3 || compareTimes > 300) { this.removeClick(this.drag.targetEl); }
        var closest = this.closest(this.drag.updatedX); this.setSpeed(this.options.dragEndSpeed, false, true); this.animStage(this.pos.items[closest]); if (!this.options.pullDrag && this.drag.updatedX === this.pos.items[closest]) { this.transitionEnd(); }
        this.drag.distance = 0; this.off(document, this.dragType[1], this.e._onDragMove); this.off(document, this.dragType[2], this.e._onDragEnd);
    }; Owl.prototype.removeClick = function (target) { this.drag.targetEl = target; this.on(target, 'click', this.e._preventClick, false); }; Owl.prototype.preventClick = function (ev) {
        if (ev.preventDefault) { ev.preventDefault(); } else { ev.returnValue = false; }
        if (ev.stopPropagation) { ev.stopPropagation(); }
        this.off(this.drag.targetEl, 'click', this.e._preventClick, false);
    }; Owl.prototype.getTransformProperty = function () { var transform = window.getComputedStyle(this.dom.stage, null).getPropertyValue(this.vendorName + 'transform'); transform = transform.replace(/matrix(3d)?\(|\)/g, '').split(','); var matrix3d = transform.length === 16; return matrix3d !== true ? transform[4] : transform[12]; }; Owl.prototype.closest = function (x) {
        var newX = 0, pull = 30; if (!this.options.freeDrag) { for (var i = 0; i < this.num.items; i++) { if (x > this.pos.items[i] - pull && x < this.pos.items[i] + pull) { newX = i; } else if (this.op(x, '<', this.pos.items[i]) && this.op(x, '>', this.pos.items[i + 1 || this.pos.items[i] - this.width.el])) { newX = this.state.direction === 'left' ? i + 1 : i; } } }
        if (!this.options.loop) { if (this.op(x, '>', this.pos.minValue)) { newX = x = this.pos.min; } else if (this.op(x, '<', this.pos.maxValue)) { newX = x = this.pos.max; } }
        if (!this.options.freeDrag) { this.pos.currentAbs = newX; this.pos.current = this.dom.$items.eq(newX).data('owl-item').index; } else { this.updateItemState(); return x; }
        return newX;
    }; Owl.prototype.animStage = function (pos) {
        if (this.speed.current !== 0 && this.pos.currentAbs !== this.pos.min) { this.fireCallback('onTransitionStart'); this.state.inMotion = true; }
        var posX = this.pos.stage = pos, style = this.dom.stage.style; if (this.support3d) { translate = 'translate3d(' + posX + 'px' + ',0px, 0px)'; style[this.transformVendor] = translate; } else if (this.state.isTouch) { style.left = posX + 'px'; } else { this.dom.$stage.animate({ left: posX }, this.speed.css2speed, this.options.fallbackEasing, function () { if (this.state.inMotion) { this.transitionEnd(); } }.bind(this)); }
        this.onChange();
    }; Owl.prototype.updatePosition = function (pos) {
        if (this.num.oItems === 0) { return false; }
        if (pos === undefined) { return false; }
        var nextPos = pos; this.pos.prev = this.pos.currentAbs; if (this.state.revert) { this.pos.current = this.dom.$items.eq(nextPos).data('owl-item').index; this.pos.currentAbs = nextPos; return; }
        if (!this.options.loop) { if (this.options.navRewind) { nextPos = nextPos > this.pos.max ? this.pos.min : (nextPos < 0 ? this.pos.max : nextPos); } else { nextPos = nextPos > this.pos.max ? this.pos.max : (nextPos <= 0 ? 0 : nextPos); } } else { nextPos = nextPos >= this.num.oItems ? this.num.oItems - 1 : nextPos; }
        this.pos.current = this.dom.$oItems.eq(nextPos).data('owl-item').index; this.pos.currentAbs = this.dom.$oItems.eq(nextPos).data('owl-item').indexAbs;
    }; Owl.prototype.setSpeed = function (speed, pos, drag) {
        var s = speed, nextPos = pos; if ((s === false && s !== 0 && drag !== true) || s === undefined) {
            var diff = Math.abs(nextPos - this.pos.prev); diff = diff === 0 ? 1 : diff; if (diff > 6) { diff = 6; }
            s = diff * this.options.smartSpeed;
        }
        if (s === false && drag === true) { s = this.options.smartSpeed; }
        if (s === 0) { s = 0; }
        if (this.support3d) { var style = this.dom.stage.style; style.webkitTransitionDuration = style.MsTransitionDuration = style.msTransitionDuration = style.MozTransitionDuration = style.OTransitionDuration = style.transitionDuration = (s / 1000) + 's'; } else { this.speed.css2speed = s; }
        this.speed.current = s; return s;
    }; Owl.prototype.jumpTo = function (pos, update) {
        if (this.state.lazyContent) { this.pos.goToLazyContent = pos; }
        this.updatePosition(pos); this.setSpeed(0); this.animStage(this.pos.items[this.pos.currentAbs]); if (update !== true) { this.updateItemState(); }
    }; Owl.prototype.goTo = function (pos, speed) {
        if (this.state.lazyContent && this.state.inMotion) { return false; }
        this.updatePosition(pos); if (this.state.animate) { speed = 0; }
        this.setSpeed(speed, this.pos.currentAbs); if (this.state.animate) { this.animate(); }
        this.animStage(this.pos.items[this.pos.currentAbs]);
    }; Owl.prototype.next = function (optionalSpeed) { var s = optionalSpeed || this.options.navSpeed; if (this.options.loop && !this.state.lazyContent) { this.goToLoop(this.options.slideBy, s); } else { this.goTo(this.pos.current + this.options.slideBy, s); } }; Owl.prototype.prev = function (optionalSpeed) { var s = optionalSpeed || this.options.navSpeed; if (this.options.loop && !this.state.lazyContent) { this.goToLoop(-this.options.slideBy, s); } else { this.goTo(this.pos.current - this.options.slideBy, s); } }; Owl.prototype.goToLoop = function (distance, speed) {
        var revert = this.pos.currentAbs, prevPosition = this.pos.currentAbs, newPosition = this.pos.currentAbs + distance, direction = prevPosition - newPosition < 0 ? true : false; this.state.revert = true; if (newPosition < 1 && direction === false) { this.state.bypass = true; revert = this.num.items - (this.options.items - prevPosition) - this.options.items; this.jumpTo(revert, true); } else if (newPosition >= this.num.items - this.options.items && direction === true) { this.state.bypass = true; revert = prevPosition - this.num.oItems; this.jumpTo(revert, true); }
        window.clearTimeout(this.e._goToLoop); this.e._goToLoop = window.setTimeout(function () { this.state.bypass = false; this.goTo(revert + distance, speed); this.state.revert = false; }.bind(this), 30);
    }; Owl.prototype.initPosition = function (init) {
        if (!this.dom.$oItems || !init || this.state.lazyContent) { return false; }
        var pos = this.options.startPosition; if (this.options.startPosition === 'URLHash') { pos = this.options.startPosition = this.hashPosition(); } else if (typeof this.options.startPosition !== Number && !this.options.center) { this.options.startPosition = 0; }
        this.dom.oStage.scrollLeft = 0; this.jumpTo(pos, true);
    }; Owl.prototype.goToHash = function () {
        var pos = this.hashPosition(); if (pos === false) { pos = 0; }
        this.dom.oStage.scrollLeft = 0; this.goTo(pos, this.options.navSpeed);
    }; Owl.prototype.hashPosition = function () {
        var hash = window.location.hash.substring(1), hashPos; if (hash === "") { return false; }
        for (var i = 0; i < this.num.oItems; i++) { if (hash === this.dom.$oItems.eq(i).data('owl-item').hash) { hashPos = i; } }
        return hashPos;
    }; Owl.prototype.autoplay = function () { if (this.options.autoplay && !this.state.videoPlay) { window.clearInterval(this.e._autoplay); this.e._autoplay = window.setInterval(this.e._play, this.options.autoplayTimeout); } else { window.clearInterval(this.e._autoplay); this.state.autoplay = false; } }; Owl.prototype.play = function (timeout, speed) {
        if (document.hidden === true) { return false; }
        if (!this.options.autoplay) { this._options.autoplay = this.options.autoplay = true; this._options.autoplayTimeout = this.options.autoplayTimeout = timeout || this.options.autoplayTimeout || 4000; this._options.autoplaySpeed = speed || this.options.autoplaySpeed; }
        if (this.options.autoplay === false || this.state.isTouch || this.state.isScrolling || this.state.isSwiping || this.state.inMotion) { window.clearInterval(this.e._autoplay); return false; }
        if (!this.options.loop && this.pos.current >= this.pos.max) { window.clearInterval(this.e._autoplay); this.goTo(0); } else { this.next(this.options.autoplaySpeed); }
        this.state.autoplay = true;
    }; Owl.prototype.stop = function () { this._options.autoplay = this.options.autoplay = false; this.state.autoplay = false; window.clearInterval(this.e._autoplay); }; Owl.prototype.pause = function () { window.clearInterval(this.e._autoplay); }; Owl.prototype.transitionEnd = function (event) {
        if (event !== undefined) { event.stopPropagation(); var eventTarget = event.target || event.srcElement || event.originalTarget; if (eventTarget !== this.dom.stage) { return false; } }
        this.state.inMotion = false; this.updateItemState(); this.autoplay(); this.fireCallback('onTransitionEnd');
    }; Owl.prototype.isElWidthChanged = function () { var newElWidth = this.dom.$el.width() - this.options.stagePadding, prevElWidth = this.width.el + this.options.margin; return newElWidth !== prevElWidth; }; Owl.prototype.windowWidth = function () {
        if (this.options.responsiveBaseElement !== window) { this.width.window = $(this.options.responsiveBaseElement).width(); } else if (window.innerWidth) { this.width.window = window.innerWidth; } else if (document.documentElement && document.documentElement.clientWidth) { this.width.window = document.documentElement.clientWidth; }
        return this.width.window;
    }; Owl.prototype.controls = function () { var cc = document.createElement('div'); cc.className = this.options.controlsClass; this.dom.$el.append(cc); this.dom.$cc = $(cc); }; Owl.prototype.updateControls = function () {
        if (this.dom.$cc === null && (this.options.nav || this.options.dots)) { this.controls(); }
        if (this.dom.$nav === null && this.options.nav) { this.createNavigation(this.dom.$cc[0]); }
        if (this.dom.$page === null && this.options.dots) { this.createDots(this.dom.$cc[0]); }
        if (this.dom.$nav !== null) { if (this.options.nav) { this.dom.$nav.show(); this.updateNavigation(); } else { this.dom.$nav.hide(); } }
        if (this.dom.$page !== null) { if (this.options.dots) { this.dom.$page.show(); this.updateDots(); } else { this.dom.$page.hide(); } }
    }; Owl.prototype.createNavigation = function (cc) { var nav = document.createElement('div'); nav.className = this.options.navContainerClass; cc.appendChild(nav); var navPrev = document.createElement('div'), navNext = document.createElement('div'); navPrev.className = this.options.navClass[0]; navNext.className = this.options.navClass[1]; nav.appendChild(navPrev); nav.appendChild(navNext); this.dom.$nav = $(nav); this.dom.$navPrev = $(navPrev).html(this.options.navText[0]); this.dom.$navNext = $(navNext).html(this.options.navText[1]); this.dom.$nav.on(this.dragType[2], '.' + this.options.navClass[0], this.e._navPrev); this.dom.$nav.on(this.dragType[2], '.' + this.options.navClass[1], this.e._navNext); }; Owl.prototype.createDots = function (cc) {
        var page = document.createElement('div'); page.className = this.options.dotsClass; cc.appendChild(page); this.dom.$page = $(page); var that = this; this.dom.$page.on(this.dragType[2], '.' + this.options.dotClass, goToPage); function goToPage(e) { e.preventDefault(); var page = $(this).data('page'); that.goTo(page, that.options.dotsSpeed); }
        this.rebuildDots();
    }; Owl.prototype.rebuildDots = function () {
        if (this.dom.$page === null) { return false; }
        var each, dot, span, counter = 0, last = 0, i, page = 0, roundPages = 0; each = this.options.dotsEach || this.options.items; if (this.options.center || this.options.dotData) { each = 1; }
        this.dom.$page.html(''); for (i = 0; i < this.num.nav.length; i++) {
            if (counter >= each || counter === 0) {
                dot = document.createElement('div'); dot.className = this.options.dotClass; span = document.createElement('span'); dot.appendChild(span); var $dot = $(dot); if (this.options.dotData) { $dot.html(this.dom.$oItems.eq(i).data('owl-item').dot); }
                $dot.data('page', page); $dot.data('goToPage', roundPages); this.dom.$page.append(dot); counter = 0; roundPages++;
            }
            this.dom.$oItems.eq(i).data('owl-item').page = roundPages - 1; counter += this.num.nav[i]; page++;
        }
        if (!this.options.loop && !this.options.center) { for (var j = this.num.nav.length - 1; j >= 0; j--) { last += this.num.nav[j]; this.dom.$oItems.eq(j).data('owl-item').page = roundPages - 1; if (last >= each) { break; } } }
        this.num.allPages = roundPages - 1;
    }; Owl.prototype.updateDots = function () { var dots = this.dom.$page.children(); var itemIndex = this.dom.$oItems.eq(this.pos.current).data('owl-item').page; for (var i = 0; i < dots.length; i++) { var dotPage = dots.eq(i).data('goToPage'); if (dotPage === itemIndex) { this.pos.currentPage = i; dots.eq(i).addClass('active'); } else { dots.eq(i).removeClass('active'); } } }; Owl.prototype.updateNavigation = function () {
        var isNav = this.options.nav; this.dom.$navNext.toggleClass('disabled', !isNav); this.dom.$navPrev.toggleClass('disabled', !isNav); if (!this.options.loop && isNav && !this.options.navRewind) {
            if (this.pos.current <= 0) { this.dom.$navPrev.addClass('disabled'); }
            if (this.pos.current >= this.pos.max) { this.dom.$navNext.addClass('disabled'); }
        }
    }; Owl.prototype.insertContent = function (content) { this.dom.$stage.empty(); this.fetchContent(content); this.refresh(); }; Owl.prototype.addItem = function (content, pos) {
        pos = pos || 0; if (this.state.lazyContent) { this.dom.$content = this.dom.$content.add($(content)); this.updateItemState(true); } else {
            var item = this.fillItem(content); if (this.dom.$oItems.length === 0) { this.dom.$stage.append(item); } else { var it = this.dom.$oItems.eq(pos); if (pos !== -1) { it.before(item); } else { it.after(item); } }
            this.refresh();
        }
    }; Owl.prototype.removeItem = function (pos) { if (this.state.lazyContent) { this.dom.$content.splice(pos, 1); this.updateItemState(true); } else { this.dom.$oItems.eq(pos).remove(); this.refresh(); } }; Owl.prototype.addCustomEvents = function () { this.e.next = function (e, s) { this.next(s); }.bind(this); this.e.prev = function (e, s) { this.prev(s); }.bind(this); this.e.goTo = function (e, p, s) { this.goTo(p, s); }.bind(this); this.e.jumpTo = function (e, p) { this.jumpTo(p); }.bind(this); this.e.addItem = function (e, c, p) { this.addItem(c, p); }.bind(this); this.e.removeItem = function (e, p) { this.removeItem(p); }.bind(this); this.e.refresh = function (e) { this.refresh(); }.bind(this); this.e.destroy = function (e) { this.destroy(); }.bind(this); this.e.autoHeight = function (e) { this.autoHeight(true); }.bind(this); this.e.stop = function () { this.stop(); }.bind(this); this.e.play = function (e, t, s) { this.play(t, s); }.bind(this); this.e.insertContent = function (e, d) { this.insertContent(d); }.bind(this); this.dom.$el.on('next.owl', this.e.next); this.dom.$el.on('prev.owl', this.e.prev); this.dom.$el.on('goTo.owl', this.e.goTo); this.dom.$el.on('jumpTo.owl', this.e.jumpTo); this.dom.$el.on('addItem.owl', this.e.addItem); this.dom.$el.on('removeItem.owl', this.e.removeItem); this.dom.$el.on('destroy.owl', this.e.destroy); this.dom.$el.on('refresh.owl', this.e.refresh); this.dom.$el.on('autoHeight.owl', this.e.autoHeight); this.dom.$el.on('play.owl', this.e.play); this.dom.$el.on('stop.owl', this.e.stop); this.dom.$el.on('stopVideo.owl', this.e.stop); this.dom.$el.on('insertContent.owl', this.e.insertContent); }; Owl.prototype.on = function (element, event, listener, capture) {
        if (element.addEventListener) { element.addEventListener(event, listener, capture); }
        else if (element.attachEvent) { element.attachEvent('on' + event, listener); }
    }; Owl.prototype.off = function (element, event, listener, capture) {
        if (element.removeEventListener) { element.removeEventListener(event, listener, capture); }
        else if (element.detachEvent) { element.detachEvent('on' + event, listener); }
    }; Owl.prototype.fireCallback = function (event, data) {
        if (!this.options.callbacks) { return; }
        if (this.dom.el.dispatchEvent) { var evt = document.createEvent('CustomEvent'); evt.initCustomEvent(event, true, true, data); return this.dom.el.dispatchEvent(evt); } else if (!this.dom.el.dispatchEvent) { return this.dom.$el.trigger(event); }
    }; Owl.prototype.watchVisibility = function () {
        if (!isElVisible(this.dom.el)) { this.dom.$el.addClass('owl-hidden'); window.clearInterval(this.e._checkVisibile); this.e._checkVisibile = window.setInterval(checkVisible.bind(this), 500); }
        function isElVisible(el) { return el.offsetWidth > 0 && el.offsetHeight > 0; }
        function checkVisible() { if (isElVisible(this.dom.el)) { this.dom.$el.removeClass('owl-hidden'); this.refresh(); window.clearInterval(this.e._checkVisibile); } }
    }; Owl.prototype.onChange = function () {
        if (!this.state.isTouch && !this.state.bypass && !this.state.responsive) {
            if (this.options.nav || this.options.dots) { this.updateControls(); }
            this.autoHeight(); this.fireCallback('onChangeState');
        }
        if (!this.state.isTouch && !this.state.bypass) { this.storeInfo(); if (this.state.videoPlay) { this.stopVideo(); } }
    }; Owl.prototype.storeInfo = function () { var currentPosition = this.state.lazyContent ? this.pos.lcCurrentAbs || 0 : this.pos.current; var allItems = this.state.lazyContent ? this.dom.$content.length - 1 : this.num.oItems; this.info = { items: this.options.items, allItems: allItems, currentPosition: currentPosition, currentPage: this.pos.currentPage, allPages: this.num.allPages, autoplay: this.state.autoplay, windowWidth: this.width.window, elWidth: this.width.el, breakpoint: this.num.breakpoint }; if (typeof this.options.info === 'function') { this.options.info.apply(this, [this.info, this.dom.el]); } }; Owl.prototype.autoHeight = function (callback) {
        if (this.options.autoHeight !== true && callback !== true) { return false; }
        if (!this.dom.$oStage.hasClass(this.options.autoHeightClass)) { this.dom.$oStage.addClass(this.options.autoHeightClass); }
        var loaded = this.dom.$items.eq(this.pos.currentAbs); var stage = this.dom.$oStage; var iterations = 0; var isLoaded = window.setInterval(function () { iterations += 1; if (loaded.data('owl-item').loaded) { stage.height(loaded.height() + 'px'); clearInterval(isLoaded); } else if (iterations === 500) { clearInterval(isLoaded); } }, 100);
    }; Owl.prototype.preloadAutoWidthImages = function (imgs) {
        var loaded = 0; var that = this; imgs.each(function (i, el) {
            var $el = $(el); var img = new Image(); img.onload = function () { loaded++; $el.attr('src', img.src); $el.css('opacity', 1); if (loaded >= imgs.length) { that.state.imagesLoaded = true; that.init(); } }
            img.src = $el.attr('src') || $el.attr('data-src') || $el.attr('data-src-retina');;
        })
    }; Owl.prototype.lazyLoad = function () { var attr = isRetina() ? 'data-src-retina' : 'data-src'; var src, img, i; for (i = 0; i < this.num.items; i++) { var $item = this.dom.$items.eq(i); if ($item.data('owl-item').current === true && $item.data('owl-item').loaded === false) { img = $item.find('.owl-lazy'); src = img.attr(attr); src = src || img.attr('data-src'); if (src) { img.css('opacity', '0'); this.preload(img, $item); } } } }; Owl.prototype.preload = function (images, $item) {
        var that = this; images.each(function (i, el) {
            var $el = $(el); var img = new Image(); img.onload = function () {
                $item.data('owl-item').loaded = true; if ($el.is('img')) { $el.attr('src', img.src); } else { $el.css('background-image', 'url(' + img.src + ')'); }
                $el.css('opacity', 1); that.fireCallback('onLazyLoaded');
            }; img.src = $el.attr('data-src') || $el.attr('data-src-retina');
        });
    }; Owl.prototype.animate = function () {
        var prevItem = this.dom.$items.eq(this.pos.prev), prevPos = Math.abs(prevItem.data('owl-item').width) * this.pos.prev, currentItem = this.dom.$items.eq(this.pos.currentAbs), currentPos = Math.abs(currentItem.data('owl-item').width) * this.pos.currentAbs; if (this.pos.currentAbs === this.pos.prev) { return false; }
        var pos = currentPos - prevPos; var tIn = this.options.animateIn; var tOut = this.options.animateOut; var that = this; removeStyles = function () { $(this).css({ "left": "" }).removeClass('animated owl-animated-out owl-animated-in').removeClass(tIn).removeClass(tOut); that.transitionEnd(); }; if (tOut) { prevItem.css({ "left": pos + "px" }).addClass('animated owl-animated-out ' + tOut).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeStyles); }
        if (tIn) { currentItem.addClass('animated owl-animated-in ' + tIn).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', removeStyles); }
    }; Owl.prototype.destroy = function () {
        window.clearInterval(this.e._autoplay); if (this.dom.$el.hasClass(this.options.themeClass)) { this.dom.$el.removeClass(this.options.themeClass); }
        if (this.options.responsive !== false) { this.off(window, 'resize', this.e._resizer); }
        if (this.transitionEndVendor) { this.off(this.dom.stage, this.transitionEndVendor, this.e._transitionEnd); }
        if (this.options.mouseDrag || this.options.touchDrag) {
            this.off(this.dom.stage, this.dragType[0], this.e._onDragStart); if (this.options.mouseDrag) { this.off(document, this.dragType[3], this.e._onDragStart); }
            if (this.options.mouseDrag) { this.dom.$stage.off('dragstart', function () { return false; }); this.dom.stage.onselectstart = function () { }; }
        }
        if (this.options.URLhashListener) { this.off(window, 'hashchange', this.e._goToHash); }
        this.dom.$el.off('next.owl', this.e.next); this.dom.$el.off('prev.owl', this.e.prev); this.dom.$el.off('goTo.owl', this.e.goTo); this.dom.$el.off('jumpTo.owl', this.e.jumpTo); this.dom.$el.off('addItem.owl', this.e.addItem); this.dom.$el.off('removeItem.owl', this.e.removeItem); this.dom.$el.off('refresh.owl', this.e.refresh); this.dom.$el.off('autoHeight.owl', this.e.autoHeight); this.dom.$el.off('play.owl', this.e.play); this.dom.$el.off('stop.owl', this.e.stop); this.dom.$el.off('stopVideo.owl', this.e.stop); this.dom.$stage.off('click', this.e._playVideo); if (this.dom.$cc !== null) { this.dom.$cc.remove(); }
        if (this.dom.$cItems !== null) { this.dom.$cItems.remove(); }
        this.e = null; this.dom.$el.data('owlCarousel', null); delete this.dom.el.owlCarousel; this.dom.$stage.unwrap(); this.dom.$items.unwrap(); this.dom.$items.contents().unwrap(); this.dom = null;
    }; Owl.prototype.op = function (a, o, b) { var rtl = this.options.rtl; switch (o) { case '<': return rtl ? a > b : a < b; case '>': return rtl ? a < b : a > b; case '>=': return rtl ? a <= b : a >= b; case '<=': return rtl ? a >= b : a <= b; default: break; } }; Owl.prototype.browserSupport = function () {
        this.support3d = isPerspective(); if (this.support3d) { this.transformVendor = isTransform(); var endVendors = ['transitionend', 'webkitTransitionEnd', 'transitionend', 'oTransitionEnd']; this.transitionEndVendor = endVendors[isTransition()]; this.vendorName = this.transformVendor.replace(/Transform/i, ''); this.vendorName = this.vendorName !== '' ? '-' + this.vendorName.toLowerCase() + '-' : ''; }
        this.state.orientation = window.orientation;
    }; function isStyleSupported(array) {
        var p, s, fake = document.createElement('div'), list = array; for (p in list) { s = list[p]; if (typeof fake.style[s] !== 'undefined') { fake = null; return [s, p]; } }
        return [false];
    }
    function isTransition() { return isStyleSupported(['transition', 'WebkitTransition', 'MozTransition', 'OTransition'])[1]; }
    function isTransform() { return isStyleSupported(['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'])[0]; }
    function isPerspective() { return isStyleSupported(['perspective', 'webkitPerspective', 'MozPerspective', 'OPerspective', 'MsPerspective'])[0]; }
    function isTouchSupport() { return 'ontouchstart' in window || !!(navigator.msMaxTouchPoints); }
    function isTouchSupportIE() { return window.navigator.msPointerEnabled; }
    function isRetina() { return window.devicePixelRatio > 1; }
    $.fn.owlCarousel = function (options) { return this.each(function () { if (!$(this).data('owlCarousel')) { $(this).data('owlCarousel', new Owl(this, options)); } }); };
})(window.Zepto || window.jQuery, window, document); if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== 'function') { throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable'); }
        var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function () { }, fBound = function () { return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments))); }; fNOP.prototype = this.prototype; fBound.prototype = new fNOP(); return fBound;
    };
}