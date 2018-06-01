

function render(onDoubleTapped = false, onLongPressed) {
    let typeModule = require('scripts/countdown/today')
    let typeView = typeModule.view
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
                    // 
                },
                ready: function() {
                    $delay(0.2, function() {
                        typeModule.refresh()
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

function destroy(){
}

module.exports = {
    render: render,
    destroy: destroy,
    showSetting: $app.env != $env.today ? require('scripts/countdown/app').render : false
}