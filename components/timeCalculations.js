const requests = require("../models/requests");

class timeCalculations {
	constructor() {}

	valid(updateTime, lstTime) {
		return lstTime.getTime() - updateTime.getTime() > 0;
	}

	getCurDate() {
		const y = new Date().getFullYear();
		const m = new Date().getMonth();
		const d = new Date().getDate();
		return new Date(Date.UTC(y, m, d));
	}

	idxOfRecord(curDate, doc) {
		for (let i = 0; i < doc.attendanceRecords.length; i++) {
			if (doc.attendanceRecords[i].day.getTime() === curDate.getTime()) {
				return i;
			}
		}
		return -1;
	}

	getCurTime() {
		return new Date(Date.UTC()).getTime();
	}

	check(now) {
		let cur = new Date(Date.UTC(now));
		let mins = cur.getHours() * 60 + cur.getMinutes();
		let le = 7 * 60,
			ri = 19 * 60;
		return mins >= le && mins <= ri;
	}

	calculateTotalTime(a, b) {
		let sum = 0;
		for (let i = 0, j = 0; i < a.length && j < b.length; j++) {
			while (i + 1 < a.length && a[i + 1] < b[j]) i++;
			if (a[i] < b[j] && this.check(a[i]) && this.check(b[i])) {
				sum += b[j] - a[i];
				i++;
			}
		}
		return sum / (1000 * 60 * 60); //in hours
	}

	getStartDate(now) {
		let year = now.getFullYear();
		let month = now.getMonth();
		let day = now.getDate();

		if (day >= 11) {
			return new Date(Date.UTC(year, month, 11));
		}

		month = month === 0 ? 11 : month - 1;
		year -= month === 11 ? 1 : 0;

		return new Date(Date.UTC(year, month, 11));
	}

	getEndDate(startDate) {
		let month = startDate.getMonth() === 11 ? 0 : startDate.getMonth() + 1;
		let year =
			month === 0 ? startDate.getFullYear() + 1 : startDate.getFullYear();

		return new Date(Date.UTC(year, month, 10));
	}

	calculateTotalInMonth(startDate, endDate, dayOff, flag) {
		let ret = 0;
		let inc = flag ? 8 * 60 + 24 : 1;
		for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
			if (d.getDay() === 5 || d.getDay() === dayOff) continue;
			ret += inc;
		}

		return ret;
	}

	calculateMissingHours(doc) {
		const now = this.getCurDate();
		let sum = 0;
		for (let d = this.getStartDate(now); d <= now; d.setDate(d.getDate() + 1)) {
			let idx = this.idxOfRecord(d, doc);
			if (idx > -1) {
				sum += doc.attendanceRecords[idx].totalTime;
			}
		}

		const totalTimeInMonth = this.calculateTotalInMonth(
			this.getStartDate(now),
			this.getEndDate(this.getStartDate(now)),
			doc.dayOff,
			true
		);

		return (sum - totalTimeInMonth) / 60;
	}

	calculateMissingDays(doc) {
		const now = this.getCurDate();
		let sum = 0;
		for (let d = this.getStartDate(now); d <= now; d.setDate(d.getDate() + 1)) {
			let idx = this.idxOfRecord(d, doc);
			if (
				idx > -1 &&
				doc.attendanceRecords[idx].totalTime > 0 &&
				(doc.attendanceRecords[idx].compensation ||
					doc.attendanceRecords[idx].weekDay !== doc.dayOff)
			) {
				sum += 1;
			}
		}
		const totalDaysInMonth = this.calculateTotalInMonth(
			this.getStartDate(now),
			this.getEndDate(this.getStartDate(now)),
			doc.dayOff,
			false
		);

		return totalDaysInMonth - sum;
	}

	async updateAttendance(doc, idx, curDate) {
		doc.attendanceRecords[idx].totalTime = this.calculateTotalTime(
			doc.attendanceRecords.signIn,
			doc.attendanceRecords.signOut
		);

		if (
			curDate.getDay() === doc.dayOff &&
			doc.attendanceRecords[idx].totalTime > 0
		) {
			//search for accepted compensation leaves that have been accepted but not
			//yet compensated prior to today if found then  compensation is true
			const reqID = doc.sentRequestsId;
			const arr = await requests.find({
				_id: { $in: reqID },
				status: "accepted",
				type: "compensation",
				compensated: false,
			});

			for (const request of arr) {
				if (curDate >= request.targetDate) {
					request.compensated = true;
					doc.compensation = true;
					await request.save();
					break;
				}
			}
		}
	}

	async signIn(doc, curDate = this.getCurDate(), curTime = this.getCurTime()) {
		let idx = this.idxOfRecord(curDate, doc);
		if (idx > -1) {
			doc.attendanceRecords.push({
				day: curDate,
				weekDay: curDate.getDay(),
			});
			idx = doc.attendanceRecords.length - 1;
		}

		doc.attendanceRecords[idx].signIn.push(curTime);
		await doc.attendanceRecords[idx].signIn.sort();

		await this.updateAttendance(doc, idx, curDate);
	}

	async signOut(doc, curDate = this.getCurDate(), curTime = this.getCurTime()) {
		let idx = this.idxOfRecord(curDate, doc);
		if (idx > -1) {
			doc.attendanceRecords.push({
				day: curDate,
				weekDay: curDate.getDay(),
			});
			idx = doc.attendanceRecords.length - 1;
		}

		doc.attendanceRecords[idx].signOut.push(curTime);
		await doc.attendanceRecords[idx].signOut.sort();

		await this.updateAttendance(doc, idx, curDate);
	}

	viewAttendanceRecords(month, doc) {
		let arr = [];
		let startDate = new Date(Date.UTC(new Date().getFullYear(), 0, 11));
		let endDate = this.getCurDate();

		if (month > -1) {
			startDate = new Date(Date.UTC(new Date().getFullYear(), month, 11));
			endDate = this.getEndDate(startDate);
		}

		for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
			let idx = this.idxOfRecord(d, doc);
			if (idx > -1) arr.push(doc.attendanceRecords[idx]);
		}

		return arr;
	}

	update(doc) {
		//update accidental leave balance

		let lstTime = doc.accidentalLeaveBalance
			? doc.accidentalLeaveBalance.lastUpdated
			: undefined;

		let updateTime = new Date(Date.UTC(new Date().getFullYear(), 0, 11));
		if (!lstTime || !this.valid(updateTime, lstTime)) {
			//first day of the year
			doc.annualLeaveBalance = {
				balance: 2.5,
				lastUpdated: this.getCurTime(),
			};

			doc.accidentalLeaveBalance = {
				balance: 6,
				lastUpdated: this.getCurTime(),
			};
			doc.attendanceRecords = [];
			return;
		}

		//update annual leave balance
		lstTime = doc.accidentalLeaveBalance.lastUpdated;
		updateTime = this.getStartDate(this.getCurDate());

		if (!lstTime || !this.valid(updateTime, lstTime)) {
			doc.annualLeaveBalance.balance += 2.5;
			doc.annualLeaveBalance.lastUpdated = this.getCurTime();
		}
	}
}

module.exports = timeCalculations;
