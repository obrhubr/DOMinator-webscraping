import { PreviewDto } from '@dominator/api-interfaces';
import { Injectable, Logger } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import * as fs from 'fs/promises';
import path = require('path');

@Injectable()
export class FetchService {
	private logger = new Logger(this.constructor.name);

	async launchBrowserAndGoToUrl(url: string) {
		const browser = await puppeteer.launch({ headless: true, args: [
			'--disable-gpu',
			'--disable-dev-shm-usage',
			'--disable-setuid-sandbox',
			'--no-first-run',
			'--no-sandbox',
			'--no-zygote',
			'--single-process',
		] });
		const page = await browser.newPage();

		await page.goto(url);
		await page.waitForNetworkIdle();

		return { browser, page };
	}

	async fetchFromUrl(url: string): Promise<string> {
		this.logger.debug(`Getting page ${url} using puppeteer.`);
		const { browser, page } = await this.launchBrowserAndGoToUrl(url);

		let bodyHTML = await page.evaluate(() => document.body.innerHTML);

		await browser.close();

		return bodyHTML;
	}

	async fetchFromUrlAndGetImage(url: string): Promise<PreviewDto> {
		this.logger.debug(`Getting page ${url} using puppeteer.`);
		const { browser, page } = await this.launchBrowserAndGoToUrl(url);

		let bodyHTML = await page.evaluate(() => document.body.innerHTML);
		let image = await page.screenshot({ encoding: 'base64' });

		await browser.close();

		return { dom: bodyHTML, image: image as string } as PreviewDto;
	}

	async getFromFile(file: string): Promise<string> {
		let text = await fs.readFile(file, { encoding: "utf-8" });
		return text;
	}

	async writeToFile(file: string, text: string) {
		return await fs.writeFile(file, JSON.stringify(text, null, 4));
	}

	async fetch(url: string): Promise<string> {
		if (process.env.ENV == "PROD") {
			return await this.fetchFromUrl(url);
		} else {
			return await this.getFromFile(path.join(process.cwd(), './apps/api/data/football.html'));
		};
	}
}