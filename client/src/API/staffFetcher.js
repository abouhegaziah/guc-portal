export class staffFetcher {
	static async resetPassword(password, token) {
		try {
			const params = { newPassword: password };
			const res = await fetch("https://gucportal.herokuapp.com/myProfile/resetPassword", {
				method: "POST",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async viewProfile(token) {
		try {
			const res = await fetch("https://gucportal.herokuapp.com/myProfile", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (e) {
			console.log(e);
		}
	}

	static async updateProfile(gender, personalInfo, token) {
		try {
			const params = {
				gender: gender,
				personalInfo: personalInfo,
			};
			const res = await fetch("https://gucportal.herokuapp.com/myProfile", {
				method: "PUT",
				body: JSON.stringify(params),
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (error) {
			console.log(error);
		}
	}

	static async getAttendanceRecords(month, token) {
		try {
			const params = { month: parseInt(month) };
			const res = await fetch(
				"https://gucportal.herokuapp.com/myProfile/viewAttendanceRecords",
				{
					method: "POST",
					body: JSON.stringify(params),
					headers: {
						Authorization: "",
						"auth-token": token,
						"Content-Type": "application/json",
						Accept: "application/json",
					},
				}
			);

			const data = await res.json();
			return data;
		} catch (e) {
			console.log(e);
		}
	}

	static async signIn(token) {
		try {
			const res = await fetch("https://gucportal.herokuapp.com/myProfile/signIn", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (e) {
			console.log(e);
		}
	}

	static async signOut(token) {
		try {
			const res = await fetch("https://gucportal.herokuapp.com/myProfile/signOut", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (e) {
			console.log(e);
		}
	}

	static async missingHours(token) {
		try {
			const res = await fetch("https://gucportal.herokuapp.com/myProfile/viewMissingHours", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (e) {
			console.log(e);
		}
	}

	static async missingDays(token) {
		try {
			const res = await fetch("https://gucportal.herokuapp.com/myProfile/viewMissingDays", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (e) {
			console.log(e);
		}
	}

	static async getNotifications(token) {
		try {
			const res = await fetch("https://gucportal.herokuapp.com/myProfile/notifications", {
				method: "GET",
				headers: {
					Authorization: "",
					"auth-token": token,
					"Content-Type": "application/json",
					Accept: "application/json",
				},
			});

			const data = await res.json();
			return data;
		} catch (e) {
			console.log(e);
		}
	}
}
