const ALL_MODULE_LIST = require("scripts/constant").ALL_MODULE_LIST

const MENU_ALPHA = 0.7
let NOW_MODULE = $cache.get("NOW_MODULE") || 0
let moduleList = []


let setting = $cache.get("OPEN_MODULE_LIST") || ALL_MODULE_LIST
let moduleName = []
let moduleCHName = []

Object.keys(ALL_MODULE_LIST).forEach((item) => {
    if (setting[item][1]) {
        moduleName.push(item)
        moduleCHName.push(setting[item][0])
    }
})

if ($app.env != $env.today) {
    moduleName = moduleName.concat(["setting"])
    moduleCHName = moduleCHName.concat(["设置"])
}

if (NOW_MODULE >= moduleName.length) {
    NOW_MODULE = 0
}

let delayTimer = 0

function toggleModule(isToggle = true) {
    if (isToggle) {
        $device.taptic(0)
        getModule(NOW_MODULE).destroy()
        NOW_MODULE++
        tapMenu()
    }
    if (NOW_MODULE >= moduleName.length) {
        NOW_MODULE = 0
    }
    $cache.set("NOW_MODULE", NOW_MODULE)
    $("main-menu").index = NOW_MODULE
    $("main-content").views.map(i => i.remove());
    $("main-content").add(getModule(NOW_MODULE).render(toggleModule, toggleModule))
}

function getModuleView(index, isFirst = false) {
    if (!isFirst) {
        $device.taptic(0)
        getModule(NOW_MODULE).destroy()
        tapMenu()
    }
    NOW_MODULE = index
    $cache.set("NOW_MODULE", NOW_MODULE)
    return getModule(NOW_MODULE).render(toggleModule, toggleModule);
}

function renderMainView() {
    const mainUI = {
        type: "view",
        props: {
            id: "main-view",
            debugging: true,
        },
        views: [{
            type: "view",
            props: {
                id: "main-content"
            },
            layout: function(make) {
                make.left.right.top.inset(0)
                // make.bottom.inset(40)
                make.bottom.inset(0)
            }
        }, {
            type: "tab",
            props: {
                id: "main-menu",
                index: NOW_MODULE,
                alpha: $app.env == $env.today ? MENU_ALPHA : 1,
                hidden: $app.env == $env.today ? true : false,
                items: moduleCHName
            },
            layout: function(make, view) {
                make.centerX.equalTo(view.super.centerX)
                if ($app.env == $env.today) {
                    make.height.equalTo(18)
                    make.bottom.inset(2)
                } else {
                    make.height.equalTo(35)
                    make.bottom.inset(5)
                }
            },
            events: {
                changed(sender) {
                    $device.taptic(0);
                    tapMenu()
                    $("main-content").views.map(i => i.remove());
                    $("main-content").add(getModuleView(sender.index))
                },
                ready() {
                    $("main-content").add(getModuleView(NOW_MODULE, true))
                }
            }
        }],
        layout: $layout.fill
    }
    $ui.render(mainUI)
}

function getModule(index) {
    if (!moduleList[index]) {
        moduleList[index] = require(`scripts/${moduleName[index]}/main`)
    }
    return moduleList[index]
}

function debug(msg) {
    // $ui.toast(msg, 0.3)
}

function tapMenu() {
    if ($app.env != $env.today) return
    debug("tapMenu")
    if ($("main-menu").hidden) {
        $("main-menu").hidden = false
        $ui.animate({
            duration: 0.2,
            animation: function() {
                $("main-menu").alpha = MENU_ALPHA
            }
        })
    }
    let timer = ++delayTimer
    $delay(2, () => {
        debug("timer " + timer)
        if (timer == delayTimer) {
            $ui.animate({
                duration: 1,
                animation: function() {
                    $("main-menu").alpha = 0
                },
                completion: function() {
                    $("main-menu").hidden = true
                }
            })
        }
    })
    debug("delay")
}











// $ui.render({
//     type: "view",
//     props: {
//         id: "main-view",
//         debugging: true,
//     },
//     views: [{
//         type: "progress",
//         props: {
//             value: 0.7,
//             radius: 7,
//             progressColor: $color("#D847FF"),
//             trackColor: $color("#BF00F2")
//         },
//         layout: function(make, view) {
//             make.center.equalTo(view.super)
//             make.size.equalTo($size(240, 40))
//         },
//         events: {
//             tapped(sender){
//                 sender.progressColor = $color("#D847FF")
//                 sender.trackColor = $color("#BF00F2")
//             }
//         }
//     }]
// })





renderMainView()