$ErrorActionPreference = 'Stop'

$productionDir = if ($PSScriptRoot) { $PSScriptRoot } else { Join-Path (Get-Location) 'production' }
$root = Split-Path -Parent $productionDir
$outputDir = Join-Path $productionDir 'output'
$clipDir = Join-Path $productionDir 'generated_clips'
$audioDir = Join-Path $root 'public\media\audio'
$publicOutputDir = Join-Path $root 'public\production\output'
$workDir = Join-Path $outputDir '_v8_work'
New-Item -ItemType Directory -Path $outputDir,$publicOutputDir,$workDir -Force | Out-Null

$ffmpegCandidates = @(
  'C:\Users\Administrator\AppData\Local\Temp\codex-ffmpeg-audit\ffmpeg\ffmpeg-8.1.2-essentials_build\bin\ffmpeg.exe',
  'C:\Users\Administrator\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\Lib\site-packages\imageio_ffmpeg\binaries\ffmpeg-win-x86_64-v7.1.exe'
)
$ffmpeg = $ffmpegCandidates | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1
if (-not $ffmpeg) { throw 'FFmpeg executable was not found.' }

$sourceSrt = Join-Path $outputDir 'naval-equipment-90s-final.srt'
$targetSrt = Join-Path $publicOutputDir 'naval-equipment-90s-final-v8.srt'
Copy-Item -LiteralPath $sourceSrt -Destination $targetSrt -Force

$rawMix = Join-Path $workDir 'v8-mix-raw.wav'
$normalizedMix = Join-Path $workDir 'v8-mix-normalized.wav'

$audioInputs = @(
  (Join-Path $audioDir 'narration-documentary-zh-v7-final.wav'),
  (Join-Path $audioDir 'music-ocean-documentary.wav'),
  (Join-Path $audioDir 'sfx-ocean-weather.wav'),
  (Join-Path $audioDir 'sfx-ship-mechanical.wav'),
  (Join-Path $audioDir 'sfx-cannon-fire.wav'),
  (Join-Path $audioDir 'sfx-carrier-aircraft.wav'),
  (Join-Path $audioDir 'sfx-transition-pack.wav')
)
$audioArgs = New-Object System.Collections.Generic.List[string]
foreach ($input in $audioInputs) { $audioArgs.Add('-i'); $audioArgs.Add($input) }

$audioFilter = @'
[0:a]atrim=0:90,asetpts=PTS-STARTPTS,aresample=48000,highpass=f=75,lowpass=f=10500,acompressor=threshold=0.12:ratio=3:attack=8:release=120:makeup=1.25,asplit=2[voice][ducksrc];
[1:a]atrim=0:90,asetpts=PTS-STARTPTS,aresample=48000,volume=0.20[bgm];
[2:a]atrim=0:18,asetpts=PTS-STARTPTS,aresample=48000,volume=0.12[sea];
[3:a]atrim=0:14,asetpts=PTS-STARTPTS,aresample=48000,adelay=31800:all=1,volume=0.09[mech];
[4:a]atrim=start=1:end=2.2,asetpts=PTS-STARTPTS,aresample=48000,adelay=47400:all=1,volume=0.24[gun];
[5:a]atrim=0:16,asetpts=PTS-STARTPTS,aresample=48000,adelay=60100:all=1,volume=0.16[air];
[6:a]atrim=0:10,asetpts=PTS-STARTPTS,aresample=48000,adelay=78000:all=1,volume=0.08[transition];
[bgm][sea][mech][gun][air][transition]amix=inputs=6:duration=longest:normalize=0[bedraw];
[bedraw][ducksrc]sidechaincompress=threshold=0.018:ratio=6:attack=15:release=320[bed];
[voice][bed]amix=inputs=2:duration=longest:normalize=0,pan=stereo|c0=c0|c1=c0,atrim=0:90,asetpts=PTS-STARTPTS[mix]
'@

& $ffmpeg -hide_banner -y @audioArgs -filter_complex $audioFilter -map '[mix]' -ar 48000 -ac 2 -c:a pcm_s24le $rawMix
if ($LASTEXITCODE -ne 0) { throw "Raw audio mix failed with code $LASTEXITCODE" }

& $ffmpeg -hide_banner -y -i $rawMix -af 'loudnorm=I=-16:TP=-1:LRA=7' -ar 48000 -ac 2 -c:a pcm_s24le $normalizedMix
if ($LASTEXITCODE -ne 0) { throw "Loudness normalization failed with code $LASTEXITCODE" }

$segments = @(
  @{ file='S01-kling.mp4'; start=0;  end=96  },
  @{ file='S02-kling.mp4'; start=2;  end=120 },
  @{ file='S03-kling.mp4'; start=0;  end=120 },
  @{ file='S04-kling.mp4'; start=7;  end=113 },
  @{ file='S05-kling.mp4'; start=5;  end=113 },
  @{ file='S06-kling.mp4'; start=5;  end=113 },
  @{ file='S06-kling1.mp4';start=5;  end=113 },
  @{ file='S08-svd.mp4';   start=10; end=106 },
  @{ file='S08-kling.mp4'; start=7;  end=110 },
  @{ file='S07-kling.mp4'; start=0;  end=120 },
  @{ file='S07-kling1.mp4';start=0;  end=120 },
  @{ file='S06-kling2.mp4';start=0;  end=120 },
  @{ file='S07-kling1.mp4';start=48; end=120 },
  @{ file='S06-kling2.mp4';start=48; end=96  },
  @{ file='S09-kling2.mp4';start=17; end=113 },
  @{ file='S09-kling4.mp4';start=0;  end=96  },
  @{ file='S09-kling3.mp4';start=24; end=120 },
  @{ file='S09-kling.mp4'; start=24; end=120 },
  @{ file='S10-svd.mp4';   start=12; end=108 },
  @{ file='S11-kling.mp4'; start=2;  end=119 },
  @{ file='S11-svd.mp4';   start=24; end=72  },
  @{ file='S12-kling.mp4'; start=24; end=96  }
)

$videoArgs = New-Object System.Collections.Generic.List[string]
$videoFilters = New-Object System.Collections.Generic.List[string]
for ($i = 0; $i -lt $segments.Count; $i++) {
  $segment = $segments[$i]
  $videoArgs.Add('-i'); $videoArgs.Add((Join-Path $clipDir $segment.file))
  $videoFilters.Add("[$i`:v]fps=24,trim=start_frame=$($segment.start):end_frame=$($segment.end),setpts=N/(24*TB),scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,setsar=1,format=yuv420p[v$i]")
}
$videoArgs.Add('-i'); $videoArgs.Add($normalizedMix)
$videoLabels = (0..($segments.Count - 1) | ForEach-Object { "[v$_]" }) -join ''
$videoFilters.Add("${videoLabels}concat=n=$($segments.Count):v=1:a=0[vcat]")

$overlayFilter = @'
[vcat]
drawbox=x=1060:y=650:w=220:h=70:color=0x08121F@1.0:t=fill,
drawtext=fontfile='C\:/Windows/Fonts/msyhbd.ttc':text='AI视觉示意':fontcolor=white:fontsize=18:x=1096:y=680,
drawbox=x=54:y=54:w=700:h=152:color=black@0.48:t=fill:enable='between(t,0,4)',
drawtext=fontfile='C\:/Windows/Fonts/msyhbd.ttc':text='海上力量':fontcolor=white:fontsize=46:x=82:y=74:enable='between(t,0,4)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='水面舰艇公开外观与海况演示':fontcolor=white:fontsize=26:x=84:y=136:enable='between(t,0,4)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='公开资料与AI视觉示意':fontcolor=0x7ED7FF:fontsize=20:x=84:y=176:enable='between(t,0,4)',
drawbox=x=44:y=32:w=510:h=48:color=black@0.42:t=fill:enable='between(t,8.9,18.3)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='大型水面舰艇｜公开外观示意':fontcolor=white:fontsize=20:x=62:y=46:enable='between(t,8.9,18.3)',
drawbox=x=44:y=32:w=530:h=48:color=black@0.42:t=fill:enable='between(t,18.3,22.8)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='国外主力水面舰艇｜公开外观示意':fontcolor=white:fontsize=20:x=62:y=46:enable='between(t,18.3,22.8)',
drawbox=x=44:y=32:w=500:h=48:color=black@0.42:t=fill:enable='between(t,22.8,35.8)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='外观级三维与系统关系｜示意':fontcolor=white:fontsize=20:x=62:y=46:enable='between(t,22.8,35.8)',
drawbox=x=44:y=32:w=390:h=48:color=black@0.42:t=fill:enable='between(t,35.8,40.1)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='风雨甲板与环境作用':fontcolor=white:fontsize=20:x=62:y=46:enable='between(t,35.8,40.1)',
drawbox=x=44:y=32:w=520:h=48:color=black@0.42:t=fill:enable='between(t,40.1,60.1)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='主炮动作与海面反馈｜演示画面':fontcolor=white:fontsize=20:x=62:y=46:enable='between(t,40.1,60.1)',
drawbox=x=44:y=32:w=540:h=48:color=black@0.42:t=fill:enable='between(t,60.1,76.1)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='舰载航空准备与起飞｜演示画面':fontcolor=white:fontsize=20:x=62:y=46:enable='between(t,60.1,76.1)',
drawbox=x=44:y=32:w=510:h=48:color=black@0.42:t=fill:enable='between(t,76.1,87)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='编队协同｜非接触演练示意':fontcolor=white:fontsize=20:x=62:y=46:enable='between(t,76.1,87)',
drawbox=x=0:y=0:w=iw:h=ih:color=black@0.56:t=fill:enable='between(t,86.4,90)',
drawtext=fontfile='C\:/Windows/Fonts/msyhbd.ttc':text='公开资料与AI视觉示意':fontcolor=white:fontsize=40:x=(w-text_w)/2:y=238:enable='between(t,86.4,90)',
drawtext=fontfile='C\:/Windows/Fonts/msyh.ttc':text='不展示内部结构、敏感参数或真实战术数据':fontcolor=0xC8D8E8:fontsize=22:x=(w-text_w)/2:y=302:enable='between(t,86.4,90)',
subtitles=filename='public/production/output/naval-equipment-90s-final-v8.srt':force_style='FontName=Microsoft YaHei,FontSize=18,PrimaryColour=&H00FFFFFF,OutlineColour=&H90000000,BorderStyle=1,Outline=1.5,Shadow=0,Alignment=2,MarginV=52',
fade=t=in:st=0:d=0.35,fade=t=out:st=89.4:d=0.6[vout]
'@
$videoFilters.Add($overlayFilter.Trim())

$targetVideo = Join-Path $publicOutputDir 'naval-equipment-90s-final-v8.mp4'
& $ffmpeg -hide_banner -y @videoArgs -filter_complex ($videoFilters -join ';') -map '[vout]' -map "$($segments.Count):a:0" -c:v libx264 -preset slow -crf 18 -profile:v high -level 4.0 -pix_fmt yuv420p -c:a aac -b:a 192k -ar 48000 -ac 2 -movflags +faststart -t 90 $targetVideo
if ($LASTEXITCODE -ne 0) { throw "V8 render failed with code $LASTEXITCODE" }

Write-Output $targetVideo
Write-Output $targetSrt
