const { SlashCommandBuilder } = require("@discordjs/builders");
const { Permissions } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");
const { AttachmentBuilder } = require("discord.js");
const path = require("path");

exports.commandBase = {
  prefixData: {
    name: "profile",
    aliases: ["pro"],
  },
  slashData: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("Shows a profile card"),
  cooldown: 5000,
  ownerOnly: false,
  async prefixRun(client, message, args) {
    await generateProfileCard(message, message.author, message.guild);
  },
  async slashRun(client, interaction) {
    await generateProfileCard(
      interaction,
      interaction.user,
      interaction.member.guild
    );
  },
};

async function generateProfileCard(replyTarget, user, guild) {
  const width = 400;
  const height = 400;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  const assetPath = (assetType, fileName) =>
    path.join(__dirname, `../../assets/${assetType}/${fileName}`);

  const BackgroundPath = assetPath("backgrounds", "bg.png");
  const shadowOnePath = assetPath("shadows", "sh1.png");
  const shadowTwoPath = assetPath("shadows", "sh2.png");
  const shadowThreePath = assetPath("shadows", "sh3.png");
  const sparklesPath = assetPath("shadows", "sparkles.png");
  const psFlagPath = assetPath("badges", "psFlag.png");
  const dzFlagPath = assetPath("badges", "dzFlag.png");

  const userAvatarUrl = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`;
  const serverIconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png?size=32`;

  const rightSideX = 165;
  const rightSideWidth = 196;

  const level = 71;
  const rep = `+${349}`;
  const credits = `${9.31}K`;
  const rank = 103739;

  const currentXP = 12500;
  const maxXP = 26378;
  const totalXP = 40000;

  await drawBackgroundAndShadows(
    ctx,
    BackgroundPath,
    shadowOnePath,
    shadowTwoPath,
    shadowThreePath,
    sparklesPath
  );
  await drawBadges(ctx, psFlagPath, dzFlagPath);
  await drawUserAvatar(ctx, userAvatarUrl);
  await drawServerIcon(ctx, serverIconUrl);
  drawStaticText(ctx, replyTarget, level, rep, credits, rank, user.username);
  drawStatus(ctx, rightSideWidth, rightSideX);
  drawProgressBar(
    ctx,
    rightSideX,
    317,
    rightSideWidth,
    20,
    currentXP,
    maxXP,
    totalXP
  );

  const attachment = new AttachmentBuilder(canvas.toBuffer(), {
    name: "profile-card.png",
  });
  replyTarget.reply({ files: [attachment] });
}

async function drawUserAvatar(ctx, userAvatarUrl) {
  await drawIcon(ctx, userAvatarUrl, 80, 65, 62, 62, 3);
}

async function drawServerIcon(ctx, serverIconUrl) {
  await drawIcon(ctx, serverIconUrl, 196 + 16, 4 + 16, 16, 16, 1.5);
}

async function drawBackgroundAndShadows(ctx, ...imagePaths) {
  const images = await Promise.all(imagePaths.map((path) => loadImage(path)));
  images.forEach((image) =>
    ctx.drawImage(image, 0, 0, ctx.canvas.width, ctx.canvas.height)
  );
}

async function drawBadges(ctx, ...badgePaths) {
  const badgeImages = await Promise.all(
    badgePaths.map((path) => loadImage(path))
  );

  const imageWidth = 40;
  const imageHeight = 40;
  const space = 10;
  const badgesTogetherWidth = badgeImages.reduce(
    (totalWidth) => totalWidth + imageWidth,
    +(badgeImages.length - 1) * space
  );

  const x = 165 + 196 / 2 - badgesTogetherWidth / 2;
  let currentX = x;
  const y = 240;

  badgeImages.forEach((image) => {
    ctx.drawImage(image, currentX, y, imageWidth, imageHeight);
    currentX += imageWidth + space;
  });
}

function drawStaticText(ctx, replyTarget, level, rep, credits, rank, userName) {
  ctx.font = "semibold 26px 'Arial' sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.25)";
  ctx.shadowBlur = 5;
  ctx.fillText(userName, 160, 75);

  ctx.shadowBlur = 0;

  ctx.font = "15px 'Arial' sans-serif";
  ctx.fillText(`LVL`, 24, 160);
  ctx.fillText(`REP`, 24, 220);

  ctx.font = "bold 28px 'Arial' sans-serif";
  ctx.fillText(level, 24, 190);
  ctx.fillText(rep, 24, 250);

  ctx.font = "12px 'Arial' sans-serif";
  ctx.fillText(`CREDITS`, 24, 280);
  ctx.fillText(`RANK`, 24, 340);

  ctx.font = "bold 19px 'Arial' sans-serif";
  ctx.fillText(credits, 24, 300);
  ctx.fillText(rank, 24, 360);
}

function drawStatus(ctx, rightSideWidth, rightSideX) {
  const status = "I Stand With Gaza";
  const statusWidth = ctx.measureText(status).width;
  const x = rightSideX + rightSideWidth / 2 - statusWidth / 2;

  ctx.font = "bold 18px 'Arial' sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(status, x, 175);
}

function drawProgressBar(ctx, x, y, width, height, progress, maxXP, totalXP) {
  const totalXPText = `TOTAL XP: ${totalXP}`;
  ctx.font = "bold 11px Arial";
  const totalXPTextWidth = ctx.measureText(totalXPText).width;
  const totalXPTextX = x + width / 2 - totalXPTextWidth / 2;
  const totalXPTextY = y + height + 15;
  ctx.fillStyle = "#fff";
  ctx.fillText(totalXPText, totalXPTextX, totalXPTextY);

  const progressWidth = (progress / maxXP) * width;
  const borderRadius = height / 2;

  ctx.fillStyle = "#D2CBF4";
  drawRoundedRect(ctx, x, y, width, height, borderRadius);
  ctx.fill();

  ctx.fillStyle = "#D2CBF4";
  drawRoundedRect(ctx, x + 1.5, y + 1.5, width - 3, height - 3, borderRadius);
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  drawRoundedRect(ctx, x + 1.5, y + 1.5, width - 3, height - 3, borderRadius);
  ctx.clip();

  ctx.fillStyle = "#37393D";
  ctx.fillRect(x + 1.5, y + 1.5, progressWidth - 3, height - 3);

  ctx.font = "13px Arial";
  ctx.textBaseline = "middle";
  const text = `${progress} / ${maxXP}`;
  const textX = x + width / 2;
  const textY = y + height / 2;
  const textWidth = ctx.measureText(text).width;
  const textStartX = textX - textWidth / 2;

  ctx.fillStyle = "#37393D";
  ctx.fillText(text, textStartX, textY);

  ctx.save();
  ctx.beginPath();
  drawRoundedRect(ctx, x, y, progressWidth, height, borderRadius);
  ctx.clip();

  ctx.fillStyle = "#D2CBF4";
  ctx.fillText(text, textStartX, textY);
  ctx.restore();
}

async function drawIcon(
  ctx,
  iconUrl,
  centerX,
  centerY,
  radius,
  outerRadius,
  borderWidth
) {
  const icon = await loadImage(iconUrl);

  ctx.save();

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    icon,
    centerX - radius,
    centerY - radius,
    radius * 2,
    radius * 2
  );

  ctx.beginPath();
  ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = borderWidth;
  ctx.stroke();

  ctx.restore();
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}
