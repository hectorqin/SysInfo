var wid = $device.info.screen.width
var day_clac = (new Date()).toLocaleDateString()
var day_dis = displaydate(day_clac)
var DEFAULT_ = [day_dis, day_clac, "", "", ""]
const SETTING_FILE='countdown-setting.conf'
let file = $file.read(SETTING_FILE)
let SETTING_ = (typeof file == "undefined") ? JSON.parse(JSON.stringify(DEFAULT_)) : JSON.parse(file.string)

let preview_ = {
    type: "view",
    props: {
        id: "preview_",
    },
    layout: $layout.fill,
    views: [{
        type: "progress",
        props: {
            id: "target_progress",
            value: bg_length()[0],
            radius: 7,
            progressColor: $color(SETTING_[3]),
            trackColor: $color(SETTING_[4])
        },
        layout: function(make, view) {
            make.centerY.equalTo(view.super).offset(-5)
            make.right.equalTo(view.super).inset(15)
            make.size.equalTo($size(bg_length()[1], 40))
        }
    },{
        type: "label",
        props: {
            id: "target_text",
            text: SETTING_[2],
            font: $font("bold", 25)
        },
        layout: function(make, view) {
            make.top.equalTo(view.super).offset(28)
            make.left.equalTo(view.super).offset(20)
        }
    }, {
        type: "label",
        props: {
            id: "target_key_",
            text: clacdays(SETTING_[1])[1],
            font: $font(20),
            color: $color("#545455")
        },
        layout: function(make, view) {
            make.top.equalTo(view.super).offset(35)
            make.left.equalTo(view.prev.right).offset(2)
        }
    }, {
        type: "label",
        props: {
            id: "target_date",
            text: clacdays(SETTING_[1])[2] + "日：" + SETTING_[0].replace(/[年|月]/g, "-").replace(/日/, ""),
            color: $color("#545455"),
            font: $font(13)
        },
        layout: function(make, view) {
            make.top.equalTo(view.prev.bottom).offset(2)
            make.left.equalTo(view.super).offset(20)
        }
    }, {
        type: "label",
        props: {
            id: "day_distance",
            color: $color("white"),
            font: $font("AvenirNext-DemiBold", 30),
        },
        layout: function(make, view) {
            make.centerY.equalTo(view.super).offset(-4)
            make.right.equalTo(view.super.right).offset(-58)
        }
    }, {
        type: "label",
        props: {
            text: "天",
            color: $color("white"),
            font: $font(23),
        },
        layout: function(make, view) {
            make.centerY.equalTo(view.super).offset(-6)
            make.right.equalTo(view.super.right).offset(-23)
        }
    }]
}

let countdownView = {
    props: {},
    layout: $layout.fill,
    views: [{
        type: "view",
        layout: function(make, view) {
            make.center.equalTo(view.super)
            make.size.equalTo($size(wid - 4, 120))
        },
        views: [preview_]
    }]
}

//将日期显示为自然语言格式
function displaydate(date) {
    var regex = /\b.*?\s.*?\s/
    var date_ = $detector.date(date)
    var date = regex.exec(date_)[0]
    return date
}

//计算天数
function clacdays(date) {
    var d_1 = new Date(SETTING_[1])
    var d_2 = new Date(day_clac)
    var key_ = d_1 >= d_2 ? "还有" : "已经"
    var key_1 = d_1 >= d_2 ? "目标" : "起始"
    var days_ = Math.abs(d_1 - d_2) / 86400000
    return [days_, key_, key_1]
}

function bg_length() {
    var num_ = clacdays(SETTING_[1])[0]
    if (num_ < 10) {
        return [0.475, 68]
    } else if (num_ < 100) {
        return [0.585, 86]
    } else if (num_ < 1000) {
        return [0.645, 103]
    } else if (num_ < 10000) {
        return [0.7, 122]
    } else if (num_ < 100000) {
        return [0.735, 140]
    }
}

function refresh() {
    file = $file.read(SETTING_FILE)
    SETTING_ = (typeof file == "undefined") ? JSON.parse(JSON.stringify(DEFAULT_)) : JSON.parse(file.string)
    console.log(SETTING_)
    let bgConfig = bg_length()
    $("target_progress").value = bgConfig[0];
    // TODO 更新颜色bug
    // $("target_progress").progressColor = $color(SETTING_[3]);
    // $("target_progress").trackColor = $color(SETTING_[4]);
    $("target_progress").updateLayout(function(make) {
        make.size.equalTo($size(bgConfig[1], 40))
    })
    $("target_text").text = SETTING_[2]
    $("target_key_").text = SETTING_[1]
    $("target_date").text = clacdays(SETTING_[1])[2] + "日：" + SETTING_[0].replace(/[年|月]/g, "-").replace(/日/, "")
    $("day_distance").text = clacdays(SETTING_[1])[0]

    //限制事件字符长度
    var lth = (SETTING_[2]).replace(/[^\x00-\xff]/g, "01").length
    if (lth > 14) {
        $("target_text").updateLayout(function(make) {
            make.width.equalTo(180)
        })
    }
}

module.exports = {
    view: countdownView,
    refresh: refresh
}