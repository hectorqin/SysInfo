const data = [{
        title: {
            text: "小火箭开启"
        },
        icon: {
            src: "assets/17.png"
        },
        url: "shadowrocket://toggle?autoclose=no"
    },
    {
        title: {
            text: "小火箭关闭"
        },
        icon: {
            src: "assets/18.png"
        },
        url: "shadowrocket://toggle?autoclose=yes"
    },
    {
        title: {
            text: "Surge 开启"
        },
        icon: {
            src: "assets/5.png"
        },
        url: "surge:///start"
    },
    {
        title: {
            text: "Surge 关闭"
        },
        icon: {
            src: "assets/55.png"
        },
        url: "surge:///stop"
    },
    {
        title: {
            text: "Thor 开启"
        },
        icon: {
            src: "assets/7.png"
        },
        url: "thor://sniffer.gui/launch?filter_name="
    },
    {
        title: {
            text: "Thor 关闭"
        },
        icon: {
            src: "assets/77.png"
        },
        url: "thor://sniffer.gui/shutdown"
    },
    {
        title: {
            text: "X.cat Pro"
        },
        icon: {
            src: "assets/22.png"
        },
        url: "XcatPro://"
    },
    {
        title: {
            text: "X.cat"
        },
        icon: {
            src: "assets/21.png"
        },
        url: "Xcat://"
    },
    {
        title: {
            text: "p.cat"
        },
        icon: {
            src: "assets/88.png"
        },
        url: "wb2432070117://"
    },
    {
        title: {
            text: "白描"
        },
        icon: {
            src: "assets/23.png"
        },
        url: "baimiao://"
    },
    {
        title: {
            text: "Shu"
        },
        icon: {
            src: "assets/19.png"
        },
        url: "shu://"
    },
    {
        title: {
            text: "迅雷"
        },
        icon: {
            src: "assets/25.png"
        },
        url: "thunder://"
    },
    {
        title: {
            text: "支付宝扫码"
        },
        icon: {
            src: "assets/15.png"
        },
        url: "alipayqr://platformapi/startapp?saId=10000007"
    },
    {
        title: {
            text: "支付宝付款码"
        },
        icon: {
            src: "assets/16.png"
        },
        url: "alipayqr://platformapi/startapp?saId=20000056"
    },
    {
        title: {
            text: "微信扫码"
        },
        icon: {
            src: "assets/14.png"
        },
        url: "weixin://scanqrcode"
    },
    {
        title: {
            text: "Avgle"
        },
        icon: {
            src: "assets/24.png"
        },
        url: "jsbox://run?name=Avgle"
    },
    {
        title: {
            text: "青娱乐"
        },
        icon: {
            src: "assets/32.png"
        },
        url: "jsbox://run?name=%E9%9D%92%E5%A8%B1%E4%B9%90%20V3.0"
    },
    {
        title: {
            text: "V2porn"
        },
        icon: {
            src: "assets/33.png"
        },
        url: "jsbox://run?name=v2porn%E4%BC%9A%E5%91%98%E7%89%B9%E6%9D%83%E7%A0%B4%E8%A7%A3"
    },
    {
        title: {
            text: "彩云天气 Pro"
        },
        icon: {
            src: "assets/27.png"
        },
        url: "wb1404453313://"
    },
    {
        title: {
            text: "有道翻译官"
        },
        icon: {
            src: "assets/30.png"
        },
        url: "ydtranslator://"
    },
    {
        title: {
            text: "Documents"
        },
        icon: {
            src: "assets/31.png"
        },
        url: "fb435446596521711://"
    },
    {
        title: {
            text: "nplayer"
        },
        icon: {
            src: "assets/20.png"
        },
        url: "nplayer://"
    },
    {
        title: {
            text: "Picsew"
        },
        icon: {
            src: "assets/35.png"
        },
        url: "picsew://"
    },
    {
        title: {
            text: "QQ安全中心"
        },
        icon: {
            src: "assets/29.png"
        },
        url: "qmtoken://"
    },
]

function render(onDoubleTapped = false, onLongPressed = false) {
    return {
        props: {
            title: "Launcher"
        },
        views: [{
            type: "matrix",
            props: {
                columns: 6,
                // itemHeight: 50,
                square: true,
                spacing: 6,
                template: [{
                        type: "blur",
                        props: {
                            radius: 15.0,
                            style: 0 // 0 ~ 5clear
                        },
                        layout: $layout.fill
                    },
                    {
                        type: "label",
                        props: {
                            id: "title",
                            textColor: $color("gray"),
                            bgcolor: $color("clear"),
                            font: $font(7)
                        },
                        layout(make, view) {
                            make.bottom.inset(4)
                            make.centerX.equalTo(view.super)
                        }
                    },
                    {
                        type: "image",
                        props: {
                            id: "icon",
                            bgcolor: $color("clear")
                        },
                        layout(make, view) {
                            make.top.inset(4)
                            make.centerX.equalTo(view.super)
                            make.size.equalTo(35)
                        }
                    }
                ],
                data: data
            },
            layout: function(make, view) {
                make.left.right.inset(8)
                if($app.env == $env.today){
                    make.centerY.equalTo(view.super).offset(1)
                    make.height.equalTo(120)
                }else{
                    make.centerY.equalTo(view.super)
                    make.height.equalTo(240)
                }
            },
            // layout: $layout.fill,
            events: {
                didSelect(sender, indexPath, data) {
                    $app.openURL(data.url)
                }
            }
        }],
        layout: $layout.fill,
        events: {
            doubleTapped: function(sender) {
                onDoubleTapped && onDoubleTapped(sender)
            },
            longPressed: function(sender) {
                onLongPressed && onLongPressed(sender)
            }
        }
    }
}

function destroy(){
}

module.exports = {
    render: render,
    destroy: destroy,
    showSetting: false
}