Add-Type -AssemblyName System.Drawing

function Draw-Icon {
  param(
    [int]$IconSize,
    [string]$OutPath,
    [bool]$Maskable
  )

  $bmp = New-Object System.Drawing.Bitmap $IconSize, $IconSize
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias

  $purple = [System.Drawing.Color]::FromArgb(255, 124, 58, 237)
  $indigo = [System.Drawing.Color]::FromArgb(255, 79, 70, 229)
  $rect = New-Object System.Drawing.Rectangle 0, 0, $IconSize, $IconSize
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, $purple, $indigo, 45.0

  if ($Maskable) {
    $g.FillRectangle($brush, 0, 0, $IconSize, $IconSize)
  } else {
    $radius = [int]($IconSize * 0.21)
    $pathObj = New-Object System.Drawing.Drawing2D.GraphicsPath
    $d = $radius * 2
    $pathObj.AddArc(0, 0, $d, $d, 180, 90)
    $pathObj.AddArc($IconSize - $d, 0, $d, $d, 270, 90)
    $pathObj.AddArc($IconSize - $d, $IconSize - $d, $d, $d, 0, 90)
    $pathObj.AddArc(0, $IconSize - $d, $d, $d, 90, 90)
    $pathObj.CloseFigure()
    $g.FillPath($brush, $pathObj)
    $pathObj.Dispose()
  }

  $bubbleW = [int]($IconSize * 0.72)
  $bubbleH = [int]($IconSize * 0.42)
  $bx = [int](($IconSize - $bubbleW) / 2)
  $by = [int]($IconSize * 0.22)

  $bubbleRect = New-Object System.Drawing.Rectangle $bx, $by, $bubbleW, $bubbleH
  $bubblePath = New-Object System.Drawing.Drawing2D.GraphicsPath
  $br = [int]($bubbleH * 0.22)
  $bd = $br * 2
  $bubblePath.AddArc($bubbleRect.X, $bubbleRect.Y, $bd, $bd, 180, 90)
  $bubblePath.AddArc($bubbleRect.Right - $bd, $bubbleRect.Y, $bd, $bd, 270, 90)
  $bubblePath.AddArc($bubbleRect.Right - $bd, $bubbleRect.Bottom - $bd, $bd, $bd, 0, 90)
  $bubblePath.AddArc($bubbleRect.X, $bubbleRect.Bottom - $bd, $bd, $bd, 90, 90)
  $bubblePath.CloseFigure()
  $g.FillPath([System.Drawing.Brushes]::White, $bubblePath)
  $bubblePath.Dispose()

  $dotR = [int]($IconSize * 0.028)
  $cy = $by + [int]($bubbleH * 0.52)
  $spacing = [int]($bubbleW * 0.22)
  $cx = $bx + [int]($bubbleW * 0.28)
  $dotBrush = New-Object System.Drawing.SolidBrush $purple
  for ($i = 0; $i -lt 3; $i++) {
    $dx = $cx + $i * $spacing - $dotR
    $g.FillEllipse($dotBrush, $dx, $cy - $dotR, $dotR * 2, $dotR * 2)
  }

  $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)

  $dotBrush.Dispose()
  $brush.Dispose()
  $g.Dispose()
  $bmp.Dispose()
}

$base = Join-Path (Split-Path $PSScriptRoot -Parent) "public"
if (-not (Test-Path $base)) { New-Item -ItemType Directory -Path $base | Out-Null }
Draw-Icon -IconSize 192 -OutPath (Join-Path $base "icon-192.png") -Maskable $false
Draw-Icon -IconSize 512 -OutPath (Join-Path $base "icon-512.png") -Maskable $false
Draw-Icon -IconSize 512 -OutPath (Join-Path $base "maskable-icon-512.png") -Maskable $true
Write-Host "PNG icons created in $base"
