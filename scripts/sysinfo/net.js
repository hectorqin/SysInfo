var netView = {
    type: "view",
    props: {
        info: 0
    },
    layout: $layout.fill,
    views: [{
            type: "label",
            props: {
                text: "当前网络:",
                font: $font(13),
                align: $align.left
            },
            layout: function(make, view) {
                make.centerY.equalTo(view.super).offset(-30)
                make.centerX.equalTo(view.super).offset(-25)
            }
        }, {
            type: "label",
            props: {
                text: "内网IP:",
                font: $font(13),
                align: $align.left
            },
            layout: function(make, view) {
                make.top.equalTo(view.prev).offset(30)
                make.left.equalTo(view.prev)
            }
        },
        {
            type: "label",
            props: {
                text: "外网IP:",
                font: $font(13),
                align: $align.left
            },
            layout: function(make, view) {
                make.top.equalTo(view.prev).offset(30)
                make.left.equalTo(view.prev)
            }
        }, {
            type: "label",
            props: {
                id: "n",
                font: $font(13),
                align: $align.right
            },
            layout: function(make, view) {
                var wid = $device.info.screen.width / 2 - 35
                make.centerY.equalTo(view.super).offset(-30)
                make.right.equalTo(view.super).offset(-25)
                make.width.equalTo(wid)
            }
        }, {
            type: "label",
            props: {
                id: "Lip",
                font: $font(13),
                align: $align.right
            },
            layout: function(make, view) {
                make.top.equalTo(view.prev).offset(30)
                make.right.equalTo(view.prev)
            }
        }, {
            type: "label",
            props: {
                id: "Wip",
                font: $font(13),
                align: $align.right
            },
            layout: function(make, view) {
                make.centerY.equalTo(view.super).offset(30)
                make.right.equalTo(view.super).offset(-25)
            }
        }
    ]
}

function getIp() {
    $http.get({
        url: "http://ip.cn",
        header: { "User-Agent": "curl/1.0" },
        handler: function(resp) {
            var regex = /\b(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/
            var ip = regex.exec(resp.data)[1]
            $("Wip").text = ip
        }
    })
}

function refresh() {
    var type = $device.networkType
    var ifa_data = $network.ifa_data
    switch (type) {
        case 0:
            $("n").text = "无网络"
            $("Lip").text = "Null"
            $("Wip").text = "Null"
            break;
        case 1:
            $("n").text = $device.ssid.SSID
            $("Lip").text = $device.wlanAddress
            getIp()
            break;
        case 2:
            $("n").text = "蜂窝网络"
            $("Lip").text = "Null"
            getIp()
            break;
    }
}

function destroy() {

}

module.exports = {
    view: netView,
    refresh: refresh
}