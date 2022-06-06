import { toast } from 'react-toastify';
import { ethers } from "ethers"
import { THCTokenContract } from "./config";

export const errHandler = (err: any) => {
	if (err) {
		console.log(err)
		if (err.code === 4001) {
			tips("you have cancelled the subscription")
		} else if (err.code === 'NETWORK_ERROR') {
			tips("Please check your network connection!")
		} else {
			tips(err.message)
		}
	} else {
		console.log("ignorant error")
		tips("ignorant error")
	}
}

export const tokenData = {
	THC: {
		contract: THCTokenContract,
		address: THCTokenContract.address,
		decimals: 9
	}

}
/**
 * change data type from Number to BigNum 
 * @param {Number} value - data that need to be change
 * @param {Number} d - decimals
 */
// @ts-ignore
export const toValue = (val: any, token: any) => ethers.utils.parseUnits((val).toString(), tokenData[token].decimals)
export const toBigNum = (value: any, d: any) => ethers.utils.parseUnits(Number(value).toFixed(d), d);
// @ts-ignore
export const fromValue = (val: any, d: any) => Number(ethers.utils.formatUnits((val).toString(), tokenData[token].decimals))
export const fromBigNum = (value: any, d: any) => parseFloat(ethers.utils.formatUnits(value, d));

export const tips = (html: string) => {
	toast(html, {
		position: "top-right",
		autoClose: 2000,
		className: 'zindex-r'
		/* hideProgressBar: false, */
		/* closeOnClick: true,
		pauseOnHover: true, */
		/* draggable: true, */
		/* progress: undefined, */
	});
}

// export const NF = (num:number,p:number=2) => Number(num).toFixed(p);// .replace(/(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
export const NF = (num: number, p: number = 2) => Number(num).toFixed(p).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
export const TF = (time: number, offset: number = 2) => {
	let iOffset = Number(offset);
	let date = time === undefined ? new Date(Date.now() * 1000 + (3600000 * iOffset)) : (typeof time === 'number' ? new Date(time * 1000 + (3600000 * iOffset)) : new Date(+time + (3600000 * iOffset)));
	let y = date.getUTCFullYear();
	let m = date.getUTCMonth() + 1;
	let d = date.getUTCDate();
	let hh = date.getUTCHours();
	let mm = date.getUTCMinutes();
	let ss = date.getUTCSeconds();
	let dt = ("0" + m).slice(-2) + "-" + ("0" + d).slice(-2);
	let tt = ("0" + hh).slice(-2) + ":" + ("0" + mm).slice(-2) + ":" + ("0" + ss).slice(-2);
	return y + '-' + dt + ' ' + tt;
}

export const copyToClipboard = (text: string) => {
	var textField = document.createElement('textarea')
	textField.innerText = text
	document.body.appendChild(textField)
	textField.select()
	document.execCommand('copy')
	textField.remove()
	tips(text);
};
