<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>plot</title>
  <script src = "js/plot.js"></script>
  <link rel="stylesheet" href="css/ui.css">
</head>
<body>

<canvas id="canvas1" width="720" height="480"
  class="main-canvas"
>Error: HTML canvas not supported.</canvas>

<table id="menu">
<tr><td>
<input type="button" value="plot" onclick="main()">
<input type="button" value="&equiv;" onclick="switch_hud()">
<input type="button" value="+" onclick="xyscale_inc()"> 
<input type="button" value="&minus;" onclick="xyscale_dec()">
<br>
<input type="text" id="inputf"
onkeyup="keys(event);" value="y=x, x^2+y^2=1">

<br>
<div id="out" class="mono">
</div>
<div class="hud" id="hud">
<input type="button" value="x+" onclick="xscale_inc()">
<input type="button" value="x&minus;" onclick="xscale_dec()">
<input type="button" value="y+" onclick="yscale_inc()">
<input type="button" value="y&minus;" onclick="yscale_dec()">
&nbsp;<a href="doc.htm">help</a>
<br><br>
<input type="button" value="calculate" onclick="calc()">
<input type="text" id="input-calc" onkeyup="keys_calc(event);">
<div id="calc-out" class="mono"></div>
</div>
</table>

</body>
</html>
