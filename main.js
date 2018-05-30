let NOW_MODULE = $cache.get("NOW_MODULE") || 0
let moduleList = []
let moduleName = ["progress", "sysinfo", "launcher"]
let moduleCHName = ["进度", "系统", "启动器"]

function toggleModule(isToggle=true) {
    if(isToggle){
        $device.taptic(0)
        getModule(NOW_MODULE).destroy()
        NOW_MODULE ++
    }
    if(NOW_MODULE >= moduleName.length){
        NOW_MODULE = 0
    }
    $cache.set("NOW_MODULE", NOW_MODULE)
    $("content").views.map(i => i.remove());
    $("content").add(getModule(NOW_MODULE).render(toggleModule, toggleModule))
}

function getModuleView(index, isFirst=false){
    if(!isFirst){
        $device.taptic(0)
        getModule(NOW_MODULE).destroy()
    }
    NOW_MODULE = index
    $cache.set("NOW_MODULE", NOW_MODULE)
    return getModule(NOW_MODULE).render(toggleModule, toggleModule);
}

function renderMainView() {
    const mainUI = {
        type: "view",
        props: {
            debugging: true,
        },
        views: [{
            type: "view",
            props: {
                id: "content"
            },
            layout: function(make) {
                make.left.right.top.inset(0)
                // make.bottom.inset(40)
                make.bottom.inset(0)
            }
        }, {
            type: "tab",
            props: {
                id: "menu",
                index: NOW_MODULE,
                alpha: $app.env == $env.today ? 0.3 : 1,
                items: moduleCHName
            },
            layout: function(make, view) {
                make.centerX.equalTo(view.super.centerX)
                if($app.env == $env.today){
                    make.height.equalTo(18)
                    make.bottom.inset(2)
                }else{
                    make.height.equalTo(35)
                    make.bottom.inset(5)
                }
            },
            events: {
                changed(sender) {
                    $device.taptic(0);
                    $("content").views.map(i => i.remove());
                    $("content").add(getModuleView(sender.index))
                },
                ready() {
                    $("content").add(getModuleView(NOW_MODULE, true))
                }
            }
        }],
        layout: $layout.fill
    }
    $ui.render(mainUI)
}

function getModule(index) {
    if(!moduleList[index]){
        moduleList[index] = require(`scripts/${moduleName[index]}/main`)
    }
    return moduleList[index]
}

renderMainView()