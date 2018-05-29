function isChinese() {
  var lan = $app.info.locale.substring(0, 2)
  return lan.indexOf("zh") != -1
}

function shadow(view) {
  var layer = view.runtimeValue().invoke("layer")
  layer.invoke("setCornerRadius", 5)
  layer.invoke("setShadowOffset", $size(3, 3))
  layer.invoke("setShadowColor", $color("darkGray").runtimeValue().invoke("CGColor"))
  layer.invoke("setShadowOpacity", 0.5)
  layer.invoke("setShadowRadius", 5)
}

function attributedString(title, tips) {
  var string = $objc("NSMutableAttributedString").invoke("alloc.initWithString", title + "\n" + tips)
  string.invoke("addAttribute:value:range:", "NSFont", $font(13), $range(title.length + 1, tips.length))
  string.invoke("addAttribute:value:range:", "NSColor", $color("darkGray"), $range(title.length + 1, tips.length))

  return string.rawValue()
}

module.exports = {
  isChinese: isChinese(),
  shadow: shadow,
  text: attributedString
}