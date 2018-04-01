'use strict';

var FONT = {
  family: 'PT Mono',
  size: 16,
  lineHeight: 20,
  color: '#000'
};

var CLOUD_PARAMS = {
  width: 420,
  height: 270,
  left: 100,
  top: 10,
  color: '#fff',
  shadowOffsetLeft: 10,
  shadowOffsetTop: 10,
  shadowColor: 'rgba(0, 0, 0, 0.7)',
  paddingLeft: 20,
  paddingRight: 20,
  paddingTop: 20,
  paddingBottom: 10
};

var HISTOGRAM_PARAMS = {
  maxBarHeight: 150,
  barWidth: 40,
  barMargin: 50
};

var PLAYER_PARAMS = {
  name: 'Вы',
  histogramBarColor: 'rgba(255, 0, 0, 1)'
};

var ANIMATION_PARAMS = {
  steps: 100,
  duration: 3000,
  getStepDuration: function () {
    return this.duration / this.steps;
  }
};

var previousAnimationSemaphore = null;

var HEADER_LINES = ['Ура вы победили!', 'Список результатов:'];

var getMaxTime = function (playersParams) {
  var maxTime = playersParams[0].time;

  for (var i = 0; i < playersParams.length; i++) {
    if (playersParams[i].time > maxTime) {
      maxTime = playersParams[i].time;
    }
  }

  return maxTime;
};

var renderPolygon = function (ctx, left, top, width, height, offsets, stroke) {
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + offsets.left, top + height / 2);
  ctx.lineTo(left, top + height);
  ctx.lineTo(left + width / 2, top + height - offsets.bottom);
  ctx.lineTo(left + width, top + height);
  ctx.lineTo(left + width - offsets.right, top + height / 2);
  ctx.lineTo(left + width, top);
  ctx.lineTo(left + width / 2, top + offsets.top);
  ctx.lineTo(left, top);
  ctx.closePath();
  if (stroke) {
    ctx.stroke();
  }
  ctx.fill();
};

var renderCloud = function (ctx) {
  var offsets = {
    left: CLOUD_PARAMS.paddingLeft / 2,
    right: CLOUD_PARAMS.paddingRight / 2,
    top: CLOUD_PARAMS.paddingTop / 2,
    bottom: CLOUD_PARAMS.paddingBottom / 2
  };
  // render polygon for shadow
  ctx.fillStyle = CLOUD_PARAMS.shadowColor;
  var shadowLeft = CLOUD_PARAMS.left + CLOUD_PARAMS.shadowOffsetLeft;
  var shadowTop = CLOUD_PARAMS.top + CLOUD_PARAMS.shadowOffsetTop;
  renderPolygon(ctx, shadowLeft, shadowTop, CLOUD_PARAMS.width, CLOUD_PARAMS.height, offsets, false);
  // render polygon for cloud itself
  ctx.fillStyle = CLOUD_PARAMS.color;
  renderPolygon(ctx, CLOUD_PARAMS.left, CLOUD_PARAMS.top, CLOUD_PARAMS.width, CLOUD_PARAMS.height, offsets, true);
};

var renderLines = function (ctx, left, top, lines) {
  ctx.fillStyle = FONT.color;
  ctx.font = FONT.family + ' ' + FONT.size + 'px';
  ctx.textBaseline = 'hanging';

  for (var i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], left, top + FONT.lineHeight * i);
  }
};

var renderLegend = function (ctx, left, top, offsetRight, playersParams) {
  for (var i = 0; i < playersParams.length; i++) {
    var playerNameLeft = left + i * offsetRight;
    renderLines(ctx, playerNameLeft, top, [playersParams[i].playerName]);
  }
};

var renderBars = function (ctx, left, bottom, width, marginRight, maxHeight, playersParams, animationStep, animationSemaphore) {
  // immediately exit if animation interrupted
  if (animationSemaphore.interrupted) {
    return;
  }

  var maxTime = getMaxTime(playersParams);

  var animationCoefficient = -Math.pow(animationStep / ANIMATION_PARAMS.steps, 2) + 2 * (animationStep / ANIMATION_PARAMS.steps);

  for (var i = 0; i < playersParams.length; i++) {
    var player = playersParams[i];

    var barLeft = left + i * (width + marginRight);

    var playerResultCoefficient = player.time / maxTime;
    var barHeight = maxHeight * animationCoefficient * playerResultCoefficient;

    // render bar
    ctx.fillStyle = player.barColor;
    ctx.fillRect(barLeft, bottom - barHeight, width, barHeight);

    // first, clear previous text, then render new text
    ctx.fillStyle = CLOUD_PARAMS.color;
    ctx.fillRect(barLeft, bottom - barHeight - FONT.lineHeight, width, FONT.lineHeight);
    renderLines(ctx, barLeft, bottom - barHeight - FONT.lineHeight, [Math.round(player.time * animationCoefficient)]);
  }

  if (animationStep++ <= ANIMATION_PARAMS.steps) {
    setTimeout(function () {
      renderBars(ctx, left, bottom, width, marginRight, maxHeight, playersParams, animationStep, animationSemaphore);
    }, ANIMATION_PARAMS.getStepDuration());
  }
};

var renderHistogram = function (ctx, left, top, width, height, playersParams) {
  var legendLeft = left;
  var legendTop = top + height - FONT.lineHeight;
  renderLegend(ctx, legendLeft, legendTop, HISTOGRAM_PARAMS.barWidth + HISTOGRAM_PARAMS.barMargin, playersParams);

  var barsLeft = left;
  var barsBottom = legendTop - FONT.lineHeight / 2;
  var animationSemaphore = {
    interrupted: false
  };
  previousAnimationSemaphore = animationSemaphore;
  renderBars(ctx, barsLeft, barsBottom, HISTOGRAM_PARAMS.barWidth, HISTOGRAM_PARAMS.barMargin, HISTOGRAM_PARAMS.maxBarHeight, playersParams, 1, animationSemaphore);
};

window.renderStatistics = function (ctx, players, times) {
  // stop animations if previous animation in process
  if (previousAnimationSemaphore !== null) {
    previousAnimationSemaphore.interrupted = true;
  }

  renderCloud(ctx);
  var headerLeft = CLOUD_PARAMS.left + CLOUD_PARAMS.paddingLeft;
  var headerTop = CLOUD_PARAMS.top + CLOUD_PARAMS.paddingTop;
  renderLines(ctx, headerLeft, headerTop, HEADER_LINES);

  var histogramLeft = CLOUD_PARAMS.left + CLOUD_PARAMS.paddingLeft;
  var histogramTop = CLOUD_PARAMS.top + CLOUD_PARAMS.paddingTop + FONT.lineHeight * HEADER_LINES.length;
  var histogramWidth = CLOUD_PARAMS.width - CLOUD_PARAMS.paddingLeft - CLOUD_PARAMS.paddingRight;
  var histogramHeight = CLOUD_PARAMS.height - CLOUD_PARAMS.paddingTop - FONT.lineHeight * HEADER_LINES.length - CLOUD_PARAMS.paddingBottom;

  var playersParams = [];
  for (var i = 0; i < players.length; i++) {
    playersParams[i] = {
      playerName: players[i],
      time: times[i]
    };

    if (players[i] === PLAYER_PARAMS.name) {
      playersParams[i].barColor = PLAYER_PARAMS.histogramBarColor;
    } else {
      playersParams[i].barColor = 'rgb(0, 0, ' + Math.ceil(Math.random() * 155 + 100) + ')';
    }
  }
  renderHistogram(ctx, histogramLeft, histogramTop, histogramWidth, histogramHeight, playersParams);
};
