var typeList = []
var typeName = ["week", "year"]
var cacheType = $cache.get("PROGRESS_TYPE") || 0

function render(onDoubleTapped = false, onLongPressed) {
    let typeView = getType(cacheType).view
    typeView.props.alpha = 1
    return {
        views: [{
            type: "view",
            props: {
                id: "main"
            },
            views: [typeView],
            layout: $layout.fill,
            events: {
                tapped: function(sender) {
                    var sub = sender.views[0]
                    $device.taptic(0)
                    cacheType = (sub.info + 1) % 2
                    toggleType(sub, cacheType)
                    $cache.set("PROGRESS_TYPE", cacheType)
                },
                ready: function() {
                    $delay(0.2, function() {
                        getType(cacheType).refresh()
                    })
                },
                doubleTapped: function(sender) {
                    onDoubleTapped && onDoubleTapped(sender)
                },
                longPressed: function(sender) {
                    onLongPressed && onLongPressed(sender)
                }
            }
        }],
        layout: $layout.fill
    }
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
                },
                completion: function() {
                    getType(type).refresh()
                }
            })
        }
    })
}

function getType(index) {
    if(!typeList[index]){
        typeList[index] = require(`scripts/progress/${typeName[index]}`)
    }
    return typeList[index]
}

function destroy(){
}

module.exports = {
    render: render,
    destroy: destroy
}