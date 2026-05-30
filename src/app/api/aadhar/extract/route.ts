

import { NextRequest, NextResponse } from 'next/server';
import jsQR from 'jsqr';
import { createWorker } from 'tesseract.js';
import sharp from 'sharp';
import { inflate } from 'pako';
import { Buffer } from 'buffer';
import { createRequire } from 'module';
import path from 'path';
import * as ort from 'onnxruntime-node';

import { JpxImage } from 'jpeg2000';
import * as JPEG from 'jpeg-js';

// ═══════════════════════════════════════════════════════════════════════════════
// VERHOEFF CHECKSUM
// ═══════════════════════════════════════════════════════════════════════════════
const d: number[][] = [
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	[1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
	[2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
	[3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
	[4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
	[5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
	[6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
	[7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
	[8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
	[9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];
const p: number[][] = [
	[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
	[1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
	[5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
	[8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
	[9, 2, 6, 3, 1, 7, 5, 4, 0, 8],
	[2, 7, 8, 5, 9, 0, 4, 1, 3, 6],
	[7, 0, 9, 4, 5, 2, 8, 6, 3, 1],
	[0, 4, 6, 8, 3, 1, 2, 5, 7, 9],
	[4, 3, 2, 1, 0, 6, 7, 8, 9, 5],
	[3, 6, 5, 7, 4, 9, 0, 8, 2, 1]
];

function validateAadharVerhoeff(num: string): boolean {
	if (!/^\d{12}$/.test(num)) return false;
	let c = 0;
	const reversed = num.split('').reverse().map(Number);
	for (let i = 0; i < reversed.length; i++) {
		// FIX: Changed (i + 1) % 8 to just i % 8 for full string validation
        c = d[c][p[i % 8][reversed[i]]];
	}
	return c === 0;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ULTRA-ROBUST QR DETECTION — 4 strategies with different preprocessing
// ═══════════════════════════════════════════════════════════════════════════════

interface QRDetectResult {
	qrString: string | null;
	binaryData: Uint8Array | null;
	strategy: string;
}

async function detectQR(buffer: Buffer): Promise<QRDetectResult> {
	// We now return { data, info } directly from the preprocess step
	const strategies: Array<{ name: string; preprocess: () => Promise<{ data: Buffer, info: import('sharp').OutputInfo }> }> = [

		// Strategy 1: Original resolution
		{
			name: 'original',
			preprocess: async () => sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true }),
		},

		// Strategy 2: Slight upscale (2x) with nearest neighbor
		{
			name: 'upscale-2x-nearest',
			preprocess: async () => {
				const meta = await sharp(buffer).metadata();
				const w = Math.min((meta.width || 1000) * 2, 4000);
				const h = Math.min((meta.height || 1000) * 2, 4000);
				return sharp(buffer)
					.resize(w, h, { fit: 'inside', kernel: 'nearest' })
					.ensureAlpha()
					.raw()
					.toBuffer({ resolveWithObject: true });
			},
		},

		// Strategy 3: Moderate resize with contrast boost
		{
			name: 'contrast-boost',
			preprocess: async () => sharp(buffer)
				.resize(2500, 2500, { fit: 'inside' })
				.modulate({ brightness: 1.1 })
				.sharpen({ sigma: 1.5, m1: 2, m2: 0 })
				.ensureAlpha()
				.raw()
				.toBuffer({ resolveWithObject: true }),
		},

		// Strategy 4: Grayscale + adaptive threshold
		{
			name: 'adaptive-threshold',
			preprocess: async () => sharp(buffer)
				.resize(2000, 2000, { fit: 'inside' })
				.grayscale()
				.threshold(128)
				.ensureAlpha()
				.raw()
				.toBuffer({ resolveWithObject: true }),
		},

		// Strategy 5: Crop center region
		{
			name: 'center-crop',
			preprocess: async () => {
				const meta = await sharp(buffer).metadata();
				const w = meta.width || 1000;
				const h = meta.height || 1000;
				const cropW = Math.floor(w * 0.5);
				const cropH = Math.floor(h * 0.5);
				const left = Math.floor(w * 0.4);
				const top = Math.floor(h * 0.1);
				return sharp(buffer)
					.extract({ left, top, width: cropW, height: cropH })
					.resize(2000, 2000, { fit: 'inside' })
					.ensureAlpha()
					.raw()
					.toBuffer({ resolveWithObject: true });
			},
		},
	];

	for (const strat of strategies) {
		try {
			const { data, info } = await strat.preprocess();

			const expectedLength = info.width * info.height * 4;
			let clamped: Uint8ClampedArray;

			if (data.length === expectedLength) {
				// 4 Channels (RGBA) - Perfect match
				clamped = new Uint8ClampedArray(data.buffer, data.byteOffset, data.byteLength);
			} else if (data.length === info.width * info.height * 3) {
				// 3 Channels (RGB) - Convert to RGBA
				clamped = new Uint8ClampedArray(expectedLength);
				for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
					clamped[j] = data[i];         // R
					clamped[j + 1] = data[i + 1]; // G
					clamped[j + 2] = data[i + 2]; // B
					clamped[j + 3] = 255;         // A (Opaque)
				}
			} else if (data.length === info.width * info.height * 1) {
				// 1 Channel (Grayscale/Threshold) - Convert to RGBA
				clamped = new Uint8ClampedArray(expectedLength);
				for (let i = 0, j = 0; i < data.length; i += 1, j += 4) {
					const val = data[i];
					clamped[j] = val;         // R
					clamped[j + 1] = val;     // G
					clamped[j + 2] = val;     // B
					clamped[j + 3] = 255;     // A (Opaque)
				}
			} else {
				console.log(`[AadharAPI] Skipping ${strat.name}: Data length (${data.length}) doesn't match expected RGBA (${expectedLength})`);
				continue;
			}

			const qr = jsQR(clamped, info.width, info.height);

			if (qr && qr.data && qr.data.length > 50) {
				console.log(`[AadharAPI] QR detected via strategy: ${strat.name}`);
				const binary = qr.binaryData ? new Uint8Array(qr.binaryData) : null;
				return {
					qrString: qr.data,
					binaryData: binary,
					strategy: strat.name,
				};
			}
		} catch (e) {
			console.log(`[AadharAPI] QR strategy ${strat.name} failed:`, (e as Error).message);
		}
	}

	return { qrString: null, binaryData: null, strategy: 'none' };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORRECT UIDAI SECURE QR PARSER (March 2019 spec)
// Base10 Big Integer → bytes → zlib inflate → delimiter 0xFF separated fields
// ═══════════════════════════════════════════════════════════════════════════════

// interface ParsedQR {
// 	emailMobileStatus: string;
// 	referenceId: string;
// 	name: string | null;
// 	dob: string | null;
// 	gender: string | null;
// 	careOf: string | null;
// 	district: string | null;
// 	landmark: string | null;
// 	house: string | null;
// 	location: string | null;
// 	pinCode: string | null;
// 	postOffice: string | null;
// 	state: string | null;
// 	street: string | null;
// 	subDistrict: string | null;
// 	vtc: string | null;
// 	last4Digits: string | null;
// 	lastDigit: string | null;
// 	photoBase64: string | null;
// 	hasEmail: boolean;
// 	hasMobile: boolean;
// 	rawXml: string | null;
// 	parseStrategy: string;
// }

// class UIDAISecureQRParser {

// 	parse(qrStringData: string, binaryData?: Uint8Array | null): ParsedQR | null {
// 		// Strategy 1: jsQR gave us a base10 string (UIDAI Secure QR standard)
// 		if (qrStringData && /^\d+$/.test(qrStringData.trim()) && qrStringData.length > 100) {
// 			const result = this.parseFromBase10(qrStringData.trim());
// 			if (result) return result;
// 		}

// 		// Strategy 2: jsQR gave us binary data (some versions)
// 		if (binaryData && binaryData.length > 50) {
// 			const result = this.parseFromBinary(binaryData);
// 			if (result) return result;
// 		}

// 		// Strategy 3: The QR string might be plain XML (old format / e-Aadhaar)
// 		if (qrStringData && (qrStringData.includes('<?xml') || qrStringData.includes('<PrintLetterBarcodeData'))) {
// 			return this.parseFromXmlString(qrStringData);
// 		}

// 		// Strategy 4: Try treating string as base64
// 		if (qrStringData && qrStringData.length > 100) {
// 			try {
// 				const decoded = Buffer.from(qrStringData, 'base64');
// 				if (decoded.length > 50) {
// 					const result = this.parseFromBinary(new Uint8Array(decoded));
// 					if (result) return result;
// 				}
// 			} catch { }
// 		}

// 		return null;
// 	}

// 	private parseFromBase10(base10Str: string): ParsedQR | null {
// 		try {
// 			console.log('[AadharAPI] Attempting base10 parse, length:', base10Str.length);

// 			const bytes = this.bigIntStringToBytes(base10Str);
// 			console.log('[AadharAPI] Converted to', bytes.length, 'bytes');
// 			console.log('[AadharAPI] First 20 bytes:', Array.from(bytes.slice(0, 20)).map(b => b.toString(16)).join(' '));

// 			if (bytes.length < 50) {
// 				console.log('[AadharAPI] Too few bytes after conversion');
// 				return null;
// 			}

// 			// Try decompression
// 			let decompressed: Uint8Array;
// 			try {
// 				decompressed = inflate(bytes);
// 				console.log('[AadharAPI] Decompressed to', decompressed.length, 'bytes');
// 			} catch (inflateErr) {
// 				console.log('[AadharAPI] Inflate failed, trying raw bytes');
// 				decompressed = bytes;
// 			}

// 			return this.parseDelimitedFields(decompressed);

// 		} catch (e: any) {
// 			console.log('[AadharAPI] Base10 parse failed:', e.message);
// 			return null;
// 		}
// 	}

// 	private bigIntStringToBytes(base10Str: string): Uint8Array {
// 		const clean = base10Str.replace(/\s/g, '');
// 		let big = BigInt(clean);
// 		const bytes: number[] = [];

// 		while (big > 0n) {
// 			bytes.unshift(Number(big & 0xFFn));
// 			big = big >> 8n;
// 		}

// 		return new Uint8Array(bytes);
// 	}

// 	private parseFromBinary(binaryData: Uint8Array): ParsedQR | null {
// 		try {
// 			let decompressed: Uint8Array;
// 			try {
// 				decompressed = inflate(binaryData);
// 			} catch {
// 				decompressed = binaryData;
// 			}
// 			return this.parseDelimitedFields(decompressed);
// 		} catch (e) {
// 			return null;
// 		}
// 	}

// 	private parseDelimitedFields(data: Uint8Array): ParsedQR | null {
// 		const fields: Uint8Array[] = [];
// 		let start = 0;
// 		for (let i = 0; i < data.length; i++) {
// 			if (data[i] === 255) {
// 				fields.push(data.slice(start, i));
// 				start = i + 1;
// 			}
// 		}
// 		if (start < data.length) {
// 			fields.push(data.slice(start));
// 		}

// 		console.log('[AadharAPI] Found', fields.length, 'fields by delimiter 255');
// 		console.log('[AadharAPI] Field lengths:', fields.map((f, i) => `F${i}=${f.length}`).join(', '));

// 		if (fields.length < 5) {
// 			console.log('[AadharAPI] Too few fields, trying alternative delimiter');
// 			// Some versions use 254 instead of 255
// 			return this.parseWithDelimiter(data, 254);
// 		}

// 		const decode = (bytes: Uint8Array): string => {
// 			try {
// 				return new TextDecoder('iso-8859-1').decode(bytes);
// 			} catch {
// 				return new TextDecoder('utf-8').decode(bytes);
// 			}
// 		};

// 		const getField = (idx: number): string | null => {
// 			if (idx >= fields.length) return null;
// 			const val = decode(fields[idx]).trim();
// 			return val || null;
// 		};

// 		// Log first few fields for debugging
// 		for (let i = 0; i < Math.min(fields.length, 6); i++) {
// 			console.log(`[AadharAPI] Field ${i}: "${getField(i)?.slice(0, 50)}"`);
// 		}

// 		const emailMobileStatus = getField(0) || '0';
// 		const referenceId = getField(1) || '';

// 		const last4Match = referenceId.match(/^(\d{4})/);
// 		const last4Digits = last4Match ? last4Match[1] : null;

// 		const statusNum = parseInt(emailMobileStatus, 10) || 0;
// 		const hasEmail = statusNum === 1 || statusNum === 3;
// 		const hasMobile = statusNum === 2 || statusNum === 3;

// 		// Photo extraction
// 		let photoBase64: string | null = null;

// 		// Method 1: Count delimiters to find photo start
// 		let delimiterCount = 0;
// 		let photoStartIndex = 0;
// 		for (let i = 0; i < data.length; i++) {
// 			if (data[i] === 255) {
// 				delimiterCount++;
// 				if (delimiterCount === 16) { // After 16th field (0-15 = 16 delimiters for 16 fields)
// 					photoStartIndex = i + 1;
// 					break;
// 				}
// 			}
// 		}

// 		// Calculate end: total - signature(256) - optional hashes
// 		let photoEndIndex = data.length - 256;
// 		if (hasMobile) photoEndIndex -= 32;
// 		if (hasEmail) photoEndIndex -= 32;

// 		if (photoStartIndex > 0 && photoEndIndex > photoStartIndex && (photoEndIndex - photoStartIndex) > 100) {
// 			const photoBytes = data.slice(photoStartIndex, photoEndIndex);
// 			console.log('[AadharAPI] Photo bytes:', photoBytes.length, 'First bytes:', Array.from(photoBytes.slice(0, 10)).map(b => b.toString(16)).join(' '));
// 			photoBase64 = this.processPhoto(photoBytes);
// 		} else {
// 			// Fallback: photo is everything after last delimiter before signature area
// 			const lastDelim = data.lastIndexOf(255, data.length - 300);
// 			if (lastDelim > 0) {
// 				const photoBytes = data.slice(lastDelim + 1, photoEndIndex);
// 				if (photoBytes.length > 100) {
// 					photoBase64 = this.processPhoto(photoBytes);
// 				}
// 			}
// 		}

// 		// Build address
// 		const addressParts = [
// 			getField(5), getField(8), getField(13), getField(7),
// 			getField(9), getField(15), getField(6), getField(14),
// 			getField(12), getField(10),
// 		].filter(Boolean);

// 		const address = addressParts.length > 0 ? addressParts.join(', ') : null;

// 		return {
// 			emailMobileStatus,
// 			referenceId,
// 			name: getField(2),
// 			dob: getField(3),
// 			gender: getField(4),
// 			careOf: getField(5),
// 			district: getField(6),
// 			landmark: getField(7),
// 			house: getField(8),
// 			location: getField(9),
// 			pinCode: getField(10),
// 			postOffice: getField(11),
// 			state: getField(12),
// 			street: getField(13),
// 			subDistrict: getField(14),
// 			vtc: getField(15),
// 			last4Digits,
// 			lastDigit: last4Digits ? last4Digits.slice(-1) : null,
// 			photoBase64,
// 			hasEmail,
// 			hasMobile,
// 			rawXml: null,
// 			parseStrategy: 'uidai-delimited'
// 		};
// 	}

// 	private parseWithDelimiter(data: Uint8Array, delimiter: number): ParsedQR | null {
// 		const fields: Uint8Array[] = [];
// 		let start = 0;
// 		for (let i = 0; i < data.length; i++) {
// 			if (data[i] === delimiter) {
// 				fields.push(data.slice(start, i));
// 				start = i + 1;
// 			}
// 		}
// 		if (start < data.length) fields.push(data.slice(start));

// 		if (fields.length < 5) return null;

// 		const decode = (bytes: Uint8Array): string => {
// 			try { return new TextDecoder('iso-8859-1').decode(bytes); }
// 			catch { return new TextDecoder('utf-8').decode(bytes); }
// 		};

// 		const getField = (idx: number): string | null => {
// 			if (idx >= fields.length) return null;
// 			const val = decode(fields[idx]).trim();
// 			return val || null;
// 		};

// 		const refId = getField(1) || '';
// 		const last4 = refId.match(/^(\d{4})/)?.[1] || null;

// 		return {
// 			emailMobileStatus: getField(0) || '0',
// 			referenceId: refId,
// 			name: getField(2),
// 			dob: getField(3),
// 			gender: getField(4),
// 			careOf: getField(5),
// 			district: getField(6),
// 			landmark: getField(7),
// 			house: getField(8),
// 			location: getField(9),
// 			pinCode: getField(10),
// 			postOffice: getField(11),
// 			state: getField(12),
// 			street: getField(13),
// 			subDistrict: getField(14),
// 			vtc: getField(15),
// 			last4Digits: last4,
// 			lastDigit: last4 ? last4.slice(-1) : null,
// 			photoBase64: null,
// 			hasEmail: false,
// 			hasMobile: false,
// 			rawXml: null,
// 			parseStrategy: `alt-delimiter-${delimiter}`
// 		};
// 	}

// 	private parseFromXmlString(xmlStr: string): ParsedQR | null {
// 		const extract = (attr: string): string | null => {
// 			const regex = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'i');
// 			const m = xmlStr.match(regex);
// 			return m ? m[1].trim() : null;
// 		};

// 		const refId = extract('refId') || extract('referenceId') || '';
// 		const last4 = refId.match(/(\d{4})$/)?.[1] || null;

// 		return {
// 			emailMobileStatus: '0',
// 			referenceId: refId,
// 			name: extract('name'),
// 			dob: extract('dob') || extract('yob'),
// 			gender: extract('gender'),
// 			careOf: extract('co'),
// 			district: extract('dist'),
// 			landmark: extract('lm'),
// 			house: extract('house'),
// 			location: extract('loc'),
// 			pinCode: extract('pc'),
// 			postOffice: extract('po'),
// 			state: extract('state'),
// 			street: extract('street'),
// 			subDistrict: extract('subdist'),
// 			vtc: extract('vtc'),
// 			last4Digits: last4,
// 			lastDigit: last4 ? last4.slice(-1) : null,
// 			photoBase64: null,
// 			hasEmail: false,
// 			hasMobile: false,
// 			rawXml: xmlStr.slice(0, 1000),
// 			parseStrategy: 'xml-fallback'
// 		};
// 	}

// 	private processPhoto(photoBytes: Uint8Array): string | null {
// 		if (!photoBytes || photoBytes.length < 100) return null;

// 		try {
// 			const isJpeg = photoBytes[0] === 0xFF && photoBytes[1] === 0xD8;
// 			const isJp2Boxed = photoBytes[0] === 0x00 && photoBytes[1] === 0x00 &&
// 				photoBytes[2] === 0x00 && photoBytes[3] === 0x0C;
// 			const isJpxBoxed = photoBytes[0] === 0x00 && photoBytes[1] === 0x00 &&
// 				photoBytes[2] === 0x00 && photoBytes[3] === 0x0D;
// 			const isJ2kCodestream = photoBytes[0] === 0xFF && photoBytes[1] === 0x4F &&
// 				photoBytes[2] === 0xFF && photoBytes[3] === 0x51;
// 			const isPng = photoBytes[0] === 0x89 && photoBytes[1] === 0x50;

// 			// ── Standard formats: pass through as Base64 ──
// 			if (isJpeg) {
// 				return `data:image/jpeg;base64,${Buffer.from(photoBytes).toString('base64')}`;
// 			}
// 			if (isPng) {
// 				return `data:image/png;base64,${Buffer.from(photoBytes).toString('base64')}`;
// 			}
// 			if (isJp2Boxed || isJpxBoxed) {
// 				// Boxed JP2/JPX — browser might support it, but likely won't on mobile
// 				// Still, pass it through as-is
// 				return `data:image/jp2;base64,${Buffer.from(photoBytes).toString('base64')}`;
// 			}

// 			// ── JPEG 2000 Codestream (J2C): Decode → RGBA → JPEG ──
//             if (isJ2kCodestream) {
//                 console.log('[AadharAPI] Detected J2K codestream, decoding via jpeg2000...');

//                 // THE FIX: Convert the standard Uint8Array into a native Node.js Buffer.
//                 // The JpxImage library requires Node Buffer methods like .readUInt16BE() to work!
//                 const nodeBuffer = Buffer.from(photoBytes.buffer, photoBytes.byteOffset, photoBytes.byteLength);

//                 const jpx = new JpxImage();
//                 jpx.parse(nodeBuffer); // <-- Pass the Node Buffer here!

//                 const width = jpx.width;
//                 const height = jpx.height;
//                 const numComponents = jpx.componentsCount;

//                 console.log(`[AadharAPI] J2K decoded: ${width}x${height}, ${numComponents} component(s)`);

//                 if (!width || !height || !jpx.tiles || jpx.tiles.length === 0) {
//                     console.log('[AadharAPI] J2K decode produced no image data');
//                     return null;
//                 }

//                 // jpeg2000 gives us tiles with pixel data
//                 const tile = jpx.tiles[0];
//                 const tileData = tile.items; 

//                const totalPixels = width * height;
//                 const rgba = new Uint8Array(totalPixels * 4);

//                 // Most UIDAI J2K photos are 3 components (RGB) and are Interleaved (RGB RGB RGB)
//                 // Meaning tileData[0] is Red, tileData[1] is Green, tileData[2] is Blue.
//                 // If tileData.length === totalPixels * numComponents, it is definitely interleaved or flat.

//                 if (numComponents === 1) {
//                     // Grayscale — replicate R=G=B
//                     for (let i = 0; i < totalPixels; i++) {
//                         const val = tileData[i];
//                         rgba[i * 4] = val;
//                         rgba[i * 4 + 1] = val;
//                         rgba[i * 4 + 2] = val;
//                         rgba[i * 4 + 3] = 255;
//                     }
//                 } else if (numComponents === 3) {
//                     if (tileData.length >= totalPixels * 3) {
//                         // Standard Interleaved (RGB RGB RGB) - MOST COMMON FOR AADHAAR
//                         for (let i = 0; i < totalPixels; i++) {
//                             rgba[i * 4]     = tileData[i * 3];     // R
//                             rgba[i * 4 + 1] = tileData[i * 3 + 1]; // G
//                             rgba[i * 4 + 2] = tileData[i * 3 + 2]; // B
//                             rgba[i * 4 + 3] = 255;                 // A
//                         }
//                     } else {
//                         // Sequential (RRR GGG BBB)
//                         for (let i = 0; i < totalPixels; i++) {
//                             rgba[i * 4]     = tileData[i];
//                             rgba[i * 4 + 1] = tileData[i + totalPixels];
//                             rgba[i * 4 + 2] = tileData[i + totalPixels * 2];
//                             rgba[i * 4 + 3] = 255;
//                         }
//                     }
//                 } else if (numComponents >= 4) {
//                     if (tileData.length >= totalPixels * 4) {
//                         // Interleaved RGBA
//                         for (let i = 0; i < totalPixels; i++) {
//                             rgba[i * 4]     = tileData[i * 4];
//                             rgba[i * 4 + 1] = tileData[i * 4 + 1];
//                             rgba[i * 4 + 2] = tileData[i * 4 + 2];
//                             rgba[i * 4 + 3] = tileData[i * 4 + 3];
//                         }
//                     } else {
//                          // Sequential RGBA
//                          for (let i = 0; i < totalPixels; i++) {
//                             rgba[i * 4]     = tileData[i];
//                             rgba[i * 4 + 1] = tileData[i + totalPixels];
//                             rgba[i * 4 + 2] = tileData[i + totalPixels * 2];
//                             rgba[i * 4 + 3] = tileData[i + totalPixels * 3];
//                         }
//                     }
//                 }

//                 // Encode RGBA to JPEG using pure-JS jpeg-js
//                 const rawImageData = {
//                     data: rgba,
//                     width: width,
//                     height: height,
//                 };

//                 const jpegBuffer = JPEG.encode(rawImageData, 85); // quality 85

//                 console.log(`[AadharAPI] Encoded to JPEG: ${jpegBuffer.data.length} bytes`);

//                 return `data:image/jpeg;base64,${Buffer.from(jpegBuffer.data).toString('base64')}`;
//             }

// 			// ── Unknown format: fallback to raw base64 ──
// 			console.log('[AadharAPI] Unknown photo format, returning raw bytes');
// 			return `data:application/octet-stream;base64,${Buffer.from(photoBytes).toString('base64')}`;

// 		} catch (e: any) {
// 			console.log('[AadharAPI] Photo processing failed:', e.message || e);
// 			return null;
// 		}
// 	}
// }



// ═══════════════════════════════════════════════════════════════════════════════
// CORRECT UIDAI SECURE QR PARSER — VERSION-AWARE (V2, V1, Standard)
// Base10 Big Integer → bytes → zlib inflate → delimiter 0xFF separated fields
// ═══════════════════════════════════════════════════════════════════════════════

interface ParsedQR {
	emailMobileStatus: string;
	referenceId: string;
	name: string | null;
	dob: string | null;
	gender: string | null;
	careOf: string | null;
	district: string | null;
	landmark: string | null;
	house: string | null;
	location: string | null;
	pinCode: string | null;
	postOffice: string | null;
	state: string | null;
	street: string | null;
	subDistrict: string | null;
	vtc: string | null;
	last4Digits: string | null;
	lastDigit: string | null;
	photoBase64: string | null;
	hasEmail: boolean;
	hasMobile: boolean;
	rawXml: string | null;
	parseStrategy: string;
}

interface SchemaInfo {
	version: string;
	offset: number;        // Fields to skip at start (1 for V2, 0 for standard)
	textFieldCount: number; // Number of text fields before photo blob
}

class UIDAISecureQRParser {

	parse(qrStringData: string, binaryData?: Uint8Array | null): ParsedQR | null {
		// Strategy 1: jsQR gave us a base10 string (UIDAI Secure QR standard)
		if (qrStringData && /^\d+$/.test(qrStringData.trim()) && qrStringData.length > 100) {
			const result = this.parseFromBase10(qrStringData.trim());
			if (result) return result;
		}

		// Strategy 2: jsQR gave us binary data (some versions)
		if (binaryData && binaryData.length > 50) {
			const result = this.parseFromBinary(binaryData);
			if (result) return result;
		}

		// Strategy 3: The QR string might be plain XML (old format / e-Aadhaar)
		if (qrStringData && (qrStringData.includes('<?xml') || qrStringData.includes('<PrintLetterBarcodeData'))) {
			return this.parseFromXmlString(qrStringData);
		}

		// Strategy 4: Try treating string as base64
		if (qrStringData && qrStringData.length > 100) {
			try {
				const decoded = Buffer.from(qrStringData, 'base64');
				if (decoded.length > 50) {
					const result = this.parseFromBinary(new Uint8Array(decoded));
					if (result) return result;
				}
			} catch { }
		}

		return null;
	}

	private parseFromBase10(base10Str: string): ParsedQR | null {
		try {
			console.log('[AadharAPI] Attempting base10 parse, length:', base10Str.length);

			const bytes = this.bigIntStringToBytes(base10Str);
			console.log('[AadharAPI] Converted to', bytes.length, 'bytes');
			console.log('[AadharAPI] First 20 bytes:', Array.from(bytes.slice(0, 20)).map(b => b.toString(16)).join(' '));

			if (bytes.length < 50) {
				console.log('[AadharAPI] Too few bytes after conversion');
				return null;
			}

			// Try decompression
			let decompressed: Uint8Array;
			try {
				decompressed = inflate(bytes);
				console.log('[AadharAPI] Decompressed to', decompressed.length, 'bytes');
			} catch (inflateErr) {
				console.log('[AadharAPI] Inflate failed, trying raw bytes');
				decompressed = bytes;
			}

			return this.parseDelimitedFields(decompressed);

		} catch (e: any) {
			console.log('[AadharAPI] Base10 parse failed:', e.message);
			return null;
		}
	}

	private bigIntStringToBytes(base10Str: string): Uint8Array {
		const clean = base10Str.replace(/\s/g, '');
		let big = BigInt(clean);
		const bytes: number[] = [];

		while (big > 0n) {
			bytes.unshift(Number(big & 0xFFn));
			big = big >> 8n;
		}

		return new Uint8Array(bytes);
	}

	private parseFromBinary(binaryData: Uint8Array): ParsedQR | null {
		try {
			let decompressed: Uint8Array;
			try {
				decompressed = inflate(binaryData);
			} catch {
				decompressed = binaryData;
			}
			return this.parseDelimitedFields(decompressed);
		} catch (e) {
			return null;
		}
	}

	// ── Split raw bytes by delimiter ──
	private splitFields(data: Uint8Array, delimiter: number): Uint8Array[] {
		const fields: Uint8Array[] = [];
		let start = 0;
		for (let i = 0; i < data.length; i++) {
			if (data[i] === delimiter) {
				fields.push(data.slice(start, i));
				start = i + 1;
			}
		}
		if (start < data.length) {
			fields.push(data.slice(start));
		}
		return fields;
	}

	// ── Auto-detect schema version by examining first few fields ──
	private detectSchema(fields: Uint8Array[]): SchemaInfo {
		const decode = (idx: number): string => {
			if (idx >= fields.length) return '';
			try { return new TextDecoder('iso-8859-1').decode(fields[idx]).trim(); }
			catch { return new TextDecoder('utf-8').decode(fields[idx]).trim(); }
		};

		const f0 = decode(0);
		const f1 = decode(1);
		const f2 = decode(2);

		// Pattern A: V2 prefix (older cards) — F0="V2", F1=status, F2=refId
		if (/^V\d+$/i.test(f0) && /^\d{1,2}$/.test(f1) && /^\d{18,22}$/.test(f2)) {
			console.log(`[AadharAPI] Schema detected: ${f0} (offset=1, textFields=17)`);
			return { version: f0.toUpperCase(), offset: 1, textFieldCount: 17 };
		}

		// Pattern B: Standard (newer cards) — F0=status, F1=refId, F2=name
		if (/^\d{1,2}$/.test(f0) && /^\d{18,22}$/.test(f1) && f2.length > 2 && /[a-zA-Z]/.test(f2)) {
			console.log('[AadharAPI] Schema detected: STANDARD (offset=0, textFields=16)');
			return { version: 'STANDARD', offset: 0, textFieldCount: 16 };
		}

		// Pattern C: Fallback brute-force — find the reference ID pattern
		for (let i = 0; i < Math.min(fields.length, 6); i++) {
			const val = decode(i);
			const next = decode(i + 1);
			if (/^\d{18,22}$/.test(val) && next.length > 2 && /[a-zA-Z]/.test(next)) {
				const offset = i - 1; // refId should be at index 1
				console.log(`[AadharAPI] Schema detected: FALLBACK (offset=${offset}, textFields=${16 + offset})`);
				return { version: 'FALLBACK', offset: Math.max(0, offset), textFieldCount: 16 + Math.max(0, offset) };
			}
		}

		// Pattern D: Desperate fallback — assume standard and let validation catch errors
		console.log('[AadharAPI] Schema unknown, assuming STANDARD with validation fallback');
		return { version: 'UNKNOWN', offset: 0, textFieldCount: 16 };
	}

	// ── Main delimited field parser ──
	private parseDelimitedFields(data: Uint8Array): ParsedQR | null {
		const fields = this.splitFields(data, 255);

		console.log('[AadharAPI] Found', fields.length, 'fields by delimiter 255');
		console.log('[AadharAPI] Field lengths:', fields.map((f, i) => `F${i}=${f.length}`).join(', '));

		if (fields.length < 5) {
			console.log('[AadharAPI] Too few fields, trying alternative delimiter 254');
			const altFields = this.splitFields(data, 254);
			if (altFields.length >= 5) {
				return this.parseWithFields(altFields, data, 'alt-delimiter-254', );
			}
			return null;
		}

		return this.parseWithFields(fields, data, 'uidai-delimited');
	}

	// ── Core parsing logic with dynamic offset ──
	private parseWithFields(fields: Uint8Array[], rawData: Uint8Array, strategy: string): ParsedQR | null {
		const decode = (bytes: Uint8Array): string => {
			try { return new TextDecoder('iso-8859-1').decode(bytes); }
			catch { return new TextDecoder('utf-8').decode(bytes); }
		};

		const getField = (idx: number): string | null => {
			if (idx >= fields.length) return null;
			const val = decode(fields[idx]).trim();
			return val || null;
		};

		// Detect schema version
		const schema = this.detectSchema(fields);

		// Extract fields using detected offset
		let emailMobileStatus = getField(0 + schema.offset) || '0';
		let referenceId = getField(1 + schema.offset) || '';
		let name = getField(2 + schema.offset);
		let dob = getField(3 + schema.offset);
		let gender = getField(4 + schema.offset);
		let careOf = getField(5 + schema.offset);
		let district = getField(6 + schema.offset);
		let landmark = getField(7 + schema.offset);
		let house = getField(8 + schema.offset);
		let location = getField(9 + schema.offset);
		let pinCode = getField(10 + schema.offset);
		let postOffice = getField(11 + schema.offset);
		let state = getField(12 + schema.offset);
		let street = getField(13 + schema.offset);
		let subDistrict = getField(14 + schema.offset);
		let vtc = getField(15 + schema.offset);

		// ── VALIDATION & AUTO-CORRECTION ──
		// If critical fields look wrong, try alternate offsets as fallback
		const refIdValid = /^\d{18,22}$/.test(referenceId);
		const nameValid = !!name && name.length > 2 && /[a-zA-Z\s]/.test(name) && !/^\d+$/.test(name);
		const dobValid = !!dob && /^\d{2}[\/\-.]\d{2}[\/\-.]\d{4}$/.test(dob);
		const genderValid = !!gender && /^[MFT]$/.test(gender);

		if (!refIdValid || !nameValid || !dobValid || !genderValid) {
			console.log('[AadharAPI] Primary schema validation failed, trying alternate offsets...');
			
			const tryOffsets = schema.offset === 0 ? [1] : [0];
			for (const altOffset of tryOffsets) {
				const altRefId = getField(1 + altOffset) || '';
				const altName = getField(2 + altOffset);
				const altDob = getField(3 + altOffset);
				const altGender = getField(4 + altOffset);

				const altRefValid = /^\d{18,22}$/.test(altRefId);
				const altNameValid = !!altName && altName.length > 2 && /[a-zA-Z\s]/.test(altName) && !/^\d+$/.test(altName);
				const altDobValid = !!altDob && /^\d{2}[\/\-.]\d{2}[\/\-.]\d{4}$/.test(altDob);
				const altGenderValid = !!altGender && /^[MFT]$/.test(altGender);

				if (altRefValid && altNameValid && altDobValid && altGenderValid) {
					console.log(`[AadharAPI] Auto-corrected to offset=${altOffset}`);
					schema.offset = altOffset;
					schema.textFieldCount = 16 + altOffset;
					emailMobileStatus = getField(0 + altOffset) || '0';
					referenceId = altRefId;
					name = altName;
					dob = altDob;
					gender = altGender;
					careOf = getField(5 + altOffset);
					district = getField(6 + altOffset);
					landmark = getField(7 + altOffset);
					house = getField(8 + altOffset);
					location = getField(9 + altOffset);
					pinCode = getField(10 + altOffset);
					postOffice = getField(11 + altOffset);
					state = getField(12 + altOffset);
					street = getField(13 + altOffset);
					subDistrict = getField(14 + altOffset);
					vtc = getField(15 + altOffset);
					break;
				}
			}
		}

		// Log extracted fields for debugging
		console.log(`[AadharAPI] Field 0+${schema.offset}: "${emailMobileStatus}"`);
		console.log(`[AadharAPI] Field 1+${schema.offset}: "${referenceId?.slice(0, 50)}"`);
		console.log(`[AadharAPI] Field 2+${schema.offset}: "${name?.slice(0, 50)}"`);
		console.log(`[AadharAPI] Field 3+${schema.offset}: "${dob?.slice(0, 50)}"`);
		console.log(`[AadharAPI] Field 4+${schema.offset}: "${gender?.slice(0, 50)}"`);

		// Extract last 4 digits from reference ID (first 4 digits of refId = last 4 of Aadhaar)
		const last4Match = referenceId.match(/^(\d{4})/);
		const last4Digits = last4Match ? last4Match[1] : null;

		const statusNum = parseInt(emailMobileStatus, 10) || 0;
		const hasEmail = statusNum === 1 || statusNum === 3;
		const hasMobile = statusNum === 2 || statusNum === 3;

		// ── PHOTO EXTRACTION: Dynamic boundary detection ──
		let photoBase64: string | null = null;
		
		// Method 1: Count delimiters to find photo start after all text fields
		let delimiterCount = 0;
		let photoStartIndex = 0;
		for (let i = 0; i < rawData.length; i++) {
			if (rawData[i] === 255) {
				delimiterCount++;
				if (delimiterCount === schema.textFieldCount) {
					photoStartIndex = i + 1;
					break;
				}
			}
		}

		// Calculate end: total - signature(256) - optional hashes
		let photoEndIndex = rawData.length - 256;
		if (hasMobile) photoEndIndex -= 32;
		if (hasEmail) photoEndIndex -= 32;

		if (photoStartIndex > 0 && photoEndIndex > photoStartIndex && (photoEndIndex - photoStartIndex) > 100) {
			const photoBytes = rawData.slice(photoStartIndex, photoEndIndex);
			console.log('[AadharAPI] Photo bytes:', photoBytes.length, 'First bytes:', Array.from(photoBytes.slice(0, 10)).map(b => b.toString(16)).join(' '));
			photoBase64 = this.processPhoto(photoBytes);
		} else {
			// Fallback: find last delimiter before signature area
			const searchStart = rawData.length - 300 - (hasMobile ? 32 : 0) - (hasEmail ? 32 : 0);
			const lastDelim = rawData.lastIndexOf(255, Math.max(0, searchStart));
			if (lastDelim > 0) {
				const photoBytes = rawData.slice(lastDelim + 1, photoEndIndex);
				if (photoBytes.length > 100) {
					console.log('[AadharAPI] Photo fallback bytes:', photoBytes.length);
					photoBase64 = this.processPhoto(photoBytes);
				}
			}
		}

		// Build address in logical order
		const addressParts = [
			careOf, house, street, landmark, location, vtc, district, subDistrict, state, pinCode
		].filter(Boolean);

		const address = addressParts.length > 0 ? addressParts.join(', ') : null;

		return {
			emailMobileStatus,
			referenceId,
			name,
			dob,
			gender,
			careOf,
			district,
			landmark,
			house,
			location,
			pinCode,
			postOffice,
			state,
			street,
			subDistrict,
			vtc,
			last4Digits,
			lastDigit: last4Digits ? last4Digits.slice(-1) : null,
			photoBase64,
			hasEmail,
			hasMobile,
			rawXml: null,
			parseStrategy: `${strategy}-${schema.version}`
		};
	}

	private parseFromXmlString(xmlStr: string): ParsedQR | null {
		const extract = (attr: string): string | null => {
			const regex = new RegExp(`${attr}\\s*=\\s*["']([^"']+)["']`, 'i');
			const m = xmlStr.match(regex);
			return m ? m[1].trim() : null;
		};

		const refId = extract('refId') || extract('referenceId') || '';
		const last4 = refId.match(/(\d{4})$/)?.[1] || null;

		return {
			emailMobileStatus: '0',
			referenceId: refId,
			name: extract('name'),
			dob: extract('dob') || extract('yob'),
			gender: extract('gender'),
			careOf: extract('co'),
			district: extract('dist'),
			landmark: extract('lm'),
			house: extract('house'),
			location: extract('loc'),
			pinCode: extract('pc'),
			postOffice: extract('po'),
			state: extract('state'),
			street: extract('street'),
			subDistrict: extract('subdist'),
			vtc: extract('vtc'),
			last4Digits: last4,
			lastDigit: last4 ? last4.slice(-1) : null,
			photoBase64: null,
			hasEmail: false,
			hasMobile: false,
			rawXml: xmlStr.slice(0, 1000),
			parseStrategy: 'xml-fallback'
		};
	}

	// private processPhoto(photoBytes: Uint8Array): string | null {
	// 	if (!photoBytes || photoBytes.length < 100) return null;

	// 	try {
	// 		const isJpeg = photoBytes[0] === 0xFF && photoBytes[1] === 0xD8;
	// 		const isJp2Boxed = photoBytes[0] === 0x00 && photoBytes[1] === 0x00 &&
	// 			photoBytes[2] === 0x00 && photoBytes[3] === 0x0C;
	// 		const isJpxBoxed = photoBytes[0] === 0x00 && photoBytes[1] === 0x00 &&
	// 			photoBytes[2] === 0x00 && photoBytes[3] === 0x0D;
	// 		const isJ2kCodestream = photoBytes[0] === 0xFF && photoBytes[1] === 0x4F &&
	// 			photoBytes[2] === 0xFF && photoBytes[3] === 0x51;
	// 		const isPng = photoBytes[0] === 0x89 && photoBytes[1] === 0x50;

	// 		// ── Standard formats: pass through as Base64 ──
	// 		if (isJpeg) {
	// 			return `data:image/jpeg;base64,${Buffer.from(photoBytes).toString('base64')}`;
	// 		}
	// 		if (isPng) {
	// 			return `data:image/png;base64,${Buffer.from(photoBytes).toString('base64')}`;
	// 		}
	// 		if (isJp2Boxed || isJpxBoxed) {
	// 			return `data:image/jp2;base64,${Buffer.from(photoBytes).toString('base64')}`;
	// 		}

	// 		// ── JPEG 2000 Codestream (J2C): Decode → RGBA → JPEG ──
	// 		if (isJ2kCodestream) {
	// 			console.log('[AadharAPI] Detected J2K codestream, decoding via jpeg2000...');

	// 			const nodeBuffer = Buffer.from(photoBytes.buffer, photoBytes.byteOffset, photoBytes.byteLength);

	// 			const jpx = new JpxImage();
	// 			jpx.parse(nodeBuffer);

	// 			const width = jpx.width;
	// 			const height = jpx.height;
	// 			const numComponents = jpx.componentsCount;

	// 			console.log(`[AadharAPI] J2K decoded: ${width}x${height}, ${numComponents} component(s)`);

	// 			if (!width || !height || !jpx.tiles || jpx.tiles.length === 0) {
	// 				console.log('[AadharAPI] J2K decode produced no image data');
	// 				return null;
	// 			}

	// 			const tile = jpx.tiles[0];
	// 			const tileData = tile.items;

	// 			const totalPixels = width * height;
	// 			const rgba = new Uint8Array(totalPixels * 4);

	// 			if (numComponents === 1) {
	// 				for (let i = 0; i < totalPixels; i++) {
	// 					const val = tileData[i];
	// 					rgba[i * 4] = val;
	// 					rgba[i * 4 + 1] = val;
	// 					rgba[i * 4 + 2] = val;
	// 					rgba[i * 4 + 3] = 255;
	// 				}
	// 			} else if (numComponents === 3) {
	// 				if (tileData.length >= totalPixels * 3) {
	// 					for (let i = 0; i < totalPixels; i++) {
	// 						rgba[i * 4] = tileData[i * 3];
	// 						rgba[i * 4 + 1] = tileData[i * 3 + 1];
	// 						rgba[i * 4 + 2] = tileData[i * 3 + 2];
	// 						rgba[i * 4 + 3] = 255;
	// 					}
	// 				} else {
	// 					for (let i = 0; i < totalPixels; i++) {
	// 						rgba[i * 4] = tileData[i];
	// 						rgba[i * 4 + 1] = tileData[i + totalPixels];
	// 						rgba[i * 4 + 2] = tileData[i + totalPixels * 2];
	// 						rgba[i * 4 + 3] = 255;
	// 					}
	// 				}
	// 			} else if (numComponents >= 4) {
	// 				if (tileData.length >= totalPixels * 4) {
	// 					for (let i = 0; i < totalPixels; i++) {
	// 						rgba[i * 4] = tileData[i * 4];
	// 						rgba[i * 4 + 1] = tileData[i * 4 + 1];
	// 						rgba[i * 4 + 2] = tileData[i * 4 + 2];
	// 						rgba[i * 4 + 3] = tileData[i * 4 + 3];
	// 					}
	// 				} else {
	// 					for (let i = 0; i < totalPixels; i++) {
	// 						rgba[i * 4] = tileData[i];
	// 						rgba[i * 4 + 1] = tileData[i + totalPixels];
	// 						rgba[i * 4 + 2] = tileData[i + totalPixels * 2];
	// 						rgba[i * 4 + 3] = tileData[i + totalPixels * 3];
	// 					}
	// 				}
	// 			}

	// 			const rawImageData = { data: rgba, width, height };
	// 			const jpegBuffer = JPEG.encode(rawImageData, 85);

	// 			console.log(`[AadharAPI] Encoded to JPEG: ${jpegBuffer.data.length} bytes`);

	// 			return `data:image/jpeg;base64,${Buffer.from(jpegBuffer.data).toString('base64')}`;
	// 		}

	// 		// ── Unknown format: fallback to raw base64 ──
	// 		console.log('[AadharAPI] Unknown photo format, returning raw bytes');
	// 		return `data:application/octet-stream;base64,${Buffer.from(photoBytes).toString('base64')}`;

	// 	} catch (e: any) {
	// 		console.log('[AadharAPI] Photo processing failed:', e.message || e);
	// 		return null;
	// 	}
	// }
	private processPhoto(photoBytes: Uint8Array): string | null {
	if (!photoBytes || photoBytes.length < 100) return null;

	try {
		// ═══ STRIP GARBAGE PREFIX (Newer cards inject masked ID text) ═══
		let cleanBytes = photoBytes;
		let offset = 0;
		const maxScan = Math.min(photoBytes.length, 100);

		for (let i = 0; i < maxScan; i++) {
			const b0 = photoBytes[i];
			const b1 = photoBytes[i + 1];
			const b2 = photoBytes[i + 2];
			const b3 = photoBytes[i + 3];

			// JPEG marker: FF D8
			if (b0 === 0xFF && b1 === 0xD8) {
				offset = i;
				break;
			}
			// J2K codestream: FF 4F FF 51
			if (b0 === 0xFF && b1 === 0x4F && b2 === 0xFF && b3 === 0x51) {
				offset = i;
				break;
			}
			// JP2 box: 00 00 00 0C or 00 00 00 0D
			if (b0 === 0x00 && b1 === 0x00 && b2 === 0x00 && (b3 === 0x0C || b3 === 0x0D)) {
				offset = i;
				break;
			}
			// PNG marker: 89 50
			if (b0 === 0x89 && b1 === 0x50) {
				offset = i;
				break;
			}
		}

		if (offset > 0) {
			console.log(`[AadharAPI] Stripped ${offset} garbage bytes from photo start. Prefix: "${new TextDecoder('ascii').decode(photoBytes.slice(0, Math.min(offset, 20)))}"`);
			cleanBytes = photoBytes.slice(offset);
		}

		// ═══ FORMAT DETECTION (now on clean bytes) ═══
		const isJpeg = cleanBytes[0] === 0xFF && cleanBytes[1] === 0xD8;
		const isJp2Boxed = cleanBytes[0] === 0x00 && cleanBytes[1] === 0x00 &&
			cleanBytes[2] === 0x00 && cleanBytes[3] === 0x0C;
		const isJpxBoxed = cleanBytes[0] === 0x00 && cleanBytes[1] === 0x00 &&
			cleanBytes[2] === 0x00 && cleanBytes[3] === 0x0D;
		const isJ2kCodestream = cleanBytes[0] === 0xFF && cleanBytes[1] === 0x4F &&
			cleanBytes[2] === 0xFF && cleanBytes[3] === 0x51;
		const isPng = cleanBytes[0] === 0x89 && cleanBytes[1] === 0x50;

		// ── Standard formats: pass through as Base64 ──
		if (isJpeg) {
			return `data:image/jpeg;base64,${Buffer.from(cleanBytes).toString('base64')}`;
		}
		if (isPng) {
			return `data:image/png;base64,${Buffer.from(cleanBytes).toString('base64')}`;
		}
		if (isJp2Boxed || isJpxBoxed) {
			return `data:image/jp2;base64,${Buffer.from(cleanBytes).toString('base64')}`;
		}

		// ── JPEG 2000 Codestream (J2C): Decode → RGBA → JPEG ──
		if (isJ2kCodestream) {
			console.log('[AadharAPI] Detected J2K codestream, decoding via jpeg2000...');

			const nodeBuffer = Buffer.from(cleanBytes.buffer, cleanBytes.byteOffset, cleanBytes.byteLength);

			const jpx = new JpxImage();
			jpx.parse(nodeBuffer);

			const width = jpx.width;
			const height = jpx.height;
			const numComponents = jpx.componentsCount;

			console.log(`[AadharAPI] J2K decoded: ${width}x${height}, ${numComponents} component(s)`);

			if (!width || !height || !jpx.tiles || jpx.tiles.length === 0) {
				console.log('[AadharAPI] J2K decode produced no image data');
				return null;
			}

			const tile = jpx.tiles[0];
			const tileData = tile.items;

			const totalPixels = width * height;
			const rgba = new Uint8Array(totalPixels * 4);

			if (numComponents === 1) {
				for (let i = 0; i < totalPixels; i++) {
					const val = tileData[i];
					rgba[i * 4] = val;
					rgba[i * 4 + 1] = val;
					rgba[i * 4 + 2] = val;
					rgba[i * 4 + 3] = 255;
				}
			} else if (numComponents === 3) {
				if (tileData.length >= totalPixels * 3) {
					for (let i = 0; i < totalPixels; i++) {
						rgba[i * 4] = tileData[i * 3];
						rgba[i * 4 + 1] = tileData[i * 3 + 1];
						rgba[i * 4 + 2] = tileData[i * 3 + 2];
						rgba[i * 4 + 3] = 255;
					}
				} else {
					for (let i = 0; i < totalPixels; i++) {
						rgba[i * 4] = tileData[i];
						rgba[i * 4 + 1] = tileData[i + totalPixels];
						rgba[i * 4 + 2] = tileData[i + totalPixels * 2];
						rgba[i * 4 + 3] = 255;
					}
				}
			} else if (numComponents >= 4) {
				if (tileData.length >= totalPixels * 4) {
					for (let i = 0; i < totalPixels; i++) {
						rgba[i * 4] = tileData[i * 4];
						rgba[i * 4 + 1] = tileData[i * 4 + 1];
						rgba[i * 4 + 2] = tileData[i * 4 + 2];
						rgba[i * 4 + 3] = tileData[i * 4 + 3];
					}
				} else {
					for (let i = 0; i < totalPixels; i++) {
						rgba[i * 4] = tileData[i];
						rgba[i * 4 + 1] = tileData[i + totalPixels];
						rgba[i * 4 + 2] = tileData[i + totalPixels * 2];
						rgba[i * 4 + 3] = tileData[i + totalPixels * 3];
					}
				}
			}

			const rawImageData = { data: rgba, width, height };
			const jpegBuffer = JPEG.encode(rawImageData, 85);

			console.log(`[AadharAPI] Encoded to JPEG: ${jpegBuffer.data.length} bytes`);

			return `data:image/jpeg;base64,${Buffer.from(jpegBuffer.data).toString('base64')}`;
		}

		// ── Unknown format: fallback to raw base64 ──
		console.log('[AadharAPI] Unknown photo format after stripping, returning raw bytes');
		return `data:application/octet-stream;base64,${Buffer.from(cleanBytes).toString('base64')}`;

	} catch (e: any) {
		console.log('[AadharAPI] Photo processing failed:', e.message || e);
		return null;
	}
}
}

// ═══════════════════════════════════════════════════════════════════════════════
// ULTRA-ROBUST OCR — 3 preprocessing pipelines, picks best result
// ═══════════════════════════════════════════════════════════════════════════════
async function runOCR(buffer: Buffer): Promise<{
	text: string;
	confidence: number;
	aadharNumber: string | null;
	aadharValid: boolean;
	name: string | null;
	dob: string | null;
}> {
	const require = createRequire(import.meta.url);
	const resolvedWorkerPath = path.resolve(
		process.cwd(),
		'./node_modules/tesseract.js/src/worker-script/node/index.js'
	);

	const worker = await createWorker('eng', 1, {
		logger: () => { },
		errorHandler: () => { },
		workerPath: resolvedWorkerPath,
		cachePath: path.resolve(process.cwd()),
	});

	// 1. GET IMAGE DIMENSIONS
    const meta = await sharp(buffer).metadata();
    const w = meta.width || 1000;
    const h = meta.height || 1000;

    // 2. CROP THE BOTTOM 35% (Where the 12-digit number is located)
    // This removes the face, the Hindi text, and the address, leaving only the digits!
    const cropTop = Math.floor(h * 0.5);
    const cropHeight = Math.floor(h * 0.5);

    const croppedBuffer = await sharp(buffer)
        .extract({ left: 0, top: cropTop, width: w, height: cropHeight })
        .toBuffer();

	// Try 3 different preprocessing strategies
	const strategies = [
		{
			name: 'original-color',
			preprocess: () => sharp(croppedBuffer)
				.resize(2000, null, { fit: 'contain' }) // upscale width to 2000px for sharp text
				.toBuffer(),
		},
		{
			name: 'grayscale-normalize',
			preprocess: () => sharp(croppedBuffer)
				.resize(2000, null, { fit: 'contain' }) // upscale width to 2000px for sharp text
				.grayscale()
				.normalize()
				.toBuffer(),
		},
		{
			name: 'adaptive-threshold',
			preprocess: () => sharp(croppedBuffer)
				.resize(2000, null, { fit: 'contain' }) // upscale width to 2000px for sharp text
				.grayscale()
				.normalize()
				.threshold(180) // Much gentler than 150
				.toBuffer(),
		},
	];

	let bestResult: {
		text: string;
		confidence: number;
		strategy: string;
	} | null = null;

	for (const strat of strategies) {
		try {
			const processed = await strat.preprocess();
			const result = await worker.recognize(processed);
			const confidence = result.data.confidence || 0;
			const text = result.data.text || '';

			console.log(`[AadharAPI] OCR strategy ${strat.name}: confidence=${confidence}, textLen=${text.length}`);

			if (!bestResult || confidence > bestResult.confidence) {
				bestResult = { text, confidence, strategy: strat.name };
			}

			// Early exit if we got a valid Aadhar number
			const quickAadhar = extractAadharFromText(text);
			if (quickAadhar && validateAadharVerhoeff(quickAadhar)) {
				console.log(`[AadharAPI] Early exit: valid Aadhar found in ${strat.name}`);
				bestResult = { text, confidence, strategy: strat.name };
				break;
			}
		} catch (e) {
			console.log(`[AadharAPI] OCR strategy ${strat.name} failed:`, (e as Error).message);
		}
	}

	await worker.terminate();

	if (!bestResult) {
		return { text: '', confidence: 0, aadharNumber: null, aadharValid: false, name: null, dob: null };
	}

	const rawText = bestResult.text;

	// Extract Aadhar with multiple strategies
	let aadharNumber = extractAadharFromText(rawText);
	const aadharValid = aadharNumber ? validateAadharVerhoeff(aadharNumber) : false;

	// Try common OCR misread corrections if Verhoeff fails
	if (aadharNumber && !aadharValid) {
		const corrected = correctOCRMisreads(aadharNumber);
		if (corrected !== aadharNumber && validateAadharVerhoeff(corrected)) {
			console.log(`[AadharAPI] Corrected OCR: ${aadharNumber} → ${corrected}`);
			aadharNumber = corrected;
		}
	}

	// Extract name
	const namePatterns = [
		/(?:Name|नाम|NAME)[:\s]+([A-Z][a-zA-Z\s]{2,40})/i,
		/([A-Z][a-z]+\s+[A-Z][a-z]+)/, // Generic proper noun fallback
	];
	let name: string | null = null;
	for (const pattern of namePatterns) {
		const match = rawText.match(pattern);
		if (match) {
			name = match[1].trim();
			break;
		}
	}

	// Extract DOB
	const dobPatterns = [
		/(\d{2}[\/\.-]\d{2}[\/\.-]\d{4})/,
		/DOB[:\s]+(\d{2}[\/\.-]\d{2}[\/\.-]\d{4})/i,
		/(\d{4})/, // Year only fallback
	];
	let dob: string | null = null;
	for (const pattern of dobPatterns) {
		const match = rawText.match(pattern);
		if (match) {
			dob = match[1];
			break;
		}
	}

	return {
		text: rawText,
		confidence: bestResult.confidence,
		aadharNumber,
		aadharValid,
		name,
		dob,
	};
}

// Extract 12-digit Aadhar from OCR text
function extractAadharFromText(text: string): string | null {
	// Strategy 1: Formatted with spaces/hyphens
	const formattedMatch = text.match(/(\d{4})\s*[-]?\s*(\d{4})\s*[-]?\s*(\d{4})/);
	if (formattedMatch) {
		const num = formattedMatch[1] + formattedMatch[2] + formattedMatch[3];
		if (validateAadharVerhoeff(num)) return num;
	}

	// Strategy 2: Raw 12 contiguous digits
	const rawMatches = text.match(/(\d{12})/g);
	if (rawMatches) {
		const valid = rawMatches.find(n => validateAadharVerhoeff(n));
		if (valid) return valid;
		// Return first 12-digit even if invalid (for manual correction)
		return rawMatches[0];
	}

	// Strategy 3: 12 digits with noise (OCR errors like spaces in middle)
	const noisyMatch = text.match(/(\d[\d\s-]{10,14}\d)/);
	if (noisyMatch) {
		const cleaned = noisyMatch[1].replace(/[\s-]/g, '');
		if (cleaned.length === 12) return cleaned;
	}

	return null;
}

// Correct common OCR misreads on Aadhar cards
function correctOCRMisreads(num: string): string {
	// Common OCR errors: B→8, O→0, I→1, S→5, Z→2, G→6
	const corrections: Record<string, string> = {
		'B': '8', 'O': '0', 'o': '0', 'I': '1', 'l': '1', 'S': '5',
		's': '5', 'Z': '2', 'z': '2', 'G': '6', 'g': '6', 'q': '9',
		'Q': '9', 'A': '4', 'a': '4', 'T': '7', 't': '7',
	};

	return num.split('').map(c => corrections[c] || c).join('');
}

// ═══════════════════════════════════════════════════════════════════════════════
// RATE LIMITING
// ═══════════════════════════════════════════════════════════════════════════════
const ipMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 20;

function checkRateLimit(ip: string): boolean {
	const now = Date.now();
	const entry = ipMap.get(ip);
	if (!entry || now > entry.resetAt) {
		ipMap.set(ip, { count: 1, resetAt: now + 60000 });
		return true;
	}
	if (entry.count >= RATE_LIMIT) return false;
	entry.count++;
	return true;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN HANDLER
// ═══════════════════════════════════════════════════════════════════════════════
export async function POST(req: NextRequest) {
	const startTime = Date.now();
	const ip = req.headers.get('x-forwarded-for') || 'unknown';

	try {
		if (!checkRateLimit(ip)) {
			return NextResponse.json({ error: 'Rate limit exceeded. Max 20 scans/minute.' }, { status: 429 });
		}

		const { base64, mimeType, qrStringData: preScannedQr } = await req.json();
		if (!base64 || typeof base64 !== 'string') {
			return NextResponse.json({ error: 'Missing or invalid base64 image' }, { status: 400 });
		}
		if (base64.length > 11_000_000) {
			return NextResponse.json({ error: 'Image too large. Max 6MB.' }, { status: 413 });
		}

		const buffer = Buffer.from(base64, 'base64');
		if (buffer.length < 1000) {
			return NextResponse.json({ error: 'Image data too small or corrupted' }, { status: 400 });
		}

		// ═══ ULTRA-ROBUST QR DETECTION ═══════════════════════════════════════════
		let qrData: ParsedQR | null = null;
		let qrError: string | null = null;
		let qrDetectResult: QRDetectResult | null = null;

		// PRIORITY 1: Use pre-scanned QR string from mobile camera (most reliable)

		if (preScannedQr && typeof preScannedQr === 'string' && preScannedQr.length > 50) {
			console.log('[AadharAPI] Using pre-scanned QR from mobile camera, length:', preScannedQr.length);
			qrDetectResult = {
				qrString: preScannedQr,
				binaryData: null,
				strategy: 'mobile-camera',
			};

			const parser = new UIDAISecureQRParser();
			qrData = parser.parse(preScannedQr, null);

			if (!qrData) {
				qrError = 'Mobile camera scanned QR but backend could not parse UIDAI format';
			}
		}

		// PRIORITY 2: Fallback to server-side image QR detection (if mobile missed it)
		if (!qrData && !qrDetectResult?.qrString) {
			try {
				qrDetectResult = await detectQR(buffer);

				if (qrDetectResult.qrString) {
					console.log('[AadharAPI] QR raw string length:', qrDetectResult.qrString.length);
					console.log('[AadharAPI] QR raw preview:', qrDetectResult.qrString.slice(0, 100));
					console.log('[AadharAPI] QR binaryData length:', qrDetectResult.binaryData?.length || 0);

					const parser = new UIDAISecureQRParser();
					qrData = parser.parse(qrDetectResult.qrString, qrDetectResult.binaryData);

					if (!qrData) {
						qrError = `QR detected (strategy: ${qrDetectResult.strategy}) but could not parse as UIDAI Secure QR format`;
					}
				} else {
					qrError = 'No QR code detected in image after 5 strategies';
				}
			} catch (e: any) {
				qrError = e.message || 'QR decode exception';
				console.error('[AadharAPI] QR Error:', e);
			}
		}

		// ═══ ULTRA-ROBUST OCR ════════════════════════════════════════════════════
		let ocrResult: Awaited<ReturnType<typeof runOCR>> | null = null;
		let ocrError: string | null = null;

		try {
			ocrResult = await runOCR(buffer);
		} catch (e: any) {
			ocrError = e.message || 'OCR exception';
			console.error('[AadharAPI] OCR Error:', e);
		}

		// ═══ CROSS-VALIDATION ════════════════════════════════════════════════════
		const ocrAadhar = ocrResult?.aadharNumber || null;
		const qrLast4 = qrData?.last4Digits || null;
		const ocrLast4 = ocrAadhar ? ocrAadhar.slice(-4) : null;

		let isVerified = false;
		let last4Match = false;
		let verificationNote = '';
		let riskLevel: 'low' | 'medium' | 'high' = 'high';

		if (qrLast4 && ocrLast4) {
			last4Match = qrLast4 === ocrLast4;
			isVerified = last4Match && (ocrResult?.aadharValid || false);

			if (last4Match && ocrResult?.aadharValid) {
				verificationNote = `VERIFIED: QR last-4 (${qrLast4}) matches OCR number (${ocrAadhar}). Verhoeff checksum passed.`;
				riskLevel = 'low';
			} else if (last4Match) {
				verificationNote = `PARTIAL: Last-4 match (${qrLast4}), but OCR number ${ocrAadhar} failed Verhoeff checksum. Possible misread.`;
				riskLevel = 'medium';
			} else {
				verificationNote = `CRITICAL MISMATCH: OCR last-4 (${ocrLast4}) ≠ QR last-4 (${qrLast4}). Card may be tampered or OCR misread.`;
				riskLevel = 'high';
			}
		} else if (qrLast4) {
			verificationNote = `QR decoded (last-4: ${qrLast4}) but OCR could not read 12-digit number. Enter manually.`;
			riskLevel = 'medium';
		} else if (ocrAadhar) {
			const verhoeff = ocrResult?.aadharValid ? 'passed' : 'FAILED';
			verificationNote = `OCR found ${ocrAadhar} (Verhoeff ${verhoeff}) but QR unreadable. Cannot verify authenticity.`;
			riskLevel = ocrResult?.aadharValid ? 'medium' : 'high';
		} else {
			verificationNote = 'Could not extract Aadhar number. Manual entry required.';
			riskLevel = 'high';
		}

		const response = {
			success: true,
			meta: {
				processingTimeMs: Date.now() - startTime,
				qrStrategy: qrData?.parseStrategy || 'none',
				qrDetectStrategy: qrDetectResult?.strategy || 'none',
				qrRawLength: qrDetectResult?.qrString?.length || 0,
				ocrConfidence: ocrResult?.confidence || 0,
				ocrStrategy: (ocrResult as any)?.strategy || 'unknown',
			},
			qr: qrData ? {
				name: qrData.name,
				gender: qrData.gender,
				dob: qrData.dob,
				address: [qrData.careOf, qrData.house, qrData.street, qrData.landmark, qrData.location, qrData.vtc, qrData.district, qrData.subDistrict, qrData.state, qrData.pinCode].filter(Boolean).join(', ') || null,
				last4Digits: qrData.last4Digits,
				photoBase64: qrData.photoBase64,
				referenceId: qrData.referenceId,
			} : null,
			qrError,
			ocr: ocrResult ? {
				fullAadharNumber: ocrResult.aadharNumber,
				aadharValid: ocrResult.aadharValid,
				name: ocrResult.name,
				dob: ocrResult.dob,
				rawText: ocrResult.text.slice(0, 3000),
				confidence: ocrResult.confidence,
			} : null,
			ocrError,
			verification: {
				isVerified,
				last4Match,
				verificationNote,
				riskLevel,
			}
		};

		console.log("--------------------------------------------- Response ----------------------------------------------------");
		console.log(JSON.stringify(response, null, 2));

		return NextResponse.json(response);

	} catch (error: any) {
		console.error('[AadharAPI] Fatal Error:', error);
		return NextResponse.json(
			{ error: error.message || 'Internal server error', success: false },
			{ status: 500 }
		);
	}
}


