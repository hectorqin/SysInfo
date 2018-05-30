var typeList = []
var speedTimer = null
var typeName = ["net", "sys"]
var cacheType = $cache.get("SYS_TYPE") || 0

function render(onDoubleTapped = false, onLongPressed) {
    let typeView = getType(cacheType).view
    typeView.props.alpha = 1
    var speedView = {
        type: "view",
        layout: $layout.fill,
        views: [{
                type: "view",
                props: {
                    bgcolor: $color("gray"),
                    alpha: 0.3
                },
                layout: function(make, view) {
                    make.centerY.equalTo(view.super)
                    make.centerX.equalTo(view.super).offset(-70)
                    make.width.equalTo(1)
                    make.height.equalTo(75)
                }
            }, {
                type: "label",
                props: {
                    id: "u",
                    text: "0 B/s",
                    font: $font(12),
                    align: $align.right
                },
                layout: function(make, view) {
                    make.centerY.equalTo(view.super).offset(-20)
                    make.right.equalTo(view.prev).offset(-13)
                }
            }, {
                type: "label",
                props: {
                    id: "d",
                    text: "0 B/s",
                    font: $font(12),
                    align: $align.right
                },
                layout: function(make, view) {
                    make.centerY.equalTo(view.super).offset(20)
                    make.right.equalTo(view.prev)
                }
            }, {
                type: "label",
                props: {
                    text: "↗",
                    font: $font("SourceCodePro-It", 22),
                    color: $color("#FE4A4A"),
                    align: $align.left
                },
                layout: function(make, view) {
                    make.centerY.equalTo(view.super).offset(-22)
                    make.left.equalTo(view.super).inset(20)
                }
            },
            {
                type: "label",
                props: {
                    text: "↙",
                    font: $font("SourceCodePro-It", 22),
                    color: $color("#1F87FF"),
                    align: $align.left
                },
                layout: function(make, view) {
                    make.centerY.equalTo(view.super).offset(18)
                    make.left.equalTo(view.prev)
                }
            }
        ]
    }
    return {
        views: [{
                type: "view",
                props: {

                },
                layout: $layout.fill,
                views: [speedView]
            },
            {
                type: "view",
                props: {
                    id: "main"
                },
                layout: $layout.fill,
                views: [typeView],
                events: {
                    tapped: function(sender) {
                        var sub = sender.views[0]
                        $device.taptic(0)
                        cacheType = (sub.info + 1) % 2
                        toggleType(sub, cacheType)
                        $cache.set("SYS_TYPE", cacheType)
                    },
                    ready: function() {
                        initTimer()
                    },
                    doubleTapped: function(sender) {
                        onDoubleTapped && onDoubleTapped(sender)
                    },
                    longPressed: function(sender) {
                        onLongPressed && onLongPressed(sender)
                    }
                }
            }
        ],
        layout: $layout.fill
    }
}

function upText(n) {
    $cache.getAsync({
        key: "tu",
        handler: function(temp) {
            $cache.set("tu", n)
            let d = n - temp
            let t = d >= 1048576 ? (d / 1048576).toFixed(1) + " MB/s" : (d >= 1024 ? (d / 1024).toFixed(1) + " KB/s" : d + " B/s")
            $("u").text = t
        }
    })
}

function downText(n) {
    $cache.getAsync({
        key: "td",
        handler: function(temp) {
            $cache.set("td", n)
            let d = n - temp
            let t = d >= 1048576 ? (d / 1048576).toFixed(1) + " MB/s" : (d >= 1024 ? (d / 1024).toFixed(1) + " KB/s" : d + " B/s")
            $("d").text = t
        }
    })
}

function toggleType(subview, type) {
    var nextView = getType(type).view
    nextView.props.alpha = 0
    $("main").add(nextView)

    $ui.animate({
        duration: 0.2,
        animation: function() {
            subview.alpha = 0
        },
        completion: function() {
            subview.remove()
            $ui.animate({
                duration: 0.2,
                animation: function() {
                    $("main").views[0].alpha = 1
                }
            })
        }
    })
}

function initTimer(){
    speedTimer = $timer.schedule({
        interval: 1,
        handler: function() {
            var type = $device.networkType
            var ifa_data = $network.ifa_data
            switch (type) {
                case 0:
                    break;
                case 1:
                    upText(ifa_data.en0.sent)
                    downText(ifa_data.en0.received)
                    break;
                case 2:
                    upText(ifa_data.pdp_ip0.sent)
                    downText(ifa_data.pdp_ip0.received)
                    break;
            }
            typeList[cacheType].refresh()
        }
    })
}

function destroy(){
    speedTimer.invalidate()
}

function getType(index) {
    if(!typeList[index]){
        typeList[index] = require(`scripts/sysinfo/${typeName[index]}`)
    }
    return typeList[index]
}

module.exports = {
    render: render,
    destroy: destroy
}