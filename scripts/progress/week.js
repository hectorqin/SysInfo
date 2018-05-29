var func = require("scripts/progress/general")

const EMOTION = {
    "1": "😣",
    "2": "😔",
    "3": "😟",
    "4": "🙁",
    "5": {
        "0": "😐",
        "1": "🤓"
    },
    "6": "😎",
    "0": {
        "0": "😌",
        "1": "😑"
    }
}

const TIPS = func.isChinese ? {
    "1": "离周末还有 $d$ 天，好好工作吧",
    "2": "离周末还有 $d$ 天，好好工作吧",
    "3": "离周末还有 $d$ 天，好好工作吧",
    "4": "离周末还有 $d$ 天，好好工作吧",
    "5": {
        "0": "离周末只有不足 $h-5$ 小时了",
        "1": "美好的周末即将开始"
    },
    "6": "好好享受周末才不辜负一周的工作",
    "0": {
        "0": "周末还剩 $h-$ 小时，管他呢",
        "1": "周末已不足 $h+$ 小时了"
    }
} : {
    "1": "$d$ days left to the weekend, back to work",
    "2": "$d$ days left to the weekend, back to work",
    "3": "$d$ days left to the weekend, back to work",
    "4": "$d$ days left to the weekend, back to work",
    "5": {
        "0": "Only less than $h-5$ hours left to the weekend",
        "1": "A good weekend starts soon"
    },
    "6": "Enjoy the weekend and live up to the hard work",
    "0": {
        "0": "It remains $h-$ hours of the weekend, let it go",
        "1": "The weekend is less than $h+$ hours"
    }
}

const texts = func.isChinese ? ["一", "二", "三", "四", "五", "六", "日"] : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

const fullWeek = 10080 //60*24*7

Date.prototype.getMinutesOfWeek = function() {
    const fullDay = 1440 //60*24
    var day = this.getDay() === 0 ? 7 : this.getDay()
    var time = this.getHours() * 60 + this.getMinutes() + (day - 1) * fullDay
    return time
}

Date.prototype.emoji = function(currentWeek) {
    var day = this.getDay()
    var hour = this.getHours()
    var emotion = EMOTION[day]
    var tips = TIPS[day]
    if (day === 5) {
        emotion = emotion[parseInt(hour / 18)]
        tips = tips[parseInt(hour / 18)]
    } else if (day === 0) {
        emotion = emotion[parseInt(hour / 21)]
        tips = tips[parseInt(hour / 21)]
    }

    var leftDay = parseInt((fullWeek - currentWeek) / 1440) //60*24
    var leftHour = (fullWeek - currentWeek) % 1440 / 60

    var match = tips.match(/\$(.+?)(\d*)\$/)
    if (match) {
        var str = ""
        switch (match[1]) {
            case "d":
                str = leftDay - 1
                break
            case "h+":
                str = Math.ceil(leftHour)
                break
            case "h-":
                str = Math.floor(leftHour)
                if (match[2]) str -= match[2]
                break
        }
        tips = tips.replace(match[0], str.toString())
        if (str === 1) {
            tips = tips.replace(/(day|hour)s/, "$1")
        }
    }

    return {
        "emotion": emotion,
        "tips": tips
    }
}

var now = new Date
var week = now.getMinutesOfWeek()
var text = now.emoji(week)
var newPercentage = week / fullWeek
var oldPercentage = $cache.get("progress-week") || newPercentage
$cache.set("progress-week", newPercentage)

var weekProgress = {
    type: "view",
    props: {
        info: 0
    },
    layout: $layout.fill,
    views: [{
            type: "view",
            props: {
                id: "progress-week"
            },
            layout: function(make, view) {
                var sup = view.super
                make.height.equalTo(15)
                make.centerY.equalTo(sup).offset(20)
                make.left.right.inset(25)
            },
            views: [{
                type: "view",
                props: {
                    bgcolor: $rgba(128, 128, 128, 0.2),
                    smoothRadius: 8
                },
                layout: $layout.fill,
                views: [{
                    type: "gradient",
                    props: {
                        id: "current-week",
                        colors: [
                            $rgba(128, 128, 128, 0.6),
                            $rgba(128, 128, 128, 0.4),
                            $rgba(128, 128, 128, 0.2)
                        ],
                        locations: [0.0, 0.5, 1.0],
                        startPoint: $point(0, 1),
                        endPoint: $point(1, 1)
                    },
                    layout: function(make, view) {
                        var sup = view.super
                        make.left.top.bottom.inset(0)
                        make.width.equalTo(sup).multipliedBy(oldPercentage)
                    }
                }]
            }]
        },
        {
            type: "view",
            props: {
                id: "frame-week"
            },
            layout: function(make, view) {
                var current = $("current-week")
                make.size.equalTo($size(30, 35))
                make.centerX.equalTo(current.right)
                make.bottom.equalTo(current.centerY).offset(3)
            },
            views: [{
                    type: "canvas",
                    events: {
                        draw: function(view, ctx) {
                            var width = view.frame.width / 2
                            var height = view.frame.height
                            var top = height
                            var bottom = 0
                            ctx.fillColor = $rgba(255, 255, 255, 1)
                            ctx.moveToPoint(width, top)
                            ctx.addLineToPoint(width - 5, bottom)
                            ctx.addLineToPoint(width + 5, bottom)
                            ctx.fillPath()
                        }
                    },
                    layout: function(make) {
                        make.height.equalTo(5)
                        make.left.bottom.right.inset(0)
                    }
                },
                {
                    type: "view",
                    props: {
                        bgcolor: $rgba(255, 255, 255, 0.8)
                    },
                    layout: function(make, view) {
                        var pre = view.prev
                        make.bottom.equalTo(pre.top)
                        make.left.top.right.inset(0)
                        func.shadow(view)
                    },
                    views: [{
                        type: "label",
                        props: {
                            text: text.emotion,
                            align: $align.center,
                            font: $font(20)
                        },
                        layout: $layout.fill
                    }]
                }
            ]
        },
        {
            type: "matrix",
            props: {
                bgcolor: $color("clear"),
                scrollEnabled: false,
                selectable: false,
                template: [{
                    type: "label",
                    props: {
                        id: "day-week",
                        align: $align.center,
                        font: $font(13),
                        autoFontSize: true,
                        textColor: $color("darkGray")
                    },
                    layout: $layout.fill
                }],
                itemHeight: 20,
                columns: 7,
                data: generateLabels(texts)
            },
            layout: function(make) {
                var pre = $("progress-week")
                make.height.equalTo(20)
                make.top.equalTo(pre.bottom)
                make.left.equalTo(pre)
                make.right.equalTo(pre).offset(1)
            }
        },
        {
            type: "label",
            props: {
                lines: 2,
                font: $font("bold", 16),
                align: $align.center,
                attributedText: func.text($l10n("week_title"), text.tips),
            },
            layout: function(make) {
                var pre = $("progress-week")
                var ppre = $("frame-week")
                make.left.equalTo(pre)
                make.right.equalTo(pre)
                make.bottom.equalTo(ppre.top).offset(-2)
            }
        }
    ]
}

function generateLabels(texts) {
    var data = []
    for (let i in texts) {
        data.push({
            "day-week": {
                text: texts[i]
            }
        })
    }
    return data
}

function refresh() {
    $("current-week").updateLayout(function(make, view) {
        var sup = view.super
        make.width.equalTo(sup).multipliedBy(newPercentage)
    })
    $ui.animate({
        duration: 0.2,
        options: 2 << 16,
        animation: function() {
            $("frame-week").super.runtimeValue().invoke("layoutIfNeeded")
        }
    })
}

module.exports = {
    view: weekProgress,
    refresh: refresh
}