let NOW_MODULE = $cache.get("NOW_MODULE") || 0
let moduleList = []
let moduleName = ["progress", "sysinfo"]

function toggleModule(isToggle=true) {
    if(isToggle){
        $device.taptic(0)
        getModule(NOW_MODULE).destroy()
        NOW_MODULE ++
    }
    if(NOW_MODULE >= moduleName.length){
        NOW_MODULE = 0
    }
    getModule(NOW_MODULE).render(toggleModule, toggleModule);
    $cache.set("NOW_MODULE", NOW_MODULE)
}

function getModule(index) {
    if(!moduleList[index]){
        moduleList[index] = require(`scripts/${moduleName[index]}/main`)
    }
    return moduleList[index]
}

toggleModule(false)