const port = process.env.PORT || 8000;
export class getterFetcher {
  static async getCourseNameById(id, token) {
    const params = { id: id };
    const res = await fetch("http://localhost:"+ port +"/getCourseNameById", {
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
  }

  static async getStaffById(id, token) {
    console.log("id" + id);
    const params = { id: id };
    const res = await fetch("http://localhost:"+ port +"/getStaffNameById", {
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
  }

  static async getCourseIdByName(name, token) {
    const params = { name: name };
    const res = await fetch("http://localhost:"+ port +"/getCourseIdByName", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return data;
  }

  static async getDepNameById(id, token) {
    const params = { id: id };
    const res = await fetch("http://localhost:"+ port +"/getDepNameById", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return data;
  }

  static async getDepIdByName(name, token) {
    const params = { name: name };
    const res = await fetch("http://localhost:"+ port +"/getDepIdByName", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return data;
  }

  static async getLocationNameById(id, token) {
    const params = { id: id };
    const res = await fetch("http://localhost:"+ port +"/getLocationNameById", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await res.json();
    return data;
  }

  static async getLocationIdByName(name, token) {
    const params = { name: name };
    const res = await fetch("http://localhost:"+ port +"/getLocationIdByName", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return data;
  }

  static async getFacultyNameById(id, token) {
    const params = { id: id };
    const res = await fetch("http://localhost:"+ port +"/getFacultyNameById", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const data = await res.json();
    return data;
  }

  static async getFacultyIdByName(name, token) {
    const params = { name: name };
    const res = await fetch("http://localhost:"+ port +"/getFacultyIdByName", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return data;
  }

  static async getId(id, token) {
    const params = { id: id };
    const res = await fetch("http://localhost:"+ port +"/getId", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return data;
  }

  static async getCoursesInDep(id, token) {
    const params = { id: id };
    const res = await fetch("http://localhost:"+ port +"/getCoursesInDep", {
      method: "POST",
      body: JSON.stringify(params),
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const data = await res.json();
    return data;
  }

  static async isHod(departmentId, userId, token) {
    try {
      const params = { depId: departmentId, userId: userId };
      const res = await fetch("http://localhost:"+ port +"/isHod", {
        method: "POST",
        body: JSON.stringify(params),
        headers: {
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
