var func = require("scripts/progress/general")

Date.prototype.isLeapYear = function() {
    var year = this.getFullYear()
    if ((year & 3) != 0) return false
    return ((year % 100) != 0 || (year % 400) == 0)
}

Date.prototype.getDaysOfYear = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334]
    var mn = this.getMonth()
    var dn = this.getDate()
    var dayOfYear = dayCount[mn] + dn
    if (mn > 1 && this.isLeapYear()) dayOfYear++
        return dayOfYear
}

Date.prototype.holiday = function(holiday, tips) {
    var mn = this.getMonth()
    var dn = this.getDate()
    var reg = new RegExp(dn + "(?=\||$)")
    if (holiday[mn]) {
        for (var i of holiday[mn]) {
            if (reg.test(i.date)) {
                return tips["on_holiday"] + i.event
            } else if (i.date.match(/^\d+/)[0] > dn) {
                // Find nearest holiday from this month
                var count = i.date.match(/^\d+/)[0] - dn
                var text = tips["next_holiday"]
                if (count === 1) text = text.replace(/(day)s/, "$1")
                return text.replace("$$", count) + i.event
            }
        }
    }
    // Find nearest holiday from next month
    for (var n = mn + 1; n < 12; n++) {
        if (holiday[n]) {
            var year = this.getFullYear()
            var start = new Date(year, mn, dn)
            var end = new Date(year, n, holiday[n][0].date.match(/^\d+/)[0])
            // 1000*60*60*24
            var count = (end - start) / 86400000
            var text = tips["next_holiday"]
            if (count === 1) text.replace(/(day)s/, "$1")
            return text.replace("$$", count) + holiday[n][0].event
        }
    }
    return tips["no_more_holiday"]
}

function generateLabels(texts, month) {
    var data = []
    for (let i in texts) {
        var text = (i == 0 || i == 11 || i == month) ? texts[i] : ""
        data.push({
            "day-year": {
                text: text
            }
        })
    }
    return data
}

function generateData(now) {
    const HOLIDAY = func.isChinese ? {
        "0": [{
            "date": "1",
            "event": "元旦"
        }],
        "1": [{
            "date": "15|16|17|18|19|20|21",
            "event": "春节"
        }],
        "3": [{
                "date": "5|6|7",
                "event": "清明节"
            },
            {
                "date": "29|30",
                "event": "劳动节"
            }
        ],
        "4": [{
            "date": "1",
            "event": "劳动节"
        }],
        "5": [{
            "date": "16|17|18",
            "event": "端午节"
        }],
        "8": [{
            "date": "22|23|24",
            "event": "中秋节"
        }],
        "9": [{
            "date": "1|2|3|4|5|6|7",
            "event": "国庆节"
        }]
    } : {
        "0": [{
            "date": "1",
            "event": "New Year's Day"
        }],
        "1": [{
            "date": "15|16|17|18|19|20|21",
            "event": "Spring Festival"
        }],
        "3": [{
                "date": "5|6|7",
                "event": "Tomb Sweeping Day"
            },
            {
                "date": "29|30",
                "event": "May Day"
            }
        ],
        "4": [{
            "date": "1",
            "event": "May Day"
        }],
        "5": [{
            "date": "16|17|18",
            "event": "Dragon Boat Festival"
        }],
        "8": [{
            "date": "22|23|24",
            "event": "Mid-Autumn Festival"
        }],
        "9": [{
            "date": "1|2|3|4|5|6|7",
            "event": "National Day"
        }]
    }

    const TIPS = func.isChinese ? {
        "on_holiday": "在假日中：",
        "next_holiday": "还有 $$ 天到下一假期：",
        "no_more_holiday": "今年的假期已经过完了"
    } : {
        "on_holiday": "On holiday: ",
        "next_holiday": "$$ days left to: ",
        "no_more_holiday": "No more holiday this year"
    }

    const LABELS = func.isChinese ? ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"] : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    var tips = now.holiday(HOLIDAY, TIPS)
    var labels = generateLabels(LABELS, now.getMonth())
    var newPercentage = now.getDaysOfYear() * 1.0 / (now.isLeapYear ? 366 : 365)

    var data = {
        cacheDate: now.getDate(),
        tips: tips,
        labels: labels,
        percentage: newPercentage
    }

    $cache.set("progress-year-data", data)
    return data
}

var now = new Date()
var data = $cache.get("progress-year-data") || generateData(now)
if (now.getDate() != data.cacheDate) {
    data = generateData(now)
}

var yearProgress = {
    type: "view",
    props: {
        info: 1
    },
    layout: $layout.fill,
    views: [{
            type: "view",
            props: {
                id: "progress-year"
            },
            layout: function(make, view) {
                var sup = view.super
                make.height.equalTo(15)
                make.centerY.equalTo(sup).offset(15)
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
                        id: "current-year",
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
                        make.width.equalTo(sup).multipliedBy(data.percentage)
                    }
                }]
            }]
        },
        {
            type: "view",
            props: {
                id: "frame-year"
            },
            layout: function(make, view) {
                var current = $("current-year")
                make.size.equalTo($size(40, 25))
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
                            text: parseInt(data.percentage * 100) + "%",
                            align: $align.center,
                            font: $font("bold", 13)
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
                        id: "day-year",
                        align: $align.center,
                        font: $font(13),
                        autoFontSize: true,
                        textColor: $color("darkGray")
                    },
                    layout: $layout.fill
                }],
                itemHeight: 20,
                columns: 12,
                data: data.labels
            },
            layout: function(make, view) {
                var pre = $("progress-year")
                make.height.equalTo(20)
                make.top.equalTo(pre.bottom)
                make.left.equalTo(pre)
                make.right.equalTo(pre) //.offset(1)
            }
        },
        {
            type: "label",
            props: {
                lines: 2,
                font: $font("bold", 16),
                align: $align.center,
                attributedText: func.text($l10n("year_title"), data.tips)
            },
            layout: function(make) {
                var pre = $("progress-year")
                var ppre = $("frame-year")
                make.left.equalTo(pre)
                make.right.equalTo(pre)
                make.bottom.equalTo(ppre.top).offset(-2)
            }
        }
    ]
}

function refresh() {

}

module.exports = {
    view: yearProgress,
    refresh: refresh
}