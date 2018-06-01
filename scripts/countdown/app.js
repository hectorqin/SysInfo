var wid = $device.info.screen.width
var day_clac = (new Date()).toLocaleDateString()
var day_dis = displaydate(day_clac)
let DEFAULT_ = [day_dis, day_clac, "", "#409EF6", "#2C86D9"]
let SETTING_ = {}
const SETTING_FILE='countdown-setting.conf'

function render() {
    let file = $file.read(SETTING_FILE)
    SETTING_ = (typeof file == "undefined") ? JSON.parse(JSON.stringify(DEFAULT_)) : JSON.parse(file.string)
    console.log(SETTING_)
    //设置缓存
    setcache(SETTING_[1])

    var text_ = {
        type: "input",
        props: {
            id: "text_",
            type: $kbType.default,
            text: SETTING_[2] === "" ? "" : (SETTING_[2]),
            font: $font("bold", 17),
            textColor: $color("#545455"),
            bgcolor: $color("clear"),
            placeholder: "点击输入事件名称"
        },
        layout: function(make, view) {
            make.top.equalTo(view.super).offset(10)
            make.left.equalTo(view.super).offset(52)
            make.size.equalTo($size(wid - 70, 40))
        },
        events: {
            returned: function(sender) {
                sender.blur()
                savesetting(2, sender.text)
            }
        }
    }

    var date_ = {
        type: "label",
        props: {
            id: "date_",
            text: (SETTING_[0] === "" | SETTING_[0] === null ? day_dis : SETTING_[0]),
            font: $font("bold", 17),
            color: $color("#545455")
        },
        layout: function(make, view) {
            make.top.equalTo(view.super).offset(10)
            make.left.equalTo(view.super).offset(62)
            make.size.equalTo($size(wid - 70, 40))
        },
        events: {
            tapped: function() {
                pickdate()
            }
        }
    }
    var theme_ = [{
            type: "label",
            props: {
                id: "them_",
                text: "选择主题颜色",
                font: $font("bold", 17),
                color: $color("#545455")
            },
            layout: function(make, view) {
                make.top.equalTo(view.super).offset(10)
                make.left.equalTo(view.super).offset(62)
                make.size.equalTo($size(wid - 70, 40))
            },
            events: {
                tapped: function() {
                    themes()
                }
            }
        },
        {
            type: "view",
            props: {
                id: "theme_c",
                radius: 5,
                bgcolor: $color(SETTING_[3]),
            },
            layout: function(make, view) {
                make.centerY.equalTo(view.super)
                make.right.equalTo(view.super).offset(-30)
                make.size.equalTo($size(60, 30))
            },
            views: [{
                tpye: "view",
                props: {
                    id: "theme_c1",
                    bgcolor: $color(SETTING_[4])
                },
                layout: function(make, view) {
                    make.top.equalTo(view.super)
                    make.left.equalTo(view.super).offset(30)
                    make.size.equalTo($size(30, 30))
                }
            }]
        }
    ]

    var save_ = {
        type: "button",
        props: {
            id: "save_",
            title: "保存",
            bgcolor: $color(SETTING_[4])
        },
        layout: function(make, view) {
            make.top.equalTo(view.super).offset(10)
            make.left.equalTo(view.super).offset(50)
            make.size.equalTo($size(wid - 100, 40))
        },
        events: {
            tapped: function() {
                savesetting(0, $("date_").text)
                savesetting(1, $cache.get("data_c")[1])
                savesetting(2, $("text_").text)
                $ui.pop()
            }
        }
    }

    $ui.push({
        title: "倒数日设置",
        views: [{
            type: "view",
            props: {
                bgcolor: $color("#F9F9F9"),
                radius: 5,
                borderWidth: 1,
                borderColor: $color("#C1C1C0")
            },
            layout: function(make, view) {
                make.top.equalTo(view.super).offset(20)
                make.centerX.equalTo(view.super)
                make.size.equalTo($size(wid - 30, 180))
            },
            views: [{
                    //icon
                    type: "button",
                    props: {
                        icon: $icon("057", $color("#C1C1C0")),
                        bgcolor: $color("clear")
                    },
                    layout: function(make, view) {
                        make.top.equalTo(view.super).offset(18)
                        make.left.equalTo(view.super).offset(10)
                    }
                }, {
                    //事件输入
                    type: "view",
                    layout: function(make, view) {
                        make.top.equalTo(view.super).offset(0)
                        make.size.equalTo($size(wid, 60))
                    },
                    views: [text_]
                },
                {
                    //line
                    type: "view",
                    props: {
                        bgcolor: $color("#C1C1C0")
                    },
                    layout: function(make, view) {
                        make.top.equalTo(view.super).offset(60)
                        make.size.equalTo($size(wid, 1))
                    }
                },
                {
                    //icon
                    type: "button",
                    props: {
                        icon: $icon("125", $color("#C1C1C0")),
                        bgcolor: $color("clear")
                    },
                    layout: function(make, view) {
                        make.top.equalTo(view.super).offset(78)
                        make.left.equalTo(view.super).offset(10)
                    }
                },
                {
                    //时间选择
                    type: "view",
                    layout: function(make, view) {
                        make.top.equalTo(view.super).offset(60)
                        make.size.equalTo($size(wid, 60))
                    },
                    views: [date_]
                }, {
                    //line
                    type: "view",
                    props: {
                        bgcolor: $color("#C1C1C0")
                    },
                    layout: function(make, view) {
                        make.top.equalTo(view.super).offset(120)
                        make.size.equalTo($size(wid, 1))
                    }
                },
                {
                    //icon
                    type: "button",
                    props: {
                        icon: $icon("151", $color("#C1C1C0")),
                        bgcolor: $color("clear")
                    },
                    layout: function(make, view) {
                        make.top.equalTo(view.super).offset(138)
                        make.left.equalTo(view.super).offset(10)
                    }
                }, {
                    type: "view",
                    layout: function(make, view) {
                        make.top.equalTo(view.super).offset(120)
                        make.size.equalTo($size(wid, 60))
                    },
                    views: theme_
                }
            ]
        }, {
            //TIPS
            type: "label",
            props: {
                text: "事件名称请尽量简洁并控制在6个中文字符或16个英文字符以内。\n天数虽然没有做限制，但是最好还是控制在5位数以内。",
                lines: 4,
                font: $font(14),
                color: $color("gray")
            },
            layout: function(make, view) {
                make.top.equalTo(view.super).offset(210)
                make.centerX.equalTo(view.super)
                make.width.equalTo(wid - 60)
            }
        }, {
            //保存按钮
            type: "view",
            layout: function(make, view) {
                make.top.equalTo(view.super).offset(300)
                make.size.equalTo($size(wid, 60))
            },
            views: [save_]
        }]
    })
}

//选择日期并写入缓存
function pickdate() {
    $pick.date({
        props: {
            mode: 1,
            date: new Date($cache.get("data_c")[1])
        },
        events: {
            changed: function(sender) {
                var dis_date = displaydate(sender.date)
                var clc_date = (sender.date).toLocaleDateString()
                $("date_").text = dis_date
                $cache.set("data_c", {
                    "0": dis_date,
                    "1": clc_date
                })
            }
        }
    })
}

//将日期显示为自然语言格式
function displaydate(date) {
    var regex = /\b.*?\s.*?\s/
    var date_ = $detector.date(date)
    var date = regex.exec(date_)[0]
    return date
}

//保存设置
function savesetting(section, value) {
    SETTING_[section] = value
    $file.write({
        data: $data({ string: JSON.stringify(SETTING_) }),
        path: SETTING_FILE
    })
}

//设置缓存以实时更新DatePicker
function setcache(date) {
    $cache.set("data_c", {
        "1": new Date(date)
    })
}

//主题选择
function themes() {
    $pick.data({
        props: {
            items: [
                ["蓝·Blue", "橙·Orange", "紫·Purple", "绿·Green", "黑·Black"]
            ]
        },
        handler: function(data) {
            n = data[0]
            if (n === "蓝·Blue") {
                c_1 = "#409EF6"
                c_2 = "#2C86D9"
            } else if (n === "橙·Orange") {
                c_1 = "#FF9F01"
                c_2 = "#FA8D01"
            } else if (n === "紫·Purple") {
                c_1 = "#D847FF"
                c_2 = "#BF00F2"
            } else if (n === "绿·Green") {
                c_1 = "#289157"
                c_2 = "#227447"
            } else if (n === "黑·Black") {
                c_1 = "#666666"
                c_2 = "#494949"
            }
            savesetting(3, c_1)
            savesetting(4, c_2)
            $("theme_c").bgcolor = $color(c_1)
            $("theme_c1").bgcolor = $color(c_2)
            $("save_").bgcolor = $color(c_2)
        }
    })
}

module.exports = {
    render: render
}