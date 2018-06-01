const ALL_MODULE_LIST = require("scripts/constant").ALL_MODULE_LIST
let moduleList = {}

function render(onDoubleTapped = false, onLongPressed) {
    let setting = $cache.get("OPEN_MODULE_LIST") || ALL_MODULE_LIST
    let data = []
    Object.keys(ALL_MODULE_LIST).forEach((item)=>{
        data.push({
            setup: {
                text: "显示" + setting[item][0]
            },
            value: {
                on: setting[item][1],
                info: {
                    name: item
                }
            }
        })
    })
    return {
        props: {
            title: "Setting"
        },
        views: [{
            type: "list",
            props: {
                id: "function-and-setting",
                data: [{
                    title: "设置",
                    rows: data
                },{
                    title: "其它",
                    rows: [{
                        setup: {
                            text: "大爷，打赏一下呗"
                        },
                        value: {
                            hidden: true
                        }
                    }]
                }],
                template: {
                    props: {
                        accessoryType: 1
                    },
                    views: [{
                            type: "label",
                            props: {
                                id: "setup",
                                textColor: $color("#666666")
                            },
                            layout: function(make, view) {
                                make.centerY.equalTo(view.super)
                                make.left.inset(15)
                            }
                        },
                        {
                            type: "switch",
                            props: {
                                id: "value",
                                onColor: $color("#666666")
                            },
                            layout: function(make, view) {
                                make.centerY.equalTo(view.super)
                                make.right.inset(0)
                            },
                            events: {
                                changed: function(sender) {
                                    setting[sender.info.name][1] = sender.on
                                    console.log(setting)
                                    $cache.set("OPEN_MODULE_LIST", setting)
                                }
                            }
                        }
                    ]
                },
                footer: {
                    type: "label",
                    props: {
                        text: "Created by Hector.",
                        lines: 0,
                        font: $font(12),
                        textColor: $color("#AAAAAA"),
                        align: $align.center
                    }
                }
            },
            layout: function(make, view) {
                make.top.equalTo(0)
                make.left.bottom.right.equalTo(0)
            },
            events: {
                didSelect: function(sender, indexPath) {
                    hanldeMoreMenu(sender, indexPath)
                }
            }
        }],
        layout: $layout.fill
    }
}

function noop(){

}

function hanldeMoreMenu(listView, indexPath) {
    let item = listView.object(indexPath)
    console.log(item)
    if(item.setup.text.match(/^显示/)){
        if(!moduleList[item.value.info.name]){
            moduleList[item.value.info.name] = require(`scripts/${item.value.info.name}/main.js`).showSetting || noop
        }
        moduleList[item.value.info.name]()
        return;
    }
    switch (item.setup.text) {
        case "大爷，打赏一下呗":
            $ui.menu({
                items: ["领门店红包", "支付宝", "微信赞赏码", "微信扫码"],
                handler: function(title, idx) {
                    switch (idx) {
                        case 0:
                            $app.openURL("https://qr.alipay.com/c1x00930yn4nevj4tsi8n42")
                            break;
                        case 1:
                            $app.openURL("https://qr.alipay.com/tsx01693hzfivuzngtkyh3f")
                            break;
                        case 2:
                            $quicklook.open({
                                type: "jpg",
                                data: $file.read("assets/wechat_prize.jpg")
                            })
                            break;
                        case 3:
                            $photo.save({
                                data: $file.read("assets/wechat_prize.jpg"),
                                handler: function(success) {
                                    $ui.alert({
                                        title: "赞赏提示",
                                        message: "赞赏码已保存，前去微信扫一扫相册可好？",
                                        actions: [{
                                                title: "好的",
                                                handler: function() {
                                                    $app.openURL("weixin://scanqrcode")
                                                }
                                            },
                                            {
                                                title: "我再想想",
                                                handler: function() {
                                                    $ui.toast("那你自己去删照片吧")
                                                }
                                            }
                                        ]
                                    })
                                }
                            })
                            break;
                        default:
                            break;
                    }
                }
            })
            break;
        default:
            break;
    }
}

function destroy() {}

module.exports = {
    render: render,
    destroy: destroy
}