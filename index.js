#!/usr/bin/env node

/**
 * resize-image
 * resize and optimize the images
 *
 * @author sokun <https://github.com/Mengsokun19>
 */
const resizeOptimizeImages = require('resize-optimize-images');
const globby = require('globby');
const alert = require('cli-alerts');
const ora = require('ora');
const { yellow: y, green: g, red: r, cyan: c } = require('chalk');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');

const input = cli.input;
const flags = cli.flags;
const { clear, debug, source, width, quality } = flags;
const spinner = ora({ text: '' });

(async () => {
	init({ clear });
	input.includes(`help`) && cli.showHelp(0);

	if (!source) {
		alert({
			type: 'error',
			msg: 'Please provide a source file or directory of images'
		});
		log.error(`Please provide a source file or directory of images`);
		process.exit(1);
	}

	// for input the images as an array to resize and optimize
	const images = await globby(source);
	const options = {
		images,
		width: width ? width : 1920,
		quality: quality ? quality : 80
	};

	// cli colorize for user interface
	spinner.start(`${y(`Resizing and optimizing ${images.length} images...`)}`);
	await resizeOptimizeImages(options);
	// after resize and optimize the images
	spinner.succeed(`${g(`Resizing and optimizing images completed!`)}`);

	alert({
		type: 'success',
		name: 'DONE',
		msg: 'Resizing and optimizing images COMPLETED!'
	});

	debug && log(flags);
	debug && log(images);
})();
